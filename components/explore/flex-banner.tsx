import Link from "next/link"
import { IconGuaranteed } from "./brand-icons"
import type { FlexPolicyFields } from "@/lib/contentful"

const FALLBACK: FlexPolicyFields = {
  heading: "E.ON Plus",
  description:
    "Mit E.ON Plus kombinieren Sie verschiedene Energieverträge und sichern sich jährlich bis zu 200 Euro Rabatt sowie weitere exklusive Vorteile. Je mehr Verträge Sie bündeln, desto mehr sparen Sie.",
  linkUrl: "/essential-information/explore-flex",
}

interface FlexBannerProps {
  policy?: FlexPolicyFields | null
}

export function FlexBanner({ policy }: FlexBannerProps) {
  const data = policy ?? FALLBACK

  return (
    <section className="bg-secondary py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
          <div className="flex flex-1 items-start gap-4">
            <div className="shrink-0 rounded-xl bg-accent/10 p-3">
              <IconGuaranteed className="h-10 w-10 text-accent" />
            </div>
            <div>
              <h2 className="mb-2 font-heading text-xl font-bold text-foreground lg:text-2xl">
                Verträge bündeln & sparen
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                {data.description}
              </p>
            </div>
          </div>

          <div className="w-full shrink-0 rounded-xl border border-border bg-card p-6 lg:w-80">
            <h3 className="mb-2 font-heading text-lg font-bold text-primary">{data.heading}</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Kombinieren Sie Ihre Energieverträge und sichern Sie sich exklusive Rabatte.
            </p>
            {data.linkUrl && (
              <Link
                href={data.linkUrl}
                className="text-sm font-semibold text-primary transition-colors hover:text-hover"
              >
                {"Mehr erfahren \u2192"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
