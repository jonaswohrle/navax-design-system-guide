"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import { ModelSelector } from "@/components/ai/model-selector"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SendHorizontal,
  Loader2,
  Lightbulb,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  User,
  Bot,
  BookOpen,
  Target,
  Zap,
  Copy,
  Check,
  ChevronDown,
  TrendingUp,
  Eye,
  FileText,
  Layers,
  Ruler,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

const STARTERS = [
  {
    label: "Analyze a prompt",
    text: 'Can you analyze this prompt for me? "Write a blog post about AI"',
    icon: Target,
    description: "See how a vague prompt scores and get a rewrite",
  },
  {
    label: "Learn prompting",
    text: "What are the most important principles for writing effective prompts?",
    icon: BookOpen,
    description: "Core techniques for better AI output",
  },
  {
    label: "System prompt",
    text: "Help me write a system prompt for a customer support chatbot that handles refund requests",
    icon: Zap,
    description: "Build a production-ready system prompt",
  },
  {
    label: "Improve a prompt",
    text: 'Can you improve this prompt? "Make me a website that looks good and has all the features"',
    icon: Sparkles,
    description: "Before/after transformation with explanation",
  },
]

const SCORE_ICONS: Record<string, React.ElementType> = {
  Clarity: Eye,
  Specificity: Target,
  Context: FileText,
  Structure: Layers,
  Constraints: Ruler,
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 gap-1.5 text-xs"
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
    >
      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  )
}

function AnimatedScore({ score, delay = 0 }: { score: number; delay?: number }) {
  const [show, setShow] = React.useState(false)
  React.useEffect(() => {
    const t = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  const color =
    score >= 8 ? "text-success" : score >= 5 ? "text-warning" : "text-destructive"
  const bg =
    score >= 8 ? "bg-success/10" : score >= 5 ? "bg-warning/10" : "bg-destructive/10"

  return (
    <div
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold transition-all duration-500",
        bg,
        color,
        show ? "scale-100 opacity-100" : "scale-75 opacity-0"
      )}
    >
      {score}
    </div>
  )
}

function ScoreRow({
  label,
  score,
  delay,
}: {
  label: string
  score: number
  delay: number
}) {
  const [width, setWidth] = React.useState(0)
  const Icon = SCORE_ICONS[label] || Target

  React.useEffect(() => {
    const t = setTimeout(() => setWidth(score * 10), delay)
    return () => clearTimeout(t)
  }, [score, delay])

  const barColor =
    score >= 8
      ? "bg-success"
      : score >= 5
        ? "bg-warning"
        : "bg-destructive"

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <span className="w-20 shrink-0 text-xs font-medium text-foreground">{label}</span>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out", barColor)}
          style={{ width: `${width}%` }}
        />
      </div>
      <span
        className={cn(
          "w-6 text-right text-sm font-bold tabular-nums",
          score >= 8 ? "text-success" : score >= 5 ? "text-warning" : "text-destructive"
        )}
      >
        {score}
      </span>
    </div>
  )
}

function AnalysisCard({ data }: { data: Record<string, unknown> }) {
  const [detailsOpen, setDetailsOpen] = React.useState(false)
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

  const scoreLabel =
    d.overallScore >= 8
      ? "Excellent"
      : d.overallScore >= 6
        ? "Good"
        : d.overallScore >= 4
          ? "Needs Work"
          : "Poor"

  const scoreBadgeVariant =
    d.overallScore >= 8
      ? "bg-success/10 text-success border-success/20"
      : d.overallScore >= 6
        ? "bg-info/10 text-info border-info/20"
        : d.overallScore >= 4
          ? "bg-warning/10 text-warning border-warning/20"
          : "bg-destructive/10 text-destructive border-destructive/20"

  const dimensions = [
    { label: "Clarity", score: d.clarity },
    { label: "Specificity", score: d.specificity },
    { label: "Context", score: d.context },
    { label: "Structure", score: d.structure },
    { label: "Constraints", score: d.constraints },
  ]

  return (
    <Card className="w-full max-w-lg overflow-hidden border-border/60 shadow-md">
      {/* Header with score */}
      <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Target className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-heading font-semibold text-foreground">Prompt Analysis</h3>
            <div className={cn("mt-0.5 inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", scoreBadgeVariant)}>
              {scoreLabel}
            </div>
          </div>
        </div>
        <AnimatedScore score={d.overallScore} delay={100} />
      </div>

      <CardContent className="flex flex-col gap-4 p-5">
        {/* Score bars */}
        <div className="flex flex-col gap-2.5">
          {dimensions.map((dim, i) => (
            <ScoreRow key={dim.label} label={dim.label} score={dim.score} delay={200 + i * 120} />
          ))}
        </div>

        {/* Expandable details */}
        <button
          onClick={() => setDetailsOpen(!detailsOpen)}
          className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform duration-200", detailsOpen && "rotate-180")}
          />
          {detailsOpen ? "Hide details" : "Show strengths & weaknesses"}
          {d.strengths?.length > 0 && d.weaknesses?.length > 0 && (
            <span className="ml-auto text-[10px] text-muted-foreground/60">
              {d.strengths.length + d.weaknesses.length} items
            </span>
          )}
        </button>

        <div
          className={cn(
            "grid grid-cols-1 gap-3 overflow-hidden transition-all duration-300 sm:grid-cols-2",
            detailsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          {d.strengths?.length > 0 && (
            <div className="rounded-xl border border-success/15 bg-success/5 p-3.5">
              <div className="mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-success">Strengths</span>
              </div>
              <ul className="flex flex-col gap-2">
                {d.strengths.map((s, i) => (
                  <li key={i} className="text-xs leading-relaxed text-muted-foreground">{s}</li>
                ))}
              </ul>
            </div>
          )}
          {d.weaknesses?.length > 0 && (
            <div className="rounded-xl border border-warning/15 bg-warning/5 p-3.5">
              <div className="mb-2.5 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-warning">To Improve</span>
              </div>
              <ul className="flex flex-col gap-2">
                {d.weaknesses.map((w, i) => (
                  <li key={i} className="text-xs leading-relaxed text-muted-foreground">{w}</li>
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
    <Card className="w-full max-w-lg overflow-hidden border-border/60 shadow-md">
      <div className="flex items-center gap-3 border-b border-border/40 bg-muted/30 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10">
          <TrendingUp className="h-4.5 w-4.5 text-secondary" />
        </div>
        <div>
          <h3 className="text-sm font-heading font-semibold text-foreground">Improved Prompt</h3>
          <p className="text-[11px] text-muted-foreground">Ready to copy and use</p>
        </div>
      </div>

      <CardContent className="p-0">
        <Tabs defaultValue="compare" className="w-full">
          <TabsList className="mx-5 mt-4 h-8 w-auto rounded-lg bg-muted p-0.5">
            <TabsTrigger value="compare" className="h-7 rounded-md px-3 text-xs">
              Compare
            </TabsTrigger>
            <TabsTrigger value="improved" className="h-7 rounded-md px-3 text-xs">
              Improved Only
            </TabsTrigger>
            <TabsTrigger value="changes" className="h-7 rounded-md px-3 text-xs">
              What Changed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compare" className="mx-5 mb-5 mt-3 flex flex-col gap-3">
            <div className="rounded-xl bg-destructive/5 p-4">
              <div className="mb-2 flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-destructive/70">Original</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{d.originalPrompt}</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10">
                <ArrowRight className="h-3 w-3 text-secondary" />
              </div>
            </div>
            <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Improved</span>
                </div>
                <CopyBtn text={d.improvedPrompt} />
              </div>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{d.improvedPrompt}</p>
            </div>
          </TabsContent>

          <TabsContent value="improved" className="mx-5 mb-5 mt-3">
            <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4">
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="outline" className="border-secondary/30 text-secondary text-[10px]">
                  Ready to use
                </Badge>
                <CopyBtn text={d.improvedPrompt} />
              </div>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{d.improvedPrompt}</p>
            </div>
          </TabsContent>

          <TabsContent value="changes" className="mx-5 mb-5 mt-3">
            {d.changes?.length > 0 && (
              <div className="flex flex-col gap-2">
                {d.changes.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-[10px] font-bold text-secondary">
                      {i + 1}
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{c}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function ToolLoading({ toolName }: { toolName: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 shadow-sm">
      <div className="relative flex h-8 w-8 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      </div>
      <div>
        <p className="text-xs font-medium text-foreground">
          {toolName === "analyzePrompt" ? "Analyzing your prompt..." : "Generating improved version..."}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {toolName === "analyzePrompt" ? "Scoring across 5 dimensions" : "Applying best practices"}
        </p>
      </div>
    </div>
  )
}

function Message({ message }: { message: UIMessage }) {
  const isUser = message.role === "user"

  const toolRenderer = React.useCallback(
    (part: Extract<UIMessage["parts"][number], { type: "tool-invocation" }>) => {
      const { toolInvocation } = part
      const { toolName, state } = toolInvocation

      if (state === "output-available") {
        const data = toolInvocation.output as Record<string, unknown>
        if (toolName === "analyzePrompt") return <AnalysisCard data={data} />
        if (toolName === "rewritePrompt") return <RewriteCard data={data} />
      }

      if (state === "input-streaming" || state === "input-available") {
        return <ToolLoading toolName={toolName} />
      }

      return null
    },
    []
  )

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-card text-muted-foreground"
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      <div className={cn("flex max-w-[88%] flex-col gap-3", isUser ? "items-end" : "items-start")}>
        {message.parts.map((part, idx) => {
          if (part.type === "text" && part.text.trim()) {
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  isUser
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-muted/60 text-foreground"
                )}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{part.text}</p>
                ) : (
                  <div className="prose prose-sm max-w-none text-foreground [&_p]:my-1.5 [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_pre]:bg-foreground/5 [&_pre]:rounded-lg [&_pre]:p-3 [&_code]:text-xs [&_code]:font-mono [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_strong]:text-foreground [&_a]:text-primary">
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

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Lightbulb className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-heading font-semibold text-foreground">Prompt Coach</h1>
            <p className="text-[11px] text-muted-foreground">
              Interactive prompt analysis with{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-foreground">useChat</code>
              {" + "}
              <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-foreground">tool()</code>
            </p>
          </div>
        </div>
        <ModelSelector value={model} onChange={setModel} />
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-8 px-4 py-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Target className="h-3 w-3" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-heading font-semibold text-foreground text-balance">
                  Write better prompts
                </h2>
                <p className="mt-1.5 max-w-md text-sm text-muted-foreground leading-relaxed">
                  Share any prompt and get interactive quality scoring, visual analysis across 5 dimensions, and an improved rewrite with tabbed comparison.
                </p>
              </div>

              {/* SDK concepts */}
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {["AI SDK useChat", "Server-side Tools", "Structured Output", "Multi-step Agent"].map((concept) => (
                  <span key={concept} className="rounded-full border border-border bg-card px-3 py-1 text-[10px] font-medium text-muted-foreground">
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 w-full max-w-xl">
              {STARTERS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSubmit(s.text)}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{s.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6 lg:px-8">
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
            {isDisabled && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-muted/60 px-4 py-3">
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.3s]" />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:-0.15s]" />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-card px-4 py-3 lg:px-8">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <div className="flex flex-1 items-end rounded-xl border border-input bg-background px-3 py-2 transition-shadow focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-primary/40">
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
