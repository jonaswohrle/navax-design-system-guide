import type { Metadata } from "next"
import Link from "next/link"
import { Tag, Gift, Globe, Users, Percent, ArrowRight } from "lucide-react"
import { getOfferCards, type OfferCardFields } from "@/lib/contentful"

export const metadata: Metadata = {
  title: "Adventure Holiday Deals | Offers & Discounts - Explore",
  description:
    "Save on your next adventure with our latest offers and discounts. Loyalty rewards, recommend a friend, discounted trips and more.",
}

const ICON_MAP: Record<string, React.ReactNode> = {
  "Loyalty discounts": <Percent className="h-8 w-8" />,
  "Recommend a friend": <Gift className="h-8 w-8" />,
  "SAVE on Polar trips": <Globe className="h-8 w-8" />,
  "Discounted trips": <Tag className="h-8 w-8" />,
  "Book back-to-back and save 5%": <ArrowRight className="h-8 w-8" />,
}

const FALLBACK_OFFERS: OfferCardFields[] = [
  { title: "Loyalty discounts", description: "After your first trip, enjoy up to 10% off future adventures with our loyalty programme.", discountText: "Up to 10% off", linkUrl: "/about-us", order: 1 },
  { title: "Recommend a friend", description: "Refer a friend and you'll both receive a discount on your next adventure.", discountText: "Save together", linkUrl: "/about-us", order: 2 },
  { title: "SAVE on Polar trips", description: "Incredible savings on selected Polar voyages to the Arctic and Antarctic.", discountText: "Great savings", linkUrl: "/destinations?region=polar", order: 3 },
  { title: "Discounted trips", description: "Browse our selection of discounted trips with reduced prices on selected departures.", discountText: "Reduced prices", linkUrl: "/destinations", order: 4 },
  { title: "Book back-to-back and save 5%", description: "Combine two or more trips and save 5% on each adventure when you book them together.", discountText: "Save 5%", linkUrl: "/destinations", order: 5 },
]

export default async function OffersPage() {
  const offers = await getOfferCards()
  const offerList: OfferCardFields[] = offers?.length ? offers : FALLBACK_OFFERS

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Page hero */}
      <section className="bg-secondary py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-4 font-heading text-4xl font-bold text-foreground lg:text-5xl">
            Travel more with our Offers & Discounts
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            {"We're always looking for ways to help you explore more for less. From loyalty rewards to last-minute deals, discover all the ways you can save on your next adventure."}
          </p>
        </div>
      </section>

      {/* Offer cards grid */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offerList.map((offer) => (
              <Link
                key={offer.title}
                href={offer.linkUrl || "/offers"}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {ICON_MAP[offer.title] ?? <Tag className="h-8 w-8" />}
                </div>
                {offer.discountText && (
                  <span className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                    {offer.discountText}
                  </span>
                )}
                <h3 className="mb-2 font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                  {offer.title}
                </h3>
                {offer.description && (
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {offer.description}
                  </p>
                )}
                <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                  {"Find out more"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
