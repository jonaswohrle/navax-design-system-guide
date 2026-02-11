import { AppSidebar } from "@/components/ds/app-sidebar"
import { Heading } from "@/components/ds/heading"
import { Text } from "@/components/ds/text"

export default function Page() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="flex flex-col gap-2">
          <Heading level={1}>Dashboard</Heading>
          <Text variant="small">Welcome back. Here is an overview of your workspace.</Text>
        </div>
      </main>
    </div>
  )
}
