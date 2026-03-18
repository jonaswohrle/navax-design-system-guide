import { SiteHeader } from "@/components/explore/site-header"
import { SiteFooter } from "@/components/explore/site-footer"
import { TravelChat } from "@/components/explore/travel-chat"
import { AuthProvider } from "@/lib/auth-context"
import { getPromoBanner } from "@/lib/contentful"


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
      <TravelChat />
    </AuthProvider>
  )
}
