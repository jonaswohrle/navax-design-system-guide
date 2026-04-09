import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Share2 } from "lucide-react"
import type { HartmannAboutCard } from "@/lib/sitecore"

interface HartmannAboutProps {
  cards: HartmannAboutCard[]
}

export function HartmannAbout({ cards }: HartmannAboutProps) {
  return (
    <section className="bg-secondary py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-10 text-center text-[22px] font-bold text-foreground lg:text-[28px]">
          {"\u00DCber HARTMANN"}
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card.id} className="group flex flex-col overflow-hidden rounded-sm bg-white shadow-sm transition-shadow hover:shadow-md">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={card.imageUrl} alt={card.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-3 py-1 text-[10px] font-semibold text-white">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    {card.label === "Unternehmensseite" ? "Mehr erfahren" : card.label}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-3 text-[16px] font-bold text-foreground">{card.title}</h3>
                <p className="mb-4 flex-1 text-[12px] leading-[1.7] text-muted-foreground">{card.description}</p>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <Link href={card.linkUrl} className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary transition-colors hover:text-hover">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <button className="text-muted-foreground transition-colors hover:text-primary" aria-label="Teilen">
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
