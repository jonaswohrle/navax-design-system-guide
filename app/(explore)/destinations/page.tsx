import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  getDestinationRegions,
  getTripListings,
  getTrustPillars,
  getBlogPosts,
} from "@/lib/contentful"
import { DestinationCard } from "@/components/explore/destination-card"
import { TripCard } from "@/components/explore/trip-card"
import { TrustStrip } from "@/components/explore/trust-strip"
import { ContentCard } from "@/components/explore/content-card"
import { DestinationFilters } from "@/components/explore/destination-filters"

export const metadata: Metadata = {
  title: "Adventure Holiday Destinations | Where To Go On Your Next Tour - Explore",
  description:
    "Find your perfect adventure holiday destination. Explore offers small group tours to over 100 countries across Europe, Asia, Africa, the Americas and beyond.",
}

const FALLBACK_REGIONS = [
  { name: "Europe", imageUrl: "/images/explore/dest-europe.jpg", slug: "europe", tripCount: 95, order: 1 },
  { name: "Asia", imageUrl: "/images/explore/dest-asia.jpg", slug: "asia", tripCount: 78, order: 2 },
  { name: "Africa", imageUrl: "/images/explore/dest-africa.jpg", slug: "africa", tripCount: 42, order: 3 },
  { name: "South America", imageUrl: "/images/explore/dest-south-america.jpg", slug: "south-america", tripCount: 35, order: 4 },
  { name: "Central America", imageUrl: "/images/explore/dest-central-america.jpg", slug: "central-america", tripCount: 18, order: 5 },
  { name: "Middle East", imageUrl: "/images/explore/dest-middle-east.jpg", slug: "middle-east", tripCount: 15, order: 6 },
  { name: "Polar Regions", imageUrl: "/images/explore/dest-polar.jpg", slug: "polar", tripCount: 12, order: 7 },
  { name: "North America", imageUrl: "/images/explore/dest-north-america.jpg", slug: "north-america", tripCount: 10, order: 8 },
  { name: "Caribbean", imageUrl: "/images/explore/dest-caribbean.jpg", slug: "caribbean", tripCount: 8, order: 9 },
  { name: "Australasia", imageUrl: "/images/explore/dest-australasia.jpg", slug: "australasia", tripCount: 14, order: 10 },
]

const TOP_DESTINATIONS = [
  "India", "Portugal", "Japan", "Italy", "Vietnam",
  "Spain", "Morocco", "Sri Lanka", "Turkey", "Costa Rica",
]

const FALLBACK_TRIPS = [
  { title: "Japan In Depth - Footsteps of the Shogun", destination: "Japan", tripType: "Discovery", duration: "12 Days", price: 4245, originalPrice: 4545, imageUrl: "/images/explore/trip-japan.jpg", badges: ["Discounted", "Best Seller"], tripCode: "JS", slug: "japan-in-depth", order: 1 },
  { title: "Amalfi Coast Walking - Agriturismo", destination: "Italy", tripType: "Walking", duration: "8 Days", price: 1495, imageUrl: "/images/explore/trip-amalfi.jpg", badges: ["Centre-based", "Best Seller"], tripCode: "NAW", slug: "amalfi-coast-walking", order: 2 },
  { title: "Adventures in Patagonia", destination: "Argentina & Chile", tripType: "Discovery", duration: "14 Days", price: 5065, imageUrl: "/images/explore/trip-patagonia.jpg", badges: ["Best Seller"], tripCode: "PA", slug: "adventures-in-patagonia", order: 3 },
  { title: "South Africa & Eswatini", destination: "South Africa", tripType: "Wildlife", duration: "10 Days", price: 1395, originalPrice: 1695, imageUrl: "/images/explore/trip-south-africa.jpg", badges: ["Discounted", "Best Seller"], tripCode: "ZK", slug: "south-africa-eswatini", order: 5 },
]

const FALLBACK_BLOG = [
  { title: "Walking the Great Wall of China: Everything you need to know", excerpt: "Our guide to walking the Great Wall covers the best sections to visit.", imageUrl: "/images/explore/blog-great-wall.jpg", publishDate: "2026-03-10", category: "Adventure Travel", slug: "walking-great-wall-china", order: 1 },
  { title: "Why cycling holidays are more popular than ever", excerpt: "Discover why cycling tours are the fastest growing holiday trend.", imageUrl: "/images/explore/blog-cycling.jpg", publishDate: "2026-03-05", category: "Cycling", slug: "cycling-holidays-popular", order: 2 },
]

interface DestinationsPageProps {
  searchParams: Promise<{ region?: string; type?: string; date?: string }>
}

export default async function DestinationsPage({ searchParams }: DestinationsPageProps) {
  const sp = await searchParams
  const [regions, trips, pillars, blog] = await Promise.all([
    getDestinationRegions(),
    getTripListings(),
    getTrustPillars(),
    getBlogPosts(),
  ])

  const regionList = regions?.length ? regions : FALLBACK_REGIONS
  const allTrips = trips?.length ? trips : FALLBACK_TRIPS
  const blogList = blog?.length ? blog : FALLBACK_BLOG

  // Apply filters from hero search
  const activeRegion = sp.region || null
  const activeType = sp.type || null
  const activeDate = sp.date || null

  const filteredTrips = allTrips.filter((trip) => {
    if (activeRegion) {
      const regionName = regionList.find((r) => r.slug === activeRegion)?.name?.toLowerCase()
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

  const tripsToShow = filteredTrips.length > 0 ? filteredTrips : allTrips
  const hasFilters = activeRegion || activeType || activeDate

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Page hero */}
      <section className="bg-secondary py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-4 font-heading text-4xl font-bold text-foreground lg:text-5xl">
            Destinations
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            {"We offer small group adventure holidays to over 100 countries worldwide. Whether you're looking for cultural discovery in Asia, wildlife encounters in Africa, or trekking in South America, we've got the perfect trip for you."}
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

      {/* Region grid */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 font-heading text-2xl font-bold text-foreground lg:text-3xl">
            Where will your next tour take you?
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {regionList.map((region) => (
              <DestinationCard key={region.name} region={region} />
            ))}
          </div>
        </div>
      </section>

      {/* Top 10 destinations */}
      <section className="bg-secondary py-10">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="mb-6 text-center font-heading text-lg font-semibold text-foreground">
            Top 10 destinations
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {TOP_DESTINATIONS.map((dest) => (
              <Link
                key={dest}
                href="/destinations"
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {dest}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular trips */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
              {hasFilters ? "Matching adventure tours" : "Popular adventure tours"}
            </h2>
            {!hasFilters && (
              <Link
                href="/destinations"
                className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-hover md:flex"
              >
                View all tours
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tripsToShow.slice(0, 4).map((trip) => (
              <TripCard key={trip.title} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <TrustStrip pillars={pillars?.length ? pillars : undefined} />

      {/* Blog inspiration */}
      {blogList.length > 0 && (
        <section className="bg-background py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-8 font-heading text-2xl font-bold text-foreground lg:text-3xl">
              More adventure holiday destination inspiration
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {blogList.slice(0, 4).map((post) => (
                <ContentCard key={post.title} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
