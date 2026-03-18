"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import { MessageCircle, X, Sparkles, ArrowDown, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { ExploreLogo } from "./explore-logo"
import { ChatTripGrid, ChatTripDetail, ChatDeparturesTable } from "./chat-trip-cards"
import { GuidedSellingFlow } from "./guided-selling"

/* -------------------------------------------------------------------------- */
/*  Transport                                                                 */
/* -------------------------------------------------------------------------- */

const transport = new DefaultChatTransport({ api: "/api/explore-chat" })

/* -------------------------------------------------------------------------- */
/*  Suggestions                                                               */
/* -------------------------------------------------------------------------- */

const SUGGESTIONS = [
  "Help me find a trip",
  "Best destinations for solo travel",
  "What trips are under $2000?",
  "Family-friendly adventures",
]

/* -------------------------------------------------------------------------- */
/*  Helper: extract text from UIMessage parts                                 */
/* -------------------------------------------------------------------------- */

function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function TravelChat() {
  const [open, setOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const { messages, sendMessage, status, addToolOutput } = useChat({
    transport,
    id: "explore-travel-chat",
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

  /* ------ Render tool invocations ------ */
  function renderToolPart(part: { type: "tool-invocation"; toolInvocation: { toolName: string; toolCallId: string; state: string; args?: Record<string, unknown>; output?: unknown } }) {
    const { toolName, toolCallId, state, args, output } = part.toolInvocation

    if (state === "input-streaming" || state === "input-available") {
      return (
        <div key={toolCallId} className="flex items-center gap-2 text-xs text-muted-foreground py-2">
          <Sparkles className="h-3 w-3 animate-spin" />
          <span>Searching...</span>
        </div>
      )
    }

    if (state !== "output-available" || !output) return null

    const data = output as Record<string, unknown>

    if (toolName === "searchTrips") {
      const trips = (data.trips || []) as Array<Record<string, unknown>>
      const totalFound = (data.totalFound || 0) as number
      if (trips.length === 0) return null
      return (
        <div key={toolCallId} className="my-2">
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
        <div key={toolCallId} className="my-2">
          <ChatTripDetail
            trip={data as never}
            onViewDepartures={(slug: string) => {
              sendMessage({ text: `Show departures for "${slug}"` })
            }}
          />
        </div>
      )
    }

    if (toolName === "getAvailableDepartures") {
      const departures = (data.departures || []) as Array<Record<string, unknown>>
      return (
        <div key={toolCallId} className="my-2">
          <ChatDeparturesTable
            departures={departures as never}
            tripTitle={(data.tripTitle || "") as string}
            tripSlug={(data.tripSlug || "") as string}
          />
        </div>
      )
    }

    if (toolName === "startGuidedSelling" && state === "input-available") {
      return (
        <div key={toolCallId} className="my-2">
          <GuidedSellingFlow
            greeting={(args?.greeting as string) || "Let's find your perfect trip!"}
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

    return null
  }

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
        <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3">
            <div className="flex items-center gap-2">
              <ExploreLogo variant="white" width={90} />
              <span className="text-xs text-primary-foreground/70">|</span>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-explore-yellow" />
                <span className="text-xs font-medium text-primary-foreground">Travel Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
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
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    )}
                  >
                    {msg.parts?.map((part, i) => {
                      if (part.type === "text" && part.text) {
                        return (
                          <p key={i} className="whitespace-pre-wrap">
                            {part.text}
                          </p>
                        )
                      }
                      if (part.type === "tool-invocation") {
                        return renderToolPart(part as Parameters<typeof renderToolPart>[0])
                      }
                      return null
                    })}
                    {/* Fallback for messages without parts */}
                    {(!msg.parts || msg.parts.length === 0) && getMessageText(msg) && (
                      <p className="whitespace-pre-wrap">{getMessageText(msg)}</p>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Streaming indicator */}
            {isStreaming && messages.length > 0 && (() => {
              const lastMsg = messages[messages.length - 1]
              const hasContent = lastMsg?.role === "assistant" && lastMsg.parts?.some(
                (p) => (p.type === "text" && (p as { text?: string }).text) || p.type === "tool-invocation"
              )
              if (hasContent) return null
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
          <div className="border-t border-border bg-card p-3">
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
      )}
    </>
  )
}
