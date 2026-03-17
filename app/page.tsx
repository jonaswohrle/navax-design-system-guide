import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Sparkles,
  Zap,
  Code2,
  Cpu,
  Layers,
  MessageSquare,
  ImagePlus,
  GitBranch,
  Palette,
  Rocket,
  Users,
  FileText,
  type LucideIcon,
} from "lucide-react"
import { BrightlyLogo } from "@/components/ds/brightly-logo"
import { Button } from "@/components/ui/button"
import {
  getHero,
  getNavigationLinks,
  getWorkshopBlocks,
  getValueProps,
  getAiShowcases,
  getCtaSection,
  getReferenceLogos,
  getSectionHeading,
  getFooterLinks,
} from "@/lib/contentful"

/* ------------------------------------------------------------------ */
/*  Icon lookup -- maps icon name strings from CMS to Lucide icons    */
/* ------------------------------------------------------------------ */
const ICON_MAP: Record<string, LucideIcon> = {
  Layers,
  Code2,
  Sparkles,
  Zap,
  Cpu,
  MessageSquare,
  ImagePlus,
  ImageIcon: ImagePlus,
  GitBranch,
  Palette,
  Rocket,
  Users,
  FileText,
}

function getIcon(name?: string): LucideIcon {
  return (name && ICON_MAP[name]) || Sparkles
}

/* ------------------------------------------------------------------ */
/*  Fallback data -- used when Contentful API key isn't configured     */
/* ------------------------------------------------------------------ */
const FALLBACK_NAV = [
  { label: "Vercel & v0", href: "/ai/vercel-v0/vercel" },
  { label: "AI Showcases", href: "/ai" },
]

const FALLBACK_HERO = {
  title: "Welcome to the\nVercel & v0 Workshop",
  subtitle: "Empowering teams through partnership and innovation with AI-powered development.",
  imageUrl: undefined as string | undefined,
}

const FALLBACK_WORKSHOP_HEADING = {
  sectionId: "workshop-agenda",
  title: "What we'll cover today",
  subtitle: "Three blocks -- from the platform through hands-on with v0 to inspiration for your own projects.",
}

const FALLBACK_WORKSHOPS = [
  { number: "01", title: "Vercel Platform", description: "The platform behind Next.js, Turborepo and the AI SDK.", href: "/ai/vercel-v0/vercel", icon: "Layers", isHighlighted: false },
  { number: "02", title: "v0 -- AI-Powered Development", description: "The main event: v0 changes who can build frontends.", href: "/ai/vercel-v0", icon: "Code2", isHighlighted: true, highlightLabel: "Main part" },
  { number: "03", title: "AI Showcases -- Project Ideas", description: "Interactive demos for inspiration.", href: "/ai", icon: "Sparkles", isHighlighted: false },
]

const FALLBACK_WHY_HEADING = {
  sectionId: "why-v0",
  title: "Why v0?",
  subtitle: "v0 is not just a code generator -- it fundamentally changes how teams go from idea to finished product.",
}

const FALLBACK_VALUE_PROPS = [
  { title: "Design-System Native", description: "v0 consumes your shadcn registry so every component it generates is automatically on-brand.", icon: "Palette" },
  { title: "Git-Native Workflow", description: "Every prompt creates a commit. Branch, review & merge just like normal development.", icon: "GitBranch" },
  { title: "Production-Ready Output", description: "Accessible, responsive, and fully typed. Ship features instead of fixing AI-generated glue code.", icon: "Rocket" },
  { title: "Non-Devs Can Build", description: "Product owners, designers & marketers build real UIs with natural language -- no handoff needed.", icon: "Users" },
]

const FALLBACK_SHOWCASES_HEADING = {
  sectionId: "ai-showcases",
  title: "AI Showcases",
  subtitle: "Interactive demos you can explore and remix. Each showcase comes with full source code.",
  label: "Try it yourself",
}

const FALLBACK_SHOWCASES = [
  { title: "Prompt Coach", description: "Interactive prompt engineering trainer.", href: "/ai/prompt-coach", icon: "MessageSquare", concepts: ["AI SDK", "Streaming", "Chat UI"] },
  { title: "Image Studio", description: "Generate, edit and remix images with multi-model AI.", href: "/ai/image-studio", icon: "ImageIcon", concepts: ["Image Gen", "Multi-Model", "Pipelines"] },
  { title: "Content Pipeline", description: "End-to-end content workflow with AI assistance.", href: "/ai/content-pipeline", icon: "FileText", concepts: ["Structured Output", "Workflows", "CMS"] },
]

const FALLBACK_REFERENCES = [
  { name: "Siemens" }, { name: "Vercel" }, { name: "Next.js" }, { name: "shadcn/ui" }, { name: "Tailwind CSS" },
]

const FALLBACK_CTA = {
  heading: "Ready to build something?",
  description: "Jump into v0 and start building with the Brightly design system.",
  primaryLabel: "Open in v0",
  primaryHref: "https://v0.dev",
  secondaryLabel: "Browse components",
  secondaryHref: "/#design-system",
}

const FALLBACK_FOOTER_LINKS = [
  { label: "Brightly Software", href: "https://www.brightlysoftware.com" },
  { label: "Siemens", href: "https://www.siemens.com" },
  { label: "Vercel", href: "https://vercel.com" },
  { label: "v0.dev", href: "https://v0.dev" },
]

/* ------------------------------------------------------------------ */
/*  Page component (Server Component with data fetching)              */
/* ------------------------------------------------------------------ */
export default async function Page() {
  const hasToken = !!process.env.CONTENTFUL_ACCESS_TOKEN

  const [
    hero,
    navLinks,
    workshopBlocks,
    valueProps,
    aiShowcases,
    ctaSection,
    referenceLogos,
    workshopHeading,
    whyHeading,
    showcasesHeading,
    footerLinks,
  ] = hasToken
    ? await Promise.all([
        getHero(),
        getNavigationLinks(),
        getWorkshopBlocks(),
        getValueProps(),
        getAiShowcases(),
        getCtaSection(),
        getReferenceLogos(),
        getSectionHeading("workshop-agenda"),
        getSectionHeading("why-v0"),
        getSectionHeading("ai-showcases"),
        getFooterLinks(),
      ])
    : [
        FALLBACK_HERO,
        FALLBACK_NAV,
        FALLBACK_WORKSHOPS,
        FALLBACK_VALUE_PROPS,
        FALLBACK_SHOWCASES,
        FALLBACK_CTA,
        FALLBACK_REFERENCES,
        FALLBACK_WORKSHOP_HEADING,
        FALLBACK_WHY_HEADING,
        FALLBACK_SHOWCASES_HEADING,
        FALLBACK_FOOTER_LINKS,
      ]

  const nav = navLinks ?? FALLBACK_NAV
  const h = hero ?? FALLBACK_HERO
  const workshops = workshopBlocks?.length ? workshopBlocks : FALLBACK_WORKSHOPS
  const values = valueProps?.length ? valueProps : FALLBACK_VALUE_PROPS
  const showcases = aiShowcases?.length ? aiShowcases : FALLBACK_SHOWCASES
  const cta = ctaSection ?? FALLBACK_CTA
  const refs = referenceLogos?.length ? referenceLogos : FALLBACK_REFERENCES
  const wsHeading = workshopHeading ?? FALLBACK_WORKSHOP_HEADING
  const whyH = whyHeading ?? FALLBACK_WHY_HEADING
  const scHeading = showcasesHeading ?? FALLBACK_SHOWCASES_HEADING
  const fLinks = footerLinks?.length ? footerLinks : FALLBACK_FOOTER_LINKS

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="fixed top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/">
            <BrightlyLogo variant="dark" width={140} />
          </Link>
          <nav className="hidden items-center gap-10 lg:flex">
            {nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/ai">
              <Button size="sm">
                AI Showcases
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-16 pt-32">
          <Image
            src={h.imageUrl ?? "/images/brightly-hero.png"}
            alt=""
            fill
            className="pointer-events-none object-cover object-center"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C2340]/80 via-transparent to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white text-balance lg:text-7xl whitespace-pre-line">
              {h.title}
            </h1>
            {h.subtitle && (
              <p className="mt-4 max-w-lg text-lg text-white/80 leading-relaxed">
                {h.subtitle}
              </p>
            )}
          </div>
        </section>

        {/* Workshop Agenda */}
        <section className="bg-secondary">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance lg:text-5xl">
              {wsHeading.title}
            </h2>
            {wsHeading.subtitle && (
              <p className="mt-4 max-w-lg text-base text-muted-foreground leading-relaxed">
                {wsHeading.subtitle}
              </p>
            )}
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {workshops.map((block) => {
                const Icon = getIcon(block.icon)
                const highlighted = block.isHighlighted
                return (
                  <Link key={block.title} href={block.href ?? "#"} className="group block">
                    <div
                      className={`flex h-full flex-col gap-6 rounded-lg p-6 transition-all group-hover:shadow-lg ${
                        highlighted
                          ? "border-2 border-primary bg-background"
                          : "border border-border bg-background group-hover:border-primary"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          {block.number && (
                            <span className="text-sm font-semibold text-muted-foreground">
                              {block.number}
                            </span>
                          )}
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                              highlighted
                                ? "bg-primary text-hover-foreground"
                                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-hover-foreground"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-transparent transition-all group-hover:translate-x-1 group-hover:text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {block.title}
                        </h3>
                        {block.description && (
                          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                            {block.description}
                          </p>
                        )}
                      </div>
                      {highlighted && block.highlightLabel && (
                        <span className="self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {block.highlightLabel}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Why v0 */}
        <section>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance lg:text-5xl">
              {whyH.title}
            </h2>
            {whyH.subtitle && (
              <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
                {whyH.subtitle}
              </p>
            )}
            <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((item) => {
                const Icon = getIcon(item.icon)
                return (
                  <div key={item.title} className="flex flex-col gap-4 rounded-lg border border-border p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* AI Showcases */}
        <section className="bg-secondary">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <div className="flex flex-col gap-2">
              {scHeading.label && (
                <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                  {scHeading.label}
                </span>
              )}
              <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance lg:text-5xl">
                {scHeading.title}
              </h2>
              {scHeading.subtitle && (
                <p className="max-w-lg text-base text-muted-foreground leading-relaxed">
                  {scHeading.subtitle}
                </p>
              )}
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {showcases.map((demo) => {
                const Icon = getIcon(demo.icon)
                return (
                  <Link key={demo.title} href={demo.href ?? "#"} className="group block">
                    <div className="flex h-full flex-col gap-5 rounded-lg border border-border bg-background p-6 transition-all group-hover:border-primary group-hover:shadow-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-hover-foreground">
                          <Icon className="h-5 w-5" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-transparent transition-all group-hover:translate-x-1 group-hover:text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {demo.title}
                        </h3>
                        {demo.description && (
                          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                            {demo.description}
                          </p>
                        )}
                      </div>
                      {demo.concepts && demo.concepts.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {demo.concepts.map((c) => (
                            <span
                              key={c}
                              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* References */}
        <section>
          <div className="mx-auto max-w-7xl px-6 py-16">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Powered by
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-12 lg:gap-20">
              {refs.map((r) => (
                <span
                  key={r.name}
                  className="text-lg font-semibold tracking-tight text-foreground/30 transition-colors hover:text-primary"
                >
                  {r.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 lg:py-28">
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-primary-foreground text-balance lg:text-5xl">
              {cta.heading}
            </h2>
            {cta.description && (
              <p className="max-w-md text-base text-primary-foreground/80 leading-relaxed">
                {cta.description}
              </p>
            )}
            <div className="flex flex-col gap-4 sm:flex-row">
              {cta.primaryLabel && cta.primaryHref && (
                <Link href={cta.primaryHref}>
                  <Button
                    size="lg"
                    className="gap-2 bg-primary-foreground text-primary hover:bg-background hover:text-foreground"
                  >
                    {cta.primaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {cta.secondaryLabel && cta.secondaryHref && (
                <Link href={cta.secondaryHref}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 border-primary-foreground/30 text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground/10"
                  >
                    {cta.secondaryLabel}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <BrightlyLogo variant="light" width={120} />
            <nav className="flex flex-wrap gap-8 text-sm text-background/60">
              {fLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-background/10 pt-8 md:flex-row md:items-center">
            <p className="text-xs text-background/40">
              Built with v0, AI SDK 6, and Vercel AI Gateway
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-xs text-background/40 transition-colors hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-background/40 transition-colors hover:text-primary">
                Imprint
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
