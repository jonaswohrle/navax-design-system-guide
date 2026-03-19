"use client"

import { useState } from "react"
import Link from "next/link"
import { ExploreLogo } from "./explore-logo"
import { Facebook, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const FOOTER_COLS = [
  {
    title: "Privatkunden",
    links: [
      { label: "Strom-Tarife", href: "/destinations" },
      { label: "Gas-Tarife", href: "/experiences" },
      { label: "Solaranlagen", href: "/about-us" },
      { label: "Wärmepumpen", href: "/about-us" },
      { label: "E-Mobilität", href: "/offers" },
      { label: "Smart Home", href: "/about-us" },
    ],
  },
  {
    title: "Service",
    links: [
      { label: "Hilfe & Kontakt", href: "/about-us" },
      { label: "Umzugsservice", href: "/about-us" },
      { label: "Zählerstand melden", href: "/about-us" },
      { label: "Rechnungen", href: "/about-us" },
      { label: "E.ON Plus Vorteile", href: "/about-us" },
      { label: "Energieratgeber", href: "/blog" },
    ],
  },
  {
    title: "Unternehmen",
    links: [
      { label: "Über E.ON", href: "/about-us" },
      { label: "Karriere", href: "/about-us" },
      { label: "Nachhaltigkeit", href: "/about-us" },
      { label: "Presse", href: "/about-us" },
      { label: "Investor Relations", href: "/about-us" },
      { label: "Mein E.ON", href: "/my-explore" },
    ],
  },
]

const TRUST_BADGES = ["TÜV SÜD", "Service König 2025", "CHIP Top Anbieter", "Ökostrom TÜV", "Klimaneutral 2040"]

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
              <h3 className="mb-3 text-sm font-bold text-background">Newsletter</h3>
              <p className="mb-3 text-xs text-background/60">
                Melden Sie sich für unseren Newsletter an und erhalten Sie Energiespar-Tipps und aktuelle Angebote.
              </p>
              {subscribed ? (
                <p className="text-sm font-semibold text-primary">Vielen Dank für Ihre Anmeldung!</p>
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
              E.ON Energie Deutschland GmbH, Arnulfstraße 203, 80634 München. Registergericht: Amtsgericht München, HRB 164869.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/about-us" className="hover:text-background/60">Datenschutz</Link>
              <Link href="/about-us" className="hover:text-background/60">Impressum</Link>
              <Link href="/about-us" className="hover:text-background/60">AGB</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
