// Test Sitecore MCP with Streamable HTTP transport (correct Accept headers)

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

// Helper for MCP JSON-RPC calls with correct headers
async function mcpCall(method, params = {}, id = 1) {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id }),
  });

  const contentType = res.headers.get("content-type") || "";
  console.log(`[v0] ${method} -> Status: ${res.status}, Content-Type: ${contentType}`);

  if (contentType.includes("text/event-stream")) {
    // Parse SSE response
    const text = await res.text();
    console.log("[v0] SSE Response (raw):", text.substring(0, 2000));
    // Try to extract JSON from SSE events
    const events = text.split("\n").filter(l => l.startsWith("data:"));
    for (const event of events) {
      const data = event.replace("data: ", "");
      try {
        const parsed = JSON.parse(data);
        console.log("[v0] Parsed event:", JSON.stringify(parsed, null, 2).substring(0, 1500));
      } catch {
        console.log("[v0] Raw event data:", data.substring(0, 500));
      }
    }
    return null;
  } else {
    const data = await res.json();
    return data;
  }
}

// Test 1: Initialize
console.log("[v0] === TEST 1: MCP Initialize ===");
const initResult = await mcpCall("initialize", {
  protocolVersion: "2024-11-05",
  capabilities: {},
  clientInfo: { name: "v0-sitecore-test", version: "1.0.0" },
});
if (initResult) {
  console.log("[v0] Init result:", JSON.stringify(initResult, null, 2).substring(0, 1000));
}

// Test 2: List tools
console.log("\n[v0] === TEST 2: List Tools ===");
const toolsResult = await mcpCall("tools/list", {}, 2);
if (toolsResult) {
  if (toolsResult.result?.tools) {
    console.log("[v0] Found", toolsResult.result.tools.length, "tools:");
    for (const tool of toolsResult.result.tools) {
      console.log(`  - ${tool.name}: ${(tool.description || "").substring(0, 80)}`);
    }
  } else {
    console.log("[v0] Tools result:", JSON.stringify(toolsResult, null, 2).substring(0, 1500));
  }
}

// Test 3: Call list_sites tool
console.log("\n[v0] === TEST 3: Call list_sites ===");
const sitesResult = await mcpCall("tools/call", {
  name: "list_sites",
  arguments: {},
}, 3);
if (sitesResult) {
  console.log("[v0] Sites result:", JSON.stringify(sitesResult, null, 2).substring(0, 2000));
}

console.log("\n[v0] === ALL TESTS COMPLETE ===");
