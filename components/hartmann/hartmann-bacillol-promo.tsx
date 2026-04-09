import Image from "next/image"
import Link from "next/link"
import type { HartmannBacillolPromo as HartmannBacillolPromoType } from "@/lib/sitecore"

interface HartmannBacillolPromoProps {
  promo: HartmannBacillolPromoType
}

export function HartmannBacillolPromo({ promo }: HartmannBacillolPromoProps) {
  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <div className="flex flex-1 flex-col justify-center px-6 py-10 lg:px-14 lg:py-16">
            <h2 className="mb-1 text-[22px] font-bold text-white lg:text-[26px]">{promo.title}</h2>
            <p className="mb-5 text-[13px] font-semibold text-primary-foreground/70">{promo.subtitle}</p>
            <p className="mb-6 text-[12px] leading-[1.8] text-white/75">{promo.description}</p>
            <div>
              <Link href={promo.linkUrl} className="inline-block rounded-sm border-2 border-white px-6 py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-white hover:text-primary">
                Jetzt entdecken
              </Link>
            </div>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-6 py-10 lg:py-0">
            <div className="relative">
              <Image src={promo.imageUrl} alt={promo.title} width={400} height={300} className="h-auto max-h-[320px] w-auto object-contain" />
              <div className="absolute -right-2 -top-2 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-white/60 bg-transparent">
                <span className="text-[18px] font-bold text-white/80">100</span>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <span className="inline-block rounded-sm bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">NEU</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
