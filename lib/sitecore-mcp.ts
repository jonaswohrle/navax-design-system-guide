/**
 * Sitecore Marketer MCP Client
 *
 * Connects to the Sitecore Marketer MCP server via Streamable HTTP transport.
 * Uses Client Credentials (automation client) for authentication -- no browser OAuth needed.
 *
 * IMPORTANT: The Sitecore MCP endpoint may respond with either:
 *   - application/json  (direct JSON-RPC response)
 *   - text/event-stream (SSE with JSON-RPC payload in a "data:" line)
 * This client handles both transparently.
 */

const MCP_ENDPOINT =
  "https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod"
const TOKEN_ENDPOINT = "https://auth.sitecorecloud.io/oauth/token"
const TOKEN_AUDIENCE = "https://api.sitecorecloud.io"

/* ── Token cache ─────────────────────────────────────────────── */

let cachedToken: { jwt: string; expiresAt: number } | null = null

export async function getSitecoreToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.jwt
  }

  const clientId = process.env.SITECORE_CLIENT_ID
  const clientSecret = process.env.SITECORE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error(
      "SITECORE_CLIENT_ID and SITECORE_CLIENT_SECRET must be set"
    )
  }

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      audience: TOKEN_AUDIENCE,
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Sitecore token error ${res.status}: ${text}`)
  }

  const data = await res.json()
  cachedToken = {
    jwt: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }

  return cachedToken.jwt
}

/* ── MCP JSON-RPC helpers ────────────────────────────────────── */

let rpcId = 0
function jsonrpc(method: string, params?: Record<string, unknown>) {
  return {
    jsonrpc: "2.0" as const,
    id: ++rpcId,
    method,
    ...(params ? { params } : {}),
  }
}

/**
 * Parse a response that may be either JSON or SSE (text/event-stream).
 * SSE responses contain one or more "data: {json}" lines; we extract the
 * last JSON-RPC result from them.
 */
async function parseResponse(res: Response): Promise<Record<string, unknown>> {
  const contentType = res.headers.get("content-type") || ""

  // Direct JSON response
  if (contentType.includes("application/json")) {
    return res.json()
  }

  // SSE / text/event-stream response -- read as text and extract JSON from data: lines
  const text = await res.text()

  // Try parsing the whole body as JSON first (some endpoints return JSON with wrong content-type)
  try {
    return JSON.parse(text)
  } catch {
    // Not direct JSON, continue to SSE parsing
  }

  // Extract "data:" lines from SSE
  const lines = text.split("\n")
  let lastData: Record<string, unknown> | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith("data:")) {
      const jsonStr = trimmed.slice(5).trim()
      if (jsonStr && jsonStr !== "[DONE]") {
        try {
          lastData = JSON.parse(jsonStr)
        } catch {
          // Skip unparseable data lines
        }
      }
    }
  }

  if (lastData) {
    return lastData
  }

  // Last resort: return the raw text wrapped in a result
  return {
    result: {
      content: [{ type: "text", text }],
    },
  }
}

/* ── MCP Client ──────────────────────────────────────────────── */

export interface MCPToolInfo {
  name: string
  description?: string
  inputSchema?: Record<string, unknown>
}

export class SitecoreMCPClient {
  private sessionId: string | null = null
  private tools: MCPToolInfo[] = []
  private initPromise: Promise<void> | null = null

  private headers(token: string): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      Authorization: `Bearer ${token}`,
      ...(this.sessionId ? { "Mcp-Session-Id": this.sessionId } : {}),
    }
  }

  /** Ensure client is initialized (idempotent) */
  async ensureInitialized(): Promise<void> {
    if (this.sessionId && this.tools.length > 0) return
    if (this.initPromise) return this.initPromise
    this.initPromise = this._initialize()
    try {
      await this.initPromise
    } finally {
      this.initPromise = null
    }
  }

  private async _initialize(): Promise<void> {
    const token = await getSitecoreToken()

    // Step 1: Initialize
    const initRes = await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers: this.headers(token),
      body: JSON.stringify(
        jsonrpc("initialize", {
          protocolVersion: "2025-03-26",
          capabilities: {},
          clientInfo: { name: "navax-design-system", version: "1.0.0" },
        })
      ),
    })

    if (!initRes.ok) {
      const text = await initRes.text()
      throw new Error(`MCP initialize failed ${initRes.status}: ${text}`)
    }

    // Extract session ID from either header casing
    this.sessionId =
      initRes.headers.get("mcp-session-id") ||
      initRes.headers.get("Mcp-Session-Id")

    // Parse the init response (may be SSE)
    await parseResponse(initRes)

    // Step 2: Send initialized notification (fire-and-forget)
    await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers: this.headers(token),
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "notifications/initialized",
      }),
    })

    // Step 3: List tools
    const toolsRes = await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers: this.headers(token),
      body: JSON.stringify(jsonrpc("tools/list")),
    })

    if (!toolsRes.ok) {
      const text = await toolsRes.text()
      throw new Error(`MCP tools/list failed ${toolsRes.status}: ${text}`)
    }

    const toolsData = await parseResponse(toolsRes)
    this.tools =
      (toolsData.result as Record<string, unknown>)?.tools as MCPToolInfo[] ??
      []
  }

  /** Get list of available tools */
  async getTools(): Promise<MCPToolInfo[]> {
    await this.ensureInitialized()
    return this.tools
  }

  /** Call an MCP tool by name */
  async callTool(
    name: string,
    args: Record<string, unknown> = {}
  ): Promise<unknown> {
    await this.ensureInitialized()

    const token = await getSitecoreToken()
    const body = JSON.stringify(
      jsonrpc("tools/call", { name, arguments: args })
    )

    const res = await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers: this.headers(token),
      body,
    })

    if (!res.ok) {
      // Session might have expired -- reset and retry once
      if (res.status === 400 || res.status === 404) {
        this.sessionId = null
        this.tools = []
        await this.ensureInitialized()

        const retryToken = await getSitecoreToken()
        const retryRes = await fetch(MCP_ENDPOINT, {
          method: "POST",
          headers: this.headers(retryToken),
          body,
        })

        if (!retryRes.ok) {
          const text = await retryRes.text()
          return {
            error: true,
            message: `MCP tool call failed after retry (${retryRes.status})`,
            details: text.slice(0, 500),
          }
        }

        const retryData = await parseResponse(retryRes)
        if (retryData.error) {
          return {
            error: true,
            message:
              (retryData.error as Record<string, unknown>)?.message ||
              "MCP tool error",
            details: retryData.error,
          }
        }
        return retryData.result
      }

      const text = await res.text()
      return {
        error: true,
        message: `MCP tool call failed (${res.status})`,
        details: text.slice(0, 500),
      }
    }

    const data = await parseResponse(res)
    if (data.error) {
      return {
        error: true,
        message:
          (data.error as Record<string, unknown>)?.message || "MCP tool error",
        details: data.error,
      }
    }
    return data.result
  }

  /** Reset session (for cleanup or error recovery) */
  reset(): void {
    this.sessionId = null
    this.tools = []
    this.initPromise = null
  }
}

/* ── Singleton ───────────────────────────────────────────────── */

export const sitecoreMCP = new SitecoreMCPClient()
