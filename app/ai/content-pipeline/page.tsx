"use client"

import * as React from "react"
import { ModelSelector } from "@/components/ai/model-selector"
import { CopyButton } from "@/components/ai/chat-message"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  FileText,
  CheckCircle2,
  Sparkles,
  Play,
  Loader2,
  AlertCircle,
  ChevronDown,
  GitBranch,
  Clock,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

type StepStatus = "pending" | "running" | "done" | "error"
type StepName = "research" | "draft" | "review" | "polish"

interface PipelineStep {
  name: StepName
  label: string
  description: string
  icon: React.ElementType
  status: StepStatus
  data?: unknown
}

const INITIAL_STEPS: PipelineStep[] = [
  { name: "research", label: "Research", description: "Analyze topic, audience, and key points", icon: Search, status: "pending" },
  { name: "draft", label: "Draft", description: "Write initial content with structure", icon: FileText, status: "pending" },
  { name: "review", label: "Review", description: "Score quality and identify improvements", icon: CheckCircle2, status: "pending" },
  { name: "polish", label: "Polish", description: "Apply edits and finalize content", icon: Sparkles, status: "pending" },
]

const TOPIC_SUGGESTIONS = [
  "Best practices for few-shot prompting",
  "How to use chain-of-thought in AI coding",
  "Building agents with tool calling",
  "System prompt design patterns",
  "Structured output with Zod schemas",
]

function StepTimeline({ steps }: { steps: PipelineStep[] }) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const Icon = step.icon
        const isLast = i === steps.length - 1

        return (
          <div key={step.name} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300",
                  step.status === "done" && "border-success bg-success text-success-foreground",
                  step.status === "running" && "border-primary bg-primary/10 text-primary",
                  step.status === "pending" && "border-border bg-card text-muted-foreground",
                  step.status === "error" && "border-destructive bg-destructive/10 text-destructive"
                )}
              >
                {step.status === "running" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : step.status === "done" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[24px] transition-colors duration-300",
                    step.status === "done" ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </div>
            <div className={cn("pb-5", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-semibold leading-none",
                  step.status === "running" && "text-primary",
                  step.status === "done" && "text-success",
                  step.status === "pending" && "text-muted-foreground",
                  step.status === "error" && "text-destructive"
                )}
              >
                {step.label}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ResearchOutput({ data }: { data: { keyPoints: string[]; targetAudience: string; angle: string; relatedTopics: string[] } }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-primary/5 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">Target Audience</p>
          <p className="mt-1 text-sm text-foreground leading-relaxed">{data.targetAudience}</p>
        </div>
        <div className="rounded-lg bg-secondary/5 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary/70">Angle</p>
          <p className="mt-1 text-sm text-foreground leading-relaxed">{data.angle}</p>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Key Points</p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {data.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
              <ArrowRight className="mt-1 h-3 w-3 shrink-0 text-primary" />
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {data.relatedTopics.map((topic, i) => (
          <span key={i} className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {topic}
          </span>
        ))}
      </div>
    </div>
  )
}

function ReviewOutput({ data }: { data: { overallScore: number; clarity: number; accuracy: number; engagement: number; actionability: number; issues: string[]; suggestions: string[] } }) {
  const scores = [
    { label: "Clarity", value: data.clarity },
    { label: "Accuracy", value: data.accuracy },
    { label: "Engagement", value: data.engagement },
    { label: "Actionability", value: data.actionability },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold",
            data.overallScore >= 8
              ? "bg-success/10 text-success"
              : data.overallScore >= 5
                ? "bg-warning/10 text-warning"
                : "bg-destructive/10 text-destructive"
          )}
        >
          {data.overallScore}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Overall Score</p>
          <p className="text-xs text-muted-foreground">
            {data.overallScore >= 8 ? "Excellent quality" : data.overallScore >= 5 ? "Good, with room for improvement" : "Needs significant work"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {scores.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs text-muted-foreground">{s.label}</span>
            <Progress
              value={s.value * 10}
              className={cn(
                "h-1.5 flex-1",
                s.value >= 8 ? "[&>div]:bg-success" : s.value >= 5 ? "[&>div]:bg-warning" : "[&>div]:bg-destructive"
              )}
            />
            <span className="w-6 text-right text-xs font-semibold tabular-nums">{s.value}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {data.issues.length > 0 && (
          <div className="rounded-lg bg-warning/5 p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-warning">Issues</p>
            <ul className="flex flex-col gap-1.5">
              {data.issues.map((issue, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.suggestions.length > 0 && (
          <div className="rounded-lg bg-primary/5 p-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-primary">Suggestions</p>
            <ul className="flex flex-col gap-1.5">
              {data.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function ContentOutput({ content, title }: { content: string; title: string }) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
      >
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")} />
        {title}
      </button>
      {expanded && (
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-3 flex justify-end">
            <CopyButton text={content} />
          </div>
          <div className="prose prose-sm max-w-none text-foreground [&_p]:my-1.5 [&_h1]:text-lg [&_h1]:font-heading [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-heading [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-3 [&_code]:text-xs [&_code]:font-mono [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_strong]:text-foreground">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ContentPipelinePage() {
  const [model, setModel] = React.useState("openai/gpt-5.2")
  const [topic, setTopic] = React.useState("")
  const [steps, setSteps] = React.useState<PipelineStep[]>(INITIAL_STEPS)
  const [isRunning, setIsRunning] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [startTime, setStartTime] = React.useState<number | null>(null)
  const [elapsed, setElapsed] = React.useState(0)

  // Timer
  React.useEffect(() => {
    if (!startTime) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    if (!isRunning) clearInterval(interval)
    return () => clearInterval(interval)
  }, [startTime, isRunning])

  const startPipeline = async () => {
    if (!topic.trim() || isRunning) return

    setIsRunning(true)
    setError(null)
    setSteps(INITIAL_STEPS)
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

  const completedSteps = steps.filter((s) => s.status === "done").length
  const isIdle = steps.every((s) => s.status === "pending") && !error

  return (
    <div className="flex flex-col gap-6 overflow-y-auto p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-info/10">
            <GitBranch className="h-5 w-5 text-info" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-semibold tracking-tight text-foreground text-balance">
              Content Pipeline
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              A 4-step AI pipeline that chains generateText calls with structured output at each stage.
            </p>
          </div>
        </div>
        <ModelSelector value={model} onChange={setModel} />
      </div>

      {/* Input */}
      <Card className="overflow-hidden border-border">
        <CardContent className="p-0">
          <div className="p-5">
            <label htmlFor="topic" className="mb-2 block text-sm font-medium text-foreground">
              Topic
            </label>
            <div className="flex gap-3">
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startPipeline()}
                placeholder="e.g. How to write effective system prompts for code generation"
                disabled={isRunning}
                className="flex-1 rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50 placeholder:text-muted-foreground"
              />
              <Button
                onClick={startPipeline}
                disabled={isRunning || !topic.trim()}
                className="min-w-[140px]"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Pipeline
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-border/50 bg-muted/20 px-5 py-3">
            {TOPIC_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setTopic(suggestion)}
                disabled={isRunning}
                className="rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Pipeline content */}
      {!isIdle && (
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Timeline sidebar */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-heading font-semibold">Progress</CardTitle>
                <span className="text-xs font-medium tabular-nums text-muted-foreground">{completedSteps}/4</span>
              </div>
              <Progress value={(completedSteps / 4) * 100} className="h-1.5 [&>div]:bg-primary" />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <StepTimeline steps={steps} />
              {(isRunning || completedSteps === 4) && (
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs tabular-nums text-muted-foreground">{elapsed}s elapsed</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step outputs */}
          <div className="flex flex-col gap-4">
            {steps.map((step) => {
              if (step.status === "running" && !step.data) {
                return (
                  <Card key={step.name} className="border-primary/20">
                    <CardContent className="flex items-center gap-3 p-5">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-primary">{step.label}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              }

              if (step.status !== "done" || !step.data) return null

              return (
                <Card key={step.name} className="overflow-hidden">
                  <CardHeader className="border-b border-border bg-muted/20 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-success/10">
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      </div>
                      <CardTitle className="text-sm font-heading font-semibold">{step.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5">
                    {step.name === "research" && (
                      <ResearchOutput data={step.data as { keyPoints: string[]; targetAudience: string; angle: string; relatedTopics: string[] }} />
                    )}
                    {step.name === "draft" && (
                      <ContentOutput
                        content={(step.data as { content: string }).content}
                        title="View Draft"
                      />
                    )}
                    {step.name === "review" && (
                      <ReviewOutput data={step.data as { overallScore: number; clarity: number; accuracy: number; engagement: number; actionability: number; issues: string[]; suggestions: string[] }} />
                    )}
                    {step.name === "polish" && (
                      <div>
                        <div className="mb-3 flex items-center gap-2 rounded-lg bg-success/5 border border-success/20 px-3 py-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <p className="text-xs font-medium text-success">Pipeline complete -- final content ready</p>
                        </div>
                        <ContentOutput
                          content={(step.data as { content: string }).content}
                          title="View Final Content"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {isIdle && (
        <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-info/10">
              <GitBranch className="h-7 w-7 text-info" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-foreground text-balance">
              Multi-Step AI Pipeline
            </h2>
            <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
              Each step uses <span className="font-mono text-xs text-foreground">generateText</span> with{" "}
              <span className="font-mono text-xs text-foreground">Output.object()</span> to produce structured data
              that feeds into the next step. Results stream via Server-Sent Events.
            </p>
          </div>

          {/* Visual step flow */}
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-4">
            {INITIAL_STEPS.map((step, i) => (
              <React.Fragment key={step.name}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <step.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">{step.label}</span>
                </div>
                {i < INITIAL_STEPS.length - 1 && (
                  <ArrowRight className="h-4 w-4 shrink-0 text-border" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
