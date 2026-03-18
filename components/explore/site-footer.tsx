import Link from "next/link"
import { ExploreLogo } from "./explore-logo"

const FOOTER_COLUMNS = [
  {
    title: "About",
    links: [
      { label: "About Explore", href: "/about-us" },
      { label: "Why Book With Us", href: "/about-us" },
      { label: "Meet The Team", href: "/about-us" },
      { label: "Careers", href: "/about-us" },
      { label: "Press & Media", href: "/about-us" },
    ],
  },
  {
    title: "Top Destinations",
    links: [
      { label: "Japan", href: "/destinations" },
      { label: "Italy", href: "/destinations" },
      { label: "Morocco", href: "/destinations" },
      { label: "India", href: "/destinations" },
      { label: "Vietnam", href: "/destinations" },
      { label: "Sri Lanka", href: "/destinations" },
      { label: "Turkey", href: "/destinations" },
      { label: "Costa Rica", href: "/destinations" },
    ],
  },
  {
    title: "Experiences",
    links: [
      { label: "Discovery", href: "/experiences" },
      { label: "Walking & Trekking", href: "/experiences" },
      { label: "Cycling", href: "/experiences" },
      { label: "Family", href: "/experiences" },
      { label: "Wildlife", href: "/experiences" },
      { label: "Polar", href: "/experiences" },
      { label: "Explore Upgraded", href: "/experiences" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Contact Us", href: "/about-us" },
      { label: "FAQs", href: "/about-us" },
      { label: "Manage My Booking", href: "/about-us" },
      { label: "Travel Insurance", href: "/about-us" },
      { label: "Explore Flex", href: "/essential-information/explore-flex" },
    ],
  },
]

const TRUST_BADGES = ["ABTA Protected", "ATOL Protected", "B Corp Certified", "Feefo Platinum"]

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:justify-between">
          <div className="shrink-0">
            <ExploreLogo variant="white" width={120} />
            <p className="mt-4 max-w-xs text-sm text-background/70">
              Small group adventure holidays to over 100 countries worldwide. Award-winning tours with expert leaders since 1981.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-background/50">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-background/70 transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-background/10 pt-8">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-6">
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge}
                className="rounded-md border border-background/20 px-3 py-1.5 text-xs font-medium text-background/60"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <p className="text-xs text-background/50">
              {"2026 Explore Worldwide Ltd. All rights reserved."}
            </p>
            <div className="flex items-center gap-4">
              <Link href="/about-us" className="text-xs text-background/50 transition-colors hover:text-background/80">
                Privacy Policy
              </Link>
              <Link href="/about-us" className="text-xs text-background/50 transition-colors hover:text-background/80">
                Terms & Conditions
              </Link>
              <Link href="/about-us" className="text-xs text-background/50 transition-colors hover:text-background/80">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
