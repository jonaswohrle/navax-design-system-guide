"use client"

import * as React from "react"
import { ModelSelector } from "@/components/ai/model-selector"
import { Button } from "@/components/ui/button"
import {
  Globe,
  FileText,
  ImageIcon,
  Play,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

/* ── Types ── */
type StepId = "research" | "draft" | "image"
type StepState = "idle" | "running" | "done" | "error"

interface PipelineState {
  research: StepState
  draft: StepState
  image: StepState
}

interface BlogData {
  title: string
  subtitle: string
  researchContent: string
  draftContent: string
  heroImage: { base64: string; mediaType: string } | null
}

const STEP_META: { id: StepId; label: string; model: string; icon: React.ElementType }[] = [
  { id: "research", label: "Web Research", model: "Gemini + Google Search", icon: Globe },
  { id: "draft", label: "Article Draft", model: "GPT-5.2", icon: FileText },
  { id: "image", label: "Hero Image", model: "Gemini 3 Pro", icon: ImageIcon },
]

const TOPIC_SUGGESTIONS = [
  "The rise of AI agents in software development",
  "Prompt engineering best practices for 2026",
  "How vibe coding is changing the developer workflow",
  "Building production AI apps with the Vercel AI SDK",
]

/* ── Pipeline Status Bar ── */
function PipelineStatusBar({
  steps,
  elapsed,
  isRunning,
}: {
  steps: PipelineState
  elapsed: number
  isRunning: boolean
}) {
  const allDone = steps.research === "done" && steps.draft === "done" && steps.image === "done"

  return (
    <div className="flex items-center gap-3 text-xs">
      {STEP_META.map((meta, i) => {
        const state = steps[meta.id]
        const Icon = meta.icon
        return (
          <React.Fragment key={meta.id}>
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium transition-all",
                state === "running" && "bg-primary/10 text-primary",
                state === "done" && "bg-success/10 text-success",
                state === "error" && "bg-destructive/10 text-destructive",
                state === "idle" && "text-muted-foreground/50"
              )}
            >
              {state === "running" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : state === "done" ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : state === "error" ? (
                <AlertCircle className="h-3 w-3" />
              ) : (
                <Icon className="h-3 w-3" />
              )}
              <span className="hidden sm:inline">{meta.label}</span>
              <span className="hidden text-[10px] font-normal opacity-60 md:inline">
                {meta.model}
              </span>
            </div>
            {i < STEP_META.length - 1 && (
              <ArrowRight
                className={cn(
                  "h-3 w-3 shrink-0",
                  i === 0 && state === "done" ? "text-success/40" : "text-border"
                )}
              />
            )}
          </React.Fragment>
        )
      })}

      <div className="ml-auto flex items-center gap-1.5 text-muted-foreground">
        {allDone ? (
          <CheckCircle2 className="h-3 w-3 text-success" />
        ) : isRunning ? (
          <Clock className="h-3 w-3" />
        ) : null}
        {(isRunning || allDone) && (
          <span className="tabular-nums">{elapsed}s</span>
        )}
      </div>
    </div>
  )
}

/* ── Markdown Components ── */
const markdownComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-8 mb-4 font-heading text-2xl font-bold tracking-tight text-foreground" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-8 mb-3 font-heading text-xl font-semibold text-foreground border-b border-border pb-2" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-6 mb-2 font-heading text-base font-semibold text-foreground" {...props}>{children}</h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mt-4 mb-2 font-heading text-sm font-semibold text-foreground" {...props}>{children}</h4>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-3 text-sm leading-relaxed text-foreground/90" {...props}>{children}</p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-3 ml-4 list-disc space-y-1.5 text-sm text-foreground/90" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-3 ml-4 list-decimal space-y-1.5 text-sm text-foreground/90" {...props}>{children}</ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props}>{children}</li>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-foreground" {...props}>{children}</strong>
  ),
  em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic text-foreground/80" {...props}>{children}</em>
  ),
  a: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="font-medium text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-4 border-l-4 border-primary/30 bg-muted/30 py-2 pl-4 pr-3 text-sm italic text-muted-foreground rounded-r-lg" {...props}>{children}</blockquote>
  ),
  code: ({ children, className: codeClassName, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !codeClassName
    if (isInline) {
      return (
        <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-primary" {...props}>{children}</code>
      )
    }
    return (
      <code className={cn("block font-mono text-xs", codeClassName)} {...props}>{children}</code>
    )
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="my-4 overflow-x-auto rounded-xl border border-border bg-muted/60 p-4 font-mono text-xs leading-relaxed" {...props}>{children}</pre>
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full text-sm" {...props}>{children}</table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="border-b border-border bg-muted/50 text-left font-medium text-foreground" {...props}>{children}</thead>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground" {...props}>{children}</th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border-t border-border px-4 py-2.5 text-foreground/90" {...props}>{children}</td>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-border" {...props} />
  ),
  img: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt={alt || ""} className="my-4 rounded-xl border border-border" {...props} />
  ),
}

/* ── Blog Preview ── */
function BlogPreview({ data, steps }: { data: BlogData; steps: PipelineState }) {
  const [copied, setCopied] = React.useState(false)

  const copyArticle = () => {
    const text = `# ${data.title}\n\n${data.subtitle}\n\n${data.draftContent}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadImage = () => {
    if (!data.heroImage) return
    const link = document.createElement("a")
    link.href = `data:${data.heroImage.mediaType};base64,${data.heroImage.base64}`
    link.download = `${data.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-hero.png`
    link.click()
  }

  return (
    <article className="mx-auto w-full max-w-3xl">
      {/* Hero image */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-border bg-muted">
        {data.heroImage ? (
          <>
            <img
              src={`data:${data.heroImage.mediaType};base64,${data.heroImage.base64}`}
              alt={data.title || "Blog hero image"}
              className="aspect-[21/9] w-full object-cover"
            />
            <button
              onClick={downloadImage}
              className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/80 text-background backdrop-blur-sm transition-colors hover:bg-foreground"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          </>
        ) : steps.image === "running" ? (
          <div className="flex aspect-[21/9] items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs font-medium">Gemini is generating the hero image...</span>
            </div>
          </div>
        ) : steps.image === "error" ? (
          <div className="flex aspect-[21/9] items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-6 w-6" />
              <span className="text-xs">Image generation unavailable</span>
            </div>
          </div>
        ) : (
          <div className="flex aspect-[21/9] items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-6 w-6" />
              <span className="text-xs">Hero image will appear here</span>
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <header className="mb-8">
        {data.title ? (
          <>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
              {data.title}
            </h1>
            {data.subtitle && (
              <p className="mt-3 text-lg text-muted-foreground leading-relaxed text-pretty">
                {data.subtitle}
              </p>
            )}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">AI Generated</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Research by Gemini Search -- Written by GPT-5.2 -- Image by Gemini
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-muted" />
            <div className="h-6 w-1/2 animate-pulse rounded-md bg-muted" />
          </div>
        )}
      </header>

      {/* Article content */}
      <div className="relative">
        {data.draftContent ? (
          <>
            <div className="absolute -right-2 -top-2 z-10">
              <button
                onClick={copyArticle}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {data.draftContent}
            </Markdown>
          </>
        ) : steps.draft === "running" ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-muted"
                style={{ width: `${60 + Math.random() * 40}%`, animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Research sources (collapsible) */}
      {data.researchContent && (
        <details className="mt-12 rounded-xl border border-border">
          <summary className="flex cursor-pointer items-center gap-2 rounded-t-xl bg-card px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/50">
            <Globe className="h-4 w-4 text-primary" />
            View Research Sources
            <span className="ml-1 text-xs text-muted-foreground">(Gemini + Google Search)</span>
          </summary>
          <div className="border-t border-border px-5 py-4">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {data.researchContent}
            </Markdown>
          </div>
        </details>
      )}
    </article>
  )
}

/* ── Empty State ── */
function EmptyState({ onSelect }: { onSelect: (topic: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground text-balance">
            Multi-Model Content Pipeline
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground leading-relaxed">
            Watch three AI models collaborate in real-time: Gemini searches the web for research,
            GPT-5.2 writes the article, and Gemini generates a hero image -- all streaming into a
            live blog preview.
          </p>
        </div>
      </div>

      {/* Model orchestration diagram */}
      <div className="flex items-start gap-3">
        {STEP_META.map((meta, i) => {
          const Icon = meta.icon
          return (
            <React.Fragment key={meta.id}>
              <div className="flex w-36 flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="text-xs font-medium text-foreground">{meta.label}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  {meta.model}
                </span>
                {meta.id === "draft" && (
                  <span className="rounded bg-secondary/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-secondary">
                    Parallel
                  </span>
                )}
                {meta.id === "image" && (
                  <span className="rounded bg-secondary/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-secondary">
                    Parallel
                  </span>
                )}
              </div>
              {i < STEP_META.length - 1 && (
                <ArrowRight className="mt-8 h-4 w-4 shrink-0 text-border" />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Topic suggestions */}
      <div className="flex flex-col items-center gap-3">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
          Try a topic
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {TOPIC_SUGGESTIONS.map((t) => (
            <button
              key={t}
              onClick={() => onSelect(t)}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function ContentPipelinePage() {
  const [model, setModel] = React.useState("openai/gpt-5.2")
  const [topic, setTopic] = React.useState("")
  const [isRunning, setIsRunning] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [startTime, setStartTime] = React.useState<number | null>(null)
  const [elapsed, setElapsed] = React.useState(0)
  const [started, setStarted] = React.useState(false)

  const [steps, setSteps] = React.useState<PipelineState>({
    research: "idle",
    draft: "idle",
    image: "idle",
  })

  const [blogData, setBlogData] = React.useState<BlogData>({
    title: "",
    subtitle: "",
    researchContent: "",
    draftContent: "",
    heroImage: null,
  })

  // Elapsed timer
  React.useEffect(() => {
    if (!startTime || !isRunning) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime, isRunning])

  const startPipeline = async (topicOverride?: string) => {
    const t = topicOverride || topic.trim()
    if (!t || isRunning) return

    if (topicOverride) setTopic(topicOverride)

    setIsRunning(true)
    setStarted(true)
    setError(null)
    setStartTime(Date.now())
    setElapsed(0)
    setSteps({ research: "idle", draft: "idle", image: "idle" })
    setBlogData({ title: "", subtitle: "", researchContent: "", draftContent: "", heroImage: null })

    try {
      const res = await fetch("/api/ai/content-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t, model }),
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
          if (!trimmed.startsWith("data:")) continue

          try {
            const data = JSON.parse(trimmed.slice(5).trim())

            if (data.event === "status") {
              setSteps((prev) => ({
                ...prev,
                [data.step as StepId]: data.state as StepState,
              }))
            }

            if (data.event === "meta") {
              setBlogData((prev) => ({
                ...prev,
                title: data.title,
                subtitle: data.subtitle,
              }))
            }

            if (data.event === "research") {
              setBlogData((prev) => ({ ...prev, researchContent: data.content }))
            }

            if (data.event === "draft-delta") {
              setBlogData((prev) => ({
                ...prev,
                draftContent: prev.draftContent + (data.delta as string),
              }))
            }

            if (data.event === "image") {
              setBlogData((prev) => ({
                ...prev,
                heroImage: { base64: data.base64, mediaType: data.mediaType },
              }))
            }

            if (data.event === "error") {
              setError(data.message || "Pipeline failed")
            }
          } catch {
            // skip invalid JSON
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pipeline failed")
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-heading font-semibold text-foreground">Content Pipeline</h1>
            <p className="text-[11px] text-muted-foreground">
              Multi-model agent: Gemini Search + GPT-5.2 + Gemini Image
            </p>
          </div>
        </div>
        <ModelSelector value={model} onChange={setModel} />
      </div>

      {/* Input bar */}
      <div className="border-b border-border bg-card/50 px-6 py-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startPipeline()}
            placeholder="Enter a topic -- the pipeline will research, write, and illustrate it..."
            disabled={isRunning}
            className="flex-1 rounded-lg border border-input bg-background px-3.5 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50 placeholder:text-muted-foreground"
          />
          <Button onClick={() => startPipeline()} disabled={isRunning || !topic.trim()} size="sm">
            {isRunning ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="mr-1.5 h-3.5 w-3.5" />
                Generate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Pipeline status bar (only when running/done) */}
      {started && (
        <div className="border-b border-border bg-muted/30 px-6 py-2.5">
          <PipelineStatusBar steps={steps} elapsed={elapsed} isRunning={isRunning} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-6 mt-4 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {!started ? (
          <EmptyState onSelect={(t) => startPipeline(t)} />
        ) : (
          <div className="px-6 py-8">
            <BlogPreview data={blogData} steps={steps} />
          </div>
        )}
      </div>
    </div>
  )
}
