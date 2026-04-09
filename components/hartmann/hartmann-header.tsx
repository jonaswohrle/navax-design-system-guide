"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
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
      {/* Top utility bar - dark navy blue like original */}
      <div className="bg-primary">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-2">
          <div className="hidden items-center gap-6 md:flex">
            <Link href="#" className="text-[11px] text-white/80 transition-colors hover:text-white">
              Professionelle Hilfe
            </Link>
            <Link href="#" className="text-[11px] text-white/80 transition-colors hover:text-white">
              Privat eShop
            </Link>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="#" className="text-[11px] text-white/80 transition-colors hover:text-white">
              Lizenz-Portfolio
            </Link>
            <Link href="#" className="text-[11px] text-white/80 transition-colors hover:text-white">
              {"\u00DCber HARTMANN"}
            </Link>
            <Link href="#" className="text-[11px] text-white/80 transition-colors hover:text-white">
              Produktion
            </Link>
            <Link href="#" className="text-[11px] text-white/80 transition-colors hover:text-white">
              Investoren
            </Link>
          </div>
          <div className="flex w-full items-center justify-between md:hidden">
            <span className="text-[11px] text-white/80">HARTMANN Gruppe</span>
            <Search className="h-3.5 w-3.5 text-white/80" />
          </div>
        </div>
      </div>

      {/* Main navigation bar - white */}
      <nav
        className={`bg-white transition-shadow duration-200 ${scrolled ? "shadow-md" : "border-b border-border"}`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="shrink-0 py-3" aria-label="HARTMANN Home" onMouseEnter={() => setActiveDropdown(null)}>
            <Image
              src="/images/hartmann-logo.png"
              alt="HARTMANN"
              width={120}
              height={36}
              className="h-8 w-auto lg:h-10"
              priority
            />
          </Link>

          <ul className="hidden items-center lg:flex" onMouseEnter={() => {}}>
            {navigation.items.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
              >
                <button
                  className={`relative px-5 py-5 text-[13px] font-bold uppercase tracking-wide transition-colors ${
                    activeDropdown === item.label
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                  {activeDropdown === item.label && (
                    <span className="absolute bottom-0 left-5 right-5 h-[3px] bg-primary" />
                  )}
                </button>

                {activeDropdown === item.label && item.children && (
                  <div className="absolute left-0 top-full z-50 w-56 border border-border bg-white py-2 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-5 py-2.5 text-[13px] text-foreground transition-colors hover:bg-secondary hover:text-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3" onMouseEnter={() => setActiveDropdown(null)}>
            <button
              className="hidden p-2 text-foreground transition-colors hover:text-primary lg:flex"
              aria-label="Suche"
            >
              <Search className="h-5 w-5" />
            </button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground lg:hidden" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-white p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex items-center justify-between bg-primary px-4 py-3">
                  <Image
                    src="/images/hartmann-logo.png"
                    alt="HARTMANN"
                    width={100}
                    height={30}
                    className="h-7 w-auto brightness-0 invert"
                  />
                  <button onClick={() => setMobileOpen(false)} className="text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex flex-col">
                  {navigation.items.map((item) => (
                    <div key={item.label} className="border-b border-border">
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-5 py-3.5 text-[13px] font-bold uppercase tracking-wide text-foreground"
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
                              className="block px-8 py-2 text-[12px] text-muted-foreground hover:text-primary"
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
