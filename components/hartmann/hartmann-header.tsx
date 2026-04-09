"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, Globe, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import type { HartmannNavigation } from "@/lib/sitecore"

interface HartmannHeaderProps {
  navigation: HartmannNavigation
}

export function HartmannHeader({ navigation }: HartmannHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="bg-secondary border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">HARTMANN Gruppe</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
              <Globe className="h-3 w-3" />
              <span>DE</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
              Kontakt
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`relative bg-background transition-shadow duration-200 ${scrolled ? "shadow-md" : "border-b border-border"}`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:py-4">
          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="HARTMANN Home" onMouseEnter={() => setActiveDropdown(null)}>
            <Image
              src="/images/hartmann-logo.png"
              alt="HARTMANN"
              width={160}
              height={48}
              className="h-10 w-auto lg:h-12"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navigation.items.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
              >
                <button
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-primary ${
                    activeDropdown === item.label ? "bg-secondary text-primary" : "text-foreground"
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-3 w-3" />}
                </button>

                {/* Dropdown */}
                {activeDropdown === item.label && item.children && (
                  <div className="absolute left-0 top-full z-50 mt-0 w-56 rounded-md border border-border bg-background py-2 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2" onMouseEnter={() => setActiveDropdown(null)}>
            <button
              className="flex items-center justify-center rounded-md p-2 text-foreground transition-colors hover:bg-secondary hover:text-primary"
              aria-label="Suche"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary lg:hidden" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-background p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex items-center justify-between bg-primary px-4 py-3">
                  <Image
                    src="/images/hartmann-logo.png"
                    alt="HARTMANN"
                    width={120}
                    height={36}
                    className="h-8 w-auto brightness-0 invert"
                  />
                  <button onClick={() => setMobileOpen(false)} className="text-primary-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex flex-col">
                  {navigation.items.map((item) => (
                    <div key={item.label} className="border-b border-border">
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-primary"
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <div className="bg-secondary pb-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className="block px-8 py-2 text-xs text-muted-foreground transition-colors hover:text-primary"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}
