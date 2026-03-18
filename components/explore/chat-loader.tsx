"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"

const TravelChat = dynamic(
  () =>
    import("@/components/explore/travel-chat").then((mod) => mod.TravelChat),
  { ssr: false }
)

export function ChatLoader() {
  const pathname = usePathname()

  if (pathname.startsWith("/ai")) return null

  return <TravelChat />
}
