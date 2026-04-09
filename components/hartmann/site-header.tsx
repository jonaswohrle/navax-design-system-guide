"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, Search, Globe, ChevronDown, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

const NAV_LINKS = [
  { label: "Produkte", href: "/vercel/sitecore" },
  { label: "Branchen", href: "/vercel/sitecore" },
  { label: "Wissen & News", href: "/vercel/sitecore" },
  { label: "Unternehmen", href: "/vercel/sitecore" },
]

export function HartmannHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="bg-[#001689] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <span className="font-medium text-white/70">PAUL HARTMANN AG</span>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-white/70 hover:text-white transition-colors">
              <Globe className="h-3 w-3" />
              DE-DE
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main nav bar */}
      <nav className={`bg-white transition-shadow duration-200 ${scrolled ? "shadow-md" : "border-b border-border"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="HARTMANN home">
            <Image
              src="/images/hartmann-logo.png"
              alt="HARTMANN"
              width={160}
              height={64}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    link.highlight
                      ? "bg-[#0045FF] text-white hover:bg-[#0035CC]"
                      : pathname === link.href
                        ? "text-[#001689] bg-[#0045FF]/5"
                        : "text-foreground/80 hover:text-[#001689] hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent("hartmann:open-chat"))}
              className="hidden gap-1.5 bg-[#0045FF] text-xs font-semibold text-white hover:bg-[#0035CC] lg:flex"
              size="sm"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              KI-Berater
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-[#001689]" aria-label="Suche">
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-white p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex items-center bg-[#001689] px-4 py-4">
                  <Image
                    src="/images/hartmann-logo.png"
                    alt="HARTMANN"
                    width={120}
                    height={48}
                    className="h-8 w-auto brightness-0 invert"
                  />
                </div>
                <nav className="flex flex-col">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="border-b border-border px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      window.dispatchEvent(new CustomEvent("hartmann:open-chat"))
                    }}
                    className="flex items-center gap-2 border-b border-border px-4 py-3.5 text-sm font-semibold text-[#0045FF] transition-colors hover:bg-muted"
                  >
                    <MessageCircle className="h-4 w-4" />
                    KI-Berater
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}
