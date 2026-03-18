"use client"

import { useCallback, useState, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import type { UIMessage } from "ai"
import { MessageCircle, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input"
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion"
import { ExploreLogo } from "./explore-logo"
import { ChatTripGrid, ChatTripDetail, ChatDeparturesTable } from "./chat-trip-cards"
import { GuidedSellingFlow } from "./guided-selling"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Transport                                                                 */
/* -------------------------------------------------------------------------- */

const transport = new DefaultChatTransport({ api: "/api/explore-chat" })

/* -------------------------------------------------------------------------- */
/*  Suggestion prompts                                                        */
/* -------------------------------------------------------------------------- */

const SUGGESTIONS = [
  "Help me find a trip",
  "Walking holidays in Europe",
  "What's available in Japan?",
  "Trips under \u00A32,000",
]

/* -------------------------------------------------------------------------- */
/*  Chat Widget Component                                                     */
/* -------------------------------------------------------------------------- */

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const pendingToolOutputs = useRef<Map<string, boolean>>(new Map())

  const { messages, sendMessage, addToolOutput, status } = useChat({
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall({ toolCall }) {
      if (toolCall.dynamic) return
      // startGuidedSelling is handled by the GuidedSellingFlow component,
      // so we don't auto-respond here. The component will call addToolOutput.
    },
  })

  const isStreaming = status === "streaming" || status === "submitted"

  /* ------ Handlers ------ */

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      if (!suggestion.trim()) return
      sendMessage({ text: suggestion.trim() })
    },
    [sendMessage]
  )

  const handleViewDetails = useCallback(
    (slug: string) => {
      sendMessage({ text: `Show me the details for the ${slug} trip` })
    },
    [sendMessage]
  )

  const handleViewDepartures = useCallback(
    (slug: string) => {
      sendMessage({ text: `What dates are available for the ${slug} trip?` })
    },
    [sendMessage]
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
    [addToolOutput]
  )

  /* ------ Render tool results ------ */

  function renderToolPart(part: UIMessage["parts"][number], messageIndex: number) {
    if (part.type !== "tool-invocation") return null

    const { toolName, toolCallId, state } = part

    if (toolName === "searchTrips") {
      if (state === "output-available") {
        const output = part.output as { trips: Array<Record<string, unknown>>; totalFound: number }
        return (
          <ChatTripGrid
            key={toolCallId}
            trips={output.trips as never}
            totalFound={output.totalFound}
            onViewDetails={handleViewDetails}
          />
        )
      }
      return (
        <div key={toolCallId} className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Searching trips...
        </div>
      )
    }

    if (toolName === "getTripDetails") {
      if (state === "output-available") {
        const output = part.output as Record<string, unknown>
        if (output.error) {
          return (
            <div key={toolCallId} className="rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
              Trip not found.
            </div>
          )
        }
        return (
          <ChatTripDetail
            key={toolCallId}
            trip={output as never}
            onViewDepartures={handleViewDepartures}
          />
        )
      }
      return (
        <div key={toolCallId} className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Loading trip details...
        </div>
      )
    }

    if (toolName === "getAvailableDepartures") {
      if (state === "output-available") {
        const output = part.output as { tourTitle: string; tourSlug: string; departures: Array<Record<string, unknown>> }
        if ((output as Record<string, unknown>).error) {
          return (
            <div key={toolCallId} className="rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
              Trip not found.
            </div>
          )
        }
        return (
          <ChatDeparturesTable
            key={toolCallId}
            tourTitle={output.tourTitle}
            tourSlug={output.tourSlug}
            departures={output.departures as never}
          />
        )
      }
      return (
        <div key={toolCallId} className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Checking availability...
        </div>
      )
    }

    if (toolName === "startGuidedSelling") {
      const input = part.input as { greeting: string }
      if (state === "output-available") {
        return (
          <div key={toolCallId} className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center text-xs text-primary font-medium">
            Preferences submitted — finding your perfect trips...
          </div>
        )
      }
      return (
        <GuidedSellingFlow
          key={toolCallId}
          greeting={input.greeting}
          onComplete={(result) => handleGuidedSellingComplete(toolCallId, result as unknown as Record<string, unknown>)}
        />
      )
    }

    return null
  }

  /* ------ Main render ------ */

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:bg-hover hover:shadow-xl hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          open && "pointer-events-none opacity-0"
        )}
        aria-label="Open travel assistant chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 p-0 sm:max-w-[420px] [&>button]:hidden"
        >
          <SheetTitle className="sr-only">Explore Travel Assistant</SheetTitle>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3">
            <div className="flex items-center gap-2.5">
              <ExploreLogo variant="white" width={80} />
              <div className="h-4 w-px bg-primary-foreground/30" />
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground/80" />
                <span className="text-xs font-medium text-primary-foreground/90">
                  Travel Assistant
                </span>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="h-8 w-8 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close chat</span>
            </Button>
          </div>

          {/* Messages */}
          <Conversation className="flex-1 bg-background">
            <ConversationContent className="gap-4 p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      Your Travel Assistant
                    </h3>
                    <p className="mx-auto max-w-[240px] text-xs text-muted-foreground">
                      I can help you find the perfect trip, answer questions about destinations, and check availability.
                    </p>
                  </div>
                  <Suggestions className="justify-center">
                    {SUGGESTIONS.map((s) => (
                      <Suggestion
                        key={s}
                        suggestion={s}
                        onClick={handleSuggestionClick}
                        className="border-primary/20 text-xs text-foreground hover:border-primary hover:bg-primary/5"
                      />
                    ))}
                  </Suggestions>
                </div>
              ) : (
                messages.map((message, i) => (
                  <Message key={message.id} from={message.role}>
                    <MessageContent>
                      {message.parts.map((part, j) => {
                        if (part.type === "text" && part.text.trim()) {
                          return (
                            <MessageResponse key={`text-${j}`}>
                              {part.text}
                            </MessageResponse>
                          )
                        }
                        if (part.type === "tool-invocation") {
                          return renderToolPart(part, i)
                        }
                        return null
                      })}
                    </MessageContent>
                  </Message>
                ))
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {/* Input */}
          <div className="border-t border-border bg-card p-3">
            <PromptInput
              onSubmit={({ text }) => {
                if (text.trim()) {
                  sendMessage({ text: text.trim() })
                }
              }}
              className="rounded-lg border-border bg-background"
            >
              <PromptInputTextarea
                placeholder="Ask about trips, destinations..."
                className="min-h-[40px] max-h-[120px] text-sm"
              />
              <PromptInputSubmit
                status={status}
                disabled={isStreaming}
                className="bg-primary text-primary-foreground hover:bg-hover"
              />
            </PromptInput>
            <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
              AI-powered assistant. Results may vary.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
