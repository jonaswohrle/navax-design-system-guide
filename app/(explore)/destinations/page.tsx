import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DestinationCard } from "@/components/explore/destination-card"
import { TripCard } from "@/components/explore/trip-card"
import { TrustStrip } from "@/components/explore/trust-strip"
import { ContentCard } from "@/components/explore/content-card"
import { DestinationFilters } from "@/components/explore/destination-filters"
import { getAllTours } from "@/lib/tour-data"

export const metadata: Metadata = {
  title: "Energieprodukte & Tarife | E.ON Energie",
  description:
    "Finden Sie den passenden Energietarif. E.ON bietet Ökostrom, Erdgas, Solar, Wärmepumpen, E-Mobilität und Smart Home Lösungen für Ihr Zuhause.",
}

const REGIONS = [
  { name: "Strom", imageUrl: "/images/explore/eon-strom.jpg", slug: "strom", tripCount: 3, order: 1 },
  { name: "Gas", imageUrl: "/images/explore/eon-gas.jpg", slug: "gas", tripCount: 2, order: 2 },
  { name: "Solar", imageUrl: "/images/explore/eon-solar.jpg", slug: "solar", tripCount: 1, order: 3 },
  { name: "Wärmepumpe", imageUrl: "/images/explore/eon-waermepumpe.jpg", slug: "waermepumpe", tripCount: 1, order: 4 },
  { name: "E-Mobilität", imageUrl: "/images/explore/eon-emobility.jpg", slug: "e-mobilitaet", tripCount: 1, order: 5 },
  { name: "Smart Home", imageUrl: "/images/explore/eon-smarthome.jpg", slug: "smart-home", tripCount: 1, order: 6 },
]

const TOP_CATEGORIES = [
  "Ökostrom", "Erdgas", "Solar", "Wärmepumpe", "Wallbox",
  "Smart Home", "E.ON Plus", "Biogas", "Autostrom", "Heizstrom",
]

const BLOG = [
  { title: "Stromverbrauch senken: 10 einfache Tipps", excerpt: "Mit diesen praktischen Tipps können Sie Ihren Stromverbrauch nachhaltig reduzieren.", imageUrl: "/images/explore/blog-energy-tips.jpg", publishDate: "2026-03-10", category: "Energieratgeber", slug: "stromverbrauch-senken-tipps", order: 1 },
  { title: "So funktioniert eine Wärmepumpe", excerpt: "Erfahren Sie, wie die Technologie funktioniert und ob sie für Ihr Zuhause geeignet ist.", imageUrl: "/images/explore/eon-waermepumpe.jpg", publishDate: "2026-03-05", category: "Heizen", slug: "waermepumpe-erklaert", order: 2 },
]

const ALL_TRIPS = getAllTours().map((tour, i) => ({
  title: tour.title,
  destination: tour.destination,
  tripType: tour.tripType,
  duration: tour.duration,
  price: tour.price,
  originalPrice: tour.originalPrice,
  imageUrl: tour.imageUrl,
  badges: [
    ...(tour.originalPrice ? ["Rabatt"] : []),
    ...(i < 6 ? ["Bestseller"] : []),
  ] as string[],
  tripCode: tour.tripCode,
  slug: tour.slug,
  order: i + 1,
}))

interface DestinationsPageProps {
  searchParams: Promise<{ region?: string; type?: string; date?: string }>
}

export default async function DestinationsPage({ searchParams }: DestinationsPageProps) {
  const sp = await searchParams

  const activeRegion = sp.region || null
  const activeType = sp.type || null
  const activeDate = sp.date || null

  const filteredTrips = ALL_TRIPS.filter((trip) => {
    if (activeRegion) {
      const regionName = REGIONS.find((r) => r.slug === activeRegion)?.name?.toLowerCase()
      if (regionName && trip.destination && !trip.destination.toLowerCase().includes(regionName)) {
        return false
      }
    }
    if (activeType && trip.tripType) {
      if (!trip.tripType.toLowerCase().includes(activeType.toLowerCase())) {
        return false
      }
    }
    return true
  })

  const tripsToShow = filteredTrips.length > 0 ? filteredTrips : ALL_TRIPS
  const hasFilters = activeRegion || activeType || activeDate

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="bg-primary py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-4 font-heading text-4xl font-bold text-primary-foreground lg:text-5xl">
            Energieprodukte & Tarife
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-primary-foreground/80 lg:text-lg">
            {"Entdecken Sie unsere vielfältigen Energielösungen für Ihr Zuhause. Von Ökostrom über Solar bis hin zu Wärmepumpen -- finden Sie den Tarif, der zu Ihnen passt."}
          </p>
        </div>
      </section>

      {/* Active filters */}
      {hasFilters && (
        <DestinationFilters
          region={activeRegion}
          type={activeType}
          date={activeDate}
          resultCount={filteredTrips.length}
        />
      )}

      {/* Category grid */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 font-heading text-2xl font-bold text-foreground lg:text-3xl">
            Welche Energielösung passt zu Ihnen?
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {REGIONS.map((region) => (
              <DestinationCard key={region.name} region={region} />
            ))}
          </div>
        </div>
      </section>

      {/* Top categories */}
      <section className="bg-secondary py-10">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="mb-6 text-center font-heading text-lg font-semibold text-foreground">
            Beliebte Kategorien
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {TOP_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href="/destinations"
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tariffs */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
              {hasFilters ? "Passende Tarife" : "Beliebte Tarife"}
            </h2>
            {!hasFilters && (
              <Link
                href="/destinations"
                className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-hover md:flex"
              >
                Alle Tarife ansehen
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tripsToShow.slice(0, 8).map((trip) => (
              <TripCard key={trip.title} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <TrustStrip />

      {/* Blog */}
      {BLOG.length > 0 && (
        <section className="bg-background py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-8 font-heading text-2xl font-bold text-foreground lg:text-3xl">
              Energieratgeber
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {BLOG.map((post) => (
                <ContentCard key={post.title} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
