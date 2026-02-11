import { generateText } from "ai"

export async function POST(req: Request) {
  const formData = await req.formData()
  const prompt = formData.get("prompt") as string
  const image = formData.get("image") as File | null

  if (!prompt || typeof prompt !== "string") {
    return Response.json({ error: "Prompt is required" }, { status: 400 })
  }

  const content: Array<
    | { type: "text"; text: string }
    | { type: "image"; image: ArrayBuffer; mediaType: string }
  > = []

  // If an image was uploaded, add it to the content
  if (image && image.size > 0) {
    const buffer = await image.arrayBuffer()
    content.push({
      type: "image",
      image: buffer,
      mediaType: image.type || "image/png",
    })
  }

  content.push({ type: "text", text: prompt })

  try {
    const result = await generateText({
      model: "google/gemini-3-pro-image",
      messages: [{ role: "user", content }],
      providerOptions: {
        google: { responseModalities: ["TEXT", "IMAGE"] },
      },
    })

    const images: { base64: string; mediaType: string }[] = []
    if (result.files) {
      for (const file of result.files) {
        if (file.mediaType?.startsWith("image/")) {
          images.push({
            base64: file.base64,
            mediaType: file.mediaType,
          })
        }
      }
    }

    return Response.json({
      text: result.text,
      images,
      usage: result.usage,
    })
  } catch (error) {
    console.error("[v0] Image generation error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Image generation failed" },
      { status: 500 }
    )
  }
}
