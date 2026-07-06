"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Search, MapPin, User, ShoppingCart, Menu, X, FileText, Heart, ChevronDown } from "lucide-react"
import { CATEGORIES } from "@/lib/shop/data"
import { useCart } from "./cart-provider"
import { cn } from "@/lib/utils"

const utilityLinks = [
  { label: "Fotowelt", href: "#" },
  { label: "Gutscheine", href: "#" },
  { label: "Karriere", href: "#" },
  { label: "Unternehmen", href: "#" },
  { label: "Geschäftskunden", href: "#" },
  { label: "Nachhaltigkeit", href: "#" },
  { label: "babywelt", href: "#" },
]

const navExtras = [
  { slug: "neu", name: "Neu" },
  { slug: "ideenwelt", name: "IDEENWELT" },
]

const megaSub: Record<string, string[]> = {
  "make-up": ["Gesicht", "Augen", "Lippen", "Nägel", "Pinsel & Zubehör", "Sets"],
  "pflege-duft": ["Gesichtspflege", "Körperpflege", "Haarpflege", "Duschen & Baden", "Düfte", "Männerpflege"],
  "baby-spielzeug": ["Windeln", "Babypflege", "Ernährung", "Stillen & Fläschchen", "Spielzeug", "Unterwegs"],
  haushalt: ["Waschen", "Putzen & Reinigen", "Küche", "Papierwaren", "Aufbewahrung", "Lufterfrischer"],
  gesundheit: ["Nahrungsergänzung", "Erste Hilfe", "Hand & Fuß", "Sport & Fitness", "Sexualität", "Reiseapotheke"],
  lebensmittel: ["Süßes & Salziges", "Getränke", "Bio-Produkte", "Frühstück", "Kaffee & Tee", "Vegan"],
}

export function SiteHeader() {
  const { count } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-card shadow-sm">
      {/* Utility bar */}
      <div className="hidden border-b border-border bg-secondary lg:block">
        <div className="mx-auto flex max-w-[1280px] items-center justify-end gap-5 px-4 py-1.5">
          {utilityLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-3">
        <button
          type="button"
          className="lg:hidden"
          aria-label="Menü öffnen"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6 text-foreground" />
        </button>

        <Link href="/" aria-label="ROSSMANN Startseite" className="shrink-0">
          <Image
            src="/shop/rossmann-logo.svg"
            alt="ROSSMANN"
            width={190}
            height={38}
            priority
            className="h-9 w-auto"
          />
        </Link>

        {/* Search */}
        <form
          role="search"
          className="relative hidden flex-1 md:block"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="search"
            placeholder="Wonach suchst du?"
            aria-label="Suchen"
            className="h-11 w-full rounded-full border border-border bg-secondary pl-5 pr-12 text-sm outline-none focus:border-primary focus:bg-card"
          />
          <button
            type="submit"
            aria-label="Suche starten"
            className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-hover"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-4">
          <Link href="#" className="hidden flex-col items-center text-foreground hover:text-primary lg:flex">
            <FileText className="h-6 w-6" />
            <span className="text-[11px]">Prospekt</span>
          </Link>
          <Link href="#" className="hidden flex-col items-center text-foreground hover:text-primary lg:flex">
            <MapPin className="h-6 w-6" />
            <span className="text-[11px]">Filiale</span>
          </Link>
          <Link href="#" className="hidden flex-col items-center text-foreground hover:text-primary sm:flex">
            <User className="h-6 w-6" />
            <span className="text-[11px]">Anmelden</span>
          </Link>
          <Link href="#" className="hidden flex-col items-center text-foreground hover:text-primary sm:flex">
            <Heart className="h-6 w-6" />
            <span className="text-[11px]">Merken</span>
          </Link>
          <Link
            href="/warenkorb"
            className="relative flex flex-col items-center text-foreground hover:text-primary"
            aria-label={`Warenkorb, ${count} Artikel`}
          >
            <span className="relative">
              <ShoppingCart className="h-6 w-6" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </span>
            <span className="text-[11px]">Warenkorb</span>
          </Link>
        </div>
      </div>

      {/* Mobile search */}
      <div className="border-t border-border px-4 py-2 md:hidden">
        <form role="search" className="relative" onSubmit={(e) => e.preventDefault()}>
          <input
            type="search"
            placeholder="Wonach suchst du?"
            aria-label="Suchen"
            className="h-10 w-full rounded-full border border-border bg-secondary pl-4 pr-11 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            aria-label="Suche starten"
            className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Main nav */}
      <nav aria-label="Hauptnavigation" className="hidden border-t border-border bg-card lg:block">
        <div
          className="mx-auto flex max-w-[1280px] items-stretch gap-1 px-4"
          onMouseLeave={() => setOpenMenu(null)}
        >
          {navExtras.map((n) => (
            <Link
              key={n.slug}
              href="/"
              className={cn(
                "flex items-center px-3 py-3 text-sm font-bold uppercase tracking-wide transition-colors",
                n.name === "Neu" ? "text-primary hover:text-hover" : "text-foreground hover:text-primary",
              )}
            >
              {n.name}
            </Link>
          ))}

          {CATEGORIES.map((cat) => (
            <div
              key={cat.slug}
              className="static"
              onMouseEnter={() => setOpenMenu(cat.slug)}
            >
              <Link
                href={`/c/${cat.slug}`}
                className={cn(
                  "flex items-center gap-1 px-3 py-3 text-sm font-semibold uppercase tracking-wide transition-colors",
                  openMenu === cat.slug ? "text-primary" : "text-foreground hover:text-primary",
                )}
              >
                {cat.short}
                <ChevronDown className="h-3.5 w-3.5" />
              </Link>

              {openMenu === cat.slug && (
                <div className="absolute inset-x-0 top-full z-40 border-t border-border bg-card shadow-lg">
                  <div className="mx-auto max-w-[1280px] px-4 py-6">
                    <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                      <div className="col-span-1">
                        <p className="mb-2 text-sm font-bold uppercase text-primary">{cat.name}</p>
                        <Link
                          href={`/c/${cat.slug}`}
                          className="text-sm font-medium text-foreground hover:text-primary"
                        >
                          Alle {cat.name} entdecken
                        </Link>
                      </div>
                      <ul className="col-span-2 grid grid-cols-2 gap-y-2">
                        {(megaSub[cat.slug] ?? []).map((sub) => (
                          <li key={sub}>
                            <Link
                              href={`/c/${cat.slug}`}
                              className="text-sm text-muted-foreground hover:text-primary"
                            >
                              {sub}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Link
            href="#"
            className="flex items-center px-3 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:text-primary"
          >
            Tier
          </Link>
          <Link
            href="#"
            className="flex items-center px-3 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:text-primary"
          >
            Marken
          </Link>
          <Link
            href="/angebote"
            className="ml-auto flex items-center px-3 py-3 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:text-hover"
          >
            Angebote
          </Link>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-card p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Image src="/shop/rossmann-logo.svg" alt="ROSSMANN" width={150} height={30} className="h-7 w-auto" />
              <button type="button" aria-label="Menü schließen" onClick={() => setMobileOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <ul className="divide-y divide-border">
              <li>
                <Link
                  href="/angebote"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 font-bold uppercase text-primary"
                >
                  Angebote
                </Link>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/c/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 font-semibold uppercase text-foreground"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              {utilityLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-sm text-muted-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
