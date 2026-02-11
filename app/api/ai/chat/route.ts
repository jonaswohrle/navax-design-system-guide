import { streamText, tool, convertToModelMessages } from "ai"
import { z } from "zod"

export async function POST(req: Request) {
  const { messages, model = "openai/gpt-5.2" } = await req.json()

  const result = streamText({
    model: model,
    system: `You are an expert prompt engineer running an interactive prompt coaching game. You make learning fun and visual.

## How you teach:
You use interactive tools to create a rich, game-like learning experience. NEVER just reply with plain text when you can use a tool instead.

## Tools you MUST use:

### When a user shares a prompt to analyze:
1. ALWAYS call "showScorecard" with detailed scores.
2. ALWAYS call "promptBattle" with original vs improved version for user to pick.
3. Keep your text to ONE sentence bridging the two cards.

### When a user asks to learn prompting or asks general questions:
1. Use "promptChallenge" to quiz them with a multiple-choice question about the concept.
2. Add ONE sentence of context before the challenge.

### When continuing a conversation after user interacted with a tool:
- If they picked the right answer in a battle/challenge, congratulate them briefly, explain WHY it's better, then use another tool (challenge, battle, or tip) to keep the game going.
- If they picked wrong, encourage them, explain the correct answer, then use "showTip" to teach the concept, followed by another "promptChallenge".

## CRITICAL RULES:
- ALWAYS use at least one tool in every response. Plain text alone is NEVER acceptable.
- Keep text responses to 1-2 sentences MAX. The tools ARE the content.
- Make it feel like a game -- fast-paced, visual, interactive.
- Never repeat the same challenge or battle.`,
    messages: await convertToModelMessages(messages),
    tools: {
      // Server-side tool: returns structured score data, rendered as interactive card
      showScorecard: tool({
        description:
          "Show an interactive prompt quality scorecard with animated bars and color-coded scores. Use whenever analyzing a prompt.",
        inputSchema: z.object({
          promptText: z.string().describe("The prompt being analyzed"),
          overall: z.number().min(1).max(10),
          clarity: z.number().min(1).max(10),
          specificity: z.number().min(1).max(10),
          context: z.number().min(1).max(10),
          structure: z.number().min(1).max(10),
          constraints: z.number().min(1).max(10),
          verdict: z
            .string()
            .describe(
              "A punchy one-line verdict, e.g. 'Too vague to produce reliable output'"
            ),
          topTip: z
            .string()
            .describe(
              "The single most impactful improvement they could make"
            ),
        }),
        execute: async (data) => data,
      }),

      // Client-side tool: user picks A or B, selection feeds back
      promptBattle: tool({
        description:
          "Show two prompts side-by-side and let the user pick which is better. One should be clearly better. Use to teach through comparison.",
        inputSchema: z.object({
          question: z
            .string()
            .describe(
              "The question/context, e.g. 'Which prompt will produce a better blog post?'"
            ),
          optionA: z.string().describe("First prompt option"),
          optionB: z.string().describe("Second prompt option"),
          correctOption: z
            .enum(["A", "B"])
            .describe("Which option is better"),
          explanation: z
            .string()
            .describe(
              "Why the correct option is better (shown after selection)"
            ),
        }),
        // No execute -- client-side tool!
      }),

      // Client-side tool: multiple choice quiz
      promptChallenge: tool({
        description:
          "Show an interactive multiple-choice challenge about a prompting concept. Use to quiz the user and teach through gameplay.",
        inputSchema: z.object({
          question: z
            .string()
            .describe("The challenge question"),
          options: z
            .array(
              z.object({
                label: z.string(),
                text: z.string().describe("The option text"),
              })
            )
            .describe("3-4 answer options labeled A, B, C, D"),
          correctLabel: z
            .string()
            .describe("The label of the correct option (A, B, C, or D)"),
          explanation: z
            .string()
            .describe("Why the correct answer is right (shown after answering)"),
          concept: z
            .string()
            .describe(
              "The prompting concept being taught, e.g. 'Few-shot prompting'"
            ),
        }),
        // No execute -- client-side tool!
      }),

      // Server-side tool: educational tip card
      showTip: tool({
        description:
          "Show a visually rich tip card that teaches a specific prompting technique with a before/after example.",
        inputSchema: z.object({
          title: z.string().describe("Tip title, e.g. 'Use Role Framing'"),
          concept: z
            .string()
            .describe(
              "Brief explanation of the technique (2-3 sentences)"
            ),
          badExample: z
            .string()
            .describe("Example of a prompt WITHOUT this technique"),
          goodExample: z
            .string()
            .describe("Example of a prompt WITH this technique applied"),
        }),
        execute: async (data) => data,
      }),
    },
    stopWhen: (event) => {
      if (event.steps.length >= 8) return true
      const lastStep = event.steps[event.steps.length - 1]
      // Stop if the last step has no tool calls (text-only response)
      // or if a client-side tool was called (needs user interaction)
      if (!lastStep?.toolCalls?.length) return true
      const hasClientTool = lastStep.toolCalls.some(
        (tc) =>
          tc.toolName === "promptBattle" || tc.toolName === "promptChallenge"
      )
      return hasClientTool
    },
  })

  return result.toUIMessageStreamResponse()
}
