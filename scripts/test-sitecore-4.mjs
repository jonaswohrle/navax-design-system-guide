// Test Sitecore MCP with proper session management

const CLIENT_ID = process.env.SITECORE_CLIENT_ID;
const CLIENT_SECRET = process.env.SITECORE_CLIENT_SECRET;

// Get token
const tokenRes = await fetch("https://auth.sitecorecloud.io/oauth/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    audience: "https://api.sitecorecloud.io",
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }),
});
const { access_token: token } = await tokenRes.json();
console.log("[v0] Token acquired\n");

const MCP_URL = "https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod";
let sessionId = null;

async function mcpCall(method, params = {}, id = 1) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  if (sessionId) {
    headers["Mcp-Session-Id"] = sessionId;
  }

  const res = await fetch(MCP_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id }),
  });

  // Capture session ID from response headers
  const newSessionId = res.headers.get("mcp-session-id");
  if (newSessionId) {
    sessionId = newSessionId;
    console.log(`[v0] Session ID captured: ${sessionId.substring(0, 20)}...`);
  }

  // Log all response headers for debugging
  if (method === "initialize") {
    console.log("[v0] Response headers:");
    for (const [key, value] of res.headers.entries()) {
      console.log(`  ${key}: ${value.substring(0, 100)}`);
    }
  }

  const contentType = res.headers.get("content-type") || "";
  console.log(`[v0] ${method} -> Status: ${res.status}, Content-Type: ${contentType}`);

  const text = await res.text();

  if (contentType.includes("text/event-stream")) {
    // Parse SSE events
    const lines = text.split("\n");
    let result = null;
    for (const line of lines) {
      if (line.startsWith("data:")) {
        const data = line.replace("data: ", "").trim();
        try {
          result = JSON.parse(data);
        } catch {}
      }
    }
    return result;
  } else {
    try {
      return JSON.parse(text);
    } catch {
      console.log("[v0] Raw response:", text.substring(0, 500));
      return null;
    }
  }
}

// Step 1: Initialize (captures session ID)
console.log("[v0] === STEP 1: Initialize ===");
const initResult = await mcpCall("initialize", {
  protocolVersion: "2024-11-05",
  capabilities: {},
  clientInfo: { name: "v0-sitecore-test", version: "1.0.0" },
}, 1);
console.log("[v0] Server:", JSON.stringify(initResult?.result?.serverInfo));
console.log("[v0] Capabilities:", JSON.stringify(initResult?.result?.capabilities));

// Step 1b: Send initialized notification
console.log("\n[v0] === STEP 1b: Send 'initialized' notification ===");
await mcpCall("notifications/initialized", {}, undefined);

// Step 2: List tools (with session ID)
console.log("\n[v0] === STEP 2: List Tools ===");
const toolsResult = await mcpCall("tools/list", {}, 2);
if (toolsResult?.result?.tools) {
  console.log(`[v0] Found ${toolsResult.result.tools.length} tools:\n`);
  for (const tool of toolsResult.result.tools) {
    console.log(`  - ${tool.name}`);
    console.log(`    ${(tool.description || "").substring(0, 100)}`);
  }
} else {
  console.log("[v0] Tools result:", JSON.stringify(toolsResult, null, 2)?.substring(0, 1500));
}

// Step 3: Call list_sites
console.log("\n[v0] === STEP 3: Call list_sites ===");
const sitesResult = await mcpCall("tools/call", {
  name: "list_sites",
  arguments: {},
}, 3);
console.log("[v0] Sites:", JSON.stringify(sitesResult, null, 2)?.substring(0, 3000));

console.log("\n[v0] === ALL TESTS COMPLETE ===");
