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
  getPersonalizedHeroes,
} from "@/lib/contentful"
import { SiteHeader } from "@/components/explore/site-header"
import { SiteFooter } from "@/components/explore/site-footer"
import { AuthProvider } from "@/lib/auth-context"
import { HeroSearch } from "@/components/explore/hero-search"
import { PersonalizedHero } from "@/components/explore/personalized-hero"
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
  title: "Energie neu denken",
  subtitle: "Strom, Gas & Solarlösungen für Ihr Zuhause",
  ctaText: "Tarif berechnen",
  ctaLink: "/destinations",
  backgroundImageUrl: "/images/explore/hero-energy.jpg",
}

const FALLBACK_TRIPS = [
  { title: "E.ON ÖkoStrom", destination: "Strom", tripType: "Ökostrom", duration: "12 Monate", price: 29, imageUrl: "/images/explore/trip-amalfi.jpg", badges: ["Bestseller"], tripCode: "OKO", slug: "oekostrom", order: 1 },
  { title: "E.ON ÖkoStrom Home & Drive", destination: "Strom & E-Auto", tripType: "Ökostrom", duration: "24 Monate", price: 34, originalPrice: 39, imageUrl: "/images/explore/trip-japan.jpg", badges: ["Rabatt", "Bestseller"], tripCode: "OHD", slug: "oekostrom-home-drive", order: 2 },
  { title: "E.ON Erdgas", destination: "Erdgas", tripType: "Gas", duration: "12 Monate", price: 8, imageUrl: "/images/explore/trip-amalfi.jpg", badges: ["Preisgarantie"], tripCode: "GAS", slug: "erdgas", order: 3 },
  { title: "E.ON Solar", destination: "Solaranlage", tripType: "Solar", duration: "Einmalig", price: 9990, imageUrl: "/images/explore/trip-south-africa.jpg", badges: ["0% MwSt."], tripCode: "SOL", slug: "solar", order: 4 },
  { title: "E.ON Home Comfort", destination: "Smart Home", tripType: "Energiemanagement", duration: "Monatlich", price: 12, imageUrl: "/images/explore/trip-patagonia.jpg", badges: ["Neu"], tripCode: "HC", slug: "home-comfort", order: 5 },
]

const FALLBACK_BLOG = [
  { title: "Stromverbrauch senken: 10 einfache Tipps", excerpt: "Mit diesen praktischen Tipps können Sie Ihren Stromverbrauch nachhaltig reduzieren und bares Geld sparen.", imageUrl: "/images/explore/blog-great-wall.jpg", publishDate: "2026-03-10", category: "Energieratgeber", slug: "stromverbrauch-senken-tipps", order: 1 },
  { title: "So funktioniert eine Wärmepumpe", excerpt: "Wärmepumpen sind die Zukunft des Heizens. Erfahren Sie, wie die Technologie funktioniert und ob sie für Ihr Zuhause geeignet ist.", imageUrl: "/images/explore/blog-cycling.jpg", publishDate: "2026-03-05", category: "Heizen", slug: "waermepumpe-erklaert", order: 2 },
  { title: "E-Auto laden: Was Sie wissen müssen", excerpt: "Alles rund um das Laden Ihres Elektroautos -- von der eigenen Wallbox bis zur öffentlichen Ladeinfrastruktur.", imageUrl: "/images/explore/blog-china-first.jpg", publishDate: "2026-02-28", category: "E-Mobilität", slug: "e-auto-laden-guide", order: 3 },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default async function Page() {
  const [hero, promoBanner, pillars, promos, trips, reviews, flex, blog, heroVariants] =
    await Promise.all([
      getExploreHero(),
      getPromoBanner(),
      getTrustPillars(),
      getPromoCards(),
      getTripListings(),
      getReviewItems(),
      getFlexPolicy(),
      getBlogPosts(),
      getPersonalizedHeroes(),
    ])

  const h = hero ?? FALLBACK_HERO
  const tripList = trips?.length ? trips : FALLBACK_TRIPS
  const blogList = blog?.length ? blog : FALLBACK_BLOG

  return (
    <AuthProvider>
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <SiteHeader promoBanner={promoBanner} />

      {/* Personalized hero -- selects variant based on visitor audience */}
      {heroVariants && heroVariants.length > 0 ? (
        <PersonalizedHero
          variants={heroVariants}
          fallbackImageUrl={h.backgroundImageUrl || "/images/explore/hero-energy.jpg"}
        />
      ) : (
        <HeroSearch backgroundImageUrl={h.backgroundImageUrl || "/images/explore/hero-energy.jpg"} />
      )}

      {/* Trust strip */}
      <TrustStrip pillars={pillars?.length ? pillars : undefined} />

      {/* Promo grid */}
      <PromoGrid promos={promos?.length ? promos : undefined} />

      {/* Brand story -- matching E.ON layout */}
      <section className="bg-secondary py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-2xl">
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground lg:text-4xl text-balance">
              Gemeinsam die Energiewende gestalten
            </h2>
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
              Europas größtes Energienetzwerk
            </p>
            <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
              E.ON ist einer der größten Energieversorger Europas und versorgt über 50 Millionen Kunden mit Strom und Gas. Von Ökostrom über Solaranlagen bis hin zu E-Mobilitätslösungen -- wir bieten alles aus einer Hand. Unsere Mission: eine nachhaltige, digitale und dezentrale Energiezukunft für alle.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews carousel */}
      <ReviewCarousel reviews={reviews?.length ? reviews : undefined} />

      {/* Recommended trips */}
      <section className="bg-secondary py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
              Unsere beliebtesten Tarife
            </h2>
            <Link
              href="/destinations"
              className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-hover md:flex"
            >
              Alle Tarife ansehen
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
                Alle Tarife ansehen
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
              Energieratgeber
            </h2>
            <Link
              href="/blog"
              className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-hover md:flex"
            >
              Alle Artikel ansehen
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
    </AuthProvider>
  )
}
