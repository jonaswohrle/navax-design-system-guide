import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
} from "ai"
import { z } from "zod"

export const maxDuration = 60

const tools = {
  showScorecard: tool({
    description:
      "Show an interactive prompt quality scorecard with animated score bars. Use when analyzing a user's prompt.",
    inputSchema: z.object({
      promptText: z.string().describe("The prompt being analyzed"),
      overall: z.number().min(1).max(10),
      clarity: z.number().min(1).max(10),
      specificity: z.number().min(1).max(10),
      context: z.number().min(1).max(10),
      structure: z.number().min(1).max(10),
      constraints: z.number().min(1).max(10),
      verdict: z.string().describe("A punchy one-line verdict"),
      topTip: z.string().describe("The single most impactful tip"),
    }),
    execute: async (data) => data,
  }),

  promptBattle: tool({
    description:
      "Show two prompts side-by-side for the user to pick which is better. The user clicks one and their choice is sent back to you. Use to teach through comparison.",
    inputSchema: z.object({
      question: z
        .string()
        .describe(
          "Context question, e.g. 'Which prompt will produce a better blog post?'"
        ),
      optionA: z.string().describe("First prompt option"),
      optionB: z.string().describe("Second prompt option"),
      correctOption: z
        .enum(["A", "B"])
        .describe("Which option is better"),
      explanation: z
        .string()
        .describe("Why the correct option is better"),
    }),
    outputSchema: z.string(),
    // No execute = client-side tool
  }),

  promptChallenge: tool({
    description:
      "Show a multiple-choice quiz about a prompting concept. The user clicks an answer and their choice is sent back to you. Use to test knowledge.",
    inputSchema: z.object({
      question: z.string().describe("The quiz question"),
      options: z
        .array(
          z.object({
            label: z
              .string()
              .describe("Option label: A, B, C, or D"),
            text: z.string().describe("The option text"),
          })
        )
        .describe("3-4 answer options"),
      correctLabel: z
        .string()
        .describe("Label of the correct option"),
      explanation: z
        .string()
        .describe("Why the correct answer is right"),
      concept: z
        .string()
        .describe(
          "The prompting concept, e.g. 'Few-shot prompting'"
        ),
    }),
    outputSchema: z.string(),
    // No execute = client-side tool
  }),

  showTip: tool({
    description:
      "Show a tip card teaching a prompting technique with before/after examples. Use to educate after wrong answers or to introduce concepts.",
    inputSchema: z.object({
      title: z
        .string()
        .describe("Tip title, e.g. 'Use Role Framing'"),
      concept: z
        .string()
        .describe("Brief explanation (2-3 sentences)"),
      badExample: z
        .string()
        .describe("Prompt WITHOUT this technique"),
      goodExample: z
        .string()
        .describe("Prompt WITH this technique"),
    }),
    execute: async (data) => data,
  }),
} as const

export async function POST(req: Request) {
  const { messages, model = "openai/gpt-5.2" } = await req.json()

  const result = streamText({
    model,
    system: `You are an expert prompt engineer running an interactive prompt coaching game. You make learning fun and visual.

## How you teach:
You use interactive tools to create a rich, game-like learning experience. NEVER just reply with plain text when you can use a tool instead.

## Tools you MUST use:

### When a user shares a prompt to analyze:
1. ALWAYS call "showScorecard" first with detailed scores.
2. Then call "promptBattle" with the original vs an improved version for the user to pick.
3. Keep any text to ONE sentence MAX between tool calls.

### When a user asks to learn prompting or asks general questions:
1. Use "promptChallenge" to quiz them with a multiple-choice question.
2. Add at most ONE sentence before the challenge.

### When continuing after the user answered a battle or challenge:
- Congratulate or correct them in ONE sentence.
- Then immediately use another tool to keep the game going: "showTip" to teach, then "promptChallenge" to quiz.
- NEVER end a turn without using at least one tool.

## CRITICAL RULES:
- ALWAYS use at least one tool in every response.
- Keep text to 1-2 sentences MAX. The tools ARE the content.
- Make it feel like a game with momentum.
- Never repeat the same challenge or battle.`,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools,
  })

  return result.toUIMessageStreamResponse()
}
