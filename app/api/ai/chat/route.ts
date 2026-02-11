import { streamText, tool, convertToModelMessages, Output } from "ai"
import { z } from "zod"

export async function POST(req: Request) {
  const { messages, model = "openai/gpt-5.2" } = await req.json()

  const result = streamText({
    model: model,
    system: `You are an expert prompt engineer and AI coach. Your role is to help users write better prompts and understand prompting techniques.

When a user shares a prompt or asks for help with prompting:

1. ALWAYS use the analyzePrompt tool first to provide a structured quality analysis.
2. ALWAYS use the rewritePrompt tool to provide an improved version.
3. After both tools, add a BRIEF 1-2 sentence summary. The tool cards show all the detail -- do NOT repeat the analysis or rewrite in your text.

IMPORTANT: Keep your text responses SHORT when you've used tools. The interactive cards show the detailed analysis and rewrite beautifully. Your text should only add a brief insight or next step, not rehash what the cards already display. Maximum 2-3 sentences after tool calls.

When the user asks general questions about prompting (without sharing a specific prompt), answer conversationally with clear, structured advice. Use markdown formatting.

Key prompting principles you teach:
- Be specific and provide context
- Use clear structure (numbered steps, sections)
- Define the output format explicitly
- Include constraints and edge cases
- Use role/persona framing ("You are a...")
- Provide examples (few-shot prompting)
- Break complex tasks into steps (chain of thought)

Be encouraging but honest.`,
    messages: await convertToModelMessages(messages),
    tools: {
      analyzePrompt: tool({
        description:
          "Analyze a user's prompt for quality across multiple dimensions. Use this whenever a user shares a prompt they want feedback on.",
        inputSchema: z.object({
          originalPrompt: z.string().describe("The prompt being analyzed"),
          overallScore: z
            .number()
            .min(1)
            .max(10)
            .describe("Overall quality score from 1-10"),
          clarity: z
            .number()
            .min(1)
            .max(10)
            .describe("How clear and unambiguous is the prompt"),
          specificity: z
            .number()
            .min(1)
            .max(10)
            .describe("How specific vs vague the instructions are"),
          context: z
            .number()
            .min(1)
            .max(10)
            .describe("How much useful context is provided"),
          structure: z
            .number()
            .min(1)
            .max(10)
            .describe("How well organized and formatted"),
          constraints: z
            .number()
            .min(1)
            .max(10)
            .describe("How well output constraints are defined"),
          strengths: z
            .array(z.string())
            .describe("List of things the prompt does well"),
          weaknesses: z
            .array(z.string())
            .describe("List of areas for improvement"),
        }),
        execute: async (analysis) => {
          return analysis
        },
      }),
      rewritePrompt: tool({
        description:
          "Provide an improved rewrite of the user's prompt. Use this after analyzing the prompt to show a concrete improvement.",
        inputSchema: z.object({
          originalPrompt: z.string().describe("The original prompt"),
          improvedPrompt: z
            .string()
            .describe("The improved version of the prompt"),
          changes: z
            .array(z.string())
            .describe("List of specific changes made and why"),
        }),
        execute: async (rewrite) => {
          return rewrite
        },
      }),
    },
    stopWhen: (event) => {
      if (event.steps.length >= 5) return true
      const lastStep = event.steps[event.steps.length - 1]
      return !lastStep?.toolCalls?.length
    },
  })

  return result.toUIMessageStreamResponse()
}
