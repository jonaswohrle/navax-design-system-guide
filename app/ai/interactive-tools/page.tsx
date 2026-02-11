"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import { ModelSelector } from "@/components/ai/model-selector"
import { ChatLayout } from "@/components/ai/chat-layout"
import { CopyButton } from "@/components/ai/chat-message"
import { PageHeader } from "@/components/ds/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Blocks,
  Layout,
  FileText,
  List,
  BarChart3,
  Shield,
  Globe,
  Star,
  Check,
  X,
  Code,
  Sparkles,
  Wrench,
} from "lucide-react"
import { cn } from "@/lib/utils"

const ICON_MAP: Record<string, React.ElementType> = {
  layout: Layout,
  form: FileText,
  list: List,
  chart: BarChart3,
  auth: Shield,
  api: Globe,
}

// Template Picker Component
function TemplatePicker({
  data,
  onSelect,
}: {
  data: { question: string; templates: { id: string; name: string; description: string; icon: string }[] }
  onSelect: (templateId: string, templateName: string) => void
}) {
  const [selected, setSelected] = React.useState<string | null>(null)

  return (
    <Card className="w-full max-w-lg border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-heading font-semibold">{data.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {data.templates.map((template) => {
            const Icon = ICON_MAP[template.icon] || Code
            const isSelected = selected === template.id
            return (
              <button
                key={template.id}
                disabled={!!selected}
                onClick={() => {
                  setSelected(template.id)
                  onSelect(template.id, template.name)
                }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : selected
                      ? "border-border opacity-50"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <Icon className={cn("h-6 w-6", isSelected ? "text-primary" : "text-muted-foreground")} />
                <div>
                  <p className="text-xs font-semibold text-foreground">{template.name}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight">{template.description}</p>
                </div>
                {isSelected && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    Selected
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Confirmation Dialog
function ConfirmationDialog({
  data,
  onRespond,
}: {
  data: { title: string; description: string }
  onRespond: (confirmed: boolean) => void
}) {
  const [responded, setResponded] = React.useState<boolean | null>(null)

  const handleRespond = (value: boolean) => {
    setResponded(value)
    onRespond(value)
  }

  return (
    <Card className="w-full max-w-sm border-warning/20">
      <CardContent className="flex flex-col gap-3 p-4">
        <div>
          <p className="text-sm font-semibold text-foreground">{data.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{data.description}</p>
        </div>
        {responded === null ? (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleRespond(true)} className="flex-1">
              <Check className="mr-1.5 h-3.5 w-3.5" />
              Confirm
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleRespond(false)} className="flex-1">
              <X className="mr-1.5 h-3.5 w-3.5" />
              Cancel
            </Button>
          </div>
        ) : (
          <div className={cn(
            "rounded-md px-3 py-2 text-xs font-medium",
            responded ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          )}>
            {responded ? "Confirmed - generating code..." : "Cancelled"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Rating Widget
function RatingWidget({
  data,
  onRate,
}: {
  data: { question: string }
  onRate: (rating: number) => void
}) {
  const [rating, setRating] = React.useState(0)
  const [hovering, setHovering] = React.useState(0)
  const [submitted, setSubmitted] = React.useState(false)

  return (
    <Card className="w-full max-w-xs border-secondary/20">
      <CardContent className="flex flex-col items-center gap-3 p-4">
        <p className="text-sm font-semibold text-foreground">{data.question}</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              disabled={submitted}
              onMouseEnter={() => setHovering(star)}
              onMouseLeave={() => setHovering(0)}
              onClick={() => {
                setRating(star)
                setSubmitted(true)
                onRate(star)
              }}
              className="p-0.5 transition-colors"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  (hovering || rating) >= star
                    ? "fill-warning text-warning"
                    : "text-muted-foreground/30"
                )}
              />
            </button>
          ))}
        </div>
        {submitted && (
          <p className="text-xs text-muted-foreground">
            Thanks for rating {rating}/5!
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// Code Block Component
function CodeBlock({ data }: { data: { filename: string; language: string; description: string; code: string } }) {
  return (
    <Card className="w-full max-w-lg border-secondary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-secondary" />
            <CardTitle className="text-sm font-mono">{data.filename}</CardTitle>
          </div>
          <CopyButton text={data.code} />
        </div>
        <p className="text-xs text-muted-foreground">{data.description}</p>
      </CardHeader>
      <CardContent>
        <pre className="max-h-80 overflow-auto rounded-md bg-foreground/5 p-4">
          <code className="text-xs font-mono text-foreground whitespace-pre">{data.code}</code>
        </pre>
      </CardContent>
    </Card>
  )
}

const STARTERS = [
  { label: "Build a component", text: "Help me build a React component for a pricing table" },
  { label: "Create an API route", text: "I need a Next.js API route that handles webhook events" },
  { label: "Design a form", text: "Build me a multi-step signup form with validation" },
]

export default function InteractiveToolsPage() {
  const [model, setModel] = React.useState("openai/gpt-4o")

  const { messages, sendMessage, addToolOutput, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/tools",
      body: { model },
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall({ toolCall }) {
      if (toolCall.dynamic) return
      // Client-side tools are handled via UI - no immediate addToolOutput
    },
  })

  const toolRenderer = React.useCallback(
    (part: { type: "tool-invocation"; toolInvocation: { toolName: string; toolCallId: string; state: string; output?: unknown; input?: unknown } }) => {
      const { toolInvocation } = part
      const { toolName, state, toolCallId } = toolInvocation
      const input = (toolInvocation.input ?? {}) as Record<string, unknown>

      // Pick Template (client-side)
      if (toolName === "pickTemplate") {
        if (state === "input-available") {
          return (
            <TemplatePicker
              data={input as { question: string; templates: { id: string; name: string; description: string; icon: string }[] }}
              onSelect={(templateId, templateName) => {
                addToolOutput({
                  tool: "pickTemplate",
                  toolCallId,
                  output: JSON.stringify({ selectedTemplate: templateId, name: templateName }),
                })
              }}
            />
          )
        }
        if (state === "output-available") {
          return (
            <TemplatePicker
              data={input as { question: string; templates: { id: string; name: string; description: string; icon: string }[] }}
              onSelect={() => {}}
            />
          )
        }
      }

      // Confirmation (client-side)
      if (toolName === "askForConfirmation") {
        if (state === "input-available") {
          return (
            <ConfirmationDialog
              data={input as { title: string; description: string }}
              onRespond={(confirmed) => {
                addToolOutput({
                  tool: "askForConfirmation",
                  toolCallId,
                  output: JSON.stringify({ confirmed }),
                })
              }}
            />
          )
        }
        if (state === "output-available") {
          return (
            <ConfirmationDialog
              data={input as { title: string; description: string }}
              onRespond={() => {}}
            />
          )
        }
      }

      // Rating (client-side)
      if (toolName === "rateFeedback") {
        if (state === "input-available") {
          return (
            <RatingWidget
              data={input as { question: string }}
              onRate={(rating) => {
                addToolOutput({
                  tool: "rateFeedback",
                  toolCallId,
                  output: JSON.stringify({ rating }),
                })
              }}
            />
          )
        }
        if (state === "output-available") {
          return (
            <RatingWidget
              data={input as { question: string }}
              onRate={() => {}}
            />
          )
        }
      }

      // Generated Code (server-side)
      if (toolName === "generateCode") {
        if (state === "output-available") {
          const output = toolInvocation.output as { filename: string; language: string; description: string; code: string }
          return <CodeBlock data={output} />
        }
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
            <span className="text-xs text-muted-foreground">Generating code...</span>
          </div>
        )
      }

      // Fallback loading
      if (state === "input-streaming") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-xs text-muted-foreground">Loading tool...</span>
          </div>
        )
      }

      return null
    },
    [addToolOutput]
  )

  const emptyState = (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10">
        <Wrench className="h-8 w-8 text-secondary" />
      </div>
      <div>
        <h2 className="text-lg font-heading font-semibold text-foreground text-balance">
          Interactive Tools
        </h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Chat with an AI that triggers interactive UI components -- template pickers, confirmation dialogs, and code generators.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {STARTERS.map((s) => (
          <Button
            key={s.label}
            variant="outline"
            className="h-auto justify-start px-4 py-3 text-left"
            onClick={() => sendMessage({ text: s.text })}
          >
            <Blocks className="mr-2 h-4 w-4 shrink-0 text-secondary" />
            <span className="text-sm">{s.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Interactive Tools"
            description="Chat with AI-powered interactive components"
          />
          <ModelSelector value={model} onChange={setModel} />
        </div>
      </div>
      <ChatLayout
        messages={messages}
        onSend={(text) => sendMessage({ text })}
        status={status}
        toolRenderer={toolRenderer}
        placeholder="Ask me to build something for you..."
        emptyState={emptyState}
        className="flex-1"
      />
    </div>
  )
}
