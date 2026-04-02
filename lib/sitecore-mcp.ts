/**
 * Sitecore Marketer MCP Client
 *
 * Connects to the Sitecore Marketer MCP server via Streamable HTTP transport.
 * Uses Client Credentials (automation client) for authentication -- no browser OAuth needed.
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
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        Authorization: `Bearer ${token}`,
      },
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

    this.sessionId =
      initRes.headers.get("mcp-session-id") ||
      initRes.headers.get("Mcp-Session-Id")

    // Step 2: Send initialized notification
    await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        Authorization: `Bearer ${token}`,
        ...(this.sessionId ? { "Mcp-Session-Id": this.sessionId } : {}),
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "notifications/initialized",
      }),
    })

    // Step 3: List tools
    const toolsRes = await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        Authorization: `Bearer ${token}`,
        ...(this.sessionId ? { "Mcp-Session-Id": this.sessionId } : {}),
      },
      body: JSON.stringify(jsonrpc("tools/list")),
    })

    if (!toolsRes.ok) {
      const text = await toolsRes.text()
      throw new Error(`MCP tools/list failed ${toolsRes.status}: ${text}`)
    }

    const toolsData = await toolsRes.json()
    this.tools = toolsData.result?.tools ?? []
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
    const res = await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        Authorization: `Bearer ${token}`,
        ...(this.sessionId ? { "Mcp-Session-Id": this.sessionId } : {}),
      },
      body: JSON.stringify(
        jsonrpc("tools/call", { name, arguments: args })
      ),
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
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/event-stream",
            Authorization: `Bearer ${retryToken}`,
            ...(this.sessionId
              ? { "Mcp-Session-Id": this.sessionId }
              : {}),
          },
          body: JSON.stringify(
            jsonrpc("tools/call", { name, arguments: args })
          ),
        })

        if (!retryRes.ok) {
          const text = await retryRes.text()
          throw new Error(
            `MCP tool call retry failed ${retryRes.status}: ${text}`
          )
        }

        const retryData = await retryRes.json()
        if (retryData.error) {
          return {
            error: true,
            message: retryData.error.message || "MCP tool error",
            details: retryData.error,
          }
        }
        return retryData.result
      }

      const text = await res.text()
      throw new Error(`MCP tool call failed ${res.status}: ${text}`)
    }

    const data = await res.json()
    if (data.error) {
      return {
        error: true,
        message: data.error.message || "MCP tool error",
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
