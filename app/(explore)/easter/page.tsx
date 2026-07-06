import type { Metadata } from "next"
import EasterEggHunt from "@/components/explore/easter-egg-hunt"

export const metadata: Metadata = {
  title: "Easter Egg Hunt | Win Travel Discounts - Explore",
  description:
    "Find hidden Easter eggs to unlock exclusive travel discounts. Play our Easter Egg Hunt game and save on your next Explore adventure.",
}

export default function EasterPage() {
  return <EasterEggHunt />
}
