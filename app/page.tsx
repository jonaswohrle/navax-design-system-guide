import {
  getHartmannHero,
  getHartmannIntro,
  getHartmannPartnerCategories,
  getHartmannCompetencies,
  getHartmannProductHighlights,
  getHartmannBacillolPromo,
  getHartmannPrivatanwender,
  getHartmannAboutCards,
  getHartmannNavigation,
  getHartmannFooter,
} from "@/lib/sitecore"
import { HartmannHeader } from "@/components/hartmann/hartmann-header"
import { HartmannFooter } from "@/components/hartmann/hartmann-footer"
import { HartmannHero } from "@/components/hartmann/hartmann-hero"
import { HartmannIntro } from "@/components/hartmann/hartmann-intro"
import { HartmannPartners } from "@/components/hartmann/hartmann-partners"
import { HartmannCompetencies } from "@/components/hartmann/hartmann-competencies"
import { HartmannProductHighlights } from "@/components/hartmann/hartmann-product-highlights"
import { HartmannBacillolPromo } from "@/components/hartmann/hartmann-bacillol-promo"
import { HartmannPrivatanwenderSection } from "@/components/hartmann/hartmann-privatanwender"
import { HartmannAbout } from "@/components/hartmann/hartmann-about"

export default async function Page() {
  const [
    hero,
    intro,
    partners,
    competencies,
    products,
    bacillol,
    privatanwender,
    aboutCards,
    navigation,
    footer,
  ] = await Promise.all([
    getHartmannHero(),
    getHartmannIntro(),
    getHartmannPartnerCategories(),
    getHartmannCompetencies(),
    getHartmannProductHighlights(),
    getHartmannBacillolPromo(),
    getHartmannPrivatanwender(),
    getHartmannAboutCards(),
    getHartmannNavigation(),
    getHartmannFooter(),
  ])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <HartmannHeader navigation={navigation} />

      {/* Hero Section */}
      <HartmannHero hero={hero} />

      {/* Intro Section */}
      <HartmannIntro intro={intro} />

      {/* Partner Categories */}
      <HartmannPartners categories={partners} />

      {/* Competencies */}
      <HartmannCompetencies competencies={competencies} />

      {/* Privatanwender */}
      <HartmannPrivatanwenderSection data={privatanwender} />

      {/* Bacillol Promo */}
      <HartmannBacillolPromo promo={bacillol} />

      {/* Product Highlights */}
      <HartmannProductHighlights products={products} />

      {/* About HARTMANN */}
      <HartmannAbout cards={aboutCards} />

      {/* Footer */}
      <HartmannFooter footer={footer} />
    </div>
  )
}
