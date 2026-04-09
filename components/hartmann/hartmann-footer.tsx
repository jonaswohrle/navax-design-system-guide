import Link from "next/link"
import Image from "next/image"
import type { HartmannFooter as HartmannFooterType } from "@/lib/sitecore"

interface HartmannFooterProps {
  footer: HartmannFooterType
}

export function HartmannFooter({ footer }: HartmannFooterProps) {
  return (
    <footer>
      {/* Main footer - dark navy */}
      <div className="bg-[#002F6C]">
        <div className="mx-auto max-w-[1200px] px-6 py-12 lg:py-16">
          {/* Logo */}
          <div className="mb-10">
            <Image
              src="/images/hartmann-logo.png"
              alt="HARTMANN"
              width={140}
              height={42}
              className="h-9 w-auto brightness-0 invert"
            />
          </div>

          {/* Footer columns */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 text-[13px] font-bold text-white">{col.title}</h3>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[12px] text-white/60 transition-colors hover:text-white"
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

      {/* Bottom legal bar */}
      <div className="bg-[#001d44]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-6 py-4 md:flex-row">
          <p className="text-[11px] text-white/40">
            {footer.companyInfo}
          </p>
          <div className="flex items-center gap-5">
            {footer.legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] text-white/40 transition-colors hover:text-white/70"
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
