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
- Tagline: "Hilft. Pflegt. Schützt." (Helps. Cares. Protects.)
- Brand Colors: Bright Blue #0045FF (primary), Dark Blue #001689 (secondary)
- Logo: HARTMANN wordmark in Dark Blue

**Key Product Lines:**
- Sterillium -- hand disinfection (market leader)
- MoliCare -- incontinence care products
- HydroClean -- wound care / wound dressings
- Foliodress -- surgical gowns and OR supplies
- Bacillol -- surface disinfection
- Peha-soft -- examination gloves

**Market Segments:**
- Kliniken (Hospitals)
- Pflegeheime (Care Homes / Nursing Homes)
- Arztpraxen (Medical Practices)
- Apotheken (Pharmacies)
- Rettungsdienste (Emergency Services)
- Privatanwender (Private Consumers)

**Competence Areas:**
- Wundversorgung (Wound Care)
- Inkontinenzmanagement (Incontinence Management)
- Infektionsmanagement (Infection Prevention / Disinfection)
- OP-Bedarf (Surgical Supplies)

## Behavior Guidelines

- Use professional medical/healthcare terminology appropriately
- Reference real HARTMANN products and market segments when suggesting content
- When creating pages, suggest structures relevant to healthcare product marketing (product detail pages, clinical evidence pages, training materials, etc.)
- Apply HARTMANN brand guidelines when discussing design or content
- Be concise -- let the rich tool results do the heavy lifting
- When a tool returns data, provide a brief helpful summary alongside it
- If a tool returns an error, explain what happened and suggest next steps
- Always use the appropriate tool when available -- never describe actions you could perform with a tool call`

/**
 * Define AI SDK tools that proxy to Sitecore MCP tool calls.
 * Each tool's execute() delegates to the MCP client.
 */
const tools = {
  /* ── Site Management ──────────────────────────────────────── */
  list_sites: tool({
    description:
      "List all available Sitecore sites. Returns site names, IDs, and languages.",
    inputSchema: z.object({}),
    execute: async () => sitecoreMCP.callTool("list_sites", {}),
  }),

  get_site_details: tool({
    description:
      "Get detailed information about a specific Sitecore site including its configuration and settings.",
    inputSchema: z.object({
      siteName: z.string().describe("The name of the site to get details for"),
    }),
    execute: async ({ siteName }) =>
      sitecoreMCP.callTool("get_site_details", { siteName }),
  }),

  get_page_tree: tool({
    description:
      "Get the page tree (hierarchical structure of pages) for a Sitecore site. Shows the sitemap-like structure.",
    inputSchema: z.object({
      siteName: z.string().describe("The name of the site"),
    }),
    execute: async ({ siteName }) =>
      sitecoreMCP.callTool("get_page_tree", { siteName }),
  }),

  /* ── Page Management ──────────────────────────────────────── */
  create_page: tool({
    description:
      "Create a new page in a Sitecore site. Specify parent path, template, and page name.",
    inputSchema: z.object({
      siteName: z.string().describe("Target site name"),
      parentPath: z
        .string()
        .describe(
          "Parent page path where the new page will be created, e.g. '/Home'"
        ),
      pageName: z.string().describe("Name of the new page"),
      template: z
        .string()
        .optional()
        .describe(
          "Page template to use, e.g. 'Page', 'Landing Page'"
        ),
    }),
    execute: async (args) => sitecoreMCP.callTool("create_page", args),
  }),

  get_page_details: tool({
    description:
      "Get details of a specific page including its metadata, template, and fields.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page, e.g. '/Home/Products/Sterillium'"),
    }),
    execute: async (args) =>
      sitecoreMCP.callTool("get_page_details", args),
  }),

  get_page_content: tool({
    description:
      "Get the content (components and their field values) of a page.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
    }),
    execute: async (args) =>
      sitecoreMCP.callTool("get_page_content", args),
  }),

  get_page_screenshot: tool({
    description:
      "Take a screenshot/preview of a published page. Returns a screenshot URL.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
    }),
    execute: async (args) =>
      sitecoreMCP.callTool("get_page_screenshot", args),
  }),

  update_page: tool({
    description:
      "Update a page's metadata or field values.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
      fields: z
        .record(z.string())
        .describe(
          "Object of field names and their new values to update"
        ),
    }),
    execute: async (args) =>
      sitecoreMCP.callTool("update_page", args),
  }),

  /* ── Component Management ─────────────────────────────────── */
  add_component: tool({
    description:
      "Add a component to a page. Components are the building blocks of page content in Sitecore.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
      componentName: z
        .string()
        .describe("Name of the component to add, e.g. 'Rich Text', 'Hero Banner', 'Product Card'"),
      placeholder: z
        .string()
        .optional()
        .describe("Placeholder/slot to add the component to"),
      fields: z
        .record(z.string())
        .optional()
        .describe("Initial field values for the component"),
    }),
    execute: async (args) =>
      sitecoreMCP.callTool("add_component", args),
  }),

  update_component_content: tool({
    description:
      "Update the content/field values of an existing component on a page.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
      componentId: z
        .string()
        .describe("ID of the component to update"),
      fields: z
        .record(z.string())
        .describe("Field values to update"),
    }),
    execute: async (args) =>
      sitecoreMCP.callTool("update_component_content", args),
  }),

  /* ── Asset Management ─────────────────────────────────────── */
  search_assets: tool({
    description:
      "Search for digital assets (images, documents, videos) in the Sitecore media library.",
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          "Search query, e.g. 'Sterillium product photo', 'wound care illustration'"
        ),
    }),
    execute: async ({ query }) =>
      sitecoreMCP.callTool("search_assets", { query }),
  }),

  get_asset_details: tool({
    description:
      "Get detailed metadata for a specific asset.",
    inputSchema: z.object({
      assetId: z.string().describe("The ID of the asset"),
    }),
    execute: async ({ assetId }) =>
      sitecoreMCP.callTool("get_asset_details", { assetId }),
  }),

  /* ── Personalization ──────────────────────────────────────── */
  list_personalization_variants: tool({
    description:
      "List all personalization variants configured for a page. Shows different content versions for different audiences.",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
    }),
    execute: async (args) =>
      sitecoreMCP.callTool("list_personalization_variants", args),
  }),

  create_personalization_variant: tool({
    description:
      "Create a personalization variant for a page, targeting a specific audience (e.g., hospital buyers vs. pharmacy visitors).",
    inputSchema: z.object({
      siteName: z.string().describe("Site name"),
      pagePath: z.string().describe("Full path to the page"),
      variantName: z
        .string()
        .describe("Name for the variant, e.g. 'Hospital Visitors'"),
      audience: z
        .string()
        .optional()
        .describe(
          "Target audience description, e.g. 'Healthcare professionals in hospitals'"
        ),
      condition: z
        .string()
        .optional()
        .describe("Targeting condition or rule"),
    }),
    execute: async (args) =>
      sitecoreMCP.callTool("create_personalization_variant", args),
  }),

  /* ── Brand Kits ───────────────────────────────────────────── */
  list_brand_kits: tool({
    description:
      "List all brand kits. Brand kits define brand identity (colors, fonts, guidelines) for AI content generation.",
    inputSchema: z.object({}),
    execute: async () =>
      sitecoreMCP.callTool("list_brand_kits", {}),
  }),

  get_brand_kit_details: tool({
    description:
      "Get detailed information about a specific brand kit including colors, fonts, tone of voice, and guidelines.",
    inputSchema: z.object({
      brandKitId: z.string().describe("The ID of the brand kit"),
    }),
    execute: async ({ brandKitId }) =>
      sitecoreMCP.callTool("get_brand_kit_details", { brandKitId }),
  }),

  create_brand_kit: tool({
    description:
      "Create a new brand kit with brand colors, fonts, tone of voice, and guidelines.",
    inputSchema: z.object({
      name: z.string().describe("Name for the brand kit, e.g. 'HARTMANN Global'"),
      description: z
        .string()
        .optional()
        .describe("Description of what this brand kit is for"),
      colors: z
        .array(z.string())
        .optional()
        .describe("Brand colors as hex values, e.g. ['#0045FF', '#001689']"),
      fonts: z
        .array(z.string())
        .optional()
        .describe("Font names used by the brand"),
      toneOfVoice: z
        .string()
        .optional()
        .describe(
          "Description of the brand's tone of voice"
        ),
      guidelines: z
        .string()
        .optional()
        .describe("Additional brand guidelines text"),
    }),
    execute: async (args) =>
      sitecoreMCP.callTool("create_brand_kit", args),
  }),

  /* ── Briefs ───────────────────────────────────────────────── */
  create_brief: tool({
    description:
      "Create a marketing brief using AI. Generates content based on brand kit, objectives, and target audience.",
    inputSchema: z.object({
      title: z
        .string()
        .describe("Brief title, e.g. 'Sterillium Q3 Campaign'"),
      objective: z
        .string()
        .describe("Campaign objective or goal"),
      targetAudience: z
        .string()
        .describe(
          "Target audience description, e.g. 'Hospital infection control managers'"
        ),
      brandKitId: z
        .string()
        .optional()
        .describe("ID of the brand kit to use for style guidance"),
      additionalContext: z
        .string()
        .optional()
        .describe("Any additional context or requirements"),
    }),
    execute: async (args) =>
      sitecoreMCP.callTool("create_brief", args),
  }),

  list_briefs: tool({
    description: "List all created marketing briefs.",
    inputSchema: z.object({}),
    execute: async () => sitecoreMCP.callTool("list_briefs", {}),
  }),

  get_brief_details: tool({
    description:
      "Get the full content and details of a specific marketing brief.",
    inputSchema: z.object({
      briefId: z.string().describe("The ID of the brief"),
    }),
    execute: async ({ briefId }) =>
      sitecoreMCP.callTool("get_brief_details", { briefId }),
  }),

  /* ── Jobs ─────────────────────────────────────────────────── */
  get_job_status: tool({
    description:
      "Check the status of an asynchronous job (e.g., page creation, asset upload, brief generation).",
    inputSchema: z.object({
      jobId: z.string().describe("The ID of the job to check"),
    }),
    execute: async ({ jobId }) =>
      sitecoreMCP.callTool("get_job_status", { jobId }),
  }),
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: "openai/gpt-5.2",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(8),
  })

  return result.toUIMessageStreamResponse()
}
