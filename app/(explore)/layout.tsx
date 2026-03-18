import { SiteHeader } from "@/components/explore/site-header"
import { SiteFooter } from "@/components/explore/site-footer"
import { AuthProvider } from "@/lib/auth-context"
import { getPromoBanner } from "@/lib/contentful"
import { ChatLoader } from "@/components/explore/chat-loader"

export default async function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const promoBanner = await getPromoBanner()

  return (
    <AuthProvider>
      <SiteHeader promoBanner={promoBanner} />
      <main>{children}</main>
      <SiteFooter />
      <ChatLoader />
    </AuthProvider>
  )
}
