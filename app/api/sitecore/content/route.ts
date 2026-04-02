import { getHomepageContent, applyContentOverride, getContentOverrides } from "@/lib/sitecore-content"

export async function GET() {
  return Response.json(getHomepageContent())
}

/**
 * POST: Apply a content override (simulates Sitecore publishing).
 * Body: { componentName: string, fields: Record<string, unknown> }
 */
export async function POST(req: Request) {
  const body = await req.json()
  const { componentName, fields } = body

  if (!componentName || !fields) {
    return Response.json(
      { error: "componentName and fields are required" },
      { status: 400 }
    )
  }

  applyContentOverride(componentName, fields)

  return Response.json({
    success: true,
    componentName,
    message: `Content for "${componentName}" updated. Changes are now live on the homepage.`,
    overrides: getContentOverrides(),
  })
}
