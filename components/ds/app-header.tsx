"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, Search, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BrightlyLogo } from "./brightly-logo"

interface NavItem {
  label: string
  href?: string
  children?: { label: string; href: string; description?: string }[]
}

interface AppHeaderProps {
  items?: NavItem[]
  ctaLabel?: string
  ctaHref?: string
  className?: string
}

const defaultItems: NavItem[] = [
  {
    label: "Solutions",
    children: [
      { label: "Asset Management", href: "#", description: "Manage assets across their lifecycle" },
      { label: "Capital Planning", href: "#", description: "Optimize budgets and forecasting" },
      { label: "Operations", href: "#", description: "Streamline maintenance workflows" },
    ],
  },
  {
    label: "Industries",
    children: [
      { label: "Education", href: "#" },
      { label: "Government", href: "#" },
      { label: "Healthcare", href: "#" },
      { label: "Manufacturing", href: "#" },
    ],
  },
  { label: "Resources", href: "#" },
  { label: "Success Stories", href: "#" },
]

export function AppHeader({
  items = defaultItems,
  ctaLabel = "Request a Demo",
  ctaHref = "#",
  className,
}: AppHeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)

  return (
    <header className={cn("sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border", className)}>
      {/* Main nav */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="shrink-0" aria-label="Home">
          <BrightlyLogo variant="dark" width={130} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {items.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
                  aria-expanded={openDropdown === item.label}
                  aria-haspopup="true"
                >
                  {item.label}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", openDropdown === item.label && "rotate-180")} />
                </button>
                {openDropdown === item.label && (
                  <div className="absolute left-0 top-full z-50 min-w-56 rounded-lg border border-border bg-background p-2 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block rounded-md px-3 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-accent hover:text-primary"
                      >
                        <span className="font-medium">{child.label}</span>
                        {child.description && (
                          <span className="mt-0.5 block text-xs text-muted-foreground">{child.description}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href || "#"}
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <button className="text-foreground/70 transition-colors hover:text-primary" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
          <Button asChild size="sm">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-foreground lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 pb-6 pt-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {items.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    className="flex w-full items-center justify-between py-3 text-sm font-medium text-foreground transition-colors"
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", openDropdown === item.label && "rotate-180")} />
                  </button>
                  {openDropdown === item.label && (
                    <div className="ml-4 flex flex-col gap-0.5 border-l-2 border-primary/30 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href || "#"}
                  className="py-3 text-sm font-medium text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Button className="w-full" asChild>
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
