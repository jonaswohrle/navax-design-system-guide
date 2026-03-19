import { SiteHeader } from "@/components/explore/site-header"
import { SiteFooter } from "@/components/explore/site-footer"
import { AuthProvider } from "@/lib/auth-context"

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </AuthProvider>
  )
}
