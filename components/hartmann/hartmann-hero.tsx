import Image from "next/image"
import type { HartmannHero as HartmannHeroType } from "@/lib/sitecore"

interface HartmannHeroProps {
  hero: HartmannHeroType
}

export function HartmannHero({ hero }: HartmannHeroProps) {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <div className="flex flex-1 flex-col justify-center px-6 py-10 lg:max-w-[480px] lg:py-16 lg:pr-12">
            <h1 className="mb-5 text-[28px] font-bold leading-tight text-[#1a1a2e] lg:text-[36px]">
              {hero.title}
            </h1>
            <p className="text-[14px] leading-[1.7] text-[#555]">
              {hero.subtitle}
            </p>
          </div>
          <div className="relative flex-1 lg:flex-[1.2]">
            <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[380px]">
              <Image
                src={hero.backgroundImageUrl}
                alt="HARTMANN - Hilft. Pflegt. Sch&uuml;tzt."
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
