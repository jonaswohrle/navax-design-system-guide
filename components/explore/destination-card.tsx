import Image from "next/image"
import Link from "next/link"
import { blobUrl } from "@/lib/blob-image-urls"
import type { DestinationRegionFields } from "@/lib/contentful"

interface DestinationCardProps {
  region: DestinationRegionFields
}

export function DestinationCard({ region }: DestinationCardProps) {
  return (
    <Link
      href={`/destinations/${region.slug || ""}`}
      className="group relative block overflow-hidden rounded-xl"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={blobUrl(region.imageUrl || "/images/explore/hero-mountains.jpg")}
          alt={region.name}
          fill
          unoptimized
          className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {region.tripCount && (
          <span className="absolute right-3 top-3 rounded-md bg-card/80 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
            {region.tripCount} trips
          </span>
        )}

        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="font-heading text-xl font-bold text-white">{region.name}</h3>
        </div>
      </div>
    </Link>
  )
}
