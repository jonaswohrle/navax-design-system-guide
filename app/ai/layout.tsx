"use client"

import * as React from "react"
import { AppSidebar } from "@/components/ds/app-sidebar"
import { MessageSquare, Blocks, GitBranch, Sparkles, LayoutDashboard } from "lucide-react"

const aiSidebarItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    label: "AI Showcases",
    icon: Sparkles,
    children: [
      { label: "Prompt Coach", href: "/ai/prompt-coach" },
      { label: "Interactive Tools", href: "/ai/interactive-tools" },
      { label: "Content Pipeline", href: "/ai/content-pipeline" },
    ],
  },
]

export default function AILayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/40 text-foreground">
      <AppSidebar items={aiSidebarItems} activePath="/ai" />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
