import { streamText, tool, convertToModelMessages } from "ai"
import { z } from "zod"

export async function POST(req: Request) {
  const { messages, model = "openai/gpt-5.2" } = await req.json()

  const result = streamText({
    model,
    system: `You are a vibe coding assistant that helps developers build things quickly. You have access to interactive tools that render UI components in the chat.

Your available tools:
1. **pickTemplate** - Present a template picker when the user wants to start a new project or component. Use this to let them choose from common patterns.
2. **askForConfirmation** - Ask the user to confirm before generating code or taking an action. Use this for important decisions.
3. **generateCode** - Generate a code snippet. Only use AFTER the user has confirmed or selected a template.
4. **rateFeedback** - Ask for feedback after generating code. Use this after delivering code to improve future suggestions.

Workflow:
- When a user asks to build something, first use pickTemplate to let them choose a starting point
- Then use askForConfirmation to confirm the approach
- After confirmation, use generateCode to deliver the code
- Finally, use rateFeedback to get their opinion

Be enthusiastic and helpful. Keep explanations brief. Focus on delivering working code.`,
    messages: await convertToModelMessages(messages),
    tools: {
      // Client-side tools (no execute)
      pickTemplate: tool({
        description: "Present a template selection grid to the user. Use this when they want to build something new.",
        inputSchema: z.object({
          question: z.string().describe("The question to ask, e.g. 'What kind of component do you want to build?'"),
          templates: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              description: z.string(),
              icon: z.string().describe("One of: layout, form, list, chart, auth, api"),
            })
          ).describe("The templates to present"),
        }),
      }),
      askForConfirmation: tool({
        description: "Ask the user to confirm an action before proceeding. Use for important decisions.",
        inputSchema: z.object({
          title: z.string().describe("What you are asking confirmation for"),
          description: z.string().describe("Details about what will happen"),
        }),
      }),
      rateFeedback: tool({
        description: "Ask the user to rate the generated output. Use after delivering code.",
        inputSchema: z.object({
          question: z.string().describe("The feedback question, e.g. 'How was this code snippet?'"),
        }),
      }),
      // Server-side tool (with execute)
      generateCode: tool({
        description: "Generate a code snippet based on the template and requirements. Use after the user confirms.",
        inputSchema: z.object({
          filename: z.string().describe("The filename, e.g. 'LoginForm.tsx'"),
          language: z.string().describe("The programming language, e.g. 'typescript', 'python'"),
          description: z.string().describe("Brief description of what the code does"),
          code: z.string().describe("The complete, working code snippet"),
        }),
        execute: async (input) => {
          return {
            filename: input.filename,
            language: input.language,
            description: input.description,
            code: input.code,
            generatedAt: new Date().toISOString(),
          }
        },
      }),
    },
    stopWhen: (event) => {
      if (event.steps.length >= 6) return true
      const lastStep = event.steps[event.steps.length - 1]
      if (!lastStep?.toolCalls?.length) return true
      // Stop if we hit a client-side tool (no execute)
      const clientTools = ["pickTemplate", "askForConfirmation", "rateFeedback"]
      return lastStep.toolCalls.some((tc: { toolName: string }) => clientTools.includes(tc.toolName))
    },
  })

  return result.toUIMessageStreamResponse()
}
