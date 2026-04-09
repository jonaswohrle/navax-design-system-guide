import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HartmannBacillolPromo as HartmannBacillolPromoType } from "@/lib/sitecore"

interface HartmannBacillolPromoProps {
  promo: HartmannBacillolPromoType
}

export function HartmannBacillolPromo({ promo }: HartmannBacillolPromoProps) {
  return (
    <section className="bg-background py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-md border border-border bg-background lg:flex">
          {/* Image */}
          <div className="relative aspect-[16/9] lg:aspect-auto lg:w-1/2">
            <Image
              src={promo.imageUrl}
              alt={promo.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-center p-6 lg:p-10">
            <h2 className="mb-2 font-heading text-2xl font-bold text-foreground lg:text-3xl text-balance">
              {promo.title}
            </h2>
            <p className="mb-4 text-sm font-semibold text-primary">
              {promo.subtitle}
            </p>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              {promo.description}
            </p>
            <div>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-hover">
                <Link href={promo.linkUrl}>
                  Jetzt entdecken
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
