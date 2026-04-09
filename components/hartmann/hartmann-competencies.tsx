import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { HartmannCompetency } from "@/lib/sitecore"

interface HartmannCompetenciesProps {
  competencies: HartmannCompetency[]
}

export function HartmannCompetencies({ competencies }: HartmannCompetenciesProps) {
  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-2 text-center text-[22px] font-bold text-[#1a1a2e] lg:text-[28px]">
          Unsere Kompetenz
        </h2>
        <p className="mx-auto mb-10 max-w-[700px] text-center text-[13px] leading-[1.7] text-[#555]">
          Vertrauen und Kompetenz von HARTMANN machen uns einzigartig. Darauf k&ouml;nnen Sie sich verlassen: Wir sind da, wenn Sie uns brauchen.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {competencies.map((comp) => (
            <div
              key={comp.id}
              className="group overflow-hidden rounded-sm bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={comp.imageUrl}
                  alt={comp.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Academy label - small blue tag above title */}
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-sm bg-[#002F6C] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    {comp.label}
                  </span>
                </div>

                <h3 className="mb-2 text-[16px] font-bold text-[#1a1a2e]">
                  {comp.title}
                </h3>

                <p className="mb-4 text-[12px] leading-[1.7] text-[#555]">
                  {comp.description}
                </p>

                <Link
                  href={comp.linkUrl}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#002F6C] transition-colors hover:text-[#001d44]"
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
