import { SiteHeader } from "@/components/explore/site-header"
import { SiteFooter } from "@/components/explore/site-footer"
import { getPromoBanner } from "@/lib/contentful"

export default async function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const promoBanner = await getPromoBanner()

  return (
    <>
      <SiteHeader promoBanner={promoBanner} />
      <main>{children}</main>
      <SiteFooter />
    </>
  )
}
