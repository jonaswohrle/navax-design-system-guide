import { generateText, Output } from "ai"
import { z } from "zod"

const STEPS = ["research", "draft", "review", "polish"] as const

function createSSEStream(topic: string, model: string) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      function send(data: Record<string, unknown>) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        // Step 1: Research
        send({ step: "research", status: "running" })
        const research = await generateText({
          model,
          output: Output.object({
            schema: z.object({
              keyPoints: z.array(z.string()).describe("5-7 key points about the topic"),
              targetAudience: z.string().describe("Who this content is for"),
              angle: z.string().describe("The unique angle or perspective to take"),
              relatedTopics: z.array(z.string()).describe("3-4 related topics to reference"),
            }),
          }),
          prompt: `You are a content researcher. Research the topic "${topic}" for a technical blog post or tutorial.
          
Identify key points, the ideal target audience, a unique angle, and related topics that would strengthen the piece.
Focus on practical, actionable insights that developers and vibe coders would find valuable.`,
        })
        send({ step: "research", status: "done", data: research.output })

        // Step 2: Draft
        send({ step: "draft", status: "running" })
        const draft = await generateText({
          model,
          prompt: `You are a technical writer. Write a blog post about "${topic}".

Use this research to guide your writing:
${JSON.stringify(research.output, null, 2)}

Guidelines:
- Write 400-600 words
- Use markdown formatting (headings, code blocks, bullet points)
- Include practical examples and code snippets where relevant
- Keep the tone professional but approachable
- Focus on how this relates to prompting and vibe coding
- Include a compelling introduction and actionable conclusion`,
        })
        send({ step: "draft", status: "done", data: { content: draft.text } })

        // Step 3: Review
        send({ step: "review", status: "running" })
        const review = await generateText({
          model,
          output: Output.object({
            schema: z.object({
              overallScore: z.number().min(1).max(10),
              clarity: z.number().min(1).max(10),
              accuracy: z.number().min(1).max(10),
              engagement: z.number().min(1).max(10),
              actionability: z.number().min(1).max(10),
              issues: z.array(z.string()).describe("Specific issues found"),
              suggestions: z.array(z.string()).describe("Improvement suggestions"),
            }),
          }),
          prompt: `You are an editorial reviewer. Review this blog post draft and provide a structured quality assessment.

Draft to review:
${draft.text}

Evaluate on: clarity, accuracy, engagement, and actionability. Identify specific issues and provide improvement suggestions.`,
        })
        send({ step: "review", status: "done", data: review.output })

        // Step 4: Polish
        send({ step: "polish", status: "running" })
        const polished = await generateText({
          model,
          prompt: `You are a senior editor. Polish and improve this blog post based on the review feedback.

Original draft:
${draft.text}

Review feedback:
${JSON.stringify(review.output, null, 2)}

Apply the suggestions, fix the issues, and improve the overall quality. Return the final polished version in markdown format.
Make sure the content is engaging, accurate, and actionable for developers learning about prompting and vibe coding.`,
        })
        send({ step: "polish", status: "done", data: { content: polished.text } })

        send({ step: "complete", status: "done" })
      } catch (error) {
        send({
          step: "error",
          status: "error",
          data: { message: error instanceof Error ? error.message : "Pipeline failed" },
        })
      } finally {
        controller.close()
      }
    },
  })

  return stream
}

export async function POST(req: Request) {
  const { topic, model = "openai/gpt-5.2" } = await req.json()

  if (!topic || typeof topic !== "string") {
    return Response.json({ error: "Topic is required" }, { status: 400 })
  }

  const stream = createSSEStream(topic, model)

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
