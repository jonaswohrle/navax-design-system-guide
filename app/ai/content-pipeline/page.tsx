"use client"

import * as React from "react"
import { ModelSelector } from "@/components/ai/model-selector"
import { CopyButton } from "@/components/ai/chat-message"
import { PageHeader } from "@/components/ds/page-header"
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
  GitBranch,
  AlertCircle,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

type StepStatus = "pending" | "running" | "done" | "error"
type StepName = "research" | "draft" | "review" | "polish"

interface PipelineStep {
  name: StepName
  label: string
  icon: React.ElementType
  status: StepStatus
  data?: unknown
}

const INITIAL_STEPS: PipelineStep[] = [
  { name: "research", label: "Research", icon: Search, status: "pending" },
  { name: "draft", label: "Draft", icon: FileText, status: "pending" },
  { name: "review", label: "Review", icon: CheckCircle2, status: "pending" },
  { name: "polish", label: "Polish", icon: Sparkles, status: "pending" },
]

function StepIndicator({ step, index, isLast }: { step: PipelineStep; index: number; isLast: boolean }) {
  const Icon = step.icon
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
            step.status === "done" && "border-success bg-success text-success-foreground",
            step.status === "running" && "border-primary bg-primary/10 text-primary",
            step.status === "pending" && "border-border bg-muted text-muted-foreground",
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
              "h-6 w-0.5 transition-colors",
              step.status === "done" ? "bg-success" : "bg-border"
            )}
          />
        )}
      </div>
      <div className="flex-1 pb-6">
        <p
          className={cn(
            "text-sm font-semibold",
            step.status === "running" && "text-primary",
            step.status === "done" && "text-success",
            step.status === "pending" && "text-muted-foreground",
            step.status === "error" && "text-destructive"
          )}
        >
          {step.label}
        </p>
        <p className="text-xs text-muted-foreground">
          {step.status === "running" && "Processing..."}
          {step.status === "done" && "Complete"}
          {step.status === "pending" && "Waiting"}
          {step.status === "error" && "Failed"}
        </p>
      </div>
    </div>
  )
}

function ResearchOutput({ data }: { data: { keyPoints: string[]; targetAudience: string; angle: string; relatedTopics: string[] } }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-xs font-semibold text-foreground">Target Audience</p>
        <p className="text-sm text-muted-foreground">{data.targetAudience}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground">Angle</p>
        <p className="text-sm text-muted-foreground">{data.angle}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground">Key Points</p>
        <ul className="flex flex-col gap-1 mt-1">
          {data.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {data.relatedTopics.map((topic, i) => (
          <span key={i} className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
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
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-foreground">Overall Score</span>
        <span className={cn(
          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
          data.overallScore >= 8 ? "bg-success/10 text-success" : data.overallScore >= 5 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
        )}>
          {data.overallScore}/10
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {scores.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs text-muted-foreground">{s.label}</span>
            <Progress value={s.value * 10} className="h-2 flex-1" />
            <span className="w-8 text-right text-xs font-semibold tabular-nums">{s.value}/10</span>
          </div>
        ))}
      </div>
      {data.issues.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-foreground mb-1">Issues</p>
          <ul className="flex flex-col gap-1">
            {data.issues.map((issue, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.suggestions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-foreground mb-1">Suggestions</p>
          <ul className="flex flex-col gap-1">
            {data.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function ContentOutput({ content, title }: { content: string; title: string }) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
      >
        <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        {title}
      </button>
      {expanded && (
        <div className="rounded-md border border-border bg-card p-4">
          <div className="flex justify-end mb-2">
            <CopyButton text={content} />
          </div>
          <div className="prose prose-sm max-w-none [&_p]:my-1.5 [&_h1]:text-lg [&_h1]:font-heading [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-heading [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold [&_pre]:bg-foreground/5 [&_pre]:rounded-md [&_pre]:p-3 [&_code]:text-xs [&_code]:font-mono [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5">
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

  const startPipeline = async () => {
    if (!topic.trim() || isRunning) return

    setIsRunning(true)
    setError(null)
    setSteps(INITIAL_STEPS)

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

  return (
    <div className="flex flex-col gap-6 overflow-y-auto p-6 lg:p-8">
      <PageHeader
        title="Content Pipeline"
        description="A multi-step AI workflow that researches, drafts, reviews, and polishes content."
        actions={<ModelSelector value={model} onChange={setModel} />}
      />

      {/* Input */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="topic" className="text-sm font-medium text-foreground">
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
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 placeholder:text-muted-foreground"
              />
              <Button onClick={startPipeline} disabled={isRunning || !topic.trim()}>
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

          {/* Quick topic suggestions */}
          <div className="flex flex-wrap gap-2">
            {[
              "Best practices for few-shot prompting",
              "How to use chain-of-thought in AI coding",
              "Building agents with tool calling",
              "System prompt design patterns",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setTopic(suggestion)}
                disabled={isRunning}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive/30">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Pipeline Progress */}
      {steps.some((s) => s.status !== "pending") && (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Step indicators */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-heading font-semibold">Pipeline Progress</CardTitle>
                <span className="text-xs text-muted-foreground">{completedSteps}/4</span>
              </div>
              <Progress value={(completedSteps / 4) * 100} className="h-1.5" />
            </CardHeader>
            <CardContent>
              {steps.map((step, i) => (
                <StepIndicator key={step.name} step={step} index={i} isLast={i === steps.length - 1} />
              ))}
            </CardContent>
          </Card>

          {/* Step outputs */}
          <div className="flex flex-col gap-4">
            {steps.map((step) => {
              if (step.status !== "done" || !step.data) return null

              return (
                <Card key={step.name}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <step.icon className="h-4 w-4 text-success" />
                      <CardTitle className="text-sm font-heading font-semibold">{step.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
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
                        <div className="mb-3 rounded-md bg-success/5 border border-success/20 p-3">
                          <p className="text-xs font-semibold text-success">Final polished content ready</p>
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
      {steps.every((s) => s.status === "pending") && !error && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-info/10">
            <GitBranch className="h-8 w-8 text-info" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-semibold text-foreground text-balance">
              Content Pipeline
            </h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Enter a topic above and watch the multi-step AI pipeline research, draft, review, and polish your content in real-time.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {INITIAL_STEPS.map((step, i) => (
              <div key={step.name} className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted">
                  <step.icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">{step.label}</span>
                {i < INITIAL_STEPS.length - 1 && (
                  <div className="h-px w-4 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
