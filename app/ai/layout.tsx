"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/ds/app-sidebar"
import { Sparkles, LayoutDashboard } from "lucide-react"

const aiSidebarItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    label: "AI Showcases",
    icon: Sparkles,
    children: [
      { label: "Overview", href: "/ai" },
      { label: "Prompt Coach", href: "/ai/prompt-coach" },
      { label: "Image Studio", href: "/ai/image-studio" },
      { label: "Content Pipeline", href: "/ai/content-pipeline" },
    ],
  },
]

export default function AILayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar items={aiSidebarItems} activePath={pathname} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
