"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import { ModelSelector } from "@/components/ai/model-selector"
import { CopyButton } from "@/components/ai/chat-message"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  SendHorizontal,
  Loader2,
  Lightbulb,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  User,
  Bot,
  BookOpen,
  Target,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

const STARTERS = [
  {
    label: "Analyze my prompt",
    text: "Can you analyze this prompt for me? \"Write a blog post about AI\"",
    icon: Target,
    description: "See how a vague prompt scores",
  },
  {
    label: "Teach me prompting",
    text: "What are the most important principles for writing effective prompts?",
    icon: BookOpen,
    description: "Learn core techniques",
  },
  {
    label: "System prompt help",
    text: "Help me write a system prompt for a customer support chatbot that handles refund requests",
    icon: Zap,
    description: "Build a production-ready prompt",
  },
  {
    label: "Improve a prompt",
    text: "Can you improve this prompt? \"Make me a website that looks good and has all the features\"",
    icon: Sparkles,
    description: "See before/after rewrite",
  },
]

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="flex-1">
        <Progress
          value={score * 10}
          className={cn(
            "h-1.5",
            score >= 8 ? "[&>div]:bg-success" : score >= 5 ? "[&>div]:bg-warning" : "[&>div]:bg-destructive"
          )}
        />
      </div>
      <span className="w-6 text-right text-xs font-semibold tabular-nums text-foreground">
        {score}
      </span>
    </div>
  )
}

function AnalysisCard({ data }: { data: Record<string, unknown> }) {
  const d = data as {
    overallScore: number
    clarity: number
    specificity: number
    context: number
    structure: number
    constraints: number
    strengths: string[]
    weaknesses: string[]
  }

  return (
    <Card className="w-full max-w-md border-primary/15 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
              <Target className="h-3.5 w-3.5 text-primary" />
            </div>
            <CardTitle className="text-sm font-heading font-semibold">Prompt Analysis</CardTitle>
          </div>
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold",
              d.overallScore >= 8
                ? "bg-success/10 text-success"
                : d.overallScore >= 5
                  ? "bg-warning/10 text-warning"
                  : "bg-destructive/10 text-destructive"
            )}
          >
            {d.overallScore}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <ScoreBar label="Clarity" score={d.clarity} />
          <ScoreBar label="Specificity" score={d.specificity} />
          <ScoreBar label="Context" score={d.context} />
          <ScoreBar label="Structure" score={d.structure} />
          <ScoreBar label="Constraints" score={d.constraints} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {d.strengths?.length > 0 && (
            <div className="rounded-lg bg-success/5 p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-success">
                Strengths
              </p>
              <ul className="flex flex-col gap-1.5">
                {d.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {d.weaknesses?.length > 0 && (
            <div className="rounded-lg bg-warning/5 p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-warning">
                To Improve
              </p>
              <ul className="flex flex-col gap-1.5">
                {d.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                    <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function RewriteCard({ data }: { data: Record<string, unknown> }) {
  const d = data as {
    originalPrompt: string
    improvedPrompt: string
    changes: string[]
  }

  return (
    <Card className="w-full max-w-md border-secondary/15 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary/10">
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
          </div>
          <CardTitle className="text-sm font-heading font-semibold">Improved Prompt</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="rounded-lg bg-destructive/5 p-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-destructive/70">Before</p>
          <p className="text-xs text-muted-foreground line-through leading-relaxed">{d.originalPrompt}</p>
        </div>
        <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-3">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary">After</p>
            <CopyButton text={d.improvedPrompt} />
          </div>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{d.improvedPrompt}</p>
        </div>

        {d.changes?.length > 0 && (
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              Changes Made
            </p>
            <ul className="flex flex-col gap-1">
              {d.changes.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-secondary" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Message({
  message,
  toolRenderer,
}: {
  message: UIMessage
  toolRenderer: (part: Extract<UIMessage["parts"][number], { type: "tool-invocation" }>) => React.ReactNode
}) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-card text-foreground"
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      <div className={cn("flex max-w-[85%] flex-col gap-2", isUser ? "items-end" : "items-start")}>
        {message.parts.map((part, idx) => {
          if (part.type === "text" && part.text.trim()) {
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  isUser
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-muted text-foreground"
                )}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{part.text}</p>
                ) : (
                  <div className="prose prose-sm max-w-none text-foreground [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_pre]:bg-foreground/5 [&_pre]:rounded-md [&_pre]:p-3 [&_code]:text-xs [&_code]:font-mono [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_strong]:text-foreground">
                    <Markdown remarkPlugins={[remarkGfm]}>{part.text}</Markdown>
                  </div>
                )}
              </div>
            )
          }

          if (part.type === "tool-invocation") {
            return <React.Fragment key={idx}>{toolRenderer(part)}</React.Fragment>
          }

          return null
        })}
      </div>
    </div>
  )
}

export default function PromptCoachPage() {
  const [model, setModel] = React.useState("openai/gpt-5.2")
  const [input, setInput] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      body: { model },
    }),
  })

  const isDisabled = status === "streaming" || status === "submitted"

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (text?: string) => {
    const value = text || input.trim()
    if (!value || isDisabled) return
    sendMessage({ text: value })
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }

  const toolRenderer = React.useCallback(
    (part: Extract<UIMessage["parts"][number], { type: "tool-invocation" }>) => {
      const { toolInvocation } = part
      const { toolName, state } = toolInvocation

      if (state === "output-available" || state === "input-available") {
        const data = (state === "output-available" ? toolInvocation.output : toolInvocation.input) as Record<string, unknown>
        if (toolName === "analyzePrompt") return <AnalysisCard data={data} />
        if (toolName === "rewritePrompt") return <RewriteCard data={data} />
      }

      if (state === "input-streaming" || state === "input-available") {
        return (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">
              {toolName === "analyzePrompt" ? "Analyzing prompt..." : "Rewriting prompt..."}
            </span>
          </div>
        )
      }

      return null
    },
    []
  )

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-heading font-semibold text-foreground">Prompt Coach</h1>
            <p className="text-xs text-muted-foreground">AI-powered prompt analysis and improvement</p>
          </div>
        </div>
        <ModelSelector value={model} onChange={setModel} />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-heading font-semibold text-foreground text-balance">
                Write better prompts
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
                Share any prompt and get instant quality scoring, detailed analysis across 5 dimensions, and an improved rewrite.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 w-full max-w-xl">
              {STARTERS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSubmit(s.text)}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{s.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} toolRenderer={toolRenderer} />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-4 py-3 lg:px-8">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <div className="flex flex-1 items-end rounded-xl border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = "auto"
                e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
              placeholder="Paste a prompt to analyze, or ask about prompting techniques..."
              rows={1}
              disabled={isDisabled}
              className="min-h-[36px] max-h-[160px] flex-1 resize-none border-0 bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground disabled:opacity-50"
              aria-label="Chat input"
            />
          </div>
          <Button
            onClick={() => handleSubmit()}
            disabled={isDisabled || !input.trim()}
            size="icon"
            className="h-10 w-10 shrink-0 rounded-xl"
            aria-label="Send message"
          >
            {isDisabled ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
