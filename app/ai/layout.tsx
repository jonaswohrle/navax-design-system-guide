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
    <div className="flex h-screen bg-background text-foreground">
      <AppSidebar items={aiSidebarItems} activePath={pathname} />
      <main className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}
