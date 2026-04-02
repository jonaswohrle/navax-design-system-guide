import Link from "next/link"

const FOOTER_COLS = [
  {
    title: "Produkte",
    links: [
      { label: "Wundversorgung", href: "/vercel/sitecore" },
      { label: "Inkontinenzmanagement", href: "/vercel/sitecore" },
      { label: "Desinfektion", href: "/vercel/sitecore" },
      { label: "OP-Versorgung", href: "/vercel/sitecore" },
      { label: "Fixierung & Stabilisierung", href: "/vercel/sitecore" },
    ],
  },
  {
    title: "Branchen",
    links: [
      { label: "Kliniken", href: "/vercel/sitecore" },
      { label: "Pflegeheime", href: "/vercel/sitecore" },
      { label: "Ambulante Pflege", href: "/vercel/sitecore" },
      { label: "Apotheken", href: "/vercel/sitecore" },
      { label: "Rettungsdienst", href: "/vercel/sitecore" },
    ],
  },
  {
    title: "Unternehmen",
    links: [
      { label: "\u00dcber HARTMANN", href: "/vercel/sitecore" },
      { label: "Karriere", href: "/vercel/sitecore" },
      { label: "Nachhaltigkeit", href: "/vercel/sitecore" },
      { label: "Investor Relations", href: "/vercel/sitecore" },
      { label: "Presse", href: "/vercel/sitecore" },
    ],
  },
  {
    title: "Service",
    links: [
      { label: "Kontakt", href: "/vercel/sitecore" },
      { label: "Schulungen", href: "/vercel/sitecore" },
      { label: "Downloads", href: "/vercel/sitecore" },
      { label: "Newsletter", href: "/vercel/sitecore" },
    ],
  },
]

export function HartmannFooter() {
  return (
    <footer>
      <div className="bg-[#001689] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 text-sm font-bold text-white">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-white/50 transition-colors hover:text-white"
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

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-[11px] text-white/30 md:flex-row lg:px-8">
            <p>
              PAUL HARTMANN AG. Alle Rechte vorbehalten. Paul-Hartmann-Str. 12,
              89522 Heidenheim an der Brenz.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/vercel/sitecore" className="hover:text-white/50">
                Impressum
              </Link>
              <Link href="/vercel/sitecore" className="hover:text-white/50">
                Datenschutz
              </Link>
              <Link href="/vercel/sitecore" className="hover:text-white/50">
                AGB
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
