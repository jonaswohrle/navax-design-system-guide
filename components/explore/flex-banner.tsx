import Link from "next/link"
import { IconGuaranteed } from "./brand-icons"
import type { FlexPolicyFields } from "@/lib/contentful"

const FALLBACK: FlexPolicyFields = {
  heading: "Explore Flex",
  description:
    "Your wellbeing comes first. We understand that plans change, so we offer a flexible booking policy. With Explore Flex, you can book with confidence knowing that you can change your trip dates or switch to a different adventure.",
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
                Your wellbeing comes first
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                {data.description}
              </p>
            </div>
          </div>

          <div className="w-full shrink-0 rounded-xl border border-border bg-card p-6 lg:w-80">
            <h3 className="mb-2 font-heading text-lg font-bold text-primary">{data.heading}</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Book with confidence. Change your dates or trip for free.
            </p>
            {data.linkUrl && (
              <Link
                href={data.linkUrl}
                className="text-sm font-semibold text-primary transition-colors hover:text-hover"
              >
                {"Find out more \u2192"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
