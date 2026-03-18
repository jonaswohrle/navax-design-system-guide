"use client"

import { useCallback, useState, useRef, useEffect, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import type { UIMessage } from "ai"
import { MessageCircle, X, Sparkles, ArrowDown, Send, Maximize2, Minimize2, RotateCcw, PanelRightClose, PanelRightOpen } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"
import { ExploreLogo } from "./explore-logo"
import { ChatTripGrid, ChatTripDetail, ChatDeparturesTable } from "./chat-trip-cards"
import { GuidedSellingFlow } from "./guided-selling"
import { useUnifiedPersonalization } from "@/components/providers/ninetailed-wrapper"

const transport = new DefaultChatTransport({ api: "/api/explore-chat" })

const SUGGESTIONS = [
  "Help me find a trip",
  "Best destinations for solo travel",
  "What trips are under \u00A32000?",
  "Family-friendly adventures",
]

function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

/* ------------------------------------------------------------------ */
/*  Canvas content types                                               */
/* ------------------------------------------------------------------ */
type CanvasContent =
  | { kind: "trips"; trips: Array<Record<string, unknown>>; totalFound: number }
  | { kind: "no-results"; filtersApplied: Record<string, unknown> }
  | { kind: "detail"; trip: Record<string, unknown> }
  | { kind: "departures"; departures: Array<Record<string, unknown>>; tourTitle: string; tourSlug: string }
  | { kind: "guided-selling"; greeting: string; toolCallId: string; input: Record<string, unknown> | undefined }
  | null

/* ------------------------------------------------------------------ */
/*  Skeleton loader for canvas                                         */
/* ------------------------------------------------------------------ */
function CanvasSkeleton({ label }: { label?: string }) {
  return (
    <div className="space-y-4 animate-pulse">
      {label && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 animate-spin" />
          <span>{label}</span>
        </div>
      )}
      <div className="h-6 w-2/3 rounded bg-muted" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[4/3] rounded-lg bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Markdown renderer                                                  */
/* ------------------------------------------------------------------ */
const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className="mb-2 space-y-1 last:mb-0">{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>,
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="flex items-start gap-1.5">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
      <span>{children}</span>
    </li>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => <p className="mb-2 text-base font-bold">{children}</p>,
  h2: ({ children }: { children?: React.ReactNode }) => <p className="mb-1.5 text-sm font-bold">{children}</p>,
  h3: ({ children }: { children?: React.ReactNode }) => <p className="mb-1 text-sm font-semibold">{children}</p>,
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
      {children}
    </a>
  ),
  hr: () => <hr className="my-2 border-border" />,
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-2 border-l-2 border-primary/30 pl-3 italic text-muted-foreground">{children}</blockquote>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">{children}</code>
  ),
}

/* ================================================================== */
/*  TravelChat component                                               */
/* ================================================================== */
export function TravelChat() {
  const [open, setOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [canvasOpen, setCanvasOpen] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const lastCanvasRef = useRef<CanvasContent>(null)
  const [canvasLoading, setCanvasLoading] = useState(false)
  const personalization = useUnifiedPersonalization()

  // Keep personalization data in a ref so the useChat body never changes
  // identity, which prevents infinite re-render loops.
  const personalizationRef = useRef({
    visitorAudience: personalization?.audience ?? "default",
    visitorTraits: personalization?.profile?.traits ?? {},
    visitorEvents: personalization?.profile?.events ?? {},
  })
  useEffect(() => {
    personalizationRef.current.visitorAudience = personalization?.audience ?? "default"
    personalizationRef.current.visitorTraits = personalization?.profile?.traits ?? {}
    personalizationRef.current.visitorEvents = personalization?.profile?.events ?? {}
  }, [personalization?.audience, personalization?.profile?.traits, personalization?.profile?.events])

  // Stable body object -- same reference across renders
  const [chatBody] = useState(() => personalizationRef.current)

  const { messages, sendMessage, status, addToolOutput, error, setMessages } = useChat({
    transport,
    id: "explore-travel-chat",
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    body: chatBody,
    onToolCall({ toolCall }) {
      if (toolCall.dynamic) return
    },
    onError: (err) => {
      console.error("Chat error:", err)
    },
  })

  const isStreaming = status === "streaming" || status === "submitted"

  /* --- Extract latest canvas content from messages --- */
  const canvasContent = useMemo<CanvasContent>(() => {
    for (let m = messages.length - 1; m >= 0; m--) {
      const msg = messages[m]
      if (msg.role !== "assistant" || !msg.parts) continue
      for (let p = msg.parts.length - 1; p >= 0; p--) {
        const part = msg.parts[p] as { type: string; state?: string; input?: Record<string, unknown>; output?: Record<string, unknown>; toolCallId?: string }
        if (!part.type.startsWith("tool-")) continue

        const toolName = part.type.replace("tool-", "")

        if (toolName === "startGuidedSelling" && part.state === "input-available") {
          return {
            kind: "guided-selling",
            greeting: (part.input?.greeting as string) || "Let's find your perfect trip!",
            toolCallId: part.toolCallId || "",
            input: part.input,
          }
        }

        if (part.state !== "output-available" || !part.output) continue

        if (toolName === "searchTrips") {
          const trips = (part.output.trips || []) as Array<Record<string, unknown>>
          const totalFound = (part.output.totalFound || 0) as number
          if (trips.length > 0) return { kind: "trips", trips, totalFound }
          // Return a no-results canvas so the user sees feedback
          return { kind: "no-results", filtersApplied: (part.output.filtersApplied || {}) as Record<string, unknown> }
        }

        if (toolName === "getTripDetails") {
          return { kind: "detail", trip: part.output }
        }

        if (toolName === "getAvailableDepartures") {
          return {
            kind: "departures",
            departures: (part.output.departures || []) as Array<Record<string, unknown>>,
            tourTitle: (part.output.tripTitle || part.output.tourTitle || "") as string,
            tourSlug: (part.output.tripSlug || part.output.tourSlug || "") as string,
          }
        }
      }
    }
    return null
  }, [messages])

  /* --- Track canvas state: keep last content, show skeleton during transitions --- */
  useEffect(() => {
    if (canvasContent !== null) {
      lastCanvasRef.current = canvasContent
      setCanvasLoading(false)
    } else if (isStreaming && lastCanvasRef.current !== null) {
      // Still streaming but no canvas content yet — show skeleton
      setCanvasLoading(true)
    } else if (!isStreaming) {
      setCanvasLoading(false)
    }
  }, [canvasContent, isStreaming])

  // The canvas should show if we have content OR if we're loading new content
  const hasCanvas = canvasContent !== null || (canvasLoading && lastCanvasRef.current !== null)
  const displayContent = canvasContent || lastCanvasRef.current

  /* --- Auto-scroll --- */
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100)
  }, [])

  /* --- Handlers --- */
  const handleSend = useCallback(() => {
    const text = inputValue.trim()
    if (!text) return
    sendMessage({ text })
    setInputValue("")
  }, [inputValue, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
    },
    [handleSend]
  )

  const handleSuggestion = useCallback((text: string) => { sendMessage({ text }) }, [sendMessage])

  const handleReset = useCallback(() => {
    setMessages([])
    lastCanvasRef.current = null
    setCanvasLoading(false)
  }, [setMessages])

  /* --- Guided selling complete handler --- */
  const handleGuidedSellingComplete = useCallback(
    (preferences: Record<string, unknown>, toolCallId: string) => {
      addToolOutput({
        tool: "startGuidedSelling",
        toolCallId,
        output: JSON.stringify(preferences),
      })
      // Show skeleton on canvas while the model processes the preferences
      setCanvasLoading(true)
    },
    [addToolOutput]
  )

  /* --- Render inline tool indicator for chat column --- */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function renderToolInline(part: any, index: number, isFullscreenMode: boolean) {
    const toolCallId = part.toolCallId as string
    const state = part.state as string
    const input = part.input as Record<string, unknown> | undefined
    const output = part.output as Record<string, unknown> | undefined
    const toolName = (part.type as string).replace("tool-", "")

    // In fullscreen with canvas open: show brief inline references
    if (isFullscreenMode && canvasOpen) {
      if (toolName === "startGuidedSelling") {
        if (state === "input-streaming") {
          return (
            <div key={toolCallId || index} className="flex items-center gap-2 text-xs text-muted-foreground py-1.5">
              <Sparkles className="h-3 w-3 animate-spin" />
              <span>Preparing trip finder...</span>
            </div>
          )
        }
        if (state === "input-available") {
          const greeting = (input?.greeting as string) || ""
          return (
            <div key={toolCallId || index} className="space-y-2">
              {greeting && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-secondary text-secondary-foreground px-3.5 py-2.5 text-sm leading-relaxed">
                    <p>{greeting}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-primary py-1">
                <Sparkles className="h-3 w-3" />
                <span className="font-medium">{"Answer the questions on the right to find your perfect trip \u2192"}</span>
              </div>
            </div>
          )
        }
        return null
      }

      if (state === "input-streaming" || state === "input-available") {
        return (
          <div key={toolCallId || index} className="flex items-center gap-2 text-xs text-muted-foreground py-1.5">
            <Sparkles className="h-3 w-3 animate-spin" />
            <span>Searching trips...</span>
          </div>
        )
      }

      if (state === "output-available") {
        // Don't show "I found trips" if search returned empty
        if (toolName === "searchTrips") {
          const trips = (output?.trips || []) as Array<unknown>
          if (trips.length === 0) return null
        }
        const labels: Record<string, string> = {
          searchTrips: "I found some trips for you \u2192",
          getTripDetails: "Here are the trip details \u2192",
          getAvailableDepartures: "Available departures are shown \u2192",
        }
        return (
          <div key={toolCallId || index} className="flex items-center gap-2 text-xs text-primary/70 py-1.5">
            <Sparkles className="h-3 w-3" />
            <span>{labels[toolName] || "Results shown on the right \u2192"}</span>
          </div>
        )
      }

      return null
    }

    // Non-fullscreen (or canvas closed): render inline
    if (toolName === "startGuidedSelling") {
      if (state === "input-streaming") {
        return (
          <div key={toolCallId || index} className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <Sparkles className="h-3 w-3 animate-spin" />
            <span>Preparing trip finder...</span>
          </div>
        )
      }
      if (state === "input-available") {
        return (
          <div key={toolCallId || index} className="my-2">
            <GuidedSellingFlow
              greeting={(input?.greeting as string) || "Let's find your perfect trip!"}
              onComplete={(preferences) => handleGuidedSellingComplete(preferences, toolCallId)}
            />
          </div>
        )
      }
      return null
    }

    if (state === "input-streaming" || state === "input-available") {
      return (
        <div key={toolCallId || index} className="flex items-center gap-2 text-xs text-muted-foreground py-2">
          <Sparkles className="h-3 w-3 animate-spin" />
          <span>Searching trips...</span>
        </div>
      )
    }

    if (state !== "output-available" || !output) return null

    if (toolName === "searchTrips") {
      const trips = (output.trips || []) as Array<Record<string, unknown>>
      const totalFound = (output.totalFound || 0) as number
      if (trips.length === 0) return null
      return (
        <div key={toolCallId || index} className="my-2">
          <ChatTripGrid trips={trips as never} totalFound={totalFound} onViewDetails={(slug: string) => sendMessage({ text: `Show me details for the trip "${slug}"` })} />
        </div>
      )
    }

    if (toolName === "getTripDetails") {
      return (
        <div key={toolCallId || index} className="my-2">
          <ChatTripDetail trip={output as never} onViewDepartures={(slug: string) => sendMessage({ text: `Show departures for "${slug}"` })} />
        </div>
      )
    }

    if (toolName === "getAvailableDepartures") {
      const departures = (output.departures || []) as Array<Record<string, unknown>>
      return (
        <div key={toolCallId || index} className="my-2">
          <ChatDeparturesTable departures={departures as never} tourTitle={(output.tripTitle || output.tourTitle || "") as string} tourSlug={(output.tripSlug || output.tourSlug || "") as string} />
        </div>
      )
    }

    return null
  }

  /* --- Canvas panel content --- */
  function renderCanvas() {
    if (canvasLoading && !canvasContent) {
      return <CanvasSkeleton label="Loading results..." />
    }

    const content = canvasContent || displayContent
    if (!content) return null

    if (content.kind === "guided-selling") {
      return (
        <GuidedSellingFlow
          greeting={content.greeting}
          onComplete={(preferences) => handleGuidedSellingComplete(preferences, content.toolCallId)}
        />
      )
    }

    if (content.kind === "no-results") {
      const filters = content.filtersApplied
      const filterLabels = Object.entries(filters)
        .filter(([, v]) => v != null)
        .map(([k, v]) => `${k}: ${v}`)
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">No trips found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your filters for more results.
            </p>
          </div>
          {filterLabels.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {filterLabels.map((label) => (
                <span key={label} className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (content.kind === "trips") {
      return (
        <div className={cn(canvasLoading && "opacity-50 pointer-events-none")}>
          <ChatTripGrid
            trips={content.trips as never}
            totalFound={content.totalFound}
            onViewDetails={(slug: string) => sendMessage({ text: `Show me details for the trip "${slug}"` })}
          />
        </div>
      )
    }

    if (content.kind === "detail") {
      return (
        <div className={cn(canvasLoading && "opacity-50 pointer-events-none")}>
          <ChatTripDetail
            trip={content.trip as never}
            onViewDepartures={(slug: string) => sendMessage({ text: `Show departures for "${slug}"` })}
          />
        </div>
      )
    }

    if (content.kind === "departures") {
      return (
        <div className={cn(canvasLoading && "opacity-50 pointer-events-none")}>
          <ChatDeparturesTable
            departures={content.departures as never}
            tourTitle={content.tourTitle}
            tourSlug={content.tourSlug}
          />
        </div>
      )
    }

    return null
  }

  /* --- Canvas label --- */
  function getCanvasLabel() {
    const content = canvasContent || displayContent
    if (!content) return ""
    if (content.kind === "trips") return "Trip Results"
    if (content.kind === "no-results") return "Search Results"
    if (content.kind === "detail") return "Trip Details"
    if (content.kind === "departures") return "Departures"
    if (content.kind === "guided-selling") return "Trip Finder"
    return ""
  }

  /* --- Panel sizing --- */
  const panelClasses = fullscreen
    ? "fixed inset-0 z-50 flex flex-col bg-card"
    : "fixed bottom-6 right-6 z-50 flex h-[600px] w-[440px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none"

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */
  return (
    <>
      {/* FAB button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
          aria-label="Open travel assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className={panelClasses}>
          {/* Header */}
          <div className={cn("flex items-center justify-between bg-primary px-4 py-3 shrink-0", fullscreen && "px-6 py-4")}>
            <div className="flex items-center gap-2">
              <ExploreLogo variant="white" width={fullscreen ? 110 : 90} />
              <span className="text-xs text-primary-foreground/70">|</span>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-explore-yellow" />
                <span className="text-xs font-medium text-primary-foreground">Travel Assistant</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={handleReset}
                  className="rounded-full p-1.5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                  aria-label="New chat"
                  title="New chat"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              {fullscreen && hasCanvas && (
                <button
                  onClick={() => setCanvasOpen((c) => !c)}
                  className="rounded-full p-1.5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                  aria-label={canvasOpen ? "Hide canvas" : "Show canvas"}
                  title={canvasOpen ? "Hide canvas" : "Show canvas"}
                >
                  {canvasOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                </button>
              )}
              <button
                onClick={() => setFullscreen((f) => !f)}
                className="rounded-full p-1.5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => { setOpen(false); setFullscreen(false) }}
                className="rounded-full p-1.5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body: split in fullscreen when canvas has content */}
          <div className="flex flex-1 min-h-0">
            {/* ---- Left: Chat column ---- */}
            <div className={cn("flex flex-1 flex-col min-w-0", fullscreen && hasCanvas && canvasOpen && "max-w-[50%]")}>
              {/* Messages */}
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className={cn(
                  "flex-1 overflow-y-auto px-4 py-3 space-y-3",
                  fullscreen && "px-6 py-4"
                )}
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
                    <p className="text-sm text-muted-foreground text-center">
                      Ask me anything about our trips and destinations.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSuggestion(s)}
                          className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, msgIndex) => {
                    const text = getMessageText(msg)
                    const hasToolParts = msg.parts?.some((p) => p.type.startsWith("tool-"))

                    if (msg.role === "assistant" && !text && !hasToolParts) return null

                    return (
                      <div key={`${msg.id}-${msgIndex}`}>
                        {text && (
                          <div className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                            <div
                              className={cn(
                                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                                msg.role === "user"
                                  ? "bg-primary text-primary-foreground rounded-br-md"
                                  : "bg-secondary text-secondary-foreground rounded-bl-md"
                              )}
                            >
                              <div className="prose-chat">
                                <ReactMarkdown components={markdownComponents}>{text}</ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        )}
                        {msg.parts?.map((part, i) => {
                          if (part.type.startsWith("tool-")) {
                            return renderToolInline(part, i, fullscreen)
                          }
                          return null
                        })}
                      </div>
                    )
                  })
                )}

                {error && (
                  <div className="mx-auto max-w-[90%] rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                    <strong>Error:</strong> {error.message}
                  </div>
                )}

                {isStreaming && messages.length > 0 && (() => {
                  const lastMsg = messages[messages.length - 1]
                  const hasVisibleContent = lastMsg?.role === "assistant" && (
                    getMessageText(lastMsg) || lastMsg.parts?.some((p) => p.type.startsWith("tool-") && (p as { state?: string }).state !== "input-streaming")
                  )
                  if (hasVisibleContent) return null
                  return (
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Scroll-to-bottom */}
              {showScrollBtn && (
                <div className="relative">
                  <button
                    onClick={scrollToBottom}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-full bg-card border border-border p-1.5 shadow-md z-10"
                    aria-label="Scroll to bottom"
                  >
                    <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              )}

              {/* Input */}
              <div className={cn("border-t border-border bg-card p-3 shrink-0", fullscreen && "px-6 py-4")}>
                <div className="flex items-end gap-2">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about trips, destinations..."
                    rows={1}
                    className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/30"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isStreaming}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
                  AI-powered assistant. Results may vary.
                </p>
              </div>
            </div>

            {/* ---- Right: Canvas panel (fullscreen only) ---- */}
            {fullscreen && hasCanvas && canvasOpen && (
              <div className="flex w-[50%] flex-col border-l border-border bg-muted/30">
                {/* Canvas header */}
                <div className="flex items-center gap-2 border-b border-border px-5 py-3 shrink-0">
                  <div className={cn("h-2 w-2 rounded-full bg-primary", (isStreaming || canvasLoading) && "animate-pulse")} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    {getCanvasLabel()}
                  </span>
                  {canvasLoading && (
                    <span className="text-[10px] text-muted-foreground ml-auto">Updating...</span>
                  )}
                </div>
                {/* Canvas body */}
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="animate-in fade-in duration-200">
                    {renderCanvas()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
