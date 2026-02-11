"use client"

import * as React from "react"
import { ModelSelector } from "@/components/ai/model-selector"
import { CopyButton } from "@/components/ai/chat-message"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Search,
  FileText,
  CheckCircle2,
  Sparkles,
  Play,
  Loader2,
  AlertCircle,
  ArrowRight,
  Clock,
  Copy,
  Check,
  ChevronRight,
  Bot,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

type StepStatus = "pending" | "running" | "done" | "error"
type StepName = "research" | "draft" | "review" | "polish"

interface PipelineStep {
  name: StepName
  label: string
  shortDesc: string
  icon: React.ElementType
  status: StepStatus
  data?: unknown
}

const INITIAL_STEPS: PipelineStep[] = [
  { name: "research", label: "Research", shortDesc: "Analyze topic", icon: Search, status: "pending" },
  { name: "draft", label: "Draft", shortDesc: "Write content", icon: FileText, status: "pending" },
  { name: "review", label: "Review", shortDesc: "Score quality", icon: CheckCircle2, status: "pending" },
  { name: "polish", label: "Polish", shortDesc: "Final edits", icon: Sparkles, status: "pending" },
]

const TOPIC_SUGGESTIONS = [
  "Best practices for few-shot prompting",
  "How to use chain-of-thought in AI coding",
  "Building agents with tool calling",
  "System prompt design patterns",
]

/* ── Horizontal Step Indicator ── */
function StepIndicator({
  steps,
  activeTab,
  onTabChange,
}: {
  steps: PipelineStep[]
  activeTab: StepName
  onTabChange: (name: StepName) => void
}) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const Icon = step.icon
        const isActive = activeTab === step.name
        const isClickable = step.status === "done" || step.status === "running"

        return (
          <React.Fragment key={step.name}>
            <button
              onClick={() => isClickable && onTabChange(step.name)}
              disabled={!isClickable}
              className={cn(
                "group flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                isActive && step.status === "done" && "bg-success/10 text-success ring-1 ring-success/20",
                isActive && step.status === "running" && "bg-primary/10 text-primary ring-1 ring-primary/20",
                isActive && step.status === "pending" && "bg-muted text-muted-foreground",
                !isActive && step.status === "done" && "text-success/70 hover:bg-success/5 hover:text-success",
                !isActive && step.status === "running" && "text-primary/70 hover:bg-primary/5 hover:text-primary",
                !isActive && step.status === "pending" && "text-muted-foreground/50",
                !isClickable && "cursor-default"
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-md transition-colors",
                  step.status === "done" && "bg-success/10",
                  step.status === "running" && "bg-primary/10",
                  step.status === "pending" && "bg-muted"
                )}
              >
                {step.status === "running" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : step.status === "done" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Icon className="h-3 w-3" />
                )}
              </div>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {i < steps.length - 1 && (
              <ChevronRight
                className={cn(
                  "h-3 w-3 shrink-0",
                  step.status === "done" ? "text-success/40" : "text-border"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

/* ── Agent Activity Log ── */
function AgentLog({
  steps,
  elapsed,
  isRunning,
}: {
  steps: PipelineStep[]
  elapsed: number
  isRunning: boolean
}) {
  const logEntries = React.useMemo(() => {
    const entries: { icon: React.ElementType; text: string; status: StepStatus; step: StepName }[] = []
    for (const step of steps) {
      if (step.status === "running") {
        entries.push({ icon: step.icon, text: `Agent is ${step.shortDesc.toLowerCase()}ing...`, status: "running", step: step.name })
      }
      if (step.status === "done") {
        entries.push({ icon: step.icon, text: `${step.label} complete`, status: "done", step: step.name })
      }
    }
    return entries
  }, [steps])

  const completedCount = steps.filter((s) => s.status === "done").length

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md",
            isRunning ? "bg-primary/10" : completedCount === 4 ? "bg-success/10" : "bg-muted"
          )}
        >
          {isRunning ? (
            <Bot className="h-3.5 w-3.5 animate-pulse text-primary" />
          ) : completedCount === 4 ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          ) : (
            <Bot className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {isRunning && logEntries.length > 0 ? (
            <span className="text-xs text-foreground">
              <span className="font-medium">Step {completedCount + 1}/4</span>
              <span className="mx-1.5 text-muted-foreground">--</span>
              <span className="text-muted-foreground">{logEntries[logEntries.length - 1].text}</span>
            </span>
          ) : completedCount === 4 ? (
            <span className="text-xs font-medium text-success">All 4 steps complete</span>
          ) : (
            <span className="text-xs text-muted-foreground">Agent ready</span>
          )}
        </div>
      </div>
      {(isRunning || completedCount > 0) && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="text-[11px] tabular-nums">{elapsed}s</span>
        </div>
      )}
    </div>
  )
}

/* ── Research Output Card ── */
function ResearchOutput({ data }: { data: { keyPoints: string[]; targetAudience: string; angle: string; relatedTopics: string[] } }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-primary/10 bg-primary/5 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/60">Target Audience</p>
          <p className="mt-1.5 text-sm text-foreground leading-relaxed">{data.targetAudience}</p>
        </div>
        <div className="rounded-lg border border-secondary/10 bg-secondary/5 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary/60">Angle</p>
          <p className="mt-1.5 text-sm text-foreground leading-relaxed">{data.angle}</p>
        </div>
      </div>
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Key Points</p>
        <ul className="flex flex-col gap-2">
          {data.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2.5 rounded-md bg-muted/30 px-3 py-2 text-sm text-foreground leading-relaxed">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary tabular-nums">
                {i + 1}
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
      {data.relatedTopics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.relatedTopics.map((topic, i) => (
            <span key={i} className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] text-muted-foreground">
              {topic}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Review Output Card ── */
function ReviewOutput({ data }: { data: { overallScore: number; clarity: number; accuracy: number; engagement: number; actionability: number; issues: string[]; suggestions: string[] } }) {
  const scores = [
    { label: "Clarity", value: data.clarity },
    { label: "Accuracy", value: data.accuracy },
    { label: "Engagement", value: data.engagement },
    { label: "Actionability", value: data.actionability },
  ]

  const scoreColor = (v: number) => (v >= 8 ? "text-success" : v >= 5 ? "text-warning" : "text-destructive")
  const barColor = (v: number) => (v >= 8 ? "bg-success" : v >= 5 ? "bg-warning" : "bg-destructive")

  return (
    <div className="flex flex-col gap-4">
      {/* Overall score + dimension scores side by side */}
      <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4">
          <span
            className={cn("text-3xl font-bold tabular-nums", scoreColor(data.overallScore))}
          >
            {data.overallScore}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">/10 Overall</span>
        </div>
        <div className="flex flex-col justify-center gap-2.5">
          {scores.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs text-muted-foreground">{s.label}</span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-700", barColor(s.value))}
                  style={{ width: `${s.value * 10}%` }}
                />
              </div>
              <span className={cn("w-5 text-right text-xs font-semibold tabular-nums", scoreColor(s.value))}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Issues + Suggestions */}
      {(data.issues.length > 0 || data.suggestions.length > 0) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.issues.length > 0 && (
            <div className="rounded-lg border border-warning/10 bg-warning/5 p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-warning/70">Issues Found</p>
              <ul className="flex flex-col gap-1.5">
                {data.issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground leading-relaxed">
                    <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.suggestions.length > 0 && (
            <div className="rounded-lg border border-primary/10 bg-primary/5 p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-primary/70">Suggestions</p>
              <ul className="flex flex-col gap-1.5">
                {data.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground leading-relaxed">
                    <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Content Renderer (Draft/Polish) ── */
function ContentView({ content }: { content: string }) {
  return (
    <div className="relative">
      <div className="absolute right-0 top-0 z-10">
        <CopyButton text={content} />
      </div>
      <div className="prose prose-sm max-w-none text-foreground [&_p]:my-1.5 [&_h1]:text-lg [&_h1]:font-heading [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-heading [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-3 [&_code]:text-xs [&_code]:font-mono [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_strong]:text-foreground">
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
      </div>
    </div>
  )
}

/* ── Step Output Panel ── */
function StepPanel({ step }: { step: PipelineStep }) {
  if (step.status === "running") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Agent is working on {step.label}...</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{step.shortDesc}</p>
        </div>
      </div>
    )
  }

  if (step.status !== "done" || !step.data) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <step.icon className="h-5 w-5 text-muted-foreground/50" />
        </div>
        <p className="text-sm text-muted-foreground">Waiting for previous steps to complete</p>
      </div>
    )
  }

  switch (step.name) {
    case "research":
      return <ResearchOutput data={step.data as { keyPoints: string[]; targetAudience: string; angle: string; relatedTopics: string[] }} />
    case "draft":
      return <ContentView content={(step.data as { content: string }).content} />
    case "review":
      return <ReviewOutput data={step.data as { overallScore: number; clarity: number; accuracy: number; engagement: number; actionability: number; issues: string[]; suggestions: string[] }} />
    case "polish":
      return (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 px-3 py-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            <span className="text-xs font-medium text-success">Pipeline complete -- final content ready</span>
          </div>
          <ContentView content={(step.data as { content: string }).content} />
        </div>
      )
    default:
      return null
  }
}

/* ── Main Page ── */
export default function ContentPipelinePage() {
  const [model, setModel] = React.useState("openai/gpt-5.2")
  const [topic, setTopic] = React.useState("")
  const [steps, setSteps] = React.useState<PipelineStep[]>(INITIAL_STEPS)
  const [activeTab, setActiveTab] = React.useState<StepName>("research")
  const [isRunning, setIsRunning] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [startTime, setStartTime] = React.useState<number | null>(null)
  const [elapsed, setElapsed] = React.useState(0)

  React.useEffect(() => {
    if (!startTime || !isRunning) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime, isRunning])

  // Auto-switch to the currently running or most recently completed step
  React.useEffect(() => {
    const running = steps.find((s) => s.status === "running")
    if (running) {
      setActiveTab(running.name)
      return
    }
    const doneSteps = steps.filter((s) => s.status === "done")
    if (doneSteps.length > 0) {
      setActiveTab(doneSteps[doneSteps.length - 1].name)
    }
  }, [steps])

  const startPipeline = async () => {
    if (!topic.trim() || isRunning) return

    setIsRunning(true)
    setError(null)
    setSteps(INITIAL_STEPS)
    setActiveTab("research")
    setStartTime(Date.now())
    setElapsed(0)

    try {
      const res = await fetch("/api/ai/content-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), model }),
      })

      if (!res.ok) throw new Error("Pipeline request failed")
      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          const trimmed = line.trim()
          if (trimmed.startsWith("data:")) {
            try {
              const data = JSON.parse(trimmed.slice(5).trim())
              if (data.step === "error") {
                setError(data.data?.message || "Pipeline failed")
                break
              }
              if (data.step === "complete") break

              setSteps((prev) =>
                prev.map((s) => {
                  if (s.name === data.step) {
                    return { ...s, status: data.status, data: data.data ?? s.data }
                  }
                  return s
                })
              )
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pipeline failed")
    } finally {
      setIsRunning(false)
    }
  }

  const isIdle = steps.every((s) => s.status === "pending") && !error
  const activeStep = steps.find((s) => s.name === activeTab) || steps[0]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Top bar: Header + Model */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-heading font-semibold text-foreground">Content Pipeline Agent</h1>
            <p className="text-[11px] text-muted-foreground">4-step autonomous agent -- Research, Draft, Review, Polish</p>
          </div>
        </div>
        <ModelSelector value={model} onChange={setModel} />
      </div>

      {/* Input bar */}
      <div className="border-b border-border bg-card/50 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startPipeline()}
              placeholder="Enter a topic for the agent to research, draft, review, and polish..."
              disabled={isRunning}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50 placeholder:text-muted-foreground"
            />
          </div>
          <Button
            onClick={startPipeline}
            disabled={isRunning || !topic.trim()}
            size="sm"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Running
              </>
            ) : (
              <>
                <Play className="mr-1.5 h-3.5 w-3.5" />
                Run Agent
              </>
            )}
          </Button>
        </div>
        {isIdle && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {TOPIC_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setTopic(s)}
                className="rounded-md border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {isIdle ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-semibold text-foreground text-balance">
                Autonomous Content Agent
              </h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground leading-relaxed">
                This agent chains 4 <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">generateText</code> calls
                with <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">Output.object()</code> to
                autonomously research, draft, review, and polish content. Results stream via SSE.
              </p>
            </div>

            {/* Visual pipeline flow */}
            <div className="flex items-center gap-2">
              {INITIAL_STEPS.map((step, i) => {
                const Icon = step.icon
                return (
                  <React.Fragment key={step.name}>
                    <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground">{step.label}</span>
                    </div>
                    {i < INITIAL_STEPS.length - 1 && (
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-border" />
                    )}
                  </React.Fragment>
                )
              })}
            </div>

            {/* SDK concepts */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["generateText", "Output.object()", "Zod Schema", "SSE Stream", "Chained Calls"].map((concept) => (
                <span key={concept} className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-mono text-muted-foreground">
                  {concept}
                </span>
              ))}
            </div>
          </div>
        ) : (
          /* Pipeline running / done */
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Agent status bar */}
            <div className="px-6 pt-4 pb-2">
              <AgentLog steps={steps} elapsed={elapsed} isRunning={isRunning} />
            </div>

            {/* Step tabs */}
            <div className="flex items-center justify-between border-b border-border px-6 py-2">
              <StepIndicator steps={steps} activeTab={activeTab} onTabChange={setActiveTab} />
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {steps.filter((s) => s.status === "done").length}/4 steps
              </span>
            </div>

            {/* Error */}
            {error && (
              <div className="mx-6 mt-4 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Active step output */}
            <div className="flex-1 overflow-y-auto p-6">
              <StepPanel step={activeStep} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
