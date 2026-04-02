// Test Sitecore Agent API connection
// 1. Get JWT via client_credentials grant
// 2. Try multiple Agent API base URLs to find the right one
// 3. List sites to verify access

const CLIENT_ID = process.env.SITECORE_CLIENT_ID;
const CLIENT_SECRET = process.env.SITECORE_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("[v0] ERROR: Missing SITECORE_CLIENT_ID or SITECORE_CLIENT_SECRET");
  process.exit(1);
}

console.log("[v0] Client ID:", CLIENT_ID.substring(0, 8) + "...(redacted)");
console.log("[v0] Client Secret: (set, redacted)");

// Step 1: Get JWT token
console.log("\n[v0] === STEP 1: Requesting JWT token ===");
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

const tokenData = await tokenRes.json();

if (!tokenRes.ok) {
  console.error("[v0] Token request FAILED:", tokenRes.status);
  console.error("[v0] Error:", JSON.stringify(tokenData, null, 2));
  process.exit(1);
}

console.log("[v0] Token SUCCESS!");
console.log("[v0] Token type:", tokenData.token_type);
console.log("[v0] Expires in:", tokenData.expires_in, "seconds");
console.log("[v0] Token preview:", tokenData.access_token.substring(0, 40) + "...");

const token = tokenData.access_token;

// Step 2: Try Agent API endpoints
console.log("\n[v0] === STEP 2: Testing Agent API endpoints ===");

const baseUrls = [
  "https://edge-platform.sitecorecloud.io/stream/ai-agent-api/api/v1",
  "https://edge-platform.sitecorecloud.io/api/v1",
  "https://content-api.sitecorecloud.io/api/v1",
];

for (const baseUrl of baseUrls) {
  console.log(`\n[v0] Trying: ${baseUrl}/sites`);
  try {
    const res = await fetch(`${baseUrl}/sites`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const text = await res.text();
    console.log(`[v0] Status: ${res.status}`);
    if (res.ok) {
      console.log("[v0] FOUND WORKING ENDPOINT!");
      try {
        const data = JSON.parse(text);
        console.log("[v0] Response:", JSON.stringify(data, null, 2).substring(0, 2000));
      } catch {
        console.log("[v0] Response (raw):", text.substring(0, 1000));
      }
    } else {
      console.log("[v0] Error:", text.substring(0, 300));
    }
  } catch (err) {
    console.log("[v0] Network error:", err.message);
  }
}

// Step 3: Try the MCP endpoint directly (for discovery)
console.log("\n[v0] === STEP 3: Testing MCP endpoint ===");
try {
  const res = await fetch("https://edge-platform.sitecorecloud.io/mcp/marketer-mcp-prod", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  console.log("[v0] MCP endpoint status:", res.status);
  const text = await res.text();
  console.log("[v0] MCP response:", text.substring(0, 500));
} catch (err) {
  console.log("[v0] MCP error:", err.message);
}

console.log("\n[v0] === TEST COMPLETE ===");
