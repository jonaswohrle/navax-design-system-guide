import { SiteHeader } from "@/components/explore/site-header"
import { SiteFooter } from "@/components/explore/site-footer"
import { AuthProvider } from "@/lib/auth-context"
import { getPromoBanner } from "@/lib/contentful"
import dynamic from "next/dynamic"

const TravelChat = dynamic(
  () => import("@/components/explore/travel-chat").then((mod) => mod.TravelChat),
  { ssr: false }
)

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
