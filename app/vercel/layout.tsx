"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/ds/app-sidebar"
import { Sparkles, LayoutDashboard, Triangle, Users } from "lucide-react"

const vercelSidebarItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    label: "Vercel & v0",
    icon: Triangle,
    children: [
      { label: "Vercel Platform", href: "/vercel/vercel-v0/vercel" },
      { label: "v0 & Workflows", href: "/vercel/vercel-v0" },
    ],
  },
  {
    label: "KI-Showcases",
    icon: Sparkles,
    children: [
      { label: "Übersicht", href: "/vercel" },
      { label: "Prompt Coach", href: "/vercel/prompt-coach" },
      { label: "Bildstudio", href: "/vercel/image-studio" },
      { label: "Content Pipeline", href: "/vercel/content-pipeline" },
    ],
  },
  {
    label: "Personalisierung",
    icon: Users,
    children: [
      { label: "Live-Profil", href: "/vercel/personalization" },
    ],
  },
]

export default function VercelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="theme-valtech flex h-screen bg-background text-foreground">
      <AppSidebar items={vercelSidebarItems} activePath={pathname} />
      <main className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}
