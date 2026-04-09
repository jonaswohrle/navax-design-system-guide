"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import Image from "next/image"
import {
  MessageCircle,
  X,
  Sparkles,
  ArrowDown,
  Send,
  ChevronRight,
  MapPin,
  Phone,
  ShieldCheck,
  Droplets,
  HeartPulse,
  Package,
  RotateCcw,
  Store,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const SUGGESTIONS = [
  "Welches Produkt fuer chronische Wunden?",
  "Sterillium Produktinfo",
  "Inkontinenzprodukte fuer mobile Patienten",
  "Haendler in meiner Naehe",
]

function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

/* ── Category icon helper ────────────────────────────────────── */

function CategoryIcon({ category, className }: { category: string; className?: string }) {
  if (category === "Wundversorgung") return <HeartPulse className={className} />
  if (category === "Desinfektion") return <Droplets className={className} />
  return <Package className={className} />
}

/* ── Product Card ─────────────────────────────────────────────── */

interface Product {
  id: string
  name: string
  category: string
  brand: string
  description: string
  applications: string[]
  features: string[]
  imageUrl: string
  price: string
  sizes: string[]
}

function ProductCard({ product, onViewDetails }: { product: Product; onViewDetails: (id: string) => void }) {
  return (
    <button
      onClick={() => onViewDetails(product.id)}
      className="group flex w-full items-start gap-3 rounded-xl border border-[#001689]/10 bg-white p-3 text-left transition-all hover:border-[#0045FF]/30 hover:shadow-md"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f0f4ff]">
        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#001689]/60 to-transparent p-1">
          <CategoryIcon category={product.category} className="h-3 w-3 text-white" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-[#001689] group-hover:text-[#0045FF]">{product.name}</p>
            <p className="text-[10px] text-[#001689]/50">{product.brand} | {product.category}</p>
          </div>
          <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#001689]/30 transition-colors group-hover:text-[#0045FF]" />
        </div>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#333]">{product.description}</p>
        <p className="mt-1 text-[10px] font-semibold text-[#0045FF]">{product.price}</p>
      </div>
    </button>
  )
}

/* ── Product Grid ─────────────────────────────────────────────── */

function ProductGrid({
  products,
  totalFound,
  onViewDetails,
}: {
  products: Product[]
  totalFound: number
  onViewDetails: (id: string) => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#001689]/50">
          {totalFound} Produkt{totalFound !== 1 ? "e" : ""} gefunden
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} />
        ))}
      </div>
    </div>
  )
}

/* ── Product Detail Card ──────────────────────────────────────── */

function ProductDetailCard({ product }: { product: Product & { relatedProducts?: { id: string; name: string; brand: string }[] } }) {
  return (
    <div className="space-y-3 rounded-xl border border-[#001689]/10 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#f0f4ff]">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#001689]">{product.name}</p>
          <p className="text-xs text-[#001689]/50">{product.brand} | {product.category}</p>
          <p className="mt-1 text-xs font-semibold text-[#0045FF]">{product.price}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-[#333]">{product.description}</p>
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#001689]/50">Anwendungsgebiete</p>
        <div className="flex flex-wrap gap-1">
          {product.applications.map((app) => (
            <span key={app} className="rounded-full bg-[#0045FF]/10 px-2 py-0.5 text-[10px] font-medium text-[#0045FF]">{app}</span>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#001689]/50">Eigenschaften</p>
        <div className="grid grid-cols-2 gap-1">
          {product.features.map((f) => (
            <div key={f} className="flex items-center gap-1 text-[10px] text-[#333]">
              <ShieldCheck className="h-3 w-3 shrink-0 text-green-600" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#001689]/50">Verfuegbare Groessen</p>
        <div className="flex flex-wrap gap-1">
          {product.sizes.map((size) => (
            <span key={size} className="rounded border border-[#001689]/10 bg-[#f8f9ff] px-2 py-0.5 text-[10px] text-[#001689]">{size}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Partner Card ─────────────────────────────────────────────── */

function PartnerList({
  partners,
  searchArea,
}: {
  partners: { name: string; address: string; phone: string; type: string }[]
  searchArea: string
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#001689]/50">
        Partner in {searchArea}
      </p>
      {partners.map((partner) => (
        <div key={partner.name} className="flex items-start gap-2.5 rounded-lg border border-[#001689]/10 bg-white p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0045FF]/10">
            <Store className="h-4 w-4 text-[#0045FF]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#001689]">{partner.name}</p>
            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#666]">
              <MapPin className="h-3 w-3 shrink-0" />
              <span>{partner.address}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#666]">
              <Phone className="h-3 w-3 shrink-0" />
              <span>{partner.phone}</span>
            </div>
            <span className="mt-1 inline-block rounded-full bg-[#0045FF]/10 px-2 py-0.5 text-[9px] font-medium text-[#0045FF]">{partner.type}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Guided Product Finder ────────────────────────────────────── */

const FINDER_QUESTIONS = [
  { id: "area", label: "Welcher Bereich?", options: ["Wundversorgung", "Desinfektion & Hygiene", "Inkontinenzversorgung"] },
  { id: "setting", label: "Wo wird das Produkt eingesetzt?", options: ["Klinik", "Pflegeheim", "Ambulante Pflege", "Zuhause"] },
  { id: "severity", label: "Schweregrad / Bedarf?", options: ["Leicht", "Mittel", "Schwer"] },
]

function GuidedProductFinder({ greeting, onComplete }: { greeting: string; onComplete: (answers: Record<string, string>) => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleSelect = (value: string) => {
    const q = FINDER_QUESTIONS[step]
    const newAnswers = { ...answers, [q.id]: value }
    setAnswers(newAnswers)
    if (step < FINDER_QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      onComplete(newAnswers)
    }
  }

  const currentQuestion = FINDER_QUESTIONS[step]

  return (
    <div className="space-y-3 rounded-xl border border-[#0045FF]/20 bg-gradient-to-br from-[#f0f4ff] to-white p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[#0045FF]" />
        <p className="text-xs font-bold text-[#001689]">Produktberater</p>
      </div>
      {step === 0 && <p className="text-xs text-[#333]">{greeting}</p>}
      <div>
        <p className="mb-2 text-xs font-semibold text-[#001689]">
          {currentQuestion.label}
          <span className="ml-1 text-[10px] font-normal text-[#999]">({step + 1}/{FINDER_QUESTIONS.length})</span>
        </p>
        <div className="flex flex-col gap-1.5">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className="flex items-center justify-between rounded-lg border border-[#001689]/10 bg-white px-3 py-2 text-left text-xs text-[#333] transition-all hover:border-[#0045FF]/40 hover:bg-[#0045FF]/5"
            >
              <span>{opt}</span>
              <ChevronRight className="h-3 w-3 text-[#001689]/30" />
            </button>
          ))}
        </div>
      </div>
      {Object.keys(answers).length > 0 && (
        <div className="flex flex-wrap gap-1">
          {Object.entries(answers).map(([key, value]) => (
            <span key={key} className="rounded-full bg-[#0045FF]/10 px-2 py-0.5 text-[9px] font-medium text-[#0045FF]">{value}</span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Markdown config ──────────────────────────────────────────── */

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-bold text-[#001689]">{children}</strong>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className="mb-1.5 space-y-0.5 last:mb-0">{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol className="mb-1.5 list-decimal space-y-0.5 pl-4 last:mb-0">{children}</ol>,
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="flex items-start gap-1.5">
      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#0045FF]" />
      <span>{children}</span>
    </li>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => <p className="mb-1.5 text-sm font-bold text-[#001689]">{children}</p>,
  h2: ({ children }: { children?: React.ReactNode }) => <p className="mb-1 text-xs font-bold text-[#001689]">{children}</p>,
  h3: ({ children }: { children?: React.ReactNode }) => <p className="mb-1 text-xs font-semibold text-[#001689]">{children}</p>,
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-[#0045FF] underline underline-offset-2 hover:text-[#0035CC]">{children}</a>
  ),
}

/* ── Main Chat Component ──────────────────────────────────────── */

export function HartmannCustomerChat() {
  const [open, setOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, status, addToolOutput, setMessages, setInput } = useChat({
    api: "/api/hartmann-chat",
    id: "hartmann-customer-chat",
    onError: (err) => console.error("[v0] Chat error:", err),
  })

  const isStreaming = status === "streaming" || status === "submitted"

  /* --- Listen for external open event (e.g. from header nav) --- */
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener("hartmann:open-chat", handler)
    return () => window.removeEventListener("hartmann:open-chat", handler)
  }, [])

  /* --- Auto-scroll --- */
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 60)
  }, [])

  /* --- Handlers --- */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        const form = document.getElementById("hartmann-chat-form") as HTMLFormElement | null
        form?.requestSubmit()
      }
    },
    []
  )

  const handleSuggestion = useCallback((text: string) => {
    setInput(text)
    setTimeout(() => {
      const form = document.getElementById("hartmann-chat-form") as HTMLFormElement | null
      form?.requestSubmit()
    }, 50)
  }, [setInput])

  const handleReset = useCallback(() => { setMessages([]) }, [setMessages])

  /* --- Guided finder complete --- */
  const handleFinderComplete = useCallback(
    (answers: Record<string, string>, toolCallId: string) => {
      addToolOutput({
        toolCallId,
        output: JSON.stringify(answers),
      })
    },
    [addToolOutput]
  )

  /* --- Render tool parts --- */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function renderToolPart(part: any, index: number) {
    const toolCallId = part.toolCallId as string
    const state = part.state as string
    const input = part.input as Record<string, unknown> | undefined
    const output = part.output as Record<string, unknown> | undefined
    const toolName = (part.type as string).replace("tool-", "")

    if (toolName === "startProductFinder") {
      if (state === "input-streaming") {
        return (
          <div key={toolCallId || index} className="flex items-center gap-2 py-1.5 text-[10px] text-[#001689]/50">
            <Sparkles className="h-3 w-3 animate-spin text-[#0045FF]" />
            <span>Produktberater wird geladen...</span>
          </div>
        )
      }
      if (state === "input-available") {
        return (
          <div key={toolCallId || index} className="my-2">
            <GuidedProductFinder
              greeting={(input?.greeting as string) || "Lassen Sie uns das richtige Produkt finden!"}
              onComplete={(answers) => handleFinderComplete(answers, toolCallId)}
            />
          </div>
        )
      }
      return null
    }

    if (state === "input-streaming" || state === "input-available") {
      const labels: Record<string, string> = {
        searchProducts: "Suche passende Produkte...",
        getProductDetails: "Lade Produktdetails...",
        findNearbyPartner: "Suche Partner in Ihrer Naehe...",
      }
      return (
        <div key={toolCallId || index} className="flex items-center gap-2 py-1.5 text-[10px] text-[#001689]/50">
          <Sparkles className="h-3 w-3 animate-spin text-[#0045FF]" />
          <span>{labels[toolName] || "Verarbeite..."}</span>
        </div>
      )
    }

    if (state !== "output-available" || !output) return null

    if (toolName === "searchProducts") {
      const products = (output.products || []) as Product[]
      const totalFound = (output.totalFound || 0) as number
      if (products.length === 0) return null
      return (
        <div key={toolCallId || index} className="my-2">
          <ProductGrid
            products={products}
            totalFound={totalFound}
            onViewDetails={(id) => handleSuggestion(`Zeige mir Details zu "${id}"`)}
          />
        </div>
      )
    }

    if (toolName === "getProductDetails") {
      if (output.error) return null
      return (
        <div key={toolCallId || index} className="my-2">
          <ProductDetailCard product={output as unknown as Product & { relatedProducts?: { id: string; name: string; brand: string }[] }} />
        </div>
      )
    }

    if (toolName === "findNearbyPartner") {
      const partners = (output.partners || []) as { name: string; address: string; phone: string; type: string }[]
      return (
        <div key={toolCallId || index} className="my-2">
          <PartnerList partners={partners} searchArea={(output.searchArea || "") as string} />
        </div>
      )
    }

    return null
  }

  /* ── Floating button ────────────────────────────────────────── */

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#001689] text-white shadow-2xl shadow-[#001689]/30 transition-all hover:scale-105 hover:bg-[#0045FF] active:scale-95"
        aria-label="HARTMANN Produktberater oeffnen"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    )
  }

  /* ── Chat panel ─────────────────────────────────────────────── */

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl border border-[#001689]/10 bg-[#fafbff] shadow-2xl shadow-[#001689]/15">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#001689] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Image src="/images/hartmann-logo.png" alt="HARTMANN" width={80} height={32} className="h-6 w-auto brightness-0 invert" />
          <div className="h-4 w-px bg-white/20" />
          <div>
            <p className="text-xs font-semibold text-white">Produktberater</p>
            <p className="text-[9px] text-white/50">Powered by AI</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button onClick={handleReset} className="flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white" aria-label="Neue Unterhaltung">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
          <button onClick={() => setOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white" aria-label="Chat schliessen">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} onScroll={handleScroll} className="relative min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#001689]/5">
              <Image src="/images/hartmann-logo.png" alt="" width={40} height={40} className="h-8 w-auto" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[#001689]">Wie kann ich Ihnen helfen?</p>
              <p className="mt-1 text-xs text-[#666]">Fragen Sie mich zu HARTMANN Produkten, Anwendungen oder Haendlern.</p>
            </div>
            <div className="flex flex-col gap-1.5 px-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="rounded-lg border border-[#001689]/10 bg-white px-3 py-2 text-left text-[11px] text-[#333] transition-all hover:border-[#0045FF]/30 hover:bg-[#0045FF]/5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => {
              const isUser = message.role === "user"
              const textContent = getMessageText(message)

              return (
                <div key={message.id} className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
                  {textContent.trim() && (
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed",
                        isUser
                          ? "rounded-br-md bg-[#001689] text-white"
                          : "rounded-bl-md bg-white text-[#333] shadow-sm ring-1 ring-[#001689]/5"
                      )}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{textContent}</p>
                      ) : (
                        <ReactMarkdown components={markdownComponents}>{textContent}</ReactMarkdown>
                      )}
                    </div>
                  )}
                  {/* Tool parts */}
                  {!isUser &&
                    message.parts
                      .filter((p) => (p.type as string).startsWith("tool-"))
                      .map((part, idx) => renderToolPart(part, idx))}
                </div>
              )
            })}
            {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex items-center gap-2 text-[10px] text-[#001689]/50">
                <Sparkles className="h-3 w-3 animate-spin text-[#0045FF]" />
                <span>Denke nach...</span>
              </div>
            )}
          </div>
        )}

        {showScrollBtn && (
          <button onClick={scrollToBottom} className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-[#001689]/10 bg-white p-1.5 shadow-md" aria-label="Nach unten scrollen">
            <ArrowDown className="h-3.5 w-3.5 text-[#001689]" />
          </button>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[#001689]/10 bg-white px-3 py-3">
        <form id="hartmann-chat-form" onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Fragen Sie zu Produkten, Anwendungen..."
            rows={1}
            disabled={isStreaming}
            className="min-h-[36px] max-h-[100px] flex-1 resize-none rounded-xl border border-[#001689]/10 bg-[#fafbff] px-3 py-2 text-xs outline-none placeholder:text-[#999] focus:border-[#0045FF]/40 disabled:opacity-50"
            aria-label="Nachricht eingeben"
          />
          <Button
            type="submit"
            disabled={isStreaming || !input.trim()}
            size="icon"
            className="h-9 w-9 shrink-0 rounded-xl bg-[#001689] hover:bg-[#0045FF]"
            aria-label="Senden"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
        <p className="mt-1.5 text-center text-[9px] text-[#999]">
          HARTMANN Produktberater | Fuer medizinische Beratung wenden Sie sich an Ihren Arzt.
        </p>
      </div>
    </div>
  )
}
