import Image from "next/image"
import Link from "next/link"
import { blobUrl } from "@/lib/blob-image-urls"
import type { PromoCardFields } from "@/lib/contentful"

const FALLBACK_PROMOS: PromoCardFields[] = [
  { title: "NEW trips for 2026", subtitle: "Discover new small group tours", imageUrl: "/images/explore/promo-new-trips.jpg", linkUrl: "/destinations", order: 1 },
  { title: "Spotlight on South America", subtitle: "Join our experts and discover more", imageUrl: "/images/explore/promo-south-america.jpg", linkUrl: "/destinations", order: 2 },
  { title: "Find your perfect Micro-retirement", subtitle: "Take our quiz", imageUrl: "/images/explore/promo-micro-retirement.jpg", linkUrl: "/experiences", order: 3 },
  { title: "Polar offers", subtitle: "Incredible savings on Polar voyages", imageUrl: "/images/explore/promo-polar.jpg", linkUrl: "/offers", order: 4 },
]

interface PromoGridProps {
  promos?: PromoCardFields[]
}

export function PromoGrid({ promos }: PromoGridProps) {
  const items = promos && promos.length > 0 ? promos : FALLBACK_PROMOS

  return (
    <section className="bg-background py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((promo) => (
            <Link
              key={promo.title}
              href={promo.linkUrl || "/destinations"}
              className="group relative block overflow-hidden rounded-xl"
            >
              <div className="relative aspect-[4/3]">
                {(() => {
                  const promoSrc = blobUrl(promo.imageUrl || "/images/explore/hero-mountains.jpg")
                  const promoIsExternal = promoSrc.startsWith("http") && !promoSrc.includes("blob.vercel-storage.com")
                  return promoIsExternal ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={promoSrc}
                      alt={promo.title}
                      className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                    />
                  ) : (
                    <Image
                      src={promoSrc}
                      alt={promo.title}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  )
                })()}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="mb-1 font-heading text-base font-bold text-white lg:text-lg">
                  {promo.title}
                </h3>
                {promo.subtitle && (
                  <p className="text-sm text-white/80">{promo.subtitle}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
