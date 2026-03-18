import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import {
  getExperienceTypes,
  getTripListings,
  getTrustPillars,
  getReviewItems,
} from "@/lib/contentful"
import { TripCard } from "@/components/explore/trip-card"
import { TrustStrip } from "@/components/explore/trust-strip"
import { ReviewCarousel } from "@/components/explore/review-carousel"

export const metadata: Metadata = {
  title: "Explore Holiday Experiences - Explore",
  description:
    "Discover the different ways to explore with us. From classic discovery tours to walking, cycling, wildlife, polar expeditions and family adventures.",
}

const FALLBACK_EXPERIENCES = [
  { name: "Discovery", description: "Our classic small group tours, exploring the highlights and hidden gems of incredible destinations.", imageUrl: "/images/explore/exp-discovery.jpg", slug: "discovery", order: 1 },
  { name: "Wildlife", description: "Get up close with the world's most incredible wildlife in their natural habitats.", imageUrl: "/images/explore/exp-wildlife.jpg", slug: "wildlife", order: 2 },
  { name: "Walking & Trekking", description: "Lace up your boots and discover stunning trails, from gentle coastal walks to challenging mountain treks.", imageUrl: "/images/explore/exp-walking.jpg", slug: "walking-trekking", order: 3 },
  { name: "Cycling", description: "Pedal through stunning landscapes on two wheels, from gentle rides to challenging routes.", imageUrl: "/images/explore/exp-cycling.jpg", slug: "cycling", order: 4 },
  { name: "Family", description: "Adventures designed for families, with activities and experiences the whole family will love.", imageUrl: "/images/explore/exp-family.jpg", slug: "family", order: 5 },
  { name: "Polar", description: "Journey to the ends of the earth with expedition voyages to the Arctic and Antarctic.", imageUrl: "/images/explore/exp-polar.jpg", slug: "polar", order: 6 },
  { name: "Boat Journeys", description: "Explore coastlines, rivers and waterways aboard traditional boats and expedition vessels.", imageUrl: "/images/explore/exp-boat.jpg", slug: "boat-journeys", order: 7 },
  { name: "Explore Upgraded", description: "Premium small group tours with enhanced accommodation, exclusive experiences and extra touches.", imageUrl: "/images/explore/exp-upgraded.jpg", slug: "upgraded", order: 8 },
]

const FALLBACK_TRIPS = [
  { title: "Japan In Depth - Footsteps of the Shogun", destination: "Japan", tripType: "Discovery", duration: "12 Days", price: 4245, originalPrice: 4545, imageUrl: "/images/explore/trip-japan.jpg", badges: ["Discounted", "Best Seller"], tripCode: "JS", slug: "japan-in-depth", order: 1 },
  { title: "Amalfi Coast Walking - Agriturismo", destination: "Italy", tripType: "Walking", duration: "8 Days", price: 1495, imageUrl: "/images/explore/trip-amalfi.jpg", badges: ["Centre-based", "Best Seller"], tripCode: "NAW", slug: "amalfi-coast-walking", order: 2 },
  { title: "Cycle Cuba!", destination: "Cuba", tripType: "Cycling", duration: "15 Days", price: 2895, imageUrl: "/images/explore/trip-cuba.jpg", badges: ["Best Seller"], tripCode: "CCC", slug: "cycle-cuba", order: 4 },
]

export default async function ExperiencesPage() {
  const [experiences, trips, pillars, reviews] = await Promise.all([
    getExperienceTypes(),
    getTripListings(),
    getTrustPillars(),
    getReviewItems(),
  ])

  const expList = experiences?.length ? experiences : FALLBACK_EXPERIENCES
  const tripList = trips?.length ? trips : FALLBACK_TRIPS

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Page hero -- crimson red like the real Explore site */}
      <section className="bg-primary py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-4 font-heading text-4xl font-bold text-primary-foreground lg:text-5xl">
            Experiences
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-primary-foreground/80 lg:text-lg">
            {"There are so many ways to explore. Whether you want to trek through mountains, cycle through vineyards, watch wildlife in their natural habitats, or discover ancient cultures, we have the perfect adventure for you."}
          </p>
        </div>
      </section>

      {/* Ways to explore grid */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 font-heading text-2xl font-bold text-foreground lg:text-3xl">
            Ways to explore
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {expList.map((exp) => (
              <Link
                key={exp.name}
                href={`/experiences#${exp.slug || ""}`}
                className="group relative block overflow-hidden rounded-xl"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={exp.imageUrl || "/images/explore/hero-mountains.jpg"}
                    alt={exp.name}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="font-heading text-lg font-bold text-white">{exp.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed descriptions */}
      <section className="bg-secondary py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-10 text-center font-heading text-2xl font-bold text-foreground lg:text-3xl">
            Our trip types
          </h2>
          <div className="flex flex-col gap-8">
            {expList.map((exp) => (
              <div key={exp.name} id={exp.slug || ""} className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                  {exp.name}
                </h3>
                {exp.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular trips */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
              Popular trips
            </h2>
            <Link
              href="/destinations"
              className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-hover md:flex"
            >
              View all tours
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tripList.slice(0, 3).map((trip) => (
              <TripCard key={trip.title} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <TrustStrip pillars={pillars?.length ? pillars : undefined} />

      {/* Reviews */}
      <ReviewCarousel reviews={reviews?.length ? reviews : undefined} />
    </div>
  )
}
