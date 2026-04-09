import Image from "next/image"
import type { HartmannHero as HartmannHeroType } from "@/lib/sitecore"

interface HartmannHeroProps {
  hero: HartmannHeroType
}

export function HartmannHero({ hero }: HartmannHeroProps) {
  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-center">
          {/* Text content */}
          <div className="relative z-10 flex-1 px-6 py-12 lg:px-12 lg:py-20">
            <h1 className="mb-4 font-heading text-3xl font-bold text-primary-foreground lg:text-5xl xl:text-6xl text-balance">
              {hero.title}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-primary-foreground/80 lg:text-base">
              {hero.subtitle}
            </p>
          </div>

          {/* Hero image */}
          <div className="relative flex-1">
            <div className="relative aspect-[16/9] lg:aspect-auto lg:h-[420px] xl:h-[480px]">
              <Image
                src={hero.backgroundImageUrl}
                alt="HARTMANN - Hilft. Pflegt. Schutzt."
                fill
                className="object-cover object-right"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
