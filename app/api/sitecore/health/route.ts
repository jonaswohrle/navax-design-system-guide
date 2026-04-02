import { NextResponse } from "next/server"

const MCP_ENDPOINT =
  "https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod"
const TOKEN_ENDPOINT = "https://auth.sitecorecloud.io/oauth/token"
const TOKEN_AUDIENCE = "https://api.sitecorecloud.io"

export const maxDuration = 30

export async function GET() {
  const result: Record<string, unknown> = {
    status: "unknown",
    message: "",
    details: { token: false, mcp: false, sites: false },
  }

  const clientId = process.env.SITECORE_CLIENT_ID
  const clientSecret = process.env.SITECORE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    result.status = "missing_credentials"
    result.message =
      "SITECORE_CLIENT_ID and SITECORE_CLIENT_SECRET are not set."
    result.suggestion =
      "Add your Sitecore automation client credentials in the Vars section of the settings menu (top right)."
    return NextResponse.json(result)
  }

  // Step 1: Token
  try {
    const tokenRes = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        audience: TOKEN_AUDIENCE,
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!tokenRes.ok) {
      result.status = "token_error"
      result.message = `Token request failed with status ${tokenRes.status}`
      result.suggestion = "Check that your SITECORE_CLIENT_ID and SITECORE_CLIENT_SECRET are valid."
      return NextResponse.json(result)
    }

    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) {
      result.status = "token_error"
      result.message = "Token response did not include an access_token."
      return NextResponse.json(result)
    }

    const token = tokenData.access_token
    ;(result.details as Record<string, unknown>).token = true

    // Decode org/tenant from JWT
    try {
      const parts = token.split(".")
      const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
      const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4)
      const payload = JSON.parse(Buffer.from(padded, "base64").toString())
      ;(result.details as Record<string, unknown>).org =
        payload.org || payload.organization || undefined
      ;(result.details as Record<string, unknown>).tenant =
        payload.tenant_name || payload.tenant_id || undefined
    } catch {
      // JWT decode is optional
    }

    // Step 2: MCP Initialize
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      Authorization: `Bearer ${token}`,
    }

    const initRes = await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-03-26",
          capabilities: {},
          clientInfo: { name: "navax-health-check", version: "1.0.0" },
        },
      }),
    })

    if (!initRes.ok) {
      result.status = "mcp_error"
      result.message = `MCP initialize failed with status ${initRes.status}`
      result.suggestion = "The Sitecore MCP endpoint may be temporarily unavailable."
      return NextResponse.json(result)
    }

    const sessionId = initRes.headers.get("mcp-session-id")
    ;(result.details as Record<string, unknown>).mcp = true

    // Send initialized notification
    await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers: {
        ...headers,
        ...(sessionId ? { "Mcp-Session-Id": sessionId } : {}),
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "notifications/initialized",
      }),
    })

    // Step 3: Test list_sites
    const sitesRes = await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers: {
        ...headers,
        ...(sessionId ? { "Mcp-Session-Id": sessionId } : {}),
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: { name: "list_sites", arguments: {} },
      }),
    })

    const sitesBody = await sitesRes.text()

    // Check for isError in the MCP response
    const hasError =
      sitesBody.includes('"isError":true') ||
      sitesBody.includes('"isError": true')

    if (hasError) {
      ;(result.details as Record<string, unknown>).sites = false
      result.status = "sites_unavailable"
      result.message =
        "Authentication and MCP connection work, but the XM Cloud environment does not have sites available."
      result.suggestion =
        "In the Sitecore Cloud Portal, ensure the XM Cloud project linked to your automation client has a deployed CM instance with at least one site created. " +
        "The chat assistant will still work for tasks that don't require the Sitecore backend (e.g., updating homepage content)."
    } else {
      ;(result.details as Record<string, unknown>).sites = true
      result.status = "connected"
      result.message = "All systems operational. Sitecore XM Cloud is connected."
    }

    return NextResponse.json(result)
  } catch (err) {
    result.status = "connection_error"
    result.message = `Connection failed: ${err instanceof Error ? err.message : String(err)}`
    result.suggestion = "Check your network connection and Sitecore credentials."
    return NextResponse.json(result)
  }
}
