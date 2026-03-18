"use client"

import { useCallback, useState, useRef, useEffect, type FormEvent } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import type { UIMessage } from "ai"
import { MessageCircle, X, Sparkles, ArrowDown, ArrowUp } from "lucide-react"
import { ExploreLogo } from "./explore-logo"
import { ChatTripGrid, ChatTripDetail, ChatDeparturesTable } from "./chat-trip-cards"
import { GuidedSellingFlow } from "./guided-selling"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Transport setup                                                           */
/* -------------------------------------------------------------------------- */

const transport = new DefaultChatTransport({ api: "/api/explore-chat" })

/* -------------------------------------------------------------------------- */
/*  Suggestion chips                                                          */
/* -------------------------------------------------------------------------- */

const SUGGESTIONS = [
  "Help me find a trip",
  "Walking holidays in Europe",
  "What\u2019s available in Japan?",
  "Trips under \u00A32,000",
]

/* -------------------------------------------------------------------------- */
/*  ChatWidget                                                                */
/* -------------------------------------------------------------------------- */

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const pendingToolOutputs = useRef<Map<string, boolean>>(new Map())
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const { messages, sendMessage, addToolOutput, status } = useChat({
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall({ toolCall }) {
      if (toolCall.dynamic) return
    },
  })

  const isStreaming = status === "streaming" || status === "submitted"

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, status])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
      setShowScrollBtn(!atBottom)
    }
    el.addEventListener("scroll", onScroll)
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  /* Handlers */
  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim()) return
      sendMessage({ text: text.trim() })
      setInput("")
    },
    [sendMessage],
  )

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      handleSend(input)
    },
    [handleSend, input],
  )

  const handleViewDetails = useCallback(
    (slug: string) => {
      sendMessage({ text: `Show me the details for the ${slug} trip` })
    },
    [sendMessage],
  )

  const handleViewDepartures = useCallback(
    (slug: string) => {
      sendMessage({ text: `What dates are available for the ${slug} trip?` })
    },
    [sendMessage],
  )

  const handleGuidedSellingComplete = useCallback(
    (toolCallId: string, result: Record<string, unknown>) => {
      if (pendingToolOutputs.current.has(toolCallId)) return
      pendingToolOutputs.current.set(toolCallId, true)
      addToolOutput({
        tool: "startGuidedSelling",
        toolCallId,
        output: result,
      })
    },
    [addToolOutput],
  )

  /* Render a single tool part */
  function renderToolPart(part: UIMessage["parts"][number]) {
    if (part.type !== "tool-invocation") return null
    const { toolName, toolCallId, state } = part

    if (toolName === "searchTrips") {
      if (state === "output-available") {
        const out = part.output as { trips: Array<Record<string, unknown>>; totalFound: number }
        return <ChatTripGrid key={toolCallId} trips={out.trips as never} totalFound={out.totalFound} onViewDetails={handleViewDetails} />
      }
      return <LoadingPill key={toolCallId} text="Searching trips\u2026" />
    }

    if (toolName === "getTripDetails") {
      if (state === "output-available") {
        const out = part.output as Record<string, unknown>
        if (out.error) return <ErrorPill key={toolCallId} text="Trip not found." />
        return <ChatTripDetail key={toolCallId} trip={out as never} onViewDepartures={handleViewDepartures} />
      }
      return <LoadingPill key={toolCallId} text="Loading trip details\u2026" />
    }

    if (toolName === "getAvailableDepartures") {
      if (state === "output-available") {
        const out = part.output as { tourTitle: string; tourSlug: string; departures: Array<Record<string, unknown>> }
        if ((out as Record<string, unknown>).error) return <ErrorPill key={toolCallId} text="Trip not found." />
        return <ChatDeparturesTable key={toolCallId} tourTitle={out.tourTitle} tourSlug={out.tourSlug} departures={out.departures as never} />
      }
      return <LoadingPill key={toolCallId} text="Checking availability\u2026" />
    }

    if (toolName === "startGuidedSelling") {
      const toolInput = part.input as { greeting: string }
      if (state === "output-available") {
        return (
          <div key={toolCallId} className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center text-xs font-medium text-primary">
            Preferences submitted \u2014 finding your perfect trips\u2026
          </div>
        )
      }
      return (
        <GuidedSellingFlow
          key={toolCallId}
          greeting={toolInput.greeting}
          onComplete={(result) => handleGuidedSellingComplete(toolCallId, result as unknown as Record<string, unknown>)}
        />
      )
    }

    return null
  }

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          open && "pointer-events-none scale-0 opacity-0",
        )}
        aria-label="Open travel assistant chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Floating chat card */}
      {open && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm sm:hidden" onClick={() => setOpen(false)} aria-hidden="true" />

          <div
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl",
              /* Mobile: near-full screen */
              "inset-3 sm:inset-auto",
              /* Desktop: fixed bottom-right */
              "sm:bottom-6 sm:right-6 sm:h-[600px] sm:w-[400px]",
            )}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between bg-primary px-4 py-3">
              <div className="flex items-center gap-2.5">
                <ExploreLogo variant="white" width={72} />
                <div className="h-4 w-px bg-primary-foreground/30" />
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary-foreground/80" />
                  <span className="text-xs font-medium text-primary-foreground/90">Travel Assistant</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="relative flex-1 overflow-y-auto">
              <div className="flex flex-col gap-4 p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">Your Travel Assistant</h3>
                      <p className="mx-auto max-w-[240px] text-xs text-muted-foreground">
                        I can help you find the perfect trip, answer questions about destinations, and check availability.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSend(s)}
                          className="rounded-full border border-primary/20 px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary hover:bg-primary/5"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className={cn("flex flex-col gap-2", message.role === "user" ? "items-end" : "items-start")}>
                      {message.parts.map((part, j) => {
                        if (part.type === "text" && part.text.trim()) {
                          return (
                            <div
                              key={`text-${j}`}
                              className={cn(
                                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                                message.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted text-foreground",
                              )}
                            >
                              {part.text}
                            </div>
                          )
                        }
                        if (part.type === "tool-invocation") {
                          return (
                            <div key={`tool-${j}`} className="w-full max-w-[95%]">
                              {renderToolPart(part)}
                            </div>
                          )
                        }
                        return null
                      })}
                    </div>
                  ))
                )}

                {/* Streaming dots */}
                {isStreaming && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex items-start">
                    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Scroll-to-bottom */}
              {showScrollBtn && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-3 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-card shadow-md transition-colors hover:bg-muted"
                  aria-label="Scroll to bottom"
                >
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-border bg-card p-3">
              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend(input)
                    }
                  }}
                  placeholder="Ask about trips, destinations\u2026"
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </form>
              <p className="mt-1.5 text-center text-[10px] text-muted-foreground">AI-powered assistant. Results may vary.</p>
            </div>
          </div>
        </>
      )}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Tiny helpers                                                              */
/* -------------------------------------------------------------------------- */

function LoadingPill({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      {text}
    </div>
  )
}

function ErrorPill({ text }: { text: string }) {
  return <div className="rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">{text}</div>
}
