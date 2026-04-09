import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { HartmannCompetency } from "@/lib/sitecore"

interface HartmannCompetenciesProps {
  competencies: HartmannCompetency[]
}

export function HartmannCompetencies({ competencies }: HartmannCompetenciesProps) {
  return (
    <section className="bg-background py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-3 text-center font-heading text-2xl font-bold text-foreground lg:text-3xl">
          Unsere Kompetenz
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground">
          Vertrauen und Kompetenz von HARTMANN machen uns einzigartig. Darauf konnen Sie sich verlassen: Wir sind da, wenn Sie uns brauchen.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {competencies.map((comp) => (
            <div
              key={comp.id}
              className="group overflow-hidden rounded-md border border-border bg-background transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={comp.imageUrl}
                  alt={comp.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-1 font-heading text-lg font-bold text-foreground">
                  {comp.title}
                </h3>
                <span className="mb-3 inline-block rounded-sm bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {comp.label}
                </span>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  {comp.description}
                </p>
                <Link
                  href={comp.linkUrl}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-hover"
                >
                  Mehr erfahren
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
