import Image from "next/image"
import Link from "next/link"
import type { HartmannBacillolPromo as HartmannBacillolPromoType } from "@/lib/sitecore"

interface HartmannBacillolPromoProps {
  promo: HartmannBacillolPromoType
}

export function HartmannBacillolPromo({ promo }: HartmannBacillolPromoProps) {
  return (
    <section className="bg-[#3a3a3a]">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          {/* Text content - left side */}
          <div className="flex flex-1 flex-col justify-center px-6 py-10 lg:px-14 lg:py-16">
            <h2 className="mb-1 text-[22px] font-bold text-white lg:text-[26px]">
              {promo.title}
            </h2>
            <p className="mb-5 text-[13px] font-semibold text-[#7ec8e3]">
              {promo.subtitle}
            </p>
            <p className="mb-6 text-[12px] leading-[1.8] text-white/75">
              {promo.description}
            </p>
            <div>
              <Link
                href={promo.linkUrl}
                className="inline-block rounded-sm border-2 border-white px-6 py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-white hover:text-[#3a3a3a]"
              >
                Jetzt entdecken
              </Link>
            </div>
          </div>

          {/* Product image - right side with NEU badge */}
          <div className="relative flex flex-1 items-center justify-center px-6 py-10 lg:py-0">
            <div className="relative">
              <Image
                src={promo.imageUrl}
                alt={promo.title}
                width={400}
                height={300}
                className="h-auto max-h-[320px] w-auto object-contain"
              />
              {/* "100" sustainability badge */}
              <div className="absolute -right-2 -top-2 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#4CAF50] bg-transparent">
                <span className="text-[18px] font-bold text-[#4CAF50]">100</span>
              </div>
              {/* NEU label */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <span className="inline-block rounded-sm bg-[#c8102e] px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  NEU
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
