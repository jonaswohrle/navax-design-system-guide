"use client"

import { HeroSearch } from "./hero-search"

interface PersonalizedHeroProps {
  fallbackImageUrl?: string
}

export function PersonalizedHero({ fallbackImageUrl = "/images/explore/hero-energy.jpg" }: PersonalizedHeroProps) {
  return <HeroSearch backgroundImageUrl={fallbackImageUrl} />
}
