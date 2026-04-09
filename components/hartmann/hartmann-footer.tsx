import Link from "next/link"
import Image from "next/image"
import type { HartmannFooter as HartmannFooterType } from "@/lib/sitecore"

interface HartmannFooterProps {
  footer: HartmannFooterType
}

export function HartmannFooter({ footer }: HartmannFooterProps) {
  return (
    <footer>
      {/* Main footer */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
          <div className="mb-10">
            <Image
              src="/images/hartmann-logo.png"
              alt="HARTMANN"
              width={160}
              height={48}
              className="h-10 w-auto brightness-0 invert"
            />
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 text-sm font-bold text-primary-foreground">{col.title}</h3>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-primary-foreground/70 transition-colors hover:text-primary-foreground"
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
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10 bg-primary">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 md:flex-row">
          <p className="text-[11px] text-primary-foreground/50">
            {footer.companyInfo}
          </p>
          <div className="flex items-center gap-4">
            {footer.legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] text-primary-foreground/50 transition-colors hover:text-primary-foreground/80"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
