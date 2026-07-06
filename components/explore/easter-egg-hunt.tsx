"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Gift, MapPin, Sparkles, X, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

/* ── Egg data ── */
interface EasterEgg {
  id: number
  /** position as % of container */
  x: number
  y: number
  color: string
  pattern: string
  prize: {
    title: string
    discount: string
    description: string
    code: string
  }
}

const EGGS: EasterEgg[] = [
  {
    id: 1, x: 15, y: 58, color: "#E8B4B8", pattern: "dots",
    prize: { title: "Early Bird Discount", discount: "15% OFF", description: "Book any summer trip before April 30th", code: "EASTER15" },
  },
  {
    id: 2, x: 72, y: 42, color: "#B8D4E8", pattern: "stripes",
    prize: { title: "Family Adventure", discount: "Free Child Place", description: "On selected family-friendly departures", code: "EGGKIDS" },
  },
  {
    id: 3, x: 45, y: 72, color: "#D4E8B8", pattern: "zigzag",
    prize: { title: "Explore Flex Free", discount: "Free Flex", description: "Add Explore Flex at no extra cost to any booking", code: "FLEXEGG" },
  },
  {
    id: 4, x: 85, y: 65, color: "#E8D4B8", pattern: "waves",
    prize: { title: "Walking Trip Deal", discount: "20% OFF", description: "Selected European walking adventures", code: "WALK20" },
  },
  {
    id: 5, x: 30, y: 35, color: "#D4B8E8", pattern: "stars",
    prize: { title: "Group Booking Bonus", discount: "Save GBP 100pp", description: "When 4+ travellers book together", code: "EGGGROUP" },
  },
  {
    id: 6, x: 58, y: 52, color: "#E8E4B8", pattern: "hearts",
    prize: { title: "Grand Prize", discount: "GBP 250 OFF", description: "Any trip over GBP 2,000 per person", code: "GRANDEGG" },
  },
]

/* ── Confetti particle ── */
function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    if (!active || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number; y: number; w: number; h: number
      color: string; vx: number; vy: number; rot: number; vr: number
    }> = []

    const colors = ["#C8102E", "#E8B4B8", "#B8D4E8", "#D4E8B8", "#E8D4B8", "#D4B8E8", "#FFD700", "#fff"]
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.5,
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.2,
      })
    }

    let frame = 0
    const maxFrames = 300

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        p.vy += 0.05

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - frame / maxFrames)
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }

      if (frame < maxFrames) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [active])

  if (!active) return null
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[100]"
    />
  )
}

/* ── SVG Egg shape with pattern ── */
function EggSvg({ color, pattern, size = 48, found }: { color: string; pattern: string; size?: number; found?: boolean }) {
  const patternId = `pat-${pattern}-${color.replace("#", "")}`
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 40 52" className={cn("drop-shadow-lg transition-transform", found && "scale-110")}>
      <defs>
        {pattern === "dots" && (
          <pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill={color} />
            <circle cx="4" cy="4" r="1.5" fill="rgba(255,255,255,0.5)" />
          </pattern>
        )}
        {pattern === "stripes" && (
          <pattern id={patternId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill={color} />
            <rect width="3" height="6" fill="rgba(255,255,255,0.3)" />
          </pattern>
        )}
        {pattern === "zigzag" && (
          <pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill={color} />
            <path d="M0 5 L5 0 L10 5 L5 10Z" fill="rgba(255,255,255,0.25)" />
          </pattern>
        )}
        {pattern === "waves" && (
          <pattern id={patternId} width="12" height="6" patternUnits="userSpaceOnUse">
            <rect width="12" height="6" fill={color} />
            <path d="M0 3 Q3 0 6 3 Q9 6 12 3" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          </pattern>
        )}
        {pattern === "stars" && (
          <pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill={color} />
            <text x="5" y="8" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.4)">*</text>
          </pattern>
        )}
        {pattern === "hearts" && (
          <pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill={color} />
            <circle cx="3.5" cy="4" r="1.5" fill="rgba(255,255,255,0.3)" />
            <circle cx="6.5" cy="4" r="1.5" fill="rgba(255,255,255,0.3)" />
            <path d="M2 5 L5 8 L8 5" fill="rgba(255,255,255,0.3)" />
          </pattern>
        )}
      </defs>
      {/* Egg shape */}
      <path
        d="M20 2 C10 2 2 16 2 30 C2 42 10 50 20 50 C30 50 38 42 38 30 C38 16 30 2 20 2Z"
        fill={`url(#${patternId})`}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1"
      />
      {/* Shine highlight */}
      <ellipse cx="14" cy="16" rx="4" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(-15 14 16)" />
    </svg>
  )
}

/* ── Hidden egg spot (wobbles to hint) ── */
function HiddenEgg({
  egg,
  found,
  hintActive,
  onFind,
}: {
  egg: EasterEgg
  found: boolean
  hintActive: boolean
  onFind: (egg: EasterEgg) => void
}) {
  const [wobble, setWobble] = useState(false)

  useEffect(() => {
    if (found || hintActive) return
    // Random wobble to give subtle hints
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setWobble(true)
        setTimeout(() => setWobble(false), 600)
      }
    }, 3000 + Math.random() * 4000)
    return () => clearInterval(interval)
  }, [found, hintActive])

  if (found) return null

  return (
    <button
      onClick={() => onFind(egg)}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300",
        "hover:scale-125 active:scale-95",
        wobble && "animate-[wobble_0.6s_ease-in-out]",
        hintActive && "animate-pulse ring-4 ring-yellow-400/60 rounded-full",
        // Semi-hidden: slightly transparent until hover
        "opacity-60 hover:opacity-100"
      )}
      style={{ left: `${egg.x}%`, top: `${egg.y}%` }}
      aria-label={`Find Easter egg ${egg.id}`}
    >
      <EggSvg color={egg.color} pattern={egg.pattern} size={36} />
    </button>
  )
}

/* ── Prize reveal modal ── */
function PrizeModal({
  egg,
  onClose,
}: {
  egg: EasterEgg | null
  onClose: () => void
}) {
  if (!egg) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-sm animate-[bounceIn_0.5s_ease-out] rounded-2xl bg-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
          <EggSvg color={egg.color} pattern={egg.pattern} size={56} found />
        </div>

        <p className="mb-1 text-sm font-medium uppercase tracking-wider text-primary/70">
          You found an egg!
        </p>
        <h3 className="mb-2 text-xl font-bold text-gray-900">
          {egg.prize.title}
        </h3>
        <div className="mb-3 inline-block rounded-full bg-primary px-4 py-1.5 text-lg font-bold text-white">
          {egg.prize.discount}
        </div>
        <p className="mb-4 text-sm text-gray-600">
          {egg.prize.description}
        </p>

        <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-3">
          <p className="text-xs text-gray-500">Your promo code</p>
          <p className="font-mono text-lg font-bold tracking-widest text-primary">
            {egg.prize.code}
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-hover"
        >
          Keep Hunting
        </button>
      </div>
    </div>
  )
}

/* ── Completion overlay ── */
function CompletionOverlay({ onReset }: { onReset: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md animate-[bounceIn_0.5s_ease-out] rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
          <Sparkles className="h-8 w-8 text-yellow-500" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          You Found All 6 Eggs!
        </h2>
        <p className="mb-6 text-gray-600">
          Amazing work, egg hunter! All your discount codes have been revealed. 
          Use them before April 30th to save on your next Explore adventure.
        </p>

        <div className="mb-6 grid grid-cols-2 gap-2">
          {EGGS.map((egg) => (
            <div key={egg.id} className="rounded-lg bg-gray-50 p-2 text-center">
              <p className="text-xs font-medium text-gray-500">{egg.prize.title}</p>
              <p className="font-mono text-sm font-bold text-primary">{egg.prize.code}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again
          </button>
          <a
            href="/offers"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-hover"
          >
            <Gift className="h-4 w-4" />
            View Offers
          </a>
        </div>
      </div>
    </div>
  )
}

/* ── Main Easter Egg Hunt ── */
export default function EasterEggHunt() {
  const [foundEggs, setFoundEggs] = useState<Set<number>>(new Set())
  const [activeEgg, setActiveEgg] = useState<EasterEgg | null>(null)
  const [showCompletion, setShowCompletion] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [hintActive, setHintActive] = useState(false)
  const [soundOn, setSoundOn] = useState(true)

  const handleFind = useCallback((egg: EasterEgg) => {
    if (foundEggs.has(egg.id)) return
    const next = new Set(foundEggs)
    next.add(egg.id)
    setFoundEggs(next)
    setActiveEgg(egg)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)

    // Check completion
    if (next.size === EGGS.length) {
      setTimeout(() => setShowCompletion(true), 1500)
    }
  }, [foundEggs])

  const handleReset = useCallback(() => {
    setFoundEggs(new Set())
    setActiveEgg(null)
    setShowCompletion(false)
    setShowConfetti(false)
  }, [])

  const handleHint = useCallback(() => {
    setHintActive(true)
    setTimeout(() => setHintActive(false), 2000)
  }, [])

  return (
    <div className="min-h-screen bg-[#F0F7E6]">
      <Confetti active={showConfetti} />

      {/* Header */}
      <header className="relative overflow-hidden bg-primary py-8 text-white lg:py-12">
        <div className="absolute inset-0 opacity-10">
          {/* Decorative background pattern */}
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="easter-bg" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="2" fill="currentColor" />
                <circle cx="0" cy="0" r="1.5" fill="currentColor" />
                <circle cx="60" cy="60" r="1.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#easter-bg)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-white/80">
            Limited Time
          </p>
          <h1 className="mb-3 font-heading text-3xl font-bold lg:text-5xl">
            Easter Egg Hunt
          </h1>
          <p className="mx-auto max-w-lg text-base text-white/90 lg:text-lg">
            Find all 6 hidden eggs in the spring meadow below to unlock exclusive travel discounts!
          </p>
        </div>
      </header>

      {/* Progress bar */}
      <div className="sticky top-0 z-30 border-b border-green-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {EGGS.map((egg) => (
                <div
                  key={egg.id}
                  className={cn(
                    "h-6 w-5 rounded-full border-2 transition-all duration-500",
                    foundEggs.has(egg.id)
                      ? "border-transparent scale-110"
                      : "border-gray-300 bg-gray-100"
                  )}
                  style={foundEggs.has(egg.id) ? { backgroundColor: egg.color } : undefined}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {foundEggs.size} / {EGGS.length} eggs found
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleHint}
              disabled={foundEggs.size === EGGS.length}
              className="flex items-center gap-1.5 rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-medium text-yellow-800 transition-colors hover:bg-yellow-200 disabled:opacity-50"
            >
              <MapPin className="h-3.5 w-3.5" />
              Hint
            </button>
            <button
              onClick={() => setSoundOn(!soundOn)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label={soundOn ? "Mute sounds" : "Enable sounds"}
            >
              {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Progress fill */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${(foundEggs.size / EGGS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Game area */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div
          className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 md:aspect-[2/1]"
          style={{
            backgroundImage: "url(/images/easter-meadow.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Darker overlay for egg visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />

          {/* Hidden eggs */}
          {EGGS.map((egg) => (
            <HiddenEgg
              key={egg.id}
              egg={egg}
              found={foundEggs.has(egg.id)}
              hintActive={hintActive && !foundEggs.has(egg.id)}
              onFind={handleFind}
            />
          ))}

          {/* Found egg markers */}
          {EGGS.filter((e) => foundEggs.has(e.id)).map((egg) => (
            <div
              key={`found-${egg.id}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 opacity-30"
              style={{ left: `${egg.x}%`, top: `${egg.y}%` }}
            >
              <EggSvg color={egg.color} pattern={egg.pattern} size={28} found />
            </div>
          ))}

          {/* Help text overlay */}
          {foundEggs.size === 0 && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-center">
              <p className="text-sm font-medium text-white">
                Tap or click on the hidden eggs to reveal your prizes
              </p>
            </div>
          )}
        </div>

        {/* Found prizes list */}
        {foundEggs.size > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Your Prizes ({foundEggs.size})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {EGGS.filter((e) => foundEggs.has(e.id)).map((egg) => (
                <div
                  key={egg.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <EggSvg color={egg.color} pattern={egg.pattern} size={32} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{egg.prize.title}</p>
                    <p className="text-xs text-gray-500">{egg.prize.description}</p>
                    <p className="mt-1 font-mono text-xs font-bold text-primary">{egg.prize.code}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* T&C */}
        <p className="mt-8 text-center text-xs text-gray-400">
          {"Promo codes are for demonstration purposes only. Offers subject to availability. Cannot be combined with other promotions."}
        </p>
      </main>

      {/* Modals */}
      <PrizeModal egg={activeEgg} onClose={() => setActiveEgg(null)} />
      {showCompletion && <CompletionOverlay onReset={handleReset} />}

      {/* Custom keyframes */}
      <style jsx global>{`
        @keyframes wobble {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          25% { transform: translate(-50%, -50%) rotate(-8deg); }
          50% { transform: translate(-50%, -50%) rotate(8deg); }
          75% { transform: translate(-50%, -50%) rotate(-4deg); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
