import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
} from "ai"
import { z } from "zod"
import { sitecoreMCP } from "@/lib/sitecore-mcp"

export const maxDuration = 120

const systemPrompt = `You are the HARTMANN Content Studio assistant, an AI-powered content management expert for Paul Hartmann AG -- a leading international healthcare company (est. 1818, headquartered in Heidenheim, Germany).

You help HARTMANN's marketing and content teams manage their digital presence using Sitecore XM Cloud. You can create pages, manage assets, set up personalization, work with brand kits, and generate marketing briefs.

## HARTMANN Context

**Brand Identity:**
- Tagline: "Hilft. Pflegt. Schuetzt." (Helps. Cares. Protects.)
- Brand Colors: Bright Blue #0045FF (primary), Dark Blue #001689 (secondary), White #FFFFFF
- Logo: HARTMANN wordmark in Dark Blue
- Tone of Voice: Professional, trustworthy, caring, scientifically grounded. Always respond in English unless the user writes in another language.

**Key Product Lines:**
- Sterillium -- hand disinfection (market leader in Europe)
- MoliCare -- incontinence care products
- HydroClean -- wound care / wound dressings
- Hydrosorb -- transparent hydrogel wound dressing
- TenderWet -- superabsorber wound pad
- Foliodress -- surgical gowns, drapes, OR supplies
- Bacillol -- surface disinfection
- Peha-soft -- examination and protective gloves
- Zetuvit -- absorbent wound pads
- Cosmopor -- self-adhesive wound dressings

**Market Segments:**
- Kliniken (Hospitals), Pflegeheime (Care Homes), Arztpraxen (Medical Practices),
  Apotheken (Pharmacies), Rettungsdienste (Emergency Services), Privatanwender (Consumers)

**Competence Areas:**
- Wundversorgung (Wound Care), Inkontinenzmanagement (Incontinence Management),
  Infektionsmanagement (Infection Prevention), OP-Versorgung (Surgical Supplies)

## HARTMANN Content Tree (XM Cloud)

The HARTMANN site is already set up in Sitecore XM Cloud. Here is the full content tree:

**Site Root:** /sitecore/content/HARTMANN (ID: 133248c2-da8d-46ec-9fd0-330402e7b5dd)
**Site Name:** "HARTMANN"

\`\`\`
HARTMANN
└── Home (ce18f98c-c0d1-4c89-b5f7-03a864f58ea1)
    ├── Produkte (897fc56d-0e69-468d-bc58-fbb2a2fa7934)
    │   ├── Wundversorgung (526e249e-eaa4-46b0-b6b0-d32c52ecde7d)
    │   ├── Desinfektion (ad83baff-3d5f-4e8a-956a-10119de27441)
    │   └── Inkontinenzversorgung (5e1272a3-6e3b-4008-b16e-cf24c06d2e4f)
    ├── Branchen (7db53e42-107f-4f4c-b131-6ec1761bac47)
    │   ├── Kliniken (9669a7ad-8ab9-4d09-86f9-cabd31da283b)
    │   ├── Pflegeheime (93471bcb-e023-457c-8e2b-abf8b70c1ac0)
    │   ├── Ambulante Pflege (f32fa4b5-5926-4a91-afb7-2a7bbe412d28)
    │   └── Apotheken (cc514830-0877-43f1-8606-764165b8dc38)
    ├── Unternehmen (885d52e2-a6dd-4e34-9a59-a0f939244b68)
    │   ├── Ueber HARTMANN (33d9cb3b-b52c-4e9f-8c35-babbd4380418)
    │   ├── Karriere (19cfd50f-81b0-4f10-b44b-9be4c6cf19cc)
    │   ├── Nachhaltigkeit (5537af98-1323-4672-88f5-2968f8c88e23)
    │   └── Investor Relations (d52cd23b-1498-4238-a47b-14cb94bf7191)
    ├── Service (f4498e87-b801-49e5-9caa-17ced636958d)
    │   ├── Kontakt (c0d2fefc-2c87-45cd-a491-6d44da7a3609)
    │   ├── Schulungen (dc4d03e3-120a-48e8-8f02-882b2b59ce34)
    │   └── Downloads (e3a9f879-b4aa-445f-841f-50631aef369c)
    ├── Impressum (8cd8bc57-5ede-47b8-a761-1281aa8d0c8f)
    ├── Datenschutz (ed5b4bc6-7c0b-4b3b-a00f-65bdf991321d)
    └── AGB (c2ebd460-5f47-4d84-a4b8-ac5279a1078d)
\`\`\`

## Tool Usage Guidelines

- IMPORTANT: list_sites may return empty. When that happens, use the content tree above to answer questions about the site structure. Use get_content_item_by_path or get_content_item_by_id to fetch details about specific pages.
- The site name for tool calls that require siteName is "HARTMANN".
- When a tool returns an error (error: true), explain the issue clearly and suggest next steps.
- Some tools return MCP format: { content: [{ type: "text", text: "..." }] }. Parse and summarize.
- For create operations, confirm what was created and suggest logical next steps.
- When presenting the content tree to the user, always show it in a well-formatted way with the full page hierarchy.
- If a tool call fails, try using get_content_item_by_path with the known paths from the content tree above.

## Homepage Content Management

You can directly update the HARTMANN homepage content using update_homepage_content.
This tool works independently of the Sitecore backend connection and changes appear immediately.
Available components: HeroBanner, TrustStrip, ProductAreasGrid, MarketSegmentsGrid, CtaBanner, AboutSection.

## Behavior Guidelines

- Use professional medical/healthcare terminology
- Be concise -- let rich tool results do the heavy lifting
- Always use appropriate tools when available
- Format responses with markdown headings, bold, and bullet lists`

/**
 * Wraps sitecoreMCP.callTool with error handling.
 * Detects Sitecore MCP isError responses and converts them to structured errors.
 */
async function mcpCall(
  toolName: string,
  args: Record<string, unknown> = {}
): Promise<unknown> {
  try {
    const result = await sitecoreMCP.callTool(toolName, args)

    // Sitecore MCP returns errors as: { content: [{ type: "text", text: "ERROR: ..." }], isError: true }
    if (
      result &&
      typeof result === "object" &&
      (result as Record<string, unknown>).isError === true
    ) {
      const content = (result as Record<string, unknown>).content as
        | Array<{ type: string; text: string }>
        | undefined
      const errorText = content?.[0]?.text || "Unknown Sitecore error"
      return {
        error: true,
        message: errorText,
        suggestion:
          "This may indicate the Sitecore XM Cloud environment needs configuration. " +
          "Check that the automation client has access to an active XM Cloud project with a deployed CM instance.",
      }
    }

    return result
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return {
      error: true,
      message: `Failed to call ${toolName}: ${msg}`,
      suggestion:
        "The Sitecore MCP endpoint may be temporarily unavailable or credentials may need to be checked.",
    }
  }
}

/**
 * AI SDK tools -- names match the actual Sitecore Marketer MCP tool names exactly.
 * Full list from MCP tools/list: 48 tools across site, page, component, content,
 * asset, personalization, and brief management.
 */
const tools = {
  /* ── Site Management ──────────────────────────────────────── */
  list_sites: tool({
    description:
      "List all available Sitecore sites with their basic info (name, display name, URL). Always call this first.",
    inputSchema: z.object({}),
    execute: async () => mcpCall("list_sites"),
  }),

  get_site_information: tool({
    description: "Get details of a specific site including ID, name, and root path.",
    inputSchema: z.object({
      siteName: z.string().describe("The name of the site"),
    }),
    execute: async ({ siteName }) =>
      mcpCall("get_site_information", { siteName }),
  }),

  get_all_pages_by_site: tool({
    description:
      "Get all pages for a site (the page tree / sitemap structure), including each page's ID and path.",
    inputSchema: z.object({
      siteName: z.string().describe("The name of the site"),
    }),
    execute: async ({ siteName }) =>
      mcpCall("get_all_pages_by_site", { siteName }),
  }),

  get_all_languages: tool({
    description: "Get all languages configured in the Sitecore environment.",
    inputSchema: z.object({}),
    execute: async () => mcpCall("get_all_languages"),
  }),

  search_site: tool({
    description:
      "Search for pages in a site matching a search term in titles and content.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      searchTerm: z.string().describe("Search query"),
    }),
    execute: async (args) => mcpCall("search_site", args),
  }),

  /* ── Page Management ──────────────────────────────────────── */
  create_page: tool({
    description: "Create a new page using a specified template under a parent page.",
    inputSchema: z.object({
      siteName: z.string().describe("Target site name"),
      parentPath: z.string().describe("Parent page path, e.g. '/Home'"),
      pageName: z.string().describe("Name of the new page"),
      template: z.string().optional().describe("Page template, e.g. 'Page', 'Landing Page'"),
    }),
    execute: async (args) => mcpCall("create_page", args),
  }),

  get_page: tool({
    description: "Get page details including ID, name, and path.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
    }),
    execute: async (args) => mcpCall("get_page", args),
  }),

  get_page_html: tool({
    description: "Get the HTML content of a specific page.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
    }),
    execute: async (args) => mcpCall("get_page_html", args),
  }),

  get_page_screenshot: tool({
    description: "Take a screenshot/preview of a published page.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
    }),
    execute: async (args) => mcpCall("get_page_screenshot", args),
  }),

  get_page_preview_url: tool({
    description: "Get the URL to preview a page.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
    }),
    execute: async (args) => mcpCall("get_page_preview_url", args),
  }),

  add_language_to_page: tool({
    description: "Add a new language version for an existing page.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
      language: z.string().describe("Language code, e.g. 'de-DE', 'fr-FR'"),
    }),
    execute: async (args) => mcpCall("add_language_to_page", args),
  }),

  /* ── Component Management ─────────────────────────────────── */
  add_component_on_page: tool({
    description: "Add a component to a specific placeholder on a page.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
      componentName: z.string().describe("Component name, e.g. 'Rich Text', 'Hero Banner'"),
      placeholder: z.string().optional().describe("Placeholder/slot to add the component to"),
    }),
    execute: async (args) => mcpCall("add_component_on_page", args),
  }),

  get_components_on_page: tool({
    description: "Get list of components currently on a specific page.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
    }),
    execute: async (args) => mcpCall("get_components_on_page", args),
  }),

  list_components: tool({
    description: "List all components available for a specific site.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
    }),
    execute: async ({ siteName }) => mcpCall("list_components", { siteName }),
  }),

  get_component: tool({
    description: "Get details of a specific component including datasource options.",
    inputSchema: z.object({
      componentId: z.string().describe("Component ID"),
    }),
    execute: async ({ componentId }) =>
      mcpCall("get_component", { componentId }),
  }),

  remove_component_on_page: tool({
    description: "Remove a component from a page.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
      componentId: z.string().describe("ID of the component to remove"),
    }),
    execute: async (args) => mcpCall("remove_component_on_page", args),
  }),

  set_component_datasource: tool({
    description: "Set the datasource for a component on a page.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
      componentId: z.string().describe("Component ID"),
      datasourceId: z.string().describe("Datasource item ID"),
    }),
    execute: async (args) => mcpCall("set_component_datasource", args),
  }),

  /* ── Content Management ───────────────────────────────────── */
  create_content_item: tool({
    description: "Create a new content item with specified template and field values.",
    inputSchema: z.object({
      parentPath: z.string().describe("Parent item path"),
      itemName: z.string().describe("Name of the new item"),
      templateId: z.string().describe("Template ID to use"),
      fields: z.record(z.string()).optional().describe("Field values"),
    }),
    execute: async (args) => mcpCall("create_content_item", args),
  }),

  update_content: tool({
    description: "Update an existing content item's fields and language.",
    inputSchema: z.object({
      itemId: z.string().describe("Item ID to update"),
      fields: z.record(z.string()).describe("Field values to update"),
      language: z.string().optional().describe("Language version to update"),
    }),
    execute: async (args) => mcpCall("update_content", args),
  }),

  get_content_item_by_path: tool({
    description: "Get content item details by its path in the content tree.",
    inputSchema: z.object({
      itemPath: z.string().describe("Full path to the content item"),
    }),
    execute: async ({ itemPath }) =>
      mcpCall("get_content_item_by_path", { itemPath }),
  }),

  get_content_item_by_id: tool({
    description: "Get content item details by its ID.",
    inputSchema: z.object({
      itemId: z.string().describe("Item ID"),
    }),
    execute: async ({ itemId }) =>
      mcpCall("get_content_item_by_id", { itemId }),
  }),

  /* ── Asset Management ─────────────────────────────────────── */
  search_assets: tool({
    description: "Search for digital assets (images, documents, videos) in the media library.",
    inputSchema: z.object({
      query: z.string().describe("Search query, e.g. 'Sterillium product photo'"),
    }),
    execute: async ({ query }) => mcpCall("search_assets", { query }),
  }),

  get_asset_information: tool({
    description: "Get detailed metadata for a specific asset.",
    inputSchema: z.object({
      assetId: z.string().describe("The ID of the asset"),
    }),
    execute: async ({ assetId }) =>
      mcpCall("get_asset_information", { assetId }),
  }),

  update_asset: tool({
    description: "Update metadata and properties of an existing asset (alt text, description, tags).",
    inputSchema: z.object({
      assetId: z.string().describe("Asset ID"),
      fields: z.record(z.string()).describe("Fields to update"),
    }),
    execute: async (args) => mcpCall("update_asset", args),
  }),

  /* ── Personalization ──────────────────────────────────────── */
  get_perso_ver_by_page: tool({
    description: "Get all personalization variants defined for a specific page.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
    }),
    execute: async (args) => mcpCall("get_perso_ver_by_page", args),
  }),

  create_perso_version: tool({
    description:
      "Create a new personalization variant for a page, targeting a specific audience.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
      variantName: z.string().describe("Name for the variant"),
      audience: z.string().optional().describe("Target audience description"),
    }),
    execute: async (args) => mcpCall("create_perso_version", args),
  }),

  /* ── Brand Kits ───────────────────────────────────────────── */
  list_brandkits: tool({
    description: "List all brand kits (brand identity definitions for AI content generation).",
    inputSchema: z.object({}),
    execute: async () => mcpCall("list_brandkits"),
  }),

  get_brandkit_by_id: tool({
    description: "Get details of a specific brand kit (colors, fonts, tone, guidelines).",
    inputSchema: z.object({
      brandKitId: z.string().describe("Brand kit ID"),
    }),
    execute: async ({ brandKitId }) =>
      mcpCall("get_brandkit_by_id", { brandKitId }),
  }),

  /* ── Briefs ───────────────────────────────────────────────── */
  list_brief_types: tool({
    description: "List all available marketing brief types.",
    inputSchema: z.object({}),
    execute: async () => mcpCall("list_brief_types"),
  }),

  generate_brief: tool({
    description: "Generate a marketing brief using AI based on objectives and audience.",
    inputSchema: z.object({
      title: z.string().describe("Brief title"),
      objective: z.string().describe("Campaign objective"),
      targetAudience: z.string().describe("Target audience description"),
      brandKitId: z.string().optional().describe("Brand kit ID for style guidance"),
      additionalContext: z.string().optional().describe("Additional context"),
    }),
    execute: async (args) => mcpCall("generate_brief", args),
  }),

  /* ── Homepage Content (local, always works) ────────────────── */
  update_homepage_content: tool({
    description:
      "Update content on the HARTMANN homepage. This always works and publishes changes immediately. " +
      "Components: HeroBanner, TrustStrip, ProductAreasGrid, MarketSegmentsGrid, CtaBanner, AboutSection.",
    inputSchema: z.object({
      componentName: z
        .string()
        .describe("Component to update: HeroBanner, TrustStrip, ProductAreasGrid, MarketSegmentsGrid, CtaBanner, or AboutSection"),
      fields: z
        .record(z.unknown())
        .describe("Field values to update. Only include fields you want to change."),
    }),
    execute: async ({ componentName, fields }) => {
      try {
        const baseUrl = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
        const res = await fetch(`${baseUrl}/api/sitecore/content`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ componentName, fields }),
        })
        return await res.json()
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        return { error: true, message: `Failed to update homepage: ${msg}` }
      }
    },
  }),
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const messages = body?.messages

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "messages array is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }

  const result = streamText({
    model: "openai/gpt-5.2",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(8),
  })

  return result.toUIMessageStreamResponse()
}
