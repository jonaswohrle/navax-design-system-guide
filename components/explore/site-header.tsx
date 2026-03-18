"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Phone, Search, Heart, User, ChevronDown } from "lucide-react"
import { ExploreLogo } from "./explore-logo"
import { MegaMenu } from "./mega-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"

const NAV_LINKS = [
  { label: "Destinations", href: "/destinations", hasMega: true as const, megaType: "destinations" as const },
  { label: "Experiences", href: "/experiences", hasMega: true as const, megaType: "experiences" as const },
  { label: "About", href: "/about-us", hasMega: false as const },
  { label: "Offers", href: "/offers", hasMega: false as const },
]

interface SiteHeaderProps {
  promoBanner?: {
    text: string
    linkText?: string
    linkUrl?: string
    isActive?: boolean
  } | null
}

export function SiteHeader({ promoBanner }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMega, setActiveMega] = useState<"destinations" | "experiences" | null>(null)
  const pathname = usePathname()
  const { user, wishlist } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar -- dark red */}
      <div className="bg-[#8B1A1A] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
          <Link href="/about-us" className="font-semibold underline underline-offset-2 hover:text-white/80">
            Support Centre
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-white/80 sm:inline">
              {"Call us, we're open today 9.00am - 7.00pm"}
            </span>
            <a href="tel:01252218716" className="flex items-center gap-1 font-bold hover:text-white/80">
              <Phone className="h-3 w-3" />
              01252 218 716
            </a>
          </div>
        </div>
      </div>

      {/* Main nav bar -- EXPLORE RED */}
      <nav
        className={`relative bg-primary transition-shadow duration-200 ${scrolled ? "shadow-md" : ""}`}
        onMouseLeave={() => setActiveMega(null)}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:py-2.5">
          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="Explore home" onMouseEnter={() => setActiveMega(null)}>
            <ExploreLogo variant="white" width={130} />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <li
                key={link.href}
                onMouseEnter={() => {
                  if (link.hasMega) setActiveMega(link.megaType)
                  else setActiveMega(null)
                }}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-0.5 rounded px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 ${
                    pathname?.startsWith(link.href) || activeMega === (link.hasMega ? link.megaType : null)
                      ? "text-white underline underline-offset-4"
                      : "text-white/90"
                  }`}
                >
                  {link.label}
                  {link.hasMega && <ChevronDown className="h-3 w-3 text-white/60" />}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right icons */}
          <div className="flex items-center gap-1" onMouseEnter={() => setActiveMega(null)}>
            <Link
              href="/my-explore"
              className="flex flex-col items-center gap-0.5 rounded px-2.5 py-1.5 text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="My Explore"
            >
              <User className="h-5 w-5" />
              <span className="hidden text-[10px] font-medium lg:block">My Explore</span>
            </Link>

            <Link
              href="/my-explore?tab=wishlist"
              className="relative flex flex-col items-center gap-0.5 rounded px-2.5 py-1.5 text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Wishlist"
            >
              <Heart className={`h-5 w-5 ${wishlist.length > 0 ? "fill-explore-yellow text-explore-yellow" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-explore-yellow text-[10px] font-bold text-explore-yellow-foreground">
                  {wishlist.length}
                </span>
              )}
              <span className="hidden text-[10px] font-medium lg:block">Wishlist</span>
            </Link>

            <Link
              href="/search"
              className="flex flex-col items-center gap-0.5 rounded px-2.5 py-1.5 text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Trip Search"
            >
              <Search className="h-5 w-5" />
              <span className="hidden text-[10px] font-medium lg:block">Trip Search</span>
            </Link>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-1 text-white hover:bg-white/10 hover:text-white lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-card p-0">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <div className="flex items-center bg-primary px-4 py-3">
                  <ExploreLogo variant="white" width={100} />
                </div>
                <nav className="flex flex-col">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="border-b border-border px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/search"
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-border px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                  >
                    Trip Search
                  </Link>
                  <Link
                    href="/my-explore"
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-border px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                  >
                    {user ? "My Dashboard" : "Login / Register"}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mega menu dropdown */}
        {activeMega && (
          <MegaMenu type={activeMega} onClose={() => setActiveMega(null)} />
        )}
      </nav>

      {/* Promo banner strip -- yellow */}
      {promoBanner?.text && promoBanner.isActive !== false && (
        <div className="bg-explore-yellow text-center">
          <div className="mx-auto max-w-7xl px-4 py-2 text-xs font-medium text-explore-yellow-foreground">
            {promoBanner.text}
            {promoBanner.linkText && promoBanner.linkUrl && (
              <>
                {" "}
                <Link href={promoBanner.linkUrl} className="font-bold underline underline-offset-2">
                  {promoBanner.linkText}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
