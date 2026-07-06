"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"

const ShopAssistant = dynamic(
  () =>
    import("@/components/shop/shop-assistant").then((mod) => mod.ShopAssistant),
  { ssr: false }
)

export function ChatLoader() {
  const pathname = usePathname()

  if (pathname.startsWith("/ai") || pathname.startsWith("/vercel")) return null

  return <ShopAssistant />
}
