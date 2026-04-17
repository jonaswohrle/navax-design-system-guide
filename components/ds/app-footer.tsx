import Link from "next/link"
import { cn } from "@/lib/utils"
import { NavaxLogo } from "./navax-logo"

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
      { label: "Asset Management", href: "#" },
      { label: "Capital Planning", href: "#" },
      { label: "Maintenance", href: "#" },
      { label: "Operations", href: "#" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Education", href: "#" },
      { label: "Government", href: "#" },
      { label: "Healthcare", href: "#" },
      { label: "Manufacturing", href: "#" },
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
      { label: "Case Studies", href: "#" },
      { label: "Events", href: "#" },
      { label: "Newsletter", href: "#" },
    ],
  },
]

export function AppFooter({
  columns = defaultColumns,
  className,
  companyName = "DEMO",
}: AppFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className={cn("bg-foreground text-background", className)}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Brand column */}
          <div className="flex flex-col gap-4 lg:max-w-xs">
            <NavaxLogo variant="light" width={120} />
            <p className="text-sm leading-relaxed text-background/60">
              Empowering you through partnership and innovation. Smart asset management solutions for every industry.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-background/70">{column.title}</h4>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-background/50 transition-colors hover:text-primary"
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
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 md:flex-row">
          <p className="text-xs text-background/40">
            {`\u00A9 ${year} ${companyName}. All rights reserved.`}
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-background/40 transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-background/40 transition-colors hover:text-primary">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs text-background/40 transition-colors hover:text-primary">
              Imprint
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
