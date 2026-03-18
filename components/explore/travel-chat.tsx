"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import type { UIMessage } from "ai"
import { MessageCircle, X, Sparkles, ArrowDown, Send, Maximize2, Minimize2, RotateCcw } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"
import { ExploreLogo } from "./explore-logo"
import { ChatTripGrid, ChatTripDetail, ChatDeparturesTable } from "./chat-trip-cards"
import { GuidedSellingFlow } from "./guided-selling"

const transport = new DefaultChatTransport({ api: "/api/explore-chat" })

const SUGGESTIONS = [
  "Help me find a trip",
  "Best destinations for solo travel",
  "What trips are under £2000?",
  "Family-friendly adventures",
]

function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export function TravelChat() {
  const [open, setOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const { messages, sendMessage, status, addToolOutput, error, setMessages } = useChat({
    transport,
    id: "explore-travel-chat",
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall({ toolCall }) {
      if (toolCall.dynamic) return
      /* startGuidedSelling is handled via UI, not here */
    },
    onError: (err) => {
      console.error("[v0] useChat error:", err)
    },
  })

  const isStreaming = status === "streaming" || status === "submitted"

  /* ------ Auto-scroll ------ */
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100)
  }, [])

  /* ------ Handlers ------ */
  const handleSend = useCallback(() => {
    const text = inputValue.trim()
    if (!text) return
    sendMessage({ text })
    setInputValue("")
  }, [inputValue, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleSuggestion = useCallback(
    (text: string) => {
      sendMessage({ text })
    },
    [sendMessage]
  )

  /* ------ Render a single tool part (AI SDK 6 format) ------ */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function renderToolPart(part: any, index: number) {
    const toolCallId = part.toolCallId as string
    const state = part.state as string
    const input = part.input as Record<string, unknown> | undefined
    const output = part.output as Record<string, unknown> | undefined
    const partType = part.type as string
    const toolName = partType.replace("tool-", "")

    /* --- Client-side tool: startGuidedSelling --- */
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
              onComplete={(preferences) => {
                addToolOutput({
                  tool: "startGuidedSelling",
                  toolCallId,
                  output: JSON.stringify(preferences),
                })
              }}
            />
          </div>
        )
      }
      /* output-available: guided selling is done, model will process */
      if (state === "output-available") {
        return (
          <div key={toolCallId || index} className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <Sparkles className="h-3 w-3 animate-spin" />
            <span>Finding trips based on your preferences...</span>
          </div>
        )
      }
      return null
    }

    /* --- Server-side tools: show loading while executing --- */
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
          <ChatTripGrid
            trips={trips as never}
            totalFound={totalFound}
            onViewDetails={(slug: string) => {
              sendMessage({ text: `Show me details for the trip "${slug}"` })
            }}
          />
        </div>
      )
    }

    if (toolName === "getTripDetails") {
      return (
        <div key={toolCallId || index} className="my-2">
          <ChatTripDetail
            trip={output as never}
            onViewDepartures={(slug: string) => {
              sendMessage({ text: `Show departures for "${slug}"` })
            }}
          />
        </div>
      )
    }

    if (toolName === "getAvailableDepartures") {
      const departures = (output.departures || []) as Array<Record<string, unknown>>
      return (
        <div key={toolCallId || index} className="my-2">
          <ChatDeparturesTable
            departures={departures as never}
            tourTitle={(output.tripTitle || output.tourTitle || "") as string}
            tourSlug={(output.tripSlug || output.tourSlug || "") as string}
          />
        </div>
      )
    }

    return null
  }

  /* ------ Check if a part is a tool part ------ */
  function isToolPart(part: { type: string }): boolean {
    return part.type.startsWith("tool-")
  }

  /* ------ Panel sizing ------ */
  const panelClasses = fullscreen
    ? "fixed inset-0 z-50 flex flex-col bg-card"
    : "fixed bottom-6 right-6 z-50 flex h-[600px] w-[440px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none"

  /* ------ UI ------ */
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
          <div className={cn("flex items-center justify-between bg-primary px-4 py-3", fullscreen && "px-6 py-4")}>
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
                  onClick={() => setMessages([])}
                  className="rounded-full p-1.5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                  aria-label="New chat"
                  title="New chat"
                >
                  <RotateCcw className="h-4 w-4" />
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

          {/* Messages */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className={cn("flex-1 overflow-y-auto px-4 py-3 space-y-3", fullscreen && "px-6 py-4 mx-auto w-full max-w-2xl")}
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
              messages.map((msg) => {
                const text = getMessageText(msg)
                const hasToolParts = msg.parts?.some((p) => isToolPart(p))

                if (msg.role === "assistant" && !text && !hasToolParts) return null

                return (
                  <div key={msg.id}>
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
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              ul: ({ children }) => <ul className="mb-1 ml-3 list-disc space-y-0.5 last:mb-0">{children}</ul>,
                              ol: ({ children }) => <ol className="mb-1 ml-3 list-decimal space-y-0.5 last:mb-0">{children}</ol>,
                              li: ({ children }) => <li>{children}</li>,
                              h2: ({ children }) => <p className="mb-1 font-semibold">{children}</p>,
                              h3: ({ children }) => <p className="mb-1 font-semibold">{children}</p>,
                              a: ({ href, children }) => (
                                <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-primary">
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {text}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {msg.parts?.map((part, i) => {
                      if (isToolPart(part)) {
                        return renderToolPart(part, i)
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
                getMessageText(lastMsg) || lastMsg.parts?.some((p) => isToolPart(p) && (p as { state?: string }).state !== "input-streaming")
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
            <button
              onClick={scrollToBottom}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-card border border-border p-1.5 shadow-md"
              aria-label="Scroll to bottom"
            >
              <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}

          {/* Input */}
          <div className={cn("border-t border-border bg-card p-3", fullscreen && "px-6 py-4")}>
            <div className={cn("flex items-end gap-2", fullscreen && "mx-auto max-w-2xl")}>
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
            <p className={cn("mt-1.5 text-center text-[10px] text-muted-foreground", fullscreen && "mx-auto max-w-2xl")}>
              AI-powered assistant. Results may vary.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
