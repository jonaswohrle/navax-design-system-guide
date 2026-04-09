"use client"

import { useCallback, useState, useRef, useEffect, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import type { UIMessage } from "ai"
import { MessageCircle, X, Sparkles, ArrowDown, Send, Maximize2, Minimize2, RotateCcw, PanelRightClose, PanelRightOpen, Stethoscope, BookOpen, ShieldCheck, Bandage } from "lucide-react"
import ReactMarkdown from "react-markdown"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChatProductGrid, ChatProductDetail, ChatContactCard } from "./chat-product-cards"
import { HartmannGuidedSelling } from "./guided-selling"

const transport = new DefaultChatTransport({ api: "/api/hartmann-chat" })

const SUGGESTIONS = [
  "Helfen Sie mir bei der Produktauswahl",
  "Produkte f\u00FCr Wundversorgung",
  "Was ist Sterillium\u00AE?",
  "Schulungen & Academy",
  "Kontakt aufnehmen",
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
  | { kind: "products"; products: Array<Record<string, unknown>>; totalFound: number }
  | { kind: "no-results"; filtersApplied: Record<string, unknown> }
  | { kind: "detail"; product: Record<string, unknown> }
  | { kind: "contact"; info: Record<string, unknown> }
  | { kind: "academy"; info: Record<string, unknown> }
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
/*  Academy card (rendered in canvas)                                  */
/* ------------------------------------------------------------------ */
function AcademyCard({ info }: { info: Record<string, unknown> }) {
  const offerings = (info.offerings || []) as string[]
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <BookOpen className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">{info.title as string}</h3>
          <span className="text-[10px] font-medium uppercase tracking-wider text-primary">Thema: {info.topic as string}</span>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{info.description as string}</p>
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-foreground">Angebote:</h4>
        <ul className="space-y-1.5">
          {offerings.map((o, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </div>
      <a
        href={info.website as string}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-hover"
      >
        Zur Academy
        <BookOpen className="h-3 w-3" />
      </a>
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
/*  HartmannChat component                                             */
/* ================================================================== */
export function HartmannChat() {
  const [open, setOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [canvasOpen, setCanvasOpen] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const lastCanvasRef = useRef<CanvasContent>(null)
  const [canvasLoading, setCanvasLoading] = useState(false)

  const { messages, sendMessage, status, addToolOutput, error, setMessages } = useChat({
    transport,
    id: "hartmann-chat",
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall({ toolCall }) {
      if (toolCall.dynamic) return
    },
    onError: (err) => {
      console.error("Hartmann Chat error:", err)
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

        // Guided selling: client-side tool, show when input is available
        if (toolName === "startGuidedSelling" && part.state === "input-available") {
          return {
            kind: "guided-selling",
            greeting: (part.input?.greeting as string) || "Lassen Sie uns das passende Produkt f\u00FCr Sie finden!",
            toolCallId: part.toolCallId || "",
            input: part.input,
          }
        }

        if (part.state !== "output-available" || !part.output) continue

        if (toolName === "searchProducts") {
          const products = (part.output.products || []) as Array<Record<string, unknown>>
          const totalFound = (part.output.totalFound || 0) as number
          if (products.length > 0) return { kind: "products", products, totalFound }
          return { kind: "no-results", filtersApplied: {} }
        }

        if (toolName === "getProductDetails") {
          if (part.output.error) continue
          return { kind: "detail", product: part.output }
        }

        if (toolName === "showContactInfo") {
          return { kind: "contact", info: part.output }
        }

        if (toolName === "showAcademyInfo") {
          return { kind: "academy", info: part.output }
        }
      }
    }
    return null
  }, [messages])

  /* --- Track canvas state --- */
  useEffect(() => {
    if (canvasContent !== null) {
      lastCanvasRef.current = canvasContent
      setCanvasLoading(false)
    } else if (isStreaming && lastCanvasRef.current !== null) {
      setCanvasLoading(true)
    } else if (!isStreaming) {
      setCanvasLoading(false)
    }
  }, [canvasContent, isStreaming])

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
              <span>Produktberater wird vorbereitet...</span>
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
                <Stethoscope className="h-3 w-3" />
                <span className="font-medium">{"Beantworten Sie die Fragen rechts, um die passenden Produkte zu finden \u2192"}</span>
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
            <span>
              {toolName === "searchProducts" && "Produkte werden gesucht..."}
              {toolName === "getProductDetails" && "Produktdetails laden..."}
              {toolName === "showContactInfo" && "Kontaktdaten laden..."}
              {toolName === "showAcademyInfo" && "Academy-Informationen laden..."}
            </span>
          </div>
        )
      }

      if (state === "output-available") {
        if (toolName === "searchProducts") {
          const products = (output?.products || []) as Array<unknown>
          if (products.length === 0) return null
        }
        const labels: Record<string, string> = {
          searchProducts: "Passende Produkte gefunden \u2192",
          getProductDetails: "Produktdetails werden angezeigt \u2192",
          showContactInfo: "Kontaktinformationen rechts \u2192",
          showAcademyInfo: "Academy-Infos werden angezeigt \u2192",
        }
        return (
          <div key={toolCallId || index} className="flex items-center gap-2 text-xs text-primary/70 py-1.5">
            <Sparkles className="h-3 w-3" />
            <span>{labels[toolName] || "Ergebnisse rechts angezeigt \u2192"}</span>
          </div>
        )
      }

      return null
    }

    // Non-fullscreen (or canvas closed): render inline cards
    if (toolName === "startGuidedSelling") {
      if (state === "input-streaming") {
        return (
          <div key={toolCallId || index} className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <Sparkles className="h-3 w-3 animate-spin" />
            <span>Produktberater wird vorbereitet...</span>
          </div>
        )
      }
      if (state === "input-available") {
        return (
          <div key={toolCallId || index} className="my-2">
            <HartmannGuidedSelling
              greeting={(input?.greeting as string) || "Lassen Sie uns das passende Produkt f\u00FCr Sie finden!"}
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
          <span>
            {toolName === "searchProducts" && "Produkte werden gesucht..."}
            {toolName === "getProductDetails" && "Produktdetails laden..."}
            {toolName === "showContactInfo" && "Kontaktdaten laden..."}
            {toolName === "showAcademyInfo" && "Academy-Informationen laden..."}
          </span>
        </div>
      )
    }

    if (state !== "output-available" || !output) return null

    // Inline product grid (non-fullscreen)
    if (toolName === "searchProducts") {
      const products = (output.products || []) as Array<Record<string, unknown>>
      const totalFound = (output.totalFound || 0) as number
      if (products.length === 0) return null
      return (
        <div key={toolCallId || index} className="my-2">
          <ChatProductGrid
            products={products as never}
            totalFound={totalFound}
            onViewDetails={(slug: string) => sendMessage({ text: `Zeige mir Details zu "${slug}"` })}
          />
        </div>
      )
    }

    if (toolName === "getProductDetails") {
      if (output.error) return null
      return (
        <div key={toolCallId || index} className="my-2">
          <ChatProductDetail
            product={output as never}
            onViewRelated={(slug: string) => sendMessage({ text: `Zeige mir verwandte Produkte zu "${slug}"` })}
          />
        </div>
      )
    }

    if (toolName === "showContactInfo") {
      return (
        <div key={toolCallId || index} className="my-2">
          <ChatContactCard info={output as never} />
        </div>
      )
    }

    if (toolName === "showAcademyInfo") {
      return (
        <div key={toolCallId || index} className="my-2">
          <AcademyCard info={output} />
        </div>
      )
    }

    return null
  }

  /* --- Canvas panel content --- */
  function renderCanvas() {
    if (canvasLoading && !canvasContent) {
      return <CanvasSkeleton label="Ergebnisse laden..." />
    }

    const content = canvasContent || displayContent
    if (!content) return null

    if (content.kind === "guided-selling") {
      return (
        <HartmannGuidedSelling
          greeting={content.greeting}
          onComplete={(preferences) => handleGuidedSellingComplete(preferences, content.toolCallId)}
        />
      )
    }

    if (content.kind === "no-results") {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <Bandage className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Keine Produkte gefunden</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Versuchen Sie es mit anderen Suchbegriffen oder starten Sie den Produktberater.
            </p>
          </div>
        </div>
      )
    }

    if (content.kind === "products") {
      return (
        <div className={cn(canvasLoading && "opacity-50 pointer-events-none")}>
          <ChatProductGrid
            products={content.products as never}
            totalFound={content.totalFound}
            onViewDetails={(slug: string) => sendMessage({ text: `Zeige mir Details zu "${slug}"` })}
          />
        </div>
      )
    }

    if (content.kind === "detail") {
      return (
        <div className={cn(canvasLoading && "opacity-50 pointer-events-none")}>
          <ChatProductDetail
            product={content.product as never}
            onViewRelated={(slug: string) => sendMessage({ text: `Zeige mir verwandte Produkte zu "${slug}"` })}
          />
        </div>
      )
    }

    if (content.kind === "contact") {
      return (
        <div className={cn(canvasLoading && "opacity-50 pointer-events-none")}>
          <ChatContactCard info={content.info as never} />
        </div>
      )
    }

    if (content.kind === "academy") {
      return (
        <div className={cn(canvasLoading && "opacity-50 pointer-events-none")}>
          <AcademyCard info={content.info} />
        </div>
      )
    }

    return null
  }

  /* --- Canvas label --- */
  function getCanvasLabel() {
    const content = canvasContent || displayContent
    if (!content) return ""
    if (content.kind === "products") return "Produktergebnisse"
    if (content.kind === "no-results") return "Suchergebnisse"
    if (content.kind === "detail") return "Produktdetails"
    if (content.kind === "contact") return "Kontakt"
    if (content.kind === "academy") return "HARTMANN Academy"
    if (content.kind === "guided-selling") return "Produktberater"
    return ""
  }

  /* --- Panel sizing --- */
  const panelClasses = fullscreen
    ? "fixed inset-0 z-50 flex flex-col bg-card"
    : "fixed bottom-6 right-6 z-50 flex h-[620px] w-[440px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none"

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
          aria-label="HARTMANN Assistent \u00F6ffnen"
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
              <Image
                src="/images/hartmann-logo.png"
                alt="HARTMANN"
                width={fullscreen ? 110 : 90}
                height={30}
                className="h-6 w-auto brightness-0 invert"
              />
              <span className="text-xs text-primary-foreground/50">|</span>
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
              {fullscreen && hasCanvas && (
                <button
                  onClick={() => setCanvasOpen((c) => !c)}
                  className="rounded-full p-1.5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                  aria-label={canvasOpen ? "Panel ausblenden" : "Panel einblenden"}
                  title={canvasOpen ? "Panel ausblenden" : "Panel einblenden"}
                >
                  {canvasOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
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
                aria-label="Chat schlie\u00DFen"
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
                  <div className="flex flex-col items-center justify-center h-full gap-6 py-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <Stethoscope className="h-7 w-7 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">HARTMANN Gesundheitsassistent</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {"Wie kann ich Ihnen helfen? Fragen Sie mich zu unseren Produkten, L\u00F6sungen oder Schulungen."}
                        </p>
                      </div>
                    </div>

                    {/* Quick action cards */}
                    <div className="w-full grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSuggestion("Helfen Sie mir bei der Produktauswahl")}
                        className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-center transition-colors hover:bg-primary/10"
                      >
                        <Stethoscope className="h-5 w-5 text-primary" />
                        <span className="text-[11px] font-medium text-foreground">Produktberater</span>
                        <span className="text-[9px] text-muted-foreground">Interaktive Beratung</span>
                      </button>
                      <button
                        onClick={() => handleSuggestion("Produkte f\u00FCr Wundversorgung")}
                        className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3 text-center transition-colors hover:bg-muted/50"
                      >
                        <Bandage className="h-5 w-5 text-primary" />
                        <span className="text-[11px] font-medium text-foreground">Wundversorgung</span>
                        <span className="text-[9px] text-muted-foreground">Produkte entdecken</span>
                      </button>
                      <button
                        onClick={() => handleSuggestion("Schulungen & Academy")}
                        className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3 text-center transition-colors hover:bg-muted/50"
                      >
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span className="text-[11px] font-medium text-foreground">Academy</span>
                        <span className="text-[9px] text-muted-foreground">Fortbildung & Wissen</span>
                      </button>
                      <button
                        onClick={() => handleSuggestion("Kontakt aufnehmen")}
                        className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3 text-center transition-colors hover:bg-muted/50"
                      >
                        <Send className="h-5 w-5 text-primary" />
                        <span className="text-[11px] font-medium text-foreground">Kontakt</span>
                        <span className="text-[9px] text-muted-foreground">Direkt anfragen</span>
                      </button>
                    </div>

                    {/* Text suggestions */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {SUGGESTIONS.slice(1).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSuggestion(s)}
                          className="rounded-full border border-border bg-card px-3 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
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
                    placeholder="Fragen zu Produkten, L\u00F6sungen, Schulungen..."
                    rows={1}
                    className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/30"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isStreaming}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-hover disabled:opacity-40"
                    aria-label="Nachricht senden"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
                  {"KI-gest\u00FCtzter Assistent \u2022 Ergebnisse k\u00F6nnen variieren"}
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
                    <span className="text-[10px] text-muted-foreground ml-auto">Wird aktualisiert...</span>
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
