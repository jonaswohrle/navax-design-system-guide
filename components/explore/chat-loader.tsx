"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { MessageCircle } from "lucide-react"

export function ChatLoader() {
  const pathname = usePathname()

  // Hide on AI / vercel sections (they have their own chat)
  if (pathname.startsWith("/ai") || pathname.startsWith("/vercel")) return null

  return (
    <Link
      href="/vercel/sitecore/chat"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0045FF] text-white shadow-lg transition-transform hover:scale-110 hover:bg-[#0035CC]"
      aria-label="Sitecore AI Chat"
    >
      <MessageCircle className="h-6 w-6" />
    </Link>
  )
}
