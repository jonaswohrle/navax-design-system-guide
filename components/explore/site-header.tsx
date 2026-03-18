"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Phone, Search, Heart, ChevronDown } from "lucide-react"
import { ExploreLogo } from "./explore-logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

const NAV_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "Experiences", href: "/experiences" },
  { label: "Offers", href: "/offers" },
  { label: "About", href: "/about-us" },
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
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar - crimson red like the real site */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
          <div className="hidden items-center gap-4 md:flex">
            <span>{"Can't find what you're looking for?"}</span>
            {promoBanner?.text && (
              <span className="font-semibold">
                {promoBanner.text}
                {promoBanner.linkText && promoBanner.linkUrl && (
                  <>
                    {" "}
                    <Link href={promoBanner.linkUrl} className="underline underline-offset-2">
                      {promoBanner.linkText}
                    </Link>
                  </>
                )}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/essential-information/explore-flex" className="hidden transition-colors hover:text-primary-foreground/80 lg:inline">
              Explore Flex
            </Link>
            <a href="tel:01011111111" className="flex items-center gap-1 font-semibold transition-colors hover:text-primary-foreground/80">
              <Phone className="h-3 w-3" />
              0101 111 1111
            </a>
          </div>
        </div>
      </div>

      {/* Main nav bar - white */}
      <nav
        className={`border-b transition-shadow duration-200 ${
          scrolled ? "bg-card shadow-md" : "bg-card"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 lg:py-3">
          <Link href="/" className="shrink-0" aria-label="Explore home">
            <ExploreLogo variant="color" width={110} />
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-0.5 rounded px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                >
                  {link.label}
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Button>
            <Link
              href="/ai"
              className="ml-1 hidden rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-card transition-colors hover:bg-foreground/80 lg:inline-flex"
            >
              AI Showcases
            </Link>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-card p-0">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <ExploreLogo variant="color" width={100} />
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
                  <div className="p-4">
                    <Link
                      href="/ai"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-hover"
                    >
                      AI Showcases
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}
