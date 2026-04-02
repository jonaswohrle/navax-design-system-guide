"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import { Button } from "@/components/ui/button"
import {
  SendHorizontal,
  Loader2,
  Globe,
  FileText,
  ImagePlus,
  Palette,
  Users,
  FileCheck,
  User,
  Bot,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  ToolResultRouter,
  ToolLoading,
} from "@/components/sitecore/tool-results"

/* ── Starters ───────────────────────────────────────────────── */

const STARTERS = [
  {
    label: "Browse Sites",
    text: "List all HARTMANN sites and show me the page tree for the main site",
    icon: Globe,
    desc: "Explore the site structure and content hierarchy",
  },
  {
    label: "Create a Page",
    text: "Create a new landing page for Sterillium hand disinfection under /Home/Products with a hero banner and product features section",
    icon: FileText,
    desc: "Build product pages with AI-powered content",
  },
  {
    label: "Search Assets",
    text: "Search for wound care product images in the media library",
    icon: ImagePlus,
    desc: "Find and manage digital assets and media",
  },
  {
    label: "Brand Kit",
    text: "Set up a brand kit for HARTMANN with brand colors #0045FF and #001689, and guidelines for professional healthcare content",
    icon: Palette,
    desc: "Define brand identity for consistent content",
  },
  {
    label: "Personalization",
    text: "Create personalized hero banner variants for hospital visitors vs. pharmacy customers on the Sterillium page",
    icon: Users,
    desc: "Target different audiences with tailored content",
  },
  {
    label: "Marketing Brief",
    text: "Generate a marketing brief for a MoliCare incontinence care campaign targeting care home managers",
    icon: FileCheck,
    desc: "AI-generated campaign briefs for healthcare marketing",
  },
]

/* ── Message renderer ───────────────────────────────────────── */

function Message({ message }: { message: UIMessage }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-[#0045FF] text-white"
            : "border border-[#333] bg-[#111] text-[#999]"
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5" />
        ) : (
          <Bot className="h-3.5 w-3.5" />
        )}
      </div>

      {/* Parts */}
      <div
        className={cn(
          "flex max-w-[min(88%,640px)] flex-col gap-3",
          isUser ? "items-end" : "items-start"
        )}
      >
        {message.parts.map((part, idx) => {
          /* ── Text ────────────────────────────────── */
          if (part.type === "text" && part.text.trim()) {
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  isUser
                    ? "rounded-br-md bg-[#0045FF] text-white"
                    : "rounded-bl-md bg-[#1a1a1a] text-[#e5e5e5]"
                )}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{part.text}</p>
                ) : (
                  <div className="prose prose-sm prose-invert max-w-none text-[#e5e5e5] [&_p]:my-1 [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white [&_strong]:text-white [&_a]:text-[#5B8DEF] [&_code]:text-[#7dd3fc] [&_code]:bg-[#262626] [&_li]:text-[#d4d4d4] [&_li]:marker:text-[#666] [&_hr]:border-[#333] [&_blockquote]:border-[#444] [&_blockquote]:text-[#aaa]">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {part.text}
                    </Markdown>
                  </div>
                )}
              </div>
            )
          }

          /* ── Tool parts (AI SDK 6 format) ────────── */
          if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
            // Extract tool info based on part type
            const toolPart = part as {
              type: string
              toolCallId: string
              state: string
              toolName?: string
              input?: unknown
              output?: unknown
            }

            const toolName =
              toolPart.toolName || toolPart.type.replace("tool-", "")
            const { state } = toolPart

            // Loading state
            if (state === "input-streaming" || state === "input-available") {
              return <ToolLoading key={idx} toolName={toolName} />
            }

            // Result state
            if (state === "output-available") {
              return (
                <div key={idx} className="w-full max-w-[min(100%,560px)]">
                  <ToolResultRouter
                    toolName={toolName}
                    data={toolPart.output}
                  />
                </div>
              )
            }
          }

          return null
        })}
      </div>
    </div>
  )
}

/* ── Connection Health Banner ────────────────────────────────── */

type HealthStatus = {
  status: string
  message: string
  details: { token: boolean; mcp: boolean; sites: boolean; org?: string; tenant?: string }
  suggestion?: string
}

function ConnectionBanner({ health, onDismiss }: { health: HealthStatus | null; onDismiss: () => void }) {
  if (!health || health.status === "connected") return null

  const isWarning = health.details.token && health.details.mcp
  const Icon = isWarning ? AlertTriangle : XCircle
  const borderColor = isWarning ? "border-yellow-500/30" : "border-red-500/30"
  const bgColor = isWarning ? "bg-yellow-500/5" : "bg-red-500/5"
  const iconColor = isWarning ? "text-yellow-500" : "text-red-400"
  const titleColor = isWarning ? "text-yellow-400" : "text-red-400"

  return (
    <div className={cn("mx-4 mt-3 rounded-lg border p-3 lg:mx-8", borderColor, bgColor)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconColor)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className={cn("text-xs font-semibold", titleColor)}>
              {health.status === "missing_credentials"
                ? "Sitecore credentials not configured"
                : health.status === "sites_unavailable"
                  ? "XM Cloud environment not fully ready"
                  : "Connection issue"}
            </p>
            <button onClick={onDismiss} className="shrink-0 text-[10px] text-[#666] hover:text-[#999]">
              Dismiss
            </button>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              {health.details.token ? (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-red-400" />
              )}
              <span className="text-[#888]">Auth</span>
            </span>
            <span className="flex items-center gap-1">
              {health.details.mcp ? (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-red-400" />
              )}
              <span className="text-[#888]">MCP</span>
            </span>
            <span className="flex items-center gap-1">
              {health.details.sites ? (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-red-400" />
              )}
              <span className="text-[#888]">Sites API</span>
            </span>
            {health.details.org && (
              <span className="text-[#555]">
                Org: {health.details.org}
                {health.details.tenant ? ` / ${health.details.tenant}` : ""}
              </span>
            )}
          </div>
          {health.suggestion && (
            <div className="mt-2 flex items-start gap-1.5 rounded bg-black/20 px-2 py-1.5 text-[10px] leading-relaxed text-[#888]">
              <Info className="mt-0.5 h-3 w-3 shrink-0 text-[#555]" />
              <span>{health.suggestion}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ──────────────────────────────────────────────── */

export default function SitecoreChatPage() {
  const [input, setInput] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [health, setHealth] = React.useState<HealthStatus | null>(null)
  const [showBanner, setShowBanner] = React.useState(true)

  React.useEffect(() => {
    fetch("/api/sitecore/health")
      .then((r) => r.json())
      .then((data: HealthStatus) => setHealth(data))
      .catch(() => {})
  }, [])
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const transport = React.useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/sitecore/chat",
      }),
    []
  )

  const { messages, sendMessage, status } = useChat({
    transport,
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
    <div className="flex h-full min-h-0 flex-col">
      {/* Header bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#222] bg-[#0a0a0a] px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0045FF]/15">
            <Globe className="h-4 w-4 text-[#0045FF]" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">
              HARTMANN Content Studio
            </h1>
            <p className="flex items-center gap-1.5 text-[11px] text-[#777]">
              Powered by{" "}
              <code className="rounded bg-[#1a1a1a] px-1 py-0.5 text-[10px] font-mono text-[#aaa]">
                Sitecore MCP
              </code>
              {" + "}
              <code className="rounded bg-[#1a1a1a] px-1 py-0.5 text-[10px] font-mono text-[#aaa]">
                AI SDK 6
              </code>
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[#0045FF]/10 px-3 py-1 text-[10px] font-semibold text-[#0045FF]">
          GPT-5.2
        </span>
      </div>

      {/* Connection status */}
      {showBanner && <ConnectionBanner health={health} onDismiss={() => setShowBanner(false)} />}

      {/* Messages area */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto bg-[#050505]">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-8 px-4 py-12">
            {/* Empty state hero */}
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0045FF]/10">
                  <Globe className="h-8 w-8 text-[#0045FF]" />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#001689] text-white">
                  <Bot className="h-3 w-3" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white text-balance">
                  HARTMANN Content Studio
                </h2>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[#888]">
                  Manage HARTMANN&apos;s Sitecore content with natural language.
                  Create pages, search assets, personalize experiences, and
                  generate marketing briefs.
                </p>
              </div>
              <div className="mt-1 flex flex-wrap justify-center gap-2">
                {[
                  "Sitecore MCP",
                  "48 Tools",
                  "Streamable HTTP",
                  "Multi-Step Agent",
                ].map((concept) => (
                  <span
                    key={concept}
                    className="rounded-full border border-[#333] bg-[#111] px-3 py-1 text-[10px] font-medium text-[#888]"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Starter grid */}
            <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {STARTERS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSubmit(s.text)}
                  className="group flex items-start gap-3 rounded-xl border border-[#222] bg-[#0a0a0a] p-4 text-left transition-all hover:border-[#0045FF]/40 hover:bg-[#111]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1a1a1a] text-[#777] transition-colors group-hover:bg-[#0045FF]/15 group-hover:text-[#0045FF]">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#777]">
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
              <Message key={msg.id} message={msg} />
            ))}
            {/* Typing indicator */}
            {isDisabled &&
              messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#333] bg-[#111] text-[#999]">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-[#1a1a1a] px-4 py-3">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#555] [animation-delay:-0.3s]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#555] [animation-delay:-0.15s]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#555]" />
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-[#222] bg-[#0a0a0a] px-4 py-3 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end rounded-xl border border-[#333] bg-[#111] px-3 py-2 transition-shadow focus-within:border-[#0045FF]/50 focus-within:shadow-[0_0_0_2px_rgba(0,69,255,0.1)]">
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
              placeholder="Ask about HARTMANN sites, pages, assets, or personalization..."
              rows={1}
              disabled={isDisabled}
              className="max-h-[160px] min-h-[36px] flex-1 resize-none border-0 bg-transparent text-sm leading-relaxed text-white outline-none placeholder:text-[#666] disabled:opacity-50"
              aria-label="Chat input"
            />
            <Button
              onClick={() => handleSubmit()}
              disabled={isDisabled || !input.trim()}
              size="icon"
              className="ml-2 h-8 w-8 shrink-0 rounded-lg bg-[#0045FF] text-white hover:bg-[#0035CC] disabled:bg-[#333] disabled:text-[#666]"
              aria-label="Send message"
            >
              {isDisabled ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <SendHorizontal className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
          <p className="mt-2 text-center text-[10px] text-[#555]">
            Connected to Sitecore XM Cloud via MCP Streamable HTTP
          </p>
        </div>
      </div>
    </div>
  )
}
