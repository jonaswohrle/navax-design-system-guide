import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { HartmannAboutCard } from "@/lib/sitecore"

interface HartmannAboutProps {
  cards: HartmannAboutCard[]
}

export function HartmannAbout({ cards }: HartmannAboutProps) {
  return (
    <section className="bg-background py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground lg:text-3xl">
          Uber HARTMANN
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group overflow-hidden rounded-md border border-border bg-background transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={card.imageUrl}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-1 font-heading text-lg font-bold text-foreground">
                  {card.title}
                </h3>
                <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-primary">
                  {card.label}
                </span>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
                <Link
                  href={card.linkUrl}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-hover"
                >
                  Mehr erfahren
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
