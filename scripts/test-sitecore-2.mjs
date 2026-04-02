// Test Sitecore - deeper endpoint discovery
// The token works! Now find the correct API URLs and auth headers.

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
console.log("[v0] Token acquired successfully\n");

// Decode JWT to see claims (audience, scopes, org info)
const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
console.log("[v0] === JWT CLAIMS ===");
console.log("[v0] Audience:", payload.aud);
console.log("[v0] Scope:", payload.scope);
console.log("[v0] Issuer:", payload.iss);
console.log("[v0] Subject:", payload.sub);
console.log("[v0] Organization:", payload.org_id || payload["https://auth.sitecorecloud.io/claims/org_id"] || "not found");
console.log("[v0] All custom claims:");
for (const [key, value] of Object.entries(payload)) {
  if (key.includes("sitecore") || key.includes("org") || key.includes("tenant") || key.includes("http")) {
    console.log(`  ${key}: ${JSON.stringify(value).substring(0, 200)}`);
  }
}

// Test 1: MCP endpoint with proper JSON-RPC POST
console.log("\n[v0] === TEST 1: MCP JSON-RPC (list tools) ===");
try {
  const res = await fetch("https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/list",
      id: 1,
    }),
  });
  console.log("[v0] Status:", res.status);
  const text = await res.text();
  console.log("[v0] Response:", text.substring(0, 2000));
} catch (err) {
  console.log("[v0] Error:", err.message);
}

// Test 2: Try MCP with initialize first (proper MCP protocol)
console.log("\n[v0] === TEST 2: MCP Initialize ===");
try {
  const res = await fetch("https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "v0-test", version: "1.0.0" },
      },
      id: 1,
    }),
  });
  console.log("[v0] Status:", res.status);
  const text = await res.text();
  console.log("[v0] Response:", text.substring(0, 2000));
} catch (err) {
  console.log("[v0] Error:", err.message);
}

// Test 3: Try SSE endpoint for MCP
console.log("\n[v0] === TEST 3: MCP SSE endpoint ===");
try {
  const res = await fetch("https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod/sse", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream",
    },
  });
  console.log("[v0] SSE Status:", res.status);
  const text = await res.text();
  console.log("[v0] SSE Response:", text.substring(0, 500));
} catch (err) {
  console.log("[v0] SSE Error:", err.message);
}

// Test 4: Try different Agent API URLs with the JWT
console.log("\n[v0] === TEST 4: Alternative Agent API URLs ===");
const urls = [
  "https://xmcloud-cm.sitecorecloud.io/api/v1/sites",
  "https://xmcloud-cm.sitecorecloud.io/sitecore/api/ssc/item",
  "https://pages-api.sitecorecloud.io/api/v1/sites",
  "https://edge-platform.sitecorecloud.io/v1/content",
];

for (const url of urls) {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    console.log(`[v0] ${url} -> ${res.status}`);
    if (res.ok || res.status < 404) {
      const text = await res.text();
      console.log("[v0] Body:", text.substring(0, 300));
    }
  } catch (err) {
    console.log(`[v0] ${url} -> Error: ${err.message}`);
  }
}

console.log("\n[v0] === ALL TESTS COMPLETE ===");
