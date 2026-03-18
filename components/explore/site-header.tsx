"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Phone, Search, Heart } from "lucide-react"
import { ExploreLogo } from "./explore-logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

const NAV_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "Experiences", href: "/experiences" },
  { label: "Offers", href: "/offers" },
  { label: "About Us", href: "/about-us" },
  { label: "Blog", href: "/blog" },
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
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const showBanner = promoBanner?.isActive && !bannerDismissed

  return (
    <header className="sticky top-0 z-50">
      {showBanner && (
        <div className="bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm">
            <div className="flex-1" />
            <p className="text-center">
              {promoBanner.text}
              {promoBanner.linkText && promoBanner.linkUrl && (
                <>
                  {" "}
                  <Link href={promoBanner.linkUrl} className="font-semibold underline underline-offset-2">
                    {promoBanner.linkText}
                  </Link>
                </>
              )}
            </p>
            <div className="flex flex-1 justify-end">
              <button
                onClick={() => setBannerDismissed(true)}
                className="rounded p-1 transition-colors hover:bg-primary-foreground/10"
                aria-label="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <nav
        className={`transition-all duration-200 ${
          scrolled ? "border-b border-border bg-card shadow-sm" : "bg-card"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:py-4">
          <Link href="/" className="shrink-0" aria-label="Explore home">
            <ExploreLogo variant="color" width={120} />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="tel:01011111111"
              className="hidden items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary md:flex"
            >
              <Phone className="h-4 w-4" />
              <span className="sr-only lg:not-sr-only">Call us</span>
            </a>
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-card p-0">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <div className="flex items-center justify-between border-b border-border p-4">
                  <ExploreLogo variant="color" width={100} />
                </div>
                <nav className="flex flex-col p-4">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="border-b border-border py-3 text-base font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/ai"
                    onClick={() => setMobileOpen(false)}
                    className="mt-4 rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-hover"
                  >
                    AI Showcases
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}
