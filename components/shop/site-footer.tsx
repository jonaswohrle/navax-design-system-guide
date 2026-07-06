"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Facebook, Instagram, Youtube, Truck, ShieldCheck, CreditCard, RotateCcw } from "lucide-react"
import { CATEGORIES } from "@/lib/shop/data"

const serviceLinks = ["Kundenservice", "Kontakt", "Versand & Lieferung", "Bezahlarten", "Rückgabe & Umtausch", "Häufige Fragen"]
const companyLinks = ["Unternehmen", "Karriere", "Presse", "Nachhaltigkeit", "Filialen", "Geschäftskunden"]
const legalLinks = ["Impressum", "Datenschutz", "AGB", "Cookie-Einstellungen", "Widerrufsrecht"]

const usps = [
  { icon: Truck, title: "Kostenloser Versand", text: "ab 49 € Bestellwert" },
  { icon: RotateCcw, title: "30 Tage Rückgabe", text: "einfach & kostenlos" },
  { icon: ShieldCheck, title: "Sicher einkaufen", text: "SSL-verschlüsselt" },
  { icon: CreditCard, title: "Sichere Zahlung", text: "viele Bezahlarten" },
]

export function SiteFooter() {
  return (
    <footer className="mt-12 bg-secondary">
      {/* USP strip */}
      <div className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
          {usps.map((u) => (
            <div key={u.title} className="flex items-center gap-3">
              <u.icon className="h-8 w-8 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-foreground">{u.title}</p>
                <p className="text-xs text-muted-foreground">{u.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-primary">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-4 px-4 py-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-3 text-primary-foreground">
            <Mail className="h-9 w-9 shrink-0" aria-hidden />
            <div>
              <p className="text-lg font-bold">Newsletter abonnieren & 10% sichern</p>
              <p className="text-sm opacity-90">Exklusive Angebote, Coupons und Neuheiten direkt per E-Mail.</p>
            </div>
          </div>
          <form
            className="flex w-full max-w-md gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="E-Mail-Adresse"
              aria-label="E-Mail-Adresse"
              className="h-11 flex-1 rounded-full border-0 px-4 text-sm text-foreground outline-none"
            />
            <button
              type="submit"
              className="h-11 shrink-0 rounded-full bg-foreground px-5 text-sm font-bold text-card hover:opacity-90"
            >
              Anmelden
            </button>
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase text-foreground">Sortiment</h3>
          <ul className="space-y-2">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/c/${c.slug}`} className="text-sm text-muted-foreground hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase text-foreground">Service & Hilfe</h3>
          <ul className="space-y-2">
            {serviceLinks.map((l) => (
              <li key={l}>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase text-foreground">Unternehmen</h3>
          <ul className="space-y-2">
            {companyLinks.map((l) => (
              <li key={l}>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase text-foreground">Folge uns</h3>
          <div className="mb-4 flex gap-3">
            <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="YouTube" className="text-muted-foreground hover:text-primary">
              <Youtube className="h-6 w-6" />
            </Link>
          </div>
          <h3 className="mb-2 text-sm font-bold uppercase text-foreground">Zahlungsarten</h3>
          <div className="flex flex-wrap gap-2">
            {["VISA", "Mastercard", "PayPal", "Klarna", "SEPA"].map((p) => (
              <span
                key={p}
                className="rounded border border-border bg-card px-2 py-1 text-[11px] font-semibold text-muted-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-4 py-5 md:flex-row">
          <Image src="/shop/rossmann-logo.svg" alt="ROSSMANN" width={150} height={30} className="h-6 w-auto" />
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {legalLinks.map((l) => (
              <li key={l}>
                <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Dirk Rossmann GmbH – Demo-Nachbau
          </p>
        </div>
      </div>
    </footer>
  )
}
