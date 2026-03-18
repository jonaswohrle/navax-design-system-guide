"use client"

import dynamic from "next/dynamic"

const TravelChat = dynamic(
  () =>
    import("@/components/explore/travel-chat").then((mod) => mod.TravelChat),
  { ssr: false }
)

export function ChatLoader() {
  return <TravelChat />
}
