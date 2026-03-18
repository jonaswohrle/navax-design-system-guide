"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Phone, Search, Heart, User, ChevronDown } from "lucide-react"
import { ExploreLogo } from "./explore-logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"

const NAV_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "Experiences", href: "/experiences" },
  { label: "About", href: "/about-us" },
  { label: "Offers", href: "/offers" },
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

      {/* Main nav bar -- EXPLORE RED with white text/logo */}
      <nav className={`bg-primary transition-shadow duration-200 ${scrolled ? "shadow-md" : ""}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:py-2.5">
          {/* Logo -- white variant on red background */}
          <Link href="/" className="shrink-0" aria-label="Explore home">
            <ExploreLogo variant="white" width={120} />
          </Link>

          {/* Desktop nav links -- white text on red */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-0.5 rounded px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 ${
                    pathname === link.href ? "text-white" : "text-white/90"
                  }`}
                >
                  {link.label}
                  <ChevronDown className="h-3 w-3 text-white/60" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right icons -- white on red, matching real site */}
          <div className="flex items-center gap-1">
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
      </nav>

      {/* Promo banner strip -- yellow with dark text */}
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
