import type { HartmannIntroSection } from "@/lib/sitecore"

interface HartmannIntroProps {
  intro: HartmannIntroSection
}

export function HartmannIntro({ intro }: HartmannIntroProps) {
  return (
    <section className="bg-background py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-heading text-2xl font-bold text-foreground lg:text-3xl text-balance">
            {intro.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
            {intro.description}
          </p>
        </div>
      </div>
    </section>
  )
}
