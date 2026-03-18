import Link from "next/link"
import {
  getExploreHero,
  getPromoBanner,
  getTrustPillars,
  getPromoCards,
  getTripListings,
  getReviewItems,
  getFlexPolicy,
  getBlogPosts,
} from "@/lib/contentful"
import { SiteHeader } from "@/components/explore/site-header"
import { SiteFooter } from "@/components/explore/site-footer"
import { HeroSearch } from "@/components/explore/hero-search"
import { TrustStrip } from "@/components/explore/trust-strip"
import { PromoGrid } from "@/components/explore/promo-grid"
import { ReviewCarousel } from "@/components/explore/review-carousel"
import { TripCard } from "@/components/explore/trip-card"
import { FlexBanner } from "@/components/explore/flex-banner"
import { AiCtaBanner } from "@/components/explore/ai-cta-banner"
import { ContentCard } from "@/components/explore/content-card"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

/* ------------------------------------------------------------------ */
/*  Fallback data                                                      */
/* ------------------------------------------------------------------ */
const FALLBACK_HERO = {
  title: "Explore!",
  subtitle: "Small group adventures to inspire the soul",
  ctaText: "Let's go!",
  ctaLink: "/destinations",
  backgroundImageUrl: "/images/explore/hero-mountains.jpg",
}

const FALLBACK_TRIPS = [
  { title: "Japan In Depth - Footsteps of the Shogun", destination: "Japan", tripType: "Discovery", duration: "12 Days", price: 4245, originalPrice: 4545, imageUrl: "/images/explore/trip-japan.jpg", badges: ["Discounted", "Best Seller"], tripCode: "JS", slug: "japan-in-depth", order: 1 },
  { title: "Amalfi Coast Walking - Agriturismo", destination: "Italy", tripType: "Walking", duration: "8 Days", price: 1495, imageUrl: "/images/explore/trip-amalfi.jpg", badges: ["Centre-based", "Best Seller"], tripCode: "NAW", slug: "amalfi-coast-walking", order: 2 },
  { title: "Adventures in Patagonia", destination: "Argentina & Chile", tripType: "Discovery", duration: "14 Days", price: 5065, imageUrl: "/images/explore/trip-patagonia.jpg", badges: ["Best Seller"], tripCode: "PA", slug: "adventures-in-patagonia", order: 3 },
  { title: "Cycle Cuba!", destination: "Cuba", tripType: "Cycling", duration: "15 Days", price: 2895, imageUrl: "/images/explore/trip-cuba.jpg", badges: ["Best Seller"], tripCode: "CCC", slug: "cycle-cuba", order: 4 },
  { title: "South Africa & Eswatini", destination: "South Africa", tripType: "Wildlife", duration: "10 Days", price: 1395, originalPrice: 1695, imageUrl: "/images/explore/trip-south-africa.jpg", badges: ["Discounted", "Best Seller"], tripCode: "ZK", slug: "south-africa-eswatini", order: 5 },
]

const FALLBACK_BLOG = [
  { title: "Walking the Great Wall of China: Everything you need to know", excerpt: "Our guide to walking the Great Wall covers the best sections to visit and how to make the most of this incredible experience.", imageUrl: "/images/explore/blog-great-wall.jpg", publishDate: "2026-03-10", category: "Adventure Travel", slug: "walking-great-wall-china", order: 1 },
  { title: "Why cycling holidays are more popular than ever", excerpt: "From the vineyards of France to the rice paddies of Vietnam, discover why cycling tours are the fastest growing holiday trend.", imageUrl: "/images/explore/blog-cycling.jpg", publishDate: "2026-03-05", category: "Cycling", slug: "cycling-holidays-popular", order: 2 },
  { title: "Your first trip to China: A complete guide", excerpt: "Planning your first trip to China? Everything you need to know about visas, culture, food and the best places to visit.", imageUrl: "/images/explore/blog-china-first.jpg", publishDate: "2026-02-28", category: "Adventure Travel", slug: "first-trip-china-guide", order: 3 },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default async function Page() {
  const [hero, promoBanner, pillars, promos, trips, reviews, flex, blog] =
    await Promise.all([
      getExploreHero(),
      getPromoBanner(),
      getTrustPillars(),
      getPromoCards(),
      getTripListings(),
      getReviewItems(),
      getFlexPolicy(),
      getBlogPosts(),
    ])

  const h = hero ?? FALLBACK_HERO
  const tripList = trips?.length ? trips : FALLBACK_TRIPS
  const blogList = blog?.length ? blog : FALLBACK_BLOG

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <SiteHeader promoBanner={promoBanner} />

      {/* Hero with search */}
      <HeroSearch
        title={h.title}
        subtitle={h.subtitle}
        ctaText={h.ctaText}
        backgroundImageUrl={h.backgroundImageUrl}
      />

      {/* Trust strip */}
      <TrustStrip pillars={pillars?.length ? pillars : undefined} />

      {/* Promo grid */}
      <PromoGrid promos={promos?.length ? promos : undefined} />

      {/* Brand story */}
      <section className="bg-background py-12 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground lg:text-3xl text-balance">
            The adventure travel experts
          </h2>
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
            Over 40 years of adventure
          </p>
          <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
            {"We've been taking small groups on adventure holidays for over 40 years. With more than 500 tours across over 100 countries, we offer an incredible range of trips -- from classic discovery tours to walking, cycling, wildlife, polar expeditions and family adventures. Our average group size of just 11 means you'll travel with like-minded adventurers, guided by expert leaders who bring every destination to life. Whether you're a solo traveller, couple, or group of friends, there's an Explore trip waiting for you."}
          </p>
        </div>
      </section>

      {/* Reviews carousel */}
      <ReviewCarousel reviews={reviews?.length ? reviews : undefined} />

      {/* Recommended trips */}
      <section className="bg-secondary py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
              Recommended trips for you
            </h2>
            <Link
              href="/destinations"
              className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-hover md:flex"
            >
              Search our tours
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {tripList.slice(0, 5).map((trip) => (
              <TripCard key={trip.title} trip={trip} />
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Button asChild variant="outline">
              <Link href="/destinations">
                Search our tours
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AI/Tech CTA */}
      <AiCtaBanner />

      {/* Blog inspiration */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
              Travel inspiration
            </h2>
            <Link
              href="/blog"
              className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-hover md:flex"
            >
              View all articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogList.slice(0, 3).map((post) => (
              <ContentCard key={post.title} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Flex banner */}
      <FlexBanner policy={flex} />

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
