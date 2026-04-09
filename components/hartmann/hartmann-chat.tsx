"use client"

import { useCallback, useState, useRef, useEffect, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import { MessageCircle, X, Sparkles, ArrowDown, Send, Maximize2, Minimize2, RotateCcw } from "lucide-react"
import ReactMarkdown from "react-markdown"
import Image from "next/image"
import { cn } from "@/lib/utils"

const transport = new DefaultChatTransport({ api: "/api/hartmann-chat" })

const SUGGESTIONS = [
  "Welche Produkte gibt es fur Wundversorgung?",
  "Was ist Sterillium?",
  "Inkontinenzprodukte fur Senioren",
  "Kontakt aufnehmen",
]

function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

/* ── Markdown components ── */
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
}

/* ── Product card rendered inline ── */
function ProductCard({ product }: { product: Record<string, unknown> }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <h4 className="text-sm font-bold text-foreground">{product.name as string}</h4>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{product.category as string}</span>
      <p className="mt-1 text-xs text-muted-foreground">{product.description as string}</p>
    </div>
  )
}

/* ── Contact card ── */
function ContactCard({ info }: { info: Record<string, unknown> }) {
  return (
    <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
      <h4 className="mb-2 text-sm font-bold text-foreground">HARTMANN Kontakt</h4>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>Telefon: {info.phone as string}</p>
        <p>E-Mail: {info.email as string}</p>
        <p>Adresse: {info.address as string}</p>
      </div>
    </div>
  )
}

/* ── Main chat component ── */
export function HartmannChat() {
  const [open, setOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport,
    id: "hartmann-chat",
  })

  const isStreaming = status === "streaming" || status === "submitted"

  /* ── Auto-scroll ── */
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100)
  }, [])

  /* ── Handlers ── */
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
  }, [setMessages])

  /* ── Render tool output inline ── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function renderToolInline(part: any, index: number) {
    const toolCallId = part.toolCallId as string
    const state = part.state as string
    const output = part.output as Record<string, unknown> | undefined
    const toolName = (part.type as string).replace("tool-", "")

    if (state === "input-streaming" || state === "input-available") {
      return (
        <div key={toolCallId || index} className="flex items-center gap-2 text-xs text-muted-foreground py-2">
          <Sparkles className="h-3 w-3 animate-spin text-primary" />
          <span>
            {toolName === "searchProducts" && "Produkte werden gesucht..."}
            {toolName === "getProductDetails" && "Produktdetails werden geladen..."}
            {toolName === "showContactInfo" && "Kontaktdaten werden geladen..."}
          </span>
        </div>
      )
    }

    if (state !== "output-available" || !output) return null

    if (toolName === "searchProducts") {
      const products = (output.products || []) as Array<Record<string, unknown>>
      if (products.length === 0) return null
      return (
        <div key={toolCallId || index} className="my-2 space-y-2">
          {products.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </div>
      )
    }

    if (toolName === "getProductDetails") {
      if (output.error) return null
      return (
        <div key={toolCallId || index} className="my-2">
          <ProductCard product={output} />
        </div>
      )
    }

    if (toolName === "showContactInfo") {
      return (
        <div key={toolCallId || index} className="my-2">
          <ContactCard info={output} />
        </div>
      )
    }

    return null
  }

  /* ── Panel sizing ── */
  const panelClasses = fullscreen
    ? "fixed inset-0 z-50 flex flex-col bg-card"
    : "fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none"

  return (
    <>
      {/* FAB button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
          aria-label="HARTMANN Assistent offnen"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className={panelClasses}>
          {/* Header */}
          <div className={cn("flex items-center justify-between bg-primary px-4 py-3 shrink-0", fullscreen && "px-6 py-4")}>
            <div className="flex items-center gap-3">
              <Image
                src="/images/hartmann-logo.png"
                alt="HARTMANN"
                width={100}
                height={30}
                className="h-6 w-auto brightness-0 invert"
              />
              <span className="text-xs text-primary-foreground/60">|</span>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary-foreground/80" />
                <span className="text-xs font-medium text-primary-foreground">Gesundheitsassistent</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={handleReset}
                  className="rounded-full p-1.5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                  aria-label="Neuer Chat"
                  title="Neuer Chat"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setFullscreen((f) => !f)}
                className="rounded-full p-1.5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                aria-label={fullscreen ? "Vollbild beenden" : "Vollbild"}
              >
                {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => { setOpen(false); setFullscreen(false) }}
                className="rounded-full p-1.5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                aria-label="Chat schliessen"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col min-h-0">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className={cn("flex-1 overflow-y-auto px-4 py-3 space-y-3", fullscreen && "px-6 py-4")}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Image
                      src="/images/hartmann-logo.png"
                      alt="HARTMANN"
                      width={80}
                      height={24}
                      className="h-8 w-auto opacity-30"
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      Wie kann ich Ihnen helfen? Fragen Sie mich zu unseren Produkten und Losungen.
                    </p>
                  </div>
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
                              "max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            )}
                          >
                            <ReactMarkdown components={markdownComponents}>{text}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                      {msg.parts?.map((part, i) => {
                        if (part.type.startsWith("tool-")) {
                          return renderToolInline(part, i)
                        }
                        return null
                      })}
                    </div>
                  )
                })
              )}

              {error && (
                <div className="mx-auto max-w-[90%] rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                  <strong>Fehler:</strong> {error.message}
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
                    <div className="rounded-lg bg-secondary px-4 py-3">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0ms]" />
                        <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:150ms]" />
                        <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce [animation-delay:300ms]" />
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
                  aria-label="Nach unten scrollen"
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
                  placeholder="Fragen Sie zu Produkten, Losungen..."
                  rows={1}
                  className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/30"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isStreaming}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-hover disabled:opacity-40"
                  aria-label="Nachricht senden"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
                KI-gestutzter Assistent. Ergebnisse konnen variieren.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
