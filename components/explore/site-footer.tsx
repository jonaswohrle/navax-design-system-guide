"use client"

import { useState } from "react"
import Link from "next/link"
import { ExploreLogo } from "./explore-logo"
import { Facebook, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const FOOTER_COLS = [
  {
    title: "Popular links",
    links: [
      { label: "Contact Us", href: "/about-us" },
      { label: "Support Site", href: "/about-us" },
      { label: "Explore Loyalty Club", href: "/about-us" },
      { label: "The Blog", href: "/blog" },
      { label: "Careers", href: "/about-us" },
      { label: "Privacy Centre", href: "/about-us" },
    ],
  },
  {
    title: "Purpose",
    links: [
      { label: "B Corp", href: "/about-us" },
      { label: "Purpose Paper", href: "/about-us" },
      { label: "Carbon Measurement", href: "/about-us" },
      { label: "Climate Change", href: "/about-us" },
      { label: "Animal Protection Policy", href: "/about-us" },
      { label: "The Explore Foundation", href: "/about-us" },
    ],
  },
  {
    title: "Booking",
    links: [
      { label: "Essential Information", href: "/essential-information" },
      { label: "Travel Updates", href: "/blog" },
      { label: "Financial Protection", href: "/about-us" },
      { label: "Booking Conditions", href: "/about-us" },
      { label: "Travel Agents", href: "/about-us" },
      { label: "My Explore", href: "/my-explore" },
    ],
  },
]

const TRUST_BADGES = ["IATA", "ABTA No. 5307", "ATOL Protected", "Travel Aware", "B Corp"]

export function SiteFooter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  return (
    <footer>
      {/* Trust badges row */}
      <div className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 py-6">
          {TRUST_BADGES.map((badge) => (
            <span
              key={badge}
              className="rounded border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-3 text-sm font-bold text-background">{col.title}</h3>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-xs text-background/60 transition-colors hover:text-primary">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter signup */}
            <div className="col-span-2 md:col-span-4 lg:col-span-2">
              <h3 className="mb-3 text-sm font-bold text-background">Keep up to date</h3>
              <p className="mb-3 text-xs text-background/60">
                Sign up to our newsletter for latest news, deals and travel information
              </p>
              {subscribed ? (
                <p className="text-sm font-semibold text-primary">Thanks for subscribing!</p>
              ) : (
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (email) setSubscribed(true)
                  }}
                >
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 border-background/20 bg-background/10 text-xs text-background placeholder:text-background/40"
                    required
                  />
                  <Button type="submit" size="sm" className="h-9 bg-explore-yellow text-xs font-bold text-explore-yellow-foreground hover:bg-explore-yellow/90">
                    Subscribe
                  </Button>
                </form>
              )}

              {/* Social icons */}
              <div className="mt-4 flex items-center gap-3">
                <a href="#" className="text-background/60 transition-colors hover:text-background" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-background/60 transition-colors hover:text-background" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-background/60 transition-colors hover:text-background" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-[10px] text-background/40 md:flex-row">
            <p>
              Explore Worldwide Ltd. Reg No: 358755213. VAT No: GB 358755213. Reg office: Nelson House, 55 Victoria Rd, Farnborough, Hants, GU14 7PA.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/about-us" className="hover:text-background/60">Privacy Policy</Link>
              <Link href="/about-us" className="hover:text-background/60">Cookie Policy</Link>
              <Link href="/about-us" className="hover:text-background/60">Booking Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
