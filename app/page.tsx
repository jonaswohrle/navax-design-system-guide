import { AppHeader } from "@/components/ds/app-header"
import { AppFooter } from "@/components/ds/app-footer"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-1" />
      <AppFooter />
    </div>
  )
}
