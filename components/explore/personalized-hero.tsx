"use client"

import { useUnifiedPersonalization } from "@/components/providers/ninetailed-wrapper"
import { HeroSearch } from "./hero-search"
import type { PersonalizedHeroFields } from "@/lib/contentful"

interface PersonalizedHeroProps {
  /** All hero variants fetched server-side from Contentful */
  variants: (PersonalizedHeroFields & { id: string })[]
  /** Fallback image if no variant has one */
  fallbackImageUrl?: string
}

export function PersonalizedHero({ variants, fallbackImageUrl = "/images/explore/hero-santorini.png" }: PersonalizedHeroProps) {
  const personalization = useUnifiedPersonalization()
  const audience = personalization?.audience ?? "default"

  // Find the variant matching the current audience, falling back to "default"
  const variant =
    variants.find((v) => v.audienceTag === audience) ??
    variants.find((v) => v.audienceTag === "default")

  if (!variant) {
    // No variants at all -- render default hero
    return <HeroSearch backgroundImageUrl={fallbackImageUrl} />
  }

  return (
    <HeroSearch
      backgroundImageUrl={variant.backgroundImageUrl || fallbackImageUrl}
      headline={variant.headline}
      subheadline={variant.subheadline}
      ctaLabel={variant.ctaLabel}
      ctaUrl={variant.ctaUrl}
    />
  )
}
