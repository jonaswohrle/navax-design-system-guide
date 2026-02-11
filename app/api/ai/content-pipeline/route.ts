import { generateText, Output } from "ai"
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
          tools: {
            google_search: google.tools.googleSearch({}),
          },
          prompt: `Research the topic "${topic}" for a professional blog post. 
            Use Google Search to find the latest information.
            Provide key facts, statistics, current trends, expert opinions, and useful context. 
            Focus on practical insights that developers and technical readers would find valuable.
            Be thorough and cite specific details.`,
        })

        const sources = research.sources?.map((s) => ({
          title: ("title" in s ? s.title : s.url) as string,
          url: s.url,
        })) ?? []
        send("research", { content: research.text, sources })
        send("status", { step: "research", state: "done" })

        /* ── Step 2: Draft + Image in parallel ── */
        send("status", { step: "draft", state: "running" })
        send("status", { step: "image", state: "running" })

        // Generate article metadata first (fast structured output)
        const meta = await generateText({
          model: "openai/gpt-5.2",
          output: Output.object({
            schema: z.object({
              title: z.string().describe("Compelling blog post title"),
              subtitle: z.string().describe("One-line subtitle or teaser"),
              imagePrompt: z.string().describe("A detailed prompt for generating a photorealistic hero image that visually represents the blog topic. Describe scene, lighting, style."),
            }),
          }),
          prompt: `Based on this research about "${topic}", generate a blog post title, subtitle, and a hero image prompt.

Research:
${research.text}`,
        })

        send("meta", {
          title: meta.output?.title ?? topic,
          subtitle: meta.output?.subtitle ?? "",
        })

        // Now run draft and image generation in parallel
        const [draftResult, imageResult] = await Promise.allSettled([
          // Draft with GPT-5.2
          generateText({
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
          }),

          // Image with Gemini
          generateText({
            model: "google/gemini-3-pro-image",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: meta.output?.imagePrompt ?? `Create a beautiful, modern hero image for a blog post about: ${topic}. Photorealistic, professional, cinematic lighting.`,
                  },
                ],
              },
            ],
            providerOptions: {
              google: { responseModalities: ["TEXT", "IMAGE"] },
            },
          }),
        ])

        // Send draft result
        if (draftResult.status === "fulfilled") {
          send("draft", { content: draftResult.value.text })
          send("status", { step: "draft", state: "done" })
        } else {
          send("draft", { content: `*Draft generation failed. Please try again.*` })
          send("status", { step: "draft", state: "error" })
        }

        // Send image result
        if (imageResult.status === "fulfilled" && imageResult.value.files?.length) {
          const file = imageResult.value.files[0]
          if (file.mediaType?.startsWith("image/")) {
            send("image", {
              base64: file.base64,
              mediaType: file.mediaType,
            })
            send("status", { step: "image", state: "done" })
          } else {
            send("status", { step: "image", state: "error" })
          }
        } else {
          send("status", { step: "image", state: "error" })
        }

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
