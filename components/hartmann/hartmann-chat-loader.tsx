"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"

const HartmannChat = dynamic(
  () =>
    import("@/components/hartmann/hartmann-chat").then((mod) => mod.HartmannChat),
  { ssr: false }
)

export function HartmannChatLoader() {
  const pathname = usePathname()

  if (pathname.startsWith("/ai") || pathname.startsWith("/vercel")) return null

  return <HartmannChat />
}
