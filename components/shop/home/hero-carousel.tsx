"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Slide = {
  image: string
  align: "left" | "right"
  eyebrow: string
  title: string
  text: string
  cta: string
  href: string
  tone: "light" | "dark"
}

const slides: Slide[] = [
  {
    image: "/shop/hero/hero-beauty.png",
    align: "right",
    eyebrow: "Von euch empfohlen",
    title: "Deine Lieblinge für strahlende Haut",
    text: "Entdecke die beliebtesten Beauty-Produkte der Saison – jetzt neu im Sortiment.",
    cta: "Jetzt entdecken",
    href: "/c/make-up",
    tone: "dark",
  },
  {
    image: "/shop/hero/hero-summer.png",
    align: "left",
    eyebrow: "So geht Sommer",
    title: "Sommerküche, Garten & Picknick",
    text: "Alles für den perfekten Sommertag – von Grillhelfern bis Frischhaltedosen.",
    cta: "Jetzt entdecken",
    href: "/c/haushalt",
    tone: "dark",
  },
  {
    image: "/shop/hero/hero-baby.png",
    align: "right",
    eyebrow: "babywelt",
    title: "Hier dreht sich alles um die Familie",
    text: "Windeln, Pflege und Spielzeug – alles was dein Baby braucht, günstig bei ROSSMANN.",
    cta: "Zum babywelt Bereich",
    href: "/c/baby-spielzeug",
    tone: "dark",
  },
]

export function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const count = slides.length

  const go = useCallback((next: number) => {
    setIndex((prev) => (next + count) % count)
  }, [count])

  useEffect(() => {
    const timer = setInterval(() => setIndex((p) => (p + 1) % count), 6000)
    return () => clearInterval(timer)
  }, [count])

  return (
    <section aria-label="Aktionen" className="relative overflow-hidden bg-secondary">
      <div className="relative mx-auto max-w-[1280px]">
        <div className="relative h-[280px] sm:h-[360px] md:h-[440px]">
          {slides.map((slide, i) => (
            <div
              key={slide.title}
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                i === index ? "opacity-100" : "pointer-events-none opacity-0",
              )}
              aria-hidden={i !== index}
            >
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                priority={i === 0}
                sizes="1280px"
                className="object-cover"
              />
              {/* Readability scrim: fades the white background into the photo behind the text */}
              <div
                className={cn(
                  "absolute inset-0",
                  slide.align === "right"
                    ? "bg-gradient-to-l from-background from-25% via-background/80 via-55% to-transparent to-80%"
                    : "bg-gradient-to-r from-background from-25% via-background/80 via-55% to-transparent to-80%",
                )}
                aria-hidden
              />
              <div
                className={cn(
                  "absolute inset-y-0 flex w-full flex-col justify-center gap-2 p-6 sm:w-1/2 sm:p-10 md:p-14",
                  slide.align === "right" ? "right-0 items-start text-left" : "left-0 items-start text-left",
                )}
              >
                <div className="max-w-md">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary sm:text-sm">
                    {slide.eyebrow}
                  </span>
                  <h2 className="mt-2 text-pretty text-3xl font-extrabold leading-[1.1] text-foreground sm:text-4xl md:text-5xl">
                    {slide.title}
                  </h2>
                  <p className="mt-3 max-w-sm text-sm text-muted-foreground sm:text-base">{slide.text}</p>
                  <Link
                    href={slide.href}
                    className="mt-5 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-hover"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Vorherige Folie"
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground shadow-md hover:bg-card"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          aria-label="Nächste Folie"
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground shadow-md hover:bg-card"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              aria-label={`Zu Folie ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2.5 rounded-full transition-all",
                i === index ? "w-6 bg-primary" : "w-2.5 bg-card/80",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
