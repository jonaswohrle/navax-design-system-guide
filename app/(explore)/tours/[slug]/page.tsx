import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Clock, Users, Mountain, MapPin, Check, X, ArrowRight, Star } from "lucide-react"
import { blobUrl } from "@/lib/blob-image-urls"
import { getTour, getAllTourSlugs, TOURS } from "@/lib/tour-data"
import { TourItinerary } from "@/components/explore/tour-itinerary"
import { BookingTable } from "@/components/explore/booking-table"
import { TripCard } from "@/components/explore/trip-card"
import { TrustStrip } from "@/components/explore/trust-strip"
import { WishlistButton } from "@/components/explore/wishlist-button"
import { Button } from "@/components/ui/button"

export function generateStaticParams() {
  return getAllTourSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tour = getTour(slug)
  if (!tour) return { title: "Tour Not Found" }
  return {
    title: `${tour.title} | Explore`,
    description: tour.overview.slice(0, 160),
  }
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tour = getTour(slug)
  if (!tour) notFound()

  const relatedTours = tour.relatedSlugs
    .map((s) => TOURS[s])
    .filter(Boolean)
    .slice(0, 3)

  const hasDiscount = tour.originalPrice && tour.originalPrice > tour.price

  return (
    <div className="min-h-screen bg-background">
      {/* Hero - crimson red overlay like the real Explore site */}
      <section className="relative bg-primary">
        <div className="absolute inset-0">
          <Image
            src={blobUrl(tour.imageUrl)}
            alt={tour.title}
            fill
            unoptimized
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 lg:py-16">
          <p className="mb-1 text-sm font-medium text-primary-foreground/80">
            {tour.destination} {tour.tripType}
          </p>
          <div className="mb-4 flex items-start gap-3">
            <h1 className="max-w-3xl font-heading text-3xl font-bold text-primary-foreground lg:text-5xl text-balance">
              {tour.title}
            </h1>
            <WishlistButton tourSlug={tour.slug} size="md" className="mt-1 bg-white/20 text-white hover:bg-white/30" />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/90">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {tour.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {tour.groupSize} people
            </span>
            <span className="flex items-center gap-1.5">
              <Mountain className="h-4 w-4" /> Physical rating: {tour.physicalRating}/5
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {tour.country}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-4">
            <div>
              {hasDiscount && (
                <p className="text-sm text-primary-foreground/70 line-through">
                  {"Was from \u00A3"}{tour.originalPrice?.toLocaleString()}
                </p>
              )}
              <p className="text-2xl font-bold text-primary-foreground">
                {hasDiscount ? "Now from" : "From"} {"\u00A3"}{tour.price.toLocaleString()}
              </p>
              <p className="text-xs text-primary-foreground/60">per person, flights not included</p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-card text-foreground hover:bg-card/90"
            >
              <a href="#dates">
                View dates & book
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Sticky nav tabs */}
      <nav className="sticky top-[88px] z-40 border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex max-w-7xl gap-0 overflow-x-auto px-4">
          {[
            { label: "Overview", href: "#overview" },
            { label: "Itinerary", href: "#itinerary" },
            { label: "Dates & Prices", href: "#dates" },
            { label: "Reviews", href: "#reviews" },
          ].map((tab) => (
            <a
              key={tab.href}
              href={tab.href}
              className="shrink-0 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {tab.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Overview */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:py-14" id="overview">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
              About this trip
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground lg:text-base">
              {tour.overview}
            </p>

            <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
              Tour highlights
            </h3>
            <ul className="mb-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {tour.highlights.map((hl) => (
                <li key={hl} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {hl}
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar - Trip summary card */}
          <div className="lg:col-span-1">
            <div className="sticky top-40 rounded-lg border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
                Trip information
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-foreground">Trip code</dt>
                  <dd className="font-mono font-medium text-foreground">{tour.tripCode}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd className="font-medium text-foreground">{tour.duration}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-foreground">Group size</dt>
                  <dd className="font-medium text-foreground">{tour.groupSize}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-foreground">Physical rating</dt>
                  <dd className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`h-2 w-4 rounded-sm ${
                          i <= tour.physicalRating ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-foreground">Trip type</dt>
                  <dd className="font-medium text-foreground">{tour.tripType}</dd>
                </div>
                <div className="flex justify-between pb-2">
                  <dt className="text-muted-foreground">Country</dt>
                  <dd className="font-medium text-foreground">{tour.country}</dd>
                </div>
              </dl>

              <div className="mt-5 border-t border-border pt-4">
                <p className="mb-1 text-xs text-muted-foreground">From</p>
                <p className="mb-3 text-2xl font-bold text-foreground">
                  {"\u00A3"}{tour.price.toLocaleString()}
                </p>
                <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-hover">
                  <a href="#dates">View dates & book</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's included / not included */}
      <section className="border-t border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
                {"What's included"}
              </h3>
              <ul className="space-y-2">
                {tour.included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
                {"What's not included"}
              </h3>
              <ul className="space-y-2">
                {tour.notIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:py-14" id="itinerary">
        <TourItinerary days={tour.itinerary} />
      </section>

      {/* Dates & Prices */}
      <section className="border-t border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
          <BookingTable
            departures={tour.departures}
            tripTitle={tour.title}
            tripSlug={tour.slug}
            duration={tour.duration}
          />
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:py-14" id="reviews">
        <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Reviews</h2>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`h-5 w-5 ${i <= 5 ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
            ))}
          </div>
          <span className="text-sm font-semibold text-foreground">4.8 / 5</span>
          <span className="text-xs text-muted-foreground">Based on 47 reviews</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { name: "Sarah M.", text: "Absolutely incredible trip. The tour leader was knowledgeable, the group was wonderful and the itinerary was perfectly planned. Would highly recommend.", rating: 5 },
            { name: "James T.", text: "An amazing adventure from start to finish. The small group size meant we got authentic experiences you'd never find on a larger tour.", rating: 5 },
          ].map((review) => (
            <div key={review.name} className="rounded-lg border border-border bg-card p-5">
              <div className="mb-2 flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i <= review.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                  />
                ))}
              </div>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
              <p className="text-xs font-medium text-foreground">{review.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
          <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
            Frequently asked questions
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { q: "Are flights included?", a: "Flights are not included in the tour price. This gives you flexibility to arrange your own flights, use air miles, or extend your stay." },
              { q: "What is the group size?", a: `This trip has a group size of ${tour.groupSize} people. Our small groups ensure a more personal, authentic experience.` },
              { q: "Can I book as a solo traveller?", a: "Absolutely! Over half our travellers come on their own. It's one of the best ways to travel, and you'll quickly make friends in the group." },
              { q: "What fitness level do I need?", a: `This trip has a physical rating of ${tour.physicalRating}/5. Check the tour overview for specific activity details.` },
              { q: "What about travel insurance?", a: "We strongly recommend comprehensive travel insurance for all our trips. This should cover cancellation, medical expenses, and repatriation." },
              { q: "Can I change my booking?", a: "Yes, with Explore Flex you can change your booking up to 60 days before departure with no amendment fees." },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-lg border border-border bg-card">
                <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-foreground marker:text-primary">
                  {faq.q}
                </summary>
                <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <TrustStrip />

      {/* Related trips */}
      {relatedTours.length > 0 && (
        <section className="border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
            <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
              You might also be interested in
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTours.map((related) => (
                <TripCard
                  key={related.slug}
                  trip={{
                    title: related.title,
                    destination: related.destination,
                    tripType: related.tripType,
                    duration: related.duration,
                    price: related.price,
                    originalPrice: related.originalPrice,
                    imageUrl: related.imageUrl,
                    tripCode: related.tripCode,
                    slug: related.slug,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
