import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WishlistButton } from "./wishlist-button"
import { blobUrl } from "@/lib/blob-image-urls"

interface TripListing {
  title: string
  destination?: string
  tripType?: string
  duration?: string
  price?: number
  originalPrice?: number
  imageUrl?: string
  badges?: string[]
  tripCode?: string
  slug?: string
  order?: number
}

const BADGE_STYLES: Record<string, string> = {
  "Bestseller": "bg-primary text-primary-foreground",
  "Rabatt": "bg-explore-yellow text-explore-yellow-foreground",
  "Preisgarantie": "bg-sky-600 text-white",
  "Neu": "bg-emerald-600 text-white",
  "0% MwSt.": "bg-primary text-primary-foreground",
}

interface TripCardProps {
  trip: TripListing
}

export function TripCard({ trip }: TripCardProps) {
  const hasDiscount = trip.originalPrice && trip.originalPrice > (trip.price || 0)
  const isHighPrice = (trip.price || 0) >= 1000

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={blobUrl(trip.imageUrl || "/images/explore/eon-strom.jpg")}
          alt={trip.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {trip.badges && trip.badges.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {trip.badges.map((badge) => (
              <span
                key={badge}
                className={`rounded-md px-2 py-0.5 text-xs font-semibold ${BADGE_STYLES[badge] || "bg-foreground/80 text-background"}`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <WishlistButton tourSlug={trip.slug || "tarif"} className="absolute right-3 top-3" />
      </div>

      <div className="flex flex-col gap-3 p-4">
        <h3 className="font-heading text-base font-semibold leading-tight text-foreground line-clamp-2">
          {trip.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {trip.destination && <span>{trip.destination}</span>}
          {trip.tripType && (
            <>
              <span className="text-border">{"/"}</span>
              <span>{trip.tripType}</span>
            </>
          )}
          {trip.tripCode && (
            <>
              <span className="text-border">{"/"}</span>
              <span className="font-mono text-[10px] uppercase">{trip.tripCode}</span>
            </>
          )}
        </div>

        {trip.duration && (
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {trip.duration}
          </div>
        )}

        <div className="border-t border-border pt-3">
          {hasDiscount ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground line-through">
                {"Vorher "}{trip.originalPrice?.toLocaleString("de-DE")}{isHighPrice ? " \u20AC" : " \u20AC/Monat"}
              </span>
              <span className="font-heading text-xl font-bold text-primary">
                {"Jetzt "}{(trip.price || 0).toLocaleString("de-DE")}{isHighPrice ? " \u20AC" : " \u20AC/Monat"}
              </span>
            </div>
          ) : trip.price && trip.price > 0 ? (
            <span className="font-heading text-xl font-bold text-foreground">
              {"Ab "}{trip.price.toLocaleString("de-DE")}{isHighPrice ? " \u20AC" : " \u20AC/Monat"}
            </span>
          ) : (
            <span className="text-sm font-medium text-foreground">Preis auf Anfrage</span>
          )}
          <p className="mt-1 text-[10px] text-muted-foreground">Zzgl. Grundpreis und Netzentgelte</p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
            <Link href={`/tours/${trip.slug || "tarif"}`}>
              Details
            </Link>
          </Button>
          <Button asChild size="sm" className="flex-1 bg-primary text-xs text-primary-foreground hover:bg-hover">
            <Link href={`/tours/${trip.slug || "tarif"}#dates`}>
              Jetzt wechseln
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
