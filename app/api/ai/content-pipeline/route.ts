import { generateText, streamText, Output } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

export const maxDuration = 120

export async function POST(req: Request) {
  const { topic } = await req.json()

  if (!topic || typeof topic !== "string") {
    return Response.json({ error: "Topic is required" }, { status: 400 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: Record<string, unknown>) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event, ...data })}\n\n`))
      }

      try {
        /* ── Step 1: Research with Gemini + Google Search ── */
        send("status", { step: "research", state: "running" })

        const research = await generateText({
          model: "google/gemini-2.5-flash",
          tools: { google_search: google.tools.googleSearch({}) },
          prompt: `Research the topic "${topic}" for a professional blog post. 
            Use Google Search to find the latest information.
            Provide key facts, statistics, current trends, expert opinions, and useful context. 
            Focus on practical insights that developers and technical readers would find valuable.
            Be thorough and cite specific details.`,
        })

        const sources =
          research.sources?.map((s) => ({
            title: ("title" in s ? s.title : s.url) as string,
            url: s.url,
          })) ?? []
        send("research", { content: research.text, sources })
        send("status", { step: "research", state: "done" })

        /* ── Step 2: Generate metadata ── */
        const meta = await generateText({
          model: "openai/gpt-5.2",
          output: Output.object({
            schema: z.object({
              title: z.string().describe("Compelling blog post title"),
              subtitle: z.string().describe("One-line subtitle or teaser"),
              imagePrompt: z
                .string()
                .describe(
                  "A detailed prompt for generating a photorealistic hero image that visually represents the blog topic. Describe scene, lighting, style."
                ),
            }),
          }),
          prompt: `Based on this research about "${topic}", generate a blog post title, subtitle, and a hero image prompt.\n\nResearch:\n${research.text}`,
        })

        send("meta", {
          title: meta.output?.title ?? topic,
          subtitle: meta.output?.subtitle ?? "",
        })

        /* ── Step 3: Draft (streamed token-by-token) + Image in parallel ── */
        send("status", { step: "draft", state: "running" })
        send("status", { step: "image", state: "running" })

        const draftPromise = (async () => {
          const result = streamText({
            model: "openai/gpt-5.2",
            prompt: `You are a senior technical writer. Write a well-structured blog post about "${topic}".

Title: ${meta.output?.title}
Subtitle: ${meta.output?.subtitle}

Use this research as your source material:
${research.text}

Guidelines:
- Write 600-900 words in markdown format
- Start directly with the content (NO title/heading at the top -- it's already displayed)
- Use ## for section headings, ### for subsections
- Include practical examples, code snippets where relevant
- Add bullet points and numbered lists for clarity
- Use bold and italic for emphasis
- Write with a professional but approachable tone
- Include a compelling introduction paragraph
- End with actionable takeaways or a conclusion
- Make it genuinely useful for developers and tech readers`,
          })

          for await (const delta of result.textStream) {
            send("draft-delta", { delta })
          }

          send("status", { step: "draft", state: "done" })
        })()

        const imagePromise = (async () => {
          try {
            const imageResult = await generateText({
              model: "google/gemini-3-pro-image",
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text:
                        meta.output?.imagePrompt ??
                        `Create a beautiful, modern hero image for a blog post about: ${topic}. Photorealistic, professional, cinematic lighting.`,
                    },
                  ],
                },
              ],
              providerOptions: {
                google: { responseModalities: ["TEXT", "IMAGE"] },
              },
            })

            if (imageResult.files?.length) {
              const file = imageResult.files[0]
              if (file.mediaType?.startsWith("image/")) {
                send("image", { base64: file.base64, mediaType: file.mediaType })
                send("status", { step: "image", state: "done" })
                return
              }
            }
            send("status", { step: "image", state: "error" })
          } catch {
            send("status", { step: "image", state: "error" })
          }
        })()

        await Promise.allSettled([draftPromise, imagePromise])

        send("complete", {})
      } catch (error) {
        send("error", {
          message: error instanceof Error ? error.message : "Pipeline failed",
        })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
