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
  Triangle,
  type LucideIcon,
} from "lucide-react"
import { ValtechLogo } from "@/components/ds/valtech-logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* ── Reusable blocks ── */

function AgendaItem({
  number,
  title,
  description,
  href,
  icon: Icon,
  isMain,
}: {
  number: string
  title: string
  description: string
  href: string
  icon: LucideIcon
  isMain?: boolean
}) {
  return (
    <Link href={href} className="group block">
      <div
        className={cn(
          "flex h-full flex-col gap-6 border-t border-foreground/20 pt-6 transition-all group-hover:border-hover",
          isMain && "border-foreground"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              {number}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 transition-colors group-hover:bg-hover group-hover:text-hover-foreground group-hover:border-hover">
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-foreground/0 transition-all group-hover:translate-x-1 group-hover:text-hover" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-heading font-normal tracking-tight text-foreground transition-colors group-hover:text-hover">
            {title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        {isMain && (
          <span className="self-start rounded-full border border-foreground/30 px-3 py-1 text-xs font-medium text-foreground">
            Hauptteil
          </span>
        )}
      </div>
    </Link>
  )
}

function DemoCard({
  title,
  description,
  href,
  icon: Icon,
  concepts,
}: {
  title: string
  description: string
  href: string
  icon: LucideIcon
  concepts: string[]
}) {
  return (
    <Link href={href} className="group block">
        <div className="flex h-full flex-col gap-5 border-t border-foreground/20 pt-6 transition-all group-hover:border-hover">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/20 transition-colors group-hover:bg-hover group-hover:text-hover-foreground group-hover:border-hover">
            <Icon className="h-5 w-5" />
          </div>
          <ArrowRight className="h-5 w-5 text-foreground/0 transition-all group-hover:translate-x-1 group-hover:text-hover" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-heading font-normal tracking-tight text-foreground transition-colors group-hover:text-hover">
            {title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {concepts.map((c) => (
            <span
              key={c}
              className="rounded-full border border-foreground/15 px-3 py-1 text-xs text-muted-foreground"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar -- Valtech style: clean, black, minimal */}
      <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/">
            <ValtechLogo variant="light" width={140} />
          </Link>
          <nav className="hidden items-center gap-10 lg:flex">
            <Link
              href="/ai/vercel-v0/vercel"
            className="text-sm text-foreground/70 transition-colors hover:text-hover"
          >
            Vercel & v0
          </Link>
          <Link
            href="/ai"
            className="text-sm text-foreground/70 transition-colors hover:text-hover"
            >
              AI Showcases
            </Link>
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
        {/* Hero -- Full-screen Valtech-style hero with background image */}
        <section className="relative flex min-h-screen flex-col justify-end px-6 pb-16 pt-32 overflow-hidden">
          {/* Background image */}
          <Image
            src="/images/hero-bg.png"
            alt=""
            fill
            className="object-cover object-center pointer-events-none"
            priority
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <h1 className="max-w-4xl text-5xl font-heading font-normal tracking-tight text-foreground text-balance lg:text-7xl">
              Willkommen zum
              {" "}Vercel & v0{" "}
              Workshop
            </h1>
          </div>
        </section>

        {/* Workshop Agenda */}
        <section className="bg-[hsl(30,33%,94%)] text-[hsl(0,0%,10%)]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <h2 className="text-3xl font-heading font-normal tracking-tight text-balance lg:text-5xl">
              Was wir heute machen
            </h2>
            <p className="mt-4 max-w-lg text-base text-[hsl(0,0%,40%)] leading-relaxed">
              Drei Bloecke -- von der Plattform ueber Hands-on mit v0 bis hin zu
              Inspirationen fuer eigene Projekte.
            </p>
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              <Link href="/ai/vercel-v0/vercel" className="group block">
                <div className="flex h-full flex-col gap-6 border-t border-[hsl(0,0%,10%)]/20 pt-6 transition-all group-hover:border-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-[hsl(0,0%,40%)]">01</span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(0,0%,10%)]/20 transition-colors group-hover:bg-hover group-hover:text-hover-foreground group-hover:border-hover">
                        <Layers className="h-5 w-5" />
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-transparent transition-all group-hover:translate-x-1 group-hover:text-hover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-normal tracking-tight text-[hsl(0,0%,10%)] transition-colors group-hover:text-hover">
                      Vercel Platform
                    </h3>
                    <p className="mt-2 text-sm text-[hsl(0,0%,40%)] leading-relaxed">
                      Die Plattform hinter Next.js, Turborepo und dem AI SDK. Open Source Foundation, Framework-Defined Infrastructure, Developer Tools und AI Cloud.
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="/ai/vercel-v0" className="group block">
                <div className="flex h-full flex-col gap-6 border-t-2 border-[hsl(0,0%,10%)] pt-6 transition-all group-hover:border-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-[hsl(0,0%,40%)]">02</span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(0,0%,10%)]/20 transition-colors group-hover:bg-hover group-hover:text-hover-foreground group-hover:border-hover">
                        <Code2 className="h-5 w-5" />
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-transparent transition-all group-hover:translate-x-1 group-hover:text-hover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-normal tracking-tight text-[hsl(0,0%,10%)] transition-colors group-hover:text-hover">
                      v0 -- AI-Powered Development
                    </h3>
                    <p className="mt-2 text-sm text-[hsl(0,0%,40%)] leading-relaxed">
                      Der Hauptteil: v0 veraendert, wer Frontend bauen kann. AI Code Generation, Git-native Workflows, Design System Integration und wie aus Prompts Produkte werden.
                    </p>
                  </div>
                  <span className="self-start rounded-full border border-[hsl(0,0%,10%)]/30 px-3 py-1 text-xs font-medium text-[hsl(0,0%,10%)]">
                    Hauptteil
                  </span>
                </div>
              </Link>
              <Link href="/ai" className="group block">
                <div className="flex h-full flex-col gap-6 border-t border-[hsl(0,0%,10%)]/20 pt-6 transition-all group-hover:border-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-[hsl(0,0%,40%)]">03</span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(0,0%,10%)]/20 transition-colors group-hover:bg-hover group-hover:text-hover-foreground group-hover:border-hover">
                        <Sparkles className="h-5 w-5" />
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-transparent transition-all group-hover:translate-x-1 group-hover:text-hover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-normal tracking-tight text-[hsl(0,0%,10%)] transition-colors group-hover:text-hover">
                      AI Showcases -- Projektideen
                    </h3>
                    <p className="mt-2 text-sm text-[hsl(0,0%,40%)] leading-relaxed">
                      Interaktive Demos als Inspiration: Prompt Coach, Image Studio und Content Pipeline. Fertige Patterns fuer AI SDK, Streaming und Multi-Model Pipelines.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Why v0 -- Key value props */}
        <section>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <h2 className="text-3xl font-heading font-normal tracking-tight text-foreground text-balance lg:text-5xl">
              Warum v0?
            </h2>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
              v0 ist nicht nur ein Code-Generator -- es veraendert grundlegend, wie Teams von der Idee
              zum fertigen Produkt kommen.
            </p>
            <div className="mt-16 grid gap-12 sm:grid-cols-3">
              {[
                {
                  title: "Rapid Prototyping",
                  desc: "Product Manager beschreiben eine Idee in natuerlicher Sprache. v0 generiert einen funktionierenden Prototyp in Minuten statt Wochen -- so wie es Okta, eBay und Procore bereits tun.",
                  icon: Zap,
                },
                {
                  title: "Vibe Coding fuer Teams",
                  desc: "Engineering-Teams nutzen v0 als Coding-Accelerator. Boilerplate generieren, Components scaffolden, interne Tools bauen -- wie bei Microsoft (6.000+ Entwickler) und Amazon.",
                  icon: Code2,
                },
                {
                  title: "Design System Integration",
                  desc: "v0 kennt eure Design Tokens, Components und Patterns. Jeder generierte Code folgt automatisch eurem Design System -- konsistent, accessible und on-brand.",
                  icon: Cpu,
                },
              ].map((item) => (
                <div key={item.title} className="flex flex-col gap-4 border-t border-foreground/20 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/20">
                    <item.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-lg font-heading font-normal text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Showcases preview */}
        <section className="bg-[hsl(30,33%,94%)] text-[hsl(0,0%,10%)]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-heading font-normal tracking-tight text-balance lg:text-5xl">
                AI Showcases -- zum Ausprobieren
              </h2>
              <p className="max-w-lg text-base text-[hsl(0,0%,40%)] leading-relaxed">
                Jede Demo ist eine funktionierende AI-Anwendung. Testet verschiedene
                Modelle, schaut euch den Code an und lasst euch fuer eigene Projekte inspirieren.
              </p>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              <Link href="/ai/prompt-coach" className="group block">
                <div className="flex h-full flex-col gap-5 border-t border-[hsl(0,0%,10%)]/20 pt-6 transition-all group-hover:border-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[hsl(0,0%,10%)]/20 transition-colors group-hover:bg-hover group-hover:text-hover-foreground group-hover:border-hover">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-transparent transition-all group-hover:translate-x-1 group-hover:text-hover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-heading font-normal tracking-tight text-[hsl(0,0%,10%)] transition-colors group-hover:text-hover">
                      Prompt Coach
                    </h3>
                    <p className="mt-2 text-sm text-[hsl(0,0%,40%)] leading-relaxed">
                      AI-gestuetztes Feedback zu euren Prompts. Qualitaets-Scores, Analyse und umgeschriebene Versionen im direkten Vergleich.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["useChat", "Tool Calling", "Structured Output"].map((c) => (
                      <span key={c} className="rounded-full border border-[hsl(0,0%,10%)]/15 px-3 py-1 text-xs text-[hsl(0,0%,40%)]">{c}</span>
                    ))}
                  </div>
                </div>
              </Link>
              <Link href="/ai/image-studio" className="group block">
                <div className="flex h-full flex-col gap-5 border-t border-[hsl(0,0%,10%)]/20 pt-6 transition-all group-hover:border-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[hsl(0,0%,10%)]/20 transition-colors group-hover:bg-hover group-hover:text-hover-foreground group-hover:border-hover">
                      <ImagePlus className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-transparent transition-all group-hover:translate-x-1 group-hover:text-hover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-heading font-normal tracking-tight text-[hsl(0,0%,10%)] transition-colors group-hover:text-hover">
                      AI Image Studio
                    </h3>
                    <p className="mt-2 text-sm text-[hsl(0,0%,40%)] leading-relaxed">
                      Bilder generieren und transformieren mit Gemini 3 Pro. Referenzbilder hochladen, Transformationen beschreiben, Ergebnisse sehen.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Multimodal", "Image Generation", "File Upload"].map((c) => (
                      <span key={c} className="rounded-full border border-[hsl(0,0%,10%)]/15 px-3 py-1 text-xs text-[hsl(0,0%,40%)]">{c}</span>
                    ))}
                  </div>
                </div>
              </Link>
              <Link href="/ai/content-pipeline" className="group block">
                <div className="flex h-full flex-col gap-5 border-t border-[hsl(0,0%,10%)]/20 pt-6 transition-all group-hover:border-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[hsl(0,0%,10%)]/20 transition-colors group-hover:bg-hover group-hover:text-hover-foreground group-hover:border-hover">
                      <GitBranch className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-transparent transition-all group-hover:translate-x-1 group-hover:text-hover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-heading font-normal tracking-tight text-[hsl(0,0%,10%)] transition-colors group-hover:text-hover">
                      Content Pipeline
                    </h3>
                    <p className="mt-2 text-sm text-[hsl(0,0%,40%)] leading-relaxed">
                      Eine 4-Schritt AI Pipeline, die in Echtzeit recherchiert, schreibt, reviewt und Bilder generiert -- alles live gestreamt.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["SSE Streaming", "Chained AI Calls", "Pipeline"].map((c) => (
                      <span key={c} className="rounded-full border border-[hsl(0,0%,10%)]/15 px-3 py-1 text-xs text-[hsl(0,0%,40%)]">{c}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* References */}
        <section>
          <div className="mx-auto max-w-7xl px-6 py-16">
            <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              v0 wird bereits eingesetzt bei
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-12 lg:gap-20">
              {["OpenAI", "Microsoft", "Amazon", "BCG", "WPP"].map((name) => (
                <span
                  key={name}
                  className="text-lg font-heading font-normal tracking-tight text-foreground/40 transition-colors hover:text-hover"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[hsl(30,33%,94%)] text-[hsl(0,0%,10%)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 lg:py-28">
            <h2 className="max-w-3xl text-3xl font-heading font-normal tracking-tight text-balance lg:text-5xl">
              Bereit loszulegen?
            </h2>
            <p className="max-w-md text-base text-[hsl(0,0%,40%)] leading-relaxed">
              Startet mit der Vercel-Plattform oder springt direkt in die
              interaktiven AI Showcases.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/ai/vercel-v0/vercel">
                <Button
                  size="lg"
                  className="gap-2 border-[hsl(0,0%,10%)] text-[hsl(0,0%,10%)] hover:bg-hover hover:text-hover-foreground hover:border-hover"
                >
                  Vercel & v0
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/ai">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-[hsl(0,0%,10%)]/30 text-[hsl(0,0%,10%)] hover:border-hover hover:bg-hover hover:text-hover-foreground"
                >
                  AI Showcases
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer -- Valtech style: black, minimal */}
      <footer className="border-t border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <ValtechLogo variant="light" width={120} />
            <nav className="flex flex-wrap gap-8 text-sm text-foreground/60">
              <Link href="/ai/vercel-v0/vercel" className="transition-colors hover:text-hover">Vercel & v0</Link>
              <Link href="/ai" className="transition-colors hover:text-hover">AI Showcases</Link>
              <Link href="/ai/prompt-coach" className="transition-colors hover:text-hover">Prompt Coach</Link>
              <Link href="/ai/image-studio" className="transition-colors hover:text-hover">Image Studio</Link>
              <Link href="/ai/content-pipeline" className="transition-colors hover:text-hover">Content Pipeline</Link>
            </nav>
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-foreground/10 pt-8 md:flex-row md:items-center">
            <p className="text-xs text-foreground/40">
              Built with v0, AI SDK 6, and Vercel AI Gateway
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-xs text-foreground/40 transition-colors hover:text-hover">
                Datenschutz
              </Link>
              <Link href="#" className="text-xs text-foreground/40 transition-colors hover:text-hover">
                Impressum
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
