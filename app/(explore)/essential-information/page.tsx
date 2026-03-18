import type { Metadata } from "next"
import Link from "next/link"
import { FileText, Shield, Phone, Plane, Heart, Globe, CreditCard, Umbrella } from "lucide-react"

export const metadata: Metadata = {
  title: "Essential Information | Explore",
  description: "Everything you need to know before your Explore trip. Visas, travel insurance, health, fitness and more.",
}

const SECTIONS = [
  { icon: FileText, title: "Booking conditions", description: "Our full terms and conditions for booking with Explore, including deposit and payment schedules.", href: "/about-us" },
  { icon: Shield, title: "Financial protection", description: "Your holiday is financially protected through ABTA and ATOL, giving you peace of mind.", href: "/about-us" },
  { icon: Plane, title: "Flights & transfers", description: "Information about flights, airport transfers, and how to arrange your own transport.", href: "/about-us" },
  { icon: Heart, title: "Health & fitness", description: "Guidance on fitness levels, health requirements, and how to prepare for your trip.", href: "/about-us" },
  { icon: Globe, title: "Visas & passports", description: "Visa requirements and passport validity information for your destination.", href: "/about-us" },
  { icon: CreditCard, title: "Travel money", description: "Tips on currency, cash, cards, and managing your money while travelling.", href: "/about-us" },
  { icon: Umbrella, title: "Travel insurance", description: "We strongly recommend travel insurance for all our trips. Find out what cover you need.", href: "/about-us" },
  { icon: Phone, title: "Contact us", description: "Need help? Get in touch with our friendly team by phone, email or online chat.", href: "/about-us" },
]

export default function EssentialInfoPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-10 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-4 font-heading text-3xl font-bold text-primary-foreground lg:text-5xl">
            Essential information
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-primary-foreground/80">
            Everything you need to know before, during, and after your Explore trip.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="group rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <s.icon className="mb-3 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-heading text-base font-semibold text-foreground group-hover:text-primary">
                {s.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore Flex section */}
      <section className="border-t border-border bg-secondary py-10 lg:py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
            Book with confidence - Explore Flex
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            Plans change. Life happens. With Explore Flex, you can change your booking up to 60 days before departure with no amendment fees. Transfer to an alternative trip, change your travel date, or pass your holiday to a friend.
          </p>
          <Link
            href="/essential-information/explore-flex"
            className="inline-flex rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-hover"
          >
            Learn about Explore Flex
          </Link>
        </div>
      </section>
    </div>
  )
}
