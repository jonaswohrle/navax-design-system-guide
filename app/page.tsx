import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Shield, Heart, Microscope, Building2, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HartmannHeader } from "@/components/hartmann/site-header"
import { HartmannFooter } from "@/components/hartmann/site-footer"
import {
  getHomepageContent,
  type HeroBanner,
  type TrustStrip,
  type ProductAreasGrid,
  type MarketSegmentsGrid,
  type CtaBanner,
  type AboutSection,
} from "@/lib/sitecore-content"

/* ── Icon map (Sitecore stores icon names as strings) ────────── */

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Heart,
  Microscope,
  Award,
  Building2,
  Users,
}

function getIcon(name: string) {
  return ICON_MAP[name] || Shield
}

/* ── Section Components ─────────────────────────────────────── */

function HeroSection({ fields }: { fields: HeroBanner["fields"] }) {
  return (
    <section className="relative h-[600px] overflow-hidden lg:h-[700px]">
      <Image
        src={fields.backgroundImage}
        alt={fields.backgroundImageAlt}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#001689]/85 via-[#001689]/50 to-transparent" />
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/60">
            {fields.tagline}
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white lg:text-6xl text-balance">
            {fields.headline}
          </h1>
          <p className="mb-8 max-w-lg text-lg text-white/80 leading-relaxed">
            {fields.subheadline}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="bg-[#0045FF] px-8 font-semibold text-white hover:bg-[#0035CC]"
            >
              <Link href={fields.ctaPrimaryHref}>
                {fields.ctaPrimaryLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 px-8 font-semibold text-white hover:bg-white/10"
            >
              <Link href={fields.ctaSecondaryHref}>
                {fields.ctaSecondaryLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustStripSection({ fields }: { fields: TrustStrip["fields"] }) {
  return (
    <section className="border-b border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 lg:grid-cols-4 lg:px-8">
        {fields.items.map((item) => {
          const Icon = getIcon(item.icon)
          return (
            <div key={item.label} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#0045FF]/10">
                <Icon className="h-5 w-5 text-[#0045FF]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ProductAreasSection({ fields }: { fields: ProductAreasGrid["fields"] }) {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#0045FF]">
            {fields.sectionLabel}
          </p>
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl text-balance">
            {fields.headline}
          </h2>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {fields.areas.map((area) => (
            <Link
              key={area.title}
              href={area.href}
              className="group block overflow-hidden rounded-xl border border-border transition-all hover:border-[#0045FF]/30 hover:shadow-lg"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={area.imageUrl}
                  alt={area.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-[#0045FF]">
                  {area.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                  {area.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {area.brands.map((brand) => (
                    <span
                      key={brand}
                      className="rounded-full bg-[#0045FF]/10 px-3 py-1 text-xs font-medium text-[#0045FF]"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function MarketSegmentsSection({ fields }: { fields: MarketSegmentsGrid["fields"] }) {
  return (
    <section className="bg-[#001689] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#0045FF]">
            {fields.sectionLabel}
          </p>
          <h2 className="text-3xl font-bold text-white lg:text-4xl text-balance">
            {fields.headline}
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fields.segments.map((seg) => {
            const Icon = getIcon(seg.icon)
            return (
              <div
                key={seg.title}
                className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-[#0045FF]/40 hover:bg-white/10"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#0045FF]/20">
                  <Icon className="h-5 w-5 text-[#0045FF]" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{seg.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{seg.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CtaBannerSection({ fields }: { fields: CtaBanner["fields"] }) {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#001689] to-[#0045FF]">
          <div className="flex flex-col gap-8 p-10 lg:flex-row lg:items-center lg:p-16">
            <div className="flex-1">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/60">
                {fields.sectionLabel}
              </p>
              <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl text-balance">
                {fields.headline}
              </h2>
              <p className="max-w-lg text-base text-white/70 leading-relaxed">
                {fields.description}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-white px-8 font-semibold text-[#001689] hover:bg-white/90"
              >
                <Link href={fields.ctaPrimaryHref}>
                  {fields.ctaPrimaryLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 px-8 font-semibold text-white hover:bg-white/10"
              >
                <Link href={fields.ctaSecondaryHref}>
                  {fields.ctaSecondaryLabel}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutSectionComponent({ fields }: { fields: AboutSection["fields"] }) {
  return (
    <section className="bg-secondary py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#0045FF]">
            {fields.sectionLabel}
          </p>
          <h2 className="mb-6 text-3xl font-bold text-foreground lg:text-4xl text-balance">
            {fields.headline}
          </h2>
          {fields.paragraphs.map((p, i) => (
            <p key={i} className="mb-4 text-base text-muted-foreground leading-relaxed last:mb-0">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Page ────────────────────────────────────────────────────── */

export default function Page() {
  const page = getHomepageContent()

  // Extract typed components from the Sitecore page data
  const hero = page.components.find((c) => c.componentName === "HeroBanner") as HeroBanner | undefined
  const trust = page.components.find((c) => c.componentName === "TrustStrip") as TrustStrip | undefined
  const products = page.components.find((c) => c.componentName === "ProductAreasGrid") as ProductAreasGrid | undefined
  const segments = page.components.find((c) => c.componentName === "MarketSegmentsGrid") as MarketSegmentsGrid | undefined
  const cta = page.components.find((c) => c.componentName === "CtaBanner") as CtaBanner | undefined
  const about = page.components.find((c) => c.componentName === "AboutSection") as AboutSection | undefined

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HartmannHeader />
      {hero && <HeroSection fields={hero.fields} />}
      {trust && <TrustStripSection fields={trust.fields} />}
      {products && <ProductAreasSection fields={products.fields} />}
      {segments && <MarketSegmentsSection fields={segments.fields} />}
      {cta && <CtaBannerSection fields={cta.fields} />}
      {about && <AboutSectionComponent fields={about.fields} />}
      <HartmannFooter />
    </div>
  )
}
