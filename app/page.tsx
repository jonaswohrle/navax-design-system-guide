import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Shield, Heart, Microscope, Building2, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HartmannHeader } from "@/components/hartmann/site-header"
import { HartmannFooter } from "@/components/hartmann/site-footer"

const PRODUCT_AREAS = [
  {
    title: "Wundversorgung",
    description: "Innovative Wundauflagen und Verbandmaterialien f\u00fcr jede Phase der Wundheilung -- von HydroClean bis Hydrosorb.",
    imageUrl: "/images/hartmann/product-wound-care.jpg",
    href: "/vercel/sitecore",
    brands: ["HydroClean", "Hydrosorb", "TenderWet"],
  },
  {
    title: "Desinfektion & Hygiene",
    description: "Sterillium, Bacillol und weitere bew\u00e4hrte L\u00f6sungen f\u00fcr H\u00e4nde-, Fl\u00e4chen- und Instrumentendesinfektion.",
    imageUrl: "/images/hartmann/product-hygiene.jpg",
    href: "/vercel/sitecore",
    brands: ["Sterillium", "Bacillol", "Dismozon"],
  },
  {
    title: "Inkontinenzversorgung",
    description: "MoliCare-Produkte f\u00fcr ein selbstbestimmtes Leben -- diskret, zuverl\u00e4ssig und hautfreundlich.",
    imageUrl: "/images/hartmann/product-incontinence.jpg",
    href: "/vercel/sitecore",
    brands: ["MoliCare", "MoliNea", "MoliForm"],
  },
]

const TRUST_ITEMS = [
  { icon: Shield, label: "200+ Jahre Erfahrung", desc: "Seit 1818 im Dienst der Gesundheit" },
  { icon: Heart, label: "Hilft. Pflegt. Sch\u00fctzt.", desc: "Unser Versprechen an Patienten und Pflegekr\u00e4fte" },
  { icon: Microscope, label: "Forschung & Innovation", desc: "Eigene R&D-Zentren weltweit" },
  { icon: Award, label: "Qualit\u00e4tsf\u00fchrer", desc: "Zertifiziert nach h\u00f6chsten Standards" },
]

const MARKET_SEGMENTS = [
  { icon: Building2, title: "Kliniken", desc: "Umfassende L\u00f6sungen f\u00fcr station\u00e4re Versorgung, OP und Intensivmedizin." },
  { icon: Users, title: "Pflegeheime", desc: "Produkte und Services f\u00fcr die Langzeitpflege und Betreuung." },
  { icon: Heart, title: "Ambulante Pflege", desc: "Zuverl\u00e4ssige Versorgung f\u00fcr h\u00e4usliche Pflege und mobile Teams." },
  { icon: Shield, title: "Apotheken & Fachhandel", desc: "Beratung und Produkte f\u00fcr Endverbraucher und Fachpersonal." },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HartmannHeader />

      {/* Hero Section */}
      <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
        <Image
          src="/images/hartmann/hero-healthcare.jpg"
          alt="HARTMANN healthcare professionals in modern clinical environment"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001689]/85 via-[#001689]/50 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#0045FF]/80">
              Hilft. Pflegt. Sch\u00fctzt.
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white lg:text-6xl text-balance">
              Intelligente L\u00f6sungen f\u00fcr die Gesundheitsversorgung
            </h1>
            <p className="mb-8 max-w-lg text-lg text-white/80 leading-relaxed">
              Seit \u00fcber 200 Jahren entwickelt PAUL HARTMANN innovative Medizin- und Pflegeprodukte. 
              Entdecken Sie, wie wir mit Sitecore AI die digitale Zukunft gestalten.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-[#0045FF] text-white hover:bg-[#0035CC] font-semibold px-8">
                <Link href="/vercel/sitecore/chat">
                  Sitecore AI erleben
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8">
                <Link href="/vercel/sitecore">
                  Alle Showcases
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-b border-border bg-secondary">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 lg:grid-cols-4 lg:px-8">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#0045FF]/10">
                <item.icon className="h-5 w-5 text-[#0045FF]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Areas */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#0045FF]">
              Produktbereiche
            </p>
            <h2 className="text-3xl font-bold text-foreground lg:text-4xl text-balance">
              Kompetenz in drei Kernbereichen
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {PRODUCT_AREAS.map((area) => (
              <Link key={area.title} href={area.href} className="group block overflow-hidden rounded-xl border border-border transition-all hover:border-[#0045FF]/30 hover:shadow-lg">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={area.imageUrl}
                    alt={area.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-foreground group-hover:text-[#0045FF] transition-colors">
                    {area.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                    {area.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {area.brands.map((brand) => (
                      <span key={brand} className="rounded-full bg-[#0045FF]/10 px-3 py-1 text-xs font-medium text-[#0045FF]">
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

      {/* Market Segments */}
      <section className="bg-[#001689] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#0045FF]">
              Branchen
            </p>
            <h2 className="text-3xl font-bold text-white lg:text-4xl text-balance">
              L\u00f6sungen f\u00fcr jede Versorgungsstufe
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MARKET_SEGMENTS.map((seg) => (
              <div key={seg.title} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-[#0045FF]/40 hover:bg-white/10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#0045FF]/20">
                  <seg.icon className="h-5 w-5 text-[#0045FF]" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{seg.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{seg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI & Sitecore CTA */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#001689] to-[#0045FF]">
            <div className="flex flex-col gap-8 p-10 lg:flex-row lg:items-center lg:p-16">
              <div className="flex-1">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/60">
                  Sitecore AI + HARTMANN
                </p>
                <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl text-balance">
                  Erleben Sie die Zukunft des Content Managements
                </h2>
                <p className="max-w-lg text-base text-white/70 leading-relaxed">
                  Unser AI-gest\u00fctztes Content Studio verbindet Sitecore MCP mit 48 intelligenten Tools. 
                  Erstellen Sie Seiten, verwalten Sie Assets und personalisieren Sie Erlebnisse -- 
                  alles durch nat\u00fcrliche Sprache.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-white text-[#001689] hover:bg-white/90 font-semibold px-8">
                  <Link href="/vercel/sitecore/chat">
                    Content Studio starten
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8">
                  <Link href="/vercel/sitecore">
                    Mehr erfahren
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About HARTMANN */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#0045FF]">
              \u00dcber HARTMANN
            </p>
            <h2 className="mb-6 text-3xl font-bold text-foreground lg:text-4xl text-balance">
              Seit 1818 im Dienst der Gesundheit
            </h2>
            <p className="mb-4 text-base text-muted-foreground leading-relaxed">
              Die PAUL HARTMANN AG mit Sitz in Heidenheim an der Brenz ist ein international f\u00fchrender 
              Hersteller von Medizin- und Pflegeprodukten. Mit \u00fcber 10.000 Mitarbeitern in \u00fcber 30 L\u00e4ndern 
              entwickeln und produzieren wir L\u00f6sungen in den Bereichen Wundversorgung, Inkontinenzmanagement, 
              Desinfektion und OP-Versorgung.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Unsere Marken wie Sterillium, MoliCare und HydroClean stehen weltweit f\u00fcr Qualit\u00e4t, Innovation 
              und Zuverl\u00e4ssigkeit. Mit der Integration von Sitecore AI treiben wir die digitale Transformation 
              unserer Kommunikation voran.
            </p>
          </div>
        </div>
      </section>

      <HartmannFooter />
    </div>
  )
}
