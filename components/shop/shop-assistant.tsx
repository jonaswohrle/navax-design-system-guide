"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import { MessageCircle, X, Sparkles, Send, RotateCcw, Star } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

const transport = new DefaultChatTransport({ api: "/api/shop-chat" })

const SUGGESTIONS = [
  "Ich suche eine pflegende Gesichtscreme",
  "Was habt ihr für Babys im Angebot?",
  "Empfehlt mir ein gutes Shampoo",
  "Zeigt mir aktuelle Angebote",
]

/* ------------------------------------------------------------------ */
/*  Types for tool output                                              */
/* ------------------------------------------------------------------ */
type ChatProduct = {
  slug: string
  name: string
  brand: string
  price: number
  oldPrice: number | null
  unit: string
  image: string
  rating: number
  reviews: number
  badge: string | null
}

const euro = (v: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(v)

/* ------------------------------------------------------------------ */
/*  Markdown renderer                                                  */
/* ------------------------------------------------------------------ */
const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <p className="mb-2 leading-relaxed last:mb-0">{children}</p>,
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold">{children}</strong>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className="mb-2 space-y-1 last:mb-0">{children}</ul>,
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="flex items-start gap-1.5">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
      <span>{children}</span>
    </li>
  ),
}

/* ------------------------------------------------------------------ */
/*  Chat product card                                                  */
/* ------------------------------------------------------------------ */
function ChatProductCard({ product }: { product: ChatProduct }) {
  return (
    <Link
      href={`/p/${product.slug}`}
      className="flex gap-3 rounded-lg border border-border bg-card p-2.5 transition-colors hover:border-primary/40"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill sizes="64px" className="object-contain p-1" />
        {product.badge && (
          <span className="absolute left-0 top-0 bg-primary px-1 py-0.5 text-[9px] font-bold uppercase leading-none text-primary-foreground">
            {product.badge}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{product.brand}</p>
        <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Star className="h-3 w-3 fill-warning text-warning" />
          <span>
            {product.rating.toFixed(1)} ({product.reviews})
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className={cn("text-sm font-bold", product.oldPrice ? "text-primary" : "text-foreground")}>
            {euro(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-[11px] text-muted-foreground line-through">{euro(product.oldPrice)}</span>
          )}
          <span className="ml-auto text-[10px] text-muted-foreground">{product.unit}</span>
        </div>
      </div>
    </Link>
  )
}

function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

/* ================================================================== */
/*  ShopAssistant component                                            */
/* ================================================================== */
export function ShopAssistant() {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    id: "rossmann-shop-assistant",
    onError: (err) => console.error("[v0] shop assistant error:", err),
  })

  const isStreaming = status === "streaming" || status === "submitted"

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [])
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSend = useCallback(() => {
    const text = inputValue.trim()
    if (!text) return
    sendMessage({ text })
    setInputValue("")
  }, [inputValue, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Respect IME composition (CJK) and Safari's unreliable final event
      // @ts-expect-error keyCode is available on the native event
      if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  /* --- Render tool output (product cards) inline --- */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function renderTool(part: any, key: string) {
    const toolName = (part.type as string).replace("tool-", "")
    const state = part.state as string

    if (state === "input-streaming" || state === "input-available") {
      return (
        <div key={key} className="flex items-center gap-2 py-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 animate-spin" />
          <span>Suche im Sortiment ...</span>
        </div>
      )
    }

    if (state !== "output-available" || !part.output) return null

    if (toolName === "searchProducts") {
      const products = (part.output.products || []) as ChatProduct[]
      if (products.length === 0) {
        return (
          <p key={key} className="py-1 text-xs text-muted-foreground">
            Leider keine passenden Produkte gefunden. Versuchen Sie es mit einem anderen Suchbegriff.
          </p>
        )
      }
      return (
        <div key={key} className="my-1.5 space-y-2">
          {products.map((p) => (
            <ChatProductCard key={p.slug} product={p} />
          ))}
        </div>
      )
    }

    if (toolName === "getProductDetails") {
      if (part.output.error) return null
      return (
        <div key={key} className="my-1.5">
          <ChatProductCard product={part.output as ChatProduct} />
        </div>
      )
    }

    return null
  }

  return (
    <div className="theme-rossmann">
      {/* Launcher button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="ROSSMANN Einkaufsassistent öffnen"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-hover"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[600px] max-h-[calc(100vh-2.5rem)] w-[calc(100vw-2.5rem)] max-w-[400px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <div className="leading-tight">
                <p className="text-sm font-bold">Einkaufsassistent</p>
                <p className="text-[11px] text-primary-foreground/80">Ihre persönliche Drogerie-Beratung</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMessages([])}
                aria-label="Unterhaltung zurücksetzen"
                className="rounded-md p-1.5 transition-colors hover:bg-primary-foreground/15"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Chat schließen"
                className="rounded-md p-1.5 transition-colors hover:bg-primary-foreground/15"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-secondary/40 p-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-card p-3 text-sm leading-relaxed text-foreground shadow-sm">
                  <p className="font-semibold">Herzlich willkommen bei ROSSMANN!</p>
                  <p className="mt-1 text-muted-foreground">
                    Ich helfe Ihnen, die passenden Produkte aus unserem Sortiment zu finden – von Pflege über Baby bis
                    Haushalt. Wonach suchen Sie?
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => sendMessage({ text: s })}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => {
              const text = getMessageText(message)
              const isUser = message.role === "user"
              return (
                <div key={message.id} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm",
                      isUser
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-card text-foreground shadow-sm",
                    )}
                  >
                    {text && (
                      <div className={cn(!isUser && "prose-sm")}>
                        <ReactMarkdown components={markdownComponents}>{text}</ReactMarkdown>
                      </div>
                    )}
                    {!isUser &&
                      message.parts
                        ?.filter((p) => p.type.startsWith("tool-"))
                        .map((p, i) => renderTool(p, `${message.id}-${i}`))}
                  </div>
                </div>
              )
            })}

            {isStreaming && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-card px-3.5 py-2.5 text-sm text-muted-foreground shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  <span>Einen Moment ...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border bg-card p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Wonach suchen Sie?"
                className="max-h-28 min-h-[42px] flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputValue.trim() || isStreaming}
                aria-label="Nachricht senden"
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
              KI-gestützte Beratung. Angaben ohne Gewähr.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
