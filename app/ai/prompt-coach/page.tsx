"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai"
import type { UIMessage } from "ai"
import { ModelSelector } from "@/components/ai/model-selector"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  SendHorizontal,
  Loader2,
  Lightbulb,
  Sparkles,
  User,
  Bot,
  BookOpen,
  Target,
  Zap,
  CheckCircle2,
  XCircle,
  Trophy,
  Swords,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Copy,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

/* ─── Starters ───────────────────────────────────────────────── */
const STARTERS = [
  {
    label: "Analyze my prompt",
    text: 'Analyze this prompt: "Write a blog post about AI"',
    icon: Target,
    desc: "Watch the AI score your prompt and challenge you",
  },
  {
    label: "Teach me prompting",
    text: "Teach me the most important prompting technique",
    icon: BookOpen,
    desc: "Interactive quiz to test your knowledge",
  },
  {
    label: "System prompt help",
    text: "Help me write a system prompt for a customer support chatbot",
    icon: Zap,
    desc: "Build a production prompt step-by-step",
  },
  {
    label: "Vibe coding prompt",
    text: 'Analyze this prompt: "Make me a website that looks good and has all the features"',
    icon: Sparkles,
    desc: "Learn why vague prompts fail spectacularly",
  },
]

/* ─── Copy button ────────────────────────────────────────────── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3 w-3 text-success" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

/* ─── Scorecard ──────────────────────────────────────────────── */
function ScorecardComponent({
  data,
}: {
  data: {
    promptText: string
    overall: number
    clarity: number
    specificity: number
    context: number
    structure: number
    constraints: number
    verdict: string
    topTip: string
  }
}) {
  const dimensions = [
    { label: "Clarity", score: data.clarity },
    { label: "Specificity", score: data.specificity },
    { label: "Context", score: data.context },
    { label: "Structure", score: data.structure },
    { label: "Constraints", score: data.constraints },
  ]

  const scoreColor = (s: number) =>
    s >= 8
      ? "text-success"
      : s >= 5
        ? "text-warning"
        : "text-destructive"
  const barColor = (s: number) =>
    s >= 8 ? "bg-success" : s >= 5 ? "bg-warning" : "bg-destructive"
  const overallBg =
    data.overall >= 8
      ? "bg-success/10 border-success/30 text-success"
      : data.overall >= 5
        ? "bg-warning/10 border-warning/30 text-warning"
        : "bg-destructive/10 border-destructive/30 text-destructive"

  return (
    <Card className="w-full overflow-hidden border-border/60 shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-border/40 bg-muted/30 px-5 py-4">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-primary">
              Prompt Scorecard
            </span>
          </div>
          <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground italic leading-relaxed">
            {'"'}
            {data.promptText}
            {'"'}
          </p>
        </div>
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border-2",
            overallBg
          )}
        >
          <span className="text-2xl font-bold leading-none">{data.overall}</span>
          <span className="text-[8px] font-bold uppercase tracking-widest opacity-70">
            /10
          </span>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="mb-4 flex flex-col gap-2">
          {dimensions.map((d, i) => (
            <DimensionBar key={d.label} {...d} index={i} />
          ))}
        </div>

        <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
          <p className="text-xs font-bold text-primary mb-1">Verdict</p>
          <p className="text-sm text-foreground leading-relaxed">{data.verdict}</p>
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-background/80 px-3 py-2">
            <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Top tip: </span>
              {data.topTip}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DimensionBar({
  label,
  score,
  index,
}: {
  label: string
  score: number
  index: number
}) {
  const [width, setWidth] = React.useState(0)
  React.useEffect(() => {
    const t = setTimeout(() => setWidth(score * 10), 100 + index * 80)
    return () => clearTimeout(t)
  }, [score, index])

  const bg = score >= 8 ? "bg-success" : score >= 5 ? "bg-warning" : "bg-destructive"
  const color =
    score >= 8
      ? "text-success"
      : score >= 5
        ? "text-warning"
        : "text-destructive"

  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
            bg
          )}
          style={{ width: `${width}%` }}
        />
      </div>
      <span
        className={cn(
          "w-5 text-right text-xs font-bold tabular-nums",
          color
        )}
      >
        {score}
      </span>
    </div>
  )
}

/* ─── Prompt Battle (client-side interactive) ────────────────── */
function BattleComponent({
  data,
  onSelect,
  disabled,
}: {
  data: {
    question: string
    optionA: string
    optionB: string
    correctOption: string
    explanation: string
  }
  onSelect: (choice: string) => void
  disabled: boolean
}) {
  const [selected, setSelected] = React.useState<string | null>(null)
  const answered = selected !== null

  const handleSelect = (option: string) => {
    if (answered || disabled) return
    setSelected(option)
    const isCorrect = option === data.correctOption
    onSelect(
      `I chose Option ${option}. ${isCorrect ? "I think this one is better!" : "Let me know if I'm wrong."}`
    )
  }

  const isCorrect = selected === data.correctOption

  return (
    <Card className="w-full overflow-hidden border-border/60 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border/40 bg-muted/30 px-5 py-3">
        <Swords className="h-4 w-4 text-secondary" />
        <span className="text-xs font-heading font-bold uppercase tracking-wider text-secondary">
          Prompt Battle
        </span>
      </div>

      <CardContent className="p-5">
        <p className="mb-4 text-sm font-semibold text-foreground leading-relaxed">
          {data.question}
        </p>

        <div className="flex flex-col gap-3">
          {(["A", "B"] as const).map((opt) => {
            const text = opt === "A" ? data.optionA : data.optionB
            const isThis = selected === opt
            const isRight = data.correctOption === opt
            let borderClass = "border-border hover:border-primary/40 hover:bg-primary/5"
            if (answered) {
              if (isRight) borderClass = "border-success/50 bg-success/5"
              else if (isThis && !isRight) borderClass = "border-destructive/50 bg-destructive/5"
              else borderClass = "border-border/40 opacity-60"
            }

            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={answered || disabled}
                className={cn(
                  "group relative flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                  borderClass,
                  !answered && !disabled && "cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                    answered && isRight
                      ? "bg-success text-success-foreground"
                      : answered && isThis && !isRight
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}
                >
                  {answered && isRight ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : answered && isThis && !isRight ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    opt
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                    {text}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {answered && (
          <div
            className={cn(
              "mt-4 rounded-xl border p-4 transition-all",
              isCorrect
                ? "border-success/20 bg-success/5"
                : "border-warning/20 bg-warning/5"
            )}
          >
            <div className="mb-2 flex items-center gap-2">
              {isCorrect ? (
                <>
                  <Trophy className="h-4 w-4 text-success" />
                  <span className="text-xs font-bold text-success uppercase tracking-wider">
                    Correct!
                  </span>
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 text-warning" />
                  <span className="text-xs font-bold text-warning uppercase tracking-wider">
                    Not quite
                  </span>
                </>
              )}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {data.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/* ─── Challenge (client-side interactive) ────────────────────── */
function ChallengeComponent({
  data,
  onAnswer,
  disabled,
}: {
  data: {
    question: string
    options: { label: string; text: string }[]
    correctLabel: string
    explanation: string
    concept: string
  }
  onAnswer: (answer: string) => void
  disabled: boolean
}) {
  const [selected, setSelected] = React.useState<string | null>(null)
  const answered = selected !== null

  const handleSelect = (label: string) => {
    if (answered || disabled) return
    setSelected(label)
    const isCorrect = label === data.correctLabel
    onAnswer(
      `I chose ${label}. ${isCorrect ? "I think this is right!" : "I'm not sure about this one."}`
    )
  }

  const isCorrect = selected === data.correctLabel

  return (
    <Card className="w-full overflow-hidden border-border/60 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-5 py-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-primary">
            Challenge
          </span>
        </div>
        <Badge
          variant="outline"
          className="border-primary/20 text-primary text-[10px]"
        >
          {data.concept}
        </Badge>
      </div>

      <CardContent className="p-5">
        <p className="mb-4 text-sm font-semibold text-foreground leading-relaxed">
          {data.question}
        </p>

        <div className="flex flex-col gap-2">
          {data.options.map((opt) => {
            const isThis = selected === opt.label
            const isRight = data.correctLabel === opt.label
            let cls =
              "border-border hover:border-primary/40 hover:bg-primary/5"
            if (answered) {
              if (isRight) cls = "border-success/50 bg-success/5"
              else if (isThis && !isRight)
                cls = "border-destructive/50 bg-destructive/5"
              else cls = "border-border/40 opacity-60"
            }

            return (
              <button
                key={opt.label}
                onClick={() => handleSelect(opt.label)}
                disabled={answered || disabled}
                className={cn(
                  "group flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
                  cls,
                  !answered && !disabled && "cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold transition-colors",
                    answered && isRight
                      ? "bg-success text-success-foreground"
                      : answered && isThis && !isRight
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}
                >
                  {answered && isRight ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : answered && isThis && !isRight ? (
                    <XCircle className="h-3.5 w-3.5" />
                  ) : (
                    opt.label
                  )}
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {opt.text}
                </p>
              </button>
            )
          })}
        </div>

        {answered && (
          <div
            className={cn(
              "mt-4 rounded-xl border p-4",
              isCorrect
                ? "border-success/20 bg-success/5"
                : "border-warning/20 bg-warning/5"
            )}
          >
            <div className="mb-2 flex items-center gap-2">
              {isCorrect ? (
                <>
                  <Trophy className="h-4 w-4 text-success" />
                  <span className="text-xs font-bold text-success uppercase tracking-wider">
                    Nailed it!
                  </span>
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 text-warning" />
                  <span className="text-xs font-bold text-warning uppercase tracking-wider">
                    The answer was {data.correctLabel}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {data.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/* ─── Tip Card (server-side) ─────────────────────────────────── */
function TipComponent({
  data,
}: {
  data: {
    title: string
    concept: string
    badExample: string
    goodExample: string
  }
}) {
  return (
    <Card className="w-full overflow-hidden border-border/60 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border/40 bg-secondary/5 px-5 py-3">
        <Lightbulb className="h-4 w-4 text-secondary" />
        <span className="text-xs font-heading font-bold uppercase tracking-wider text-secondary">
          Pro Tip
        </span>
      </div>

      <CardContent className="p-5">
        <h4 className="mb-2 text-sm font-heading font-bold text-foreground">
          {data.title}
        </h4>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          {data.concept}
        </p>

        <div className="flex flex-col gap-3">
          <div className="rounded-xl bg-destructive/5 border border-destructive/10 p-4">
            <div className="mb-2 flex items-center gap-1.5">
              <XCircle className="h-3 w-3 text-destructive" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
                Without this technique
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic whitespace-pre-wrap">
              {data.badExample}
            </p>
          </div>
          <div className="flex justify-center">
            <ArrowRight className="h-4 w-4 text-muted-foreground/40" />
          </div>
          <div className="rounded-xl bg-success/5 border border-success/10 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-success" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-success">
                  With this technique
                </span>
              </div>
              <CopyBtn text={data.goodExample} />
            </div>
            <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
              {data.goodExample}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Loading pill ───────────────────────────────────────────── */
function ToolLoading({ toolName }: { toolName: string }) {
  const labels: Record<string, string> = {
    showScorecard: "Scoring your prompt...",
    promptBattle: "Setting up a battle...",
    promptChallenge: "Creating a challenge...",
    showTip: "Preparing a tip...",
  }
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card px-4 py-3 shadow-sm">
      <div className="relative flex h-6 w-6 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
      </div>
      <p className="text-xs font-medium text-muted-foreground">
        {labels[toolName] || "Working..."}
      </p>
    </div>
  )
}

/* ─── Message renderer ───────────────────────────────────────── */
function Message({
  message,
  onToolInteraction,
}: {
  message: UIMessage
  onToolInteraction: (
    toolCallId: string,
    toolName: string,
    output: string
  ) => void
}) {
  const isUser = message.role === "user"

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
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : (
          <Bot className="h-3.5 w-3.5" />
        )}
      </div>

      <div
        className={cn(
          "flex max-w-[min(88%,560px)] flex-col gap-3",
          isUser ? "items-end" : "items-start"
        )}
      >
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
                  <div className="prose prose-sm max-w-none text-foreground [&_p]:my-1 [&_strong]:text-foreground [&_a]:text-primary">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {part.text}
                    </Markdown>
                  </div>
                )}
              </div>
            )
          }

          if (part.type.startsWith("tool-")) {
            const toolPart = part as {
              type: string
              toolCallId: string
              state: string
              input?: unknown
              output?: unknown
            }
            const toolName = toolPart.type.replace("tool-", "")
            const { state, toolCallId } = toolPart

            // Client-side tools: render interactive component in ALL states except input-streaming
            if (toolName === "promptBattle") {
              if (state === "input-streaming") {
                return <ToolLoading key={idx} toolName={toolName} />
              }
              const args = (toolPart.input || {}) as Parameters<
                typeof BattleComponent
              >[0]["data"]
              return (
                <BattleComponent
                  key={idx}
                  data={args}
                  disabled={state === "output-available"}
                  onSelect={(choice) =>
                    onToolInteraction(toolCallId, toolName, choice)
                  }
                />
              )
            }

            if (toolName === "promptChallenge") {
              if (state === "input-streaming") {
                return <ToolLoading key={idx} toolName={toolName} />
              }
              const args = (toolPart.input || {}) as Parameters<
                typeof ChallengeComponent
              >[0]["data"]
              return (
                <ChallengeComponent
                  key={idx}
                  data={args}
                  disabled={state === "output-available"}
                  onAnswer={(answer) =>
                    onToolInteraction(toolCallId, toolName, answer)
                  }
                />
              )
            }

            // Server-side tools: show loading while streaming/waiting, render card on output
            if (state === "input-streaming" || state === "input-available") {
              return <ToolLoading key={idx} toolName={toolName} />
            }

            if (state === "output-available") {
              const output = toolPart.output as Record<string, unknown>
              if (toolName === "showScorecard") {
                return (
                  <ScorecardComponent
                    key={idx}
                    data={output as Parameters<typeof ScorecardComponent>[0]["data"]}
                  />
                )
              }
              if (toolName === "showTip") {
                return (
                  <TipComponent
                    key={idx}
                    data={output as Parameters<typeof TipComponent>[0]["data"]}
                  />
                )
              }
            }
          }

          return null
        })}
      </div>
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function PromptCoachPage() {
  const [model, setModel] = React.useState("openai/gpt-5.2")
  const [input, setInput] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const transport = React.useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
        body: { model },
      }),
    [model]
  )

  const { messages, sendMessage, addToolOutput, status } = useChat({
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  })

  const isDisabled = status === "streaming" || status === "submitted"

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleToolInteraction = React.useCallback(
    (toolCallId: string, toolName: string, output: string) => {
      addToolOutput({
        tool: toolName,
        toolCallId,
        output,
      })
    },
    [addToolOutput]
  )

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
            <h1 className="text-sm font-heading font-semibold text-foreground">
              Prompt Coach
            </h1>
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              Interactive learning game with{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-foreground">
                useChat
              </code>
              {" + client-side "}
              <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-foreground">
                tool()
              </code>
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
                  <Trophy className="h-3 w-3" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-heading font-semibold text-foreground text-balance">
                  The Prompt Engineering Game
                </h2>
                <p className="mt-1.5 max-w-md text-sm text-muted-foreground leading-relaxed">
                  Learn prompting through interactive challenges, prompt battles, and live scoring.
                  Pick the better prompt, answer quizzes, and level up your skills.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {[
                  "Client-side Tools",
                  "Prompt Battles",
                  "Interactive Quizzes",
                  "Live Scoring",
                ].map((concept) => (
                  <span
                    key={concept}
                    className="rounded-full border border-border bg-card px-3 py-1 text-[10px] font-medium text-muted-foreground"
                  >
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
                    <p className="text-sm font-semibold text-foreground">
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6 lg:px-8">
            {messages.map((msg) => (
              <Message
                key={msg.id}
                message={msg}
                onToolInteraction={handleToolInteraction}
              />
            ))}
            {isDisabled &&
              messages[messages.length - 1]?.role === "user" && (
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
              placeholder="Share a prompt to analyze, or ask me to teach you..."
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
