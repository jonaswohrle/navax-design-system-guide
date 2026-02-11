"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ModelSelector } from "@/components/ai/model-selector"
import { ChatLayout } from "@/components/ai/chat-layout"
import { CopyButton } from "@/components/ai/chat-message"
import { PageHeader } from "@/components/ds/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, Lightbulb, Sparkles, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const STARTERS = [
  { label: "Analyze my prompt", text: "Can you analyze this prompt for me? \"Write a blog post about AI\"" },
  { label: "Teach me prompting", text: "What are the most important principles for writing effective prompts?" },
  { label: "System prompt help", text: "Help me write a system prompt for a customer support chatbot that handles refund requests" },
  { label: "Improve a prompt", text: "Can you improve this prompt? \"Make me a website that looks good and has all the features\"" },
]

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color =
    score >= 8
      ? "bg-success"
      : score >= 5
        ? "bg-warning"
        : "bg-destructive"

  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="flex-1">
        <Progress value={score * 10} className="h-2" />
      </div>
      <span className="w-8 text-right text-xs font-semibold tabular-nums text-foreground">
        {score}/10
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
    <Card className="w-full max-w-md border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-heading font-semibold">Prompt Analysis</CardTitle>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              d.overallScore >= 8
                ? "bg-success/10 text-success"
                : d.overallScore >= 5
                  ? "bg-warning/10 text-warning"
                  : "bg-destructive/10 text-destructive"
            )}
          >
            {d.overallScore}/10
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <ScoreBar label="Clarity" score={d.clarity} />
          <ScoreBar label="Specificity" score={d.specificity} />
          <ScoreBar label="Context" score={d.context} />
          <ScoreBar label="Structure" score={d.structure} />
          <ScoreBar label="Constraints" score={d.constraints} />
        </div>

        {d.strengths?.length > 0 && (
          <div className="mt-2">
            <p className="mb-1.5 text-xs font-semibold text-foreground">Strengths</p>
            <ul className="flex flex-col gap-1">
              {d.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {d.weaknesses?.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-semibold text-foreground">Areas to Improve</p>
            <ul className="flex flex-col gap-1">
              {d.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
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
    <Card className="w-full max-w-md border-secondary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-heading font-semibold">Improved Prompt</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="rounded-md bg-muted p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-muted-foreground line-through">{d.originalPrompt}</p>
          </div>
        </div>
        <div className="rounded-md border border-secondary/30 bg-secondary/5 p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-foreground whitespace-pre-wrap">{d.improvedPrompt}</p>
            <CopyButton text={d.improvedPrompt} />
          </div>
        </div>

        {d.changes?.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-semibold text-foreground">Changes Made</p>
            <ul className="flex flex-col gap-1">
              {d.changes.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
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

export default function PromptCoachPage() {
  const [model, setModel] = React.useState("openai/gpt-5.2")

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      body: { model },
    }),
  })

  const toolRenderer = React.useCallback(
    (part: { type: "tool-invocation"; toolInvocation: { toolName: string; state: string; output?: unknown; input?: unknown } }) => {
      const { toolInvocation } = part
      const { toolName, state } = toolInvocation

      if (state === "output-available" || state === "input-available") {
        const data = (state === "output-available" ? toolInvocation.output : toolInvocation.input) as Record<string, unknown>

        if (toolName === "analyzePrompt") {
          return <AnalysisCard data={data} />
        }
        if (toolName === "rewritePrompt") {
          return <RewriteCard data={data} />
        }
      }

      // Loading state for tools
      if (state === "input-streaming" || state === "input-available") {
        return (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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

  const emptyState = (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-heading font-semibold text-foreground text-balance">
          Prompt Coach
        </h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Share a prompt and I will analyze its quality, suggest improvements, and help you write better prompts.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {STARTERS.map((s) => (
          <Button
            key={s.label}
            variant="outline"
            className="h-auto justify-start px-4 py-3 text-left"
            onClick={() => sendMessage({ text: s.text })}
          >
            <Lightbulb className="mr-2 h-4 w-4 shrink-0 text-primary" />
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
            title="Prompt Coach"
            description="Get AI-powered feedback on your prompts"
          />
          <ModelSelector value={model} onChange={setModel} />
        </div>
      </div>
      <ChatLayout
        messages={messages}
        onSend={(text) => sendMessage({ text })}
        status={status}
        toolRenderer={toolRenderer}
        placeholder="Paste a prompt to analyze, or ask about prompting techniques..."
        emptyState={emptyState}
        className="flex-1"
      />
    </div>
  )
}
