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
} from "lucide-react"
import { cn } from "@/lib/utils"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  ToolResultRouter,
  ToolLoading,
} from "@/components/sitecore/tool-results"

/* ─── Starters ───────────────────────────────────────────────── */

const STARTERS = [
  {
    label: "Browse Sites",
    text: "List all HARTMANN sites and show me the page tree for the main site",
    icon: Globe,
    desc: "Explore the site structure and content hierarchy",
  },
  {
    label: "Create a Page",
    text: "Create a new landing page for Sterillium hand disinfection with a hero banner and product features",
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
    text: "Set up a brand kit for HARTMANN with our brand colors #0045FF and #001689, and guidelines for healthcare content",
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

/* ─── Message renderer ───────────────────────────────────────── */

function Message({ message }: { message: UIMessage }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-[#0045FF] text-white"
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
          "flex max-w-[min(88%,640px)] flex-col gap-3",
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
                    ? "rounded-br-md bg-[#0045FF] text-white"
                    : "rounded-bl-md bg-muted/60 text-foreground"
                )}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{part.text}</p>
                ) : (
                  <div className="prose prose-sm max-w-none text-foreground [&_p]:my-1 [&_strong]:text-foreground [&_a]:text-[#0045FF]">
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
            const { state } = toolPart

            // Show loading for streaming/waiting states
            if (state === "input-streaming" || state === "input-available") {
              return <ToolLoading key={idx} toolName={toolName} />
            }

            // Show rich result when output is available
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

/* ─── Main Page ──────────────────────────────────────────────── */

export default function SitecoreChatPage() {
  const [input, setInput] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
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
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0045FF]/10">
            <Globe className="h-4 w-4 text-[#0045FF]" />
          </div>
          <div>
            <h1 className="text-sm font-heading font-semibold text-foreground">
              HARTMANN Content Studio
            </h1>
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              Powered by{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-foreground">
                Sitecore MCP
              </code>
              {" + "}
              <code className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-foreground">
                AI SDK 6
              </code>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#001689]/10 px-3 py-1 text-[10px] font-semibold text-[#001689]">
            GPT-5.2
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-8 px-4 py-12">
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
                <h2 className="text-xl font-heading font-semibold text-foreground text-balance">
                  HARTMANN Content Studio
                </h2>
                <p className="mt-1.5 max-w-md text-sm text-muted-foreground leading-relaxed">
                  Manage HARTMANN&apos;s Sitecore content with natural language.
                  Create pages, search assets, personalize experiences, and generate
                  marketing briefs.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {[
                  "Sitecore MCP",
                  "48 Tools",
                  "Streamable HTTP",
                  "Multi-Step Agent",
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

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-3xl">
              {STARTERS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSubmit(s.text)}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-[#0045FF]/30 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-[#0045FF]/10 group-hover:text-[#0045FF]">
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
              <Message key={msg.id} message={msg} />
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
      <div className="shrink-0 border-t border-border bg-card px-4 py-3 lg:px-8">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <div className="flex flex-1 items-end rounded-xl border border-input bg-background px-3 py-2 transition-shadow focus-within:ring-2 focus-within:ring-[#0045FF]/20 focus-within:border-[#0045FF]/40">
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
              className="min-h-[36px] max-h-[160px] flex-1 resize-none border-0 bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground disabled:opacity-50"
              aria-label="Chat input"
            />
          </div>
          <Button
            onClick={() => handleSubmit()}
            disabled={isDisabled || !input.trim()}
            size="icon"
            className="h-10 w-10 shrink-0 rounded-xl bg-[#0045FF] hover:bg-[#0045FF]/90"
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
