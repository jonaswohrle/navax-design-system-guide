import Link from "next/link"
import { cn } from "@/lib/utils"
import { ValtechLogo } from "./valtech-logo"

interface FooterColumn {
  title: string
  links: { label: string; href: string }[]
}

interface AppFooterProps {
  columns?: FooterColumn[]
  className?: string
  companyName?: string
}

const defaultColumns: FooterColumn[] = [
  {
    title: "Solutions",
    links: [
      { label: "ERP", href: "#" },
      { label: "CRM", href: "#" },
      { label: "Business Intelligence", href: "#" },
      { label: "Automation", href: "#" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Manufacturing", href: "#" },
      { label: "Professional Services", href: "#" },
      { label: "Construction", href: "#" },
      { label: "Trade", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Whitepapers", href: "#" },
      { label: "Events", href: "#" },
      { label: "Newsletter", href: "#" },
    ],
  },
]

export function AppFooter({
  columns = defaultColumns,
  className,
  companyName = "Valtech",
}: AppFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className={cn("bg-background text-foreground", className)}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Brand column */}
          <div className="flex flex-col gap-4 lg:max-w-xs">
            <ValtechLogo variant="light" width={120} />
            <p className="text-sm leading-relaxed text-foreground/50">
              The experience innovation company. We transform bold ideas into transformative experiences.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-foreground/70">{column.title}</h4>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground/40 transition-colors hover:text-hover"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-8 md:flex-row">
          <p className="text-xs text-foreground/40">
            {`\u00A9 ${year} ${companyName}. All rights reserved.`}
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-foreground/40 transition-colors hover:text-hover">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-foreground/40 transition-colors hover:text-hover">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs text-foreground/40 transition-colors hover:text-hover">
              Imprint
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
