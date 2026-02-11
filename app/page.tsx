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
import { NavaxLogo } from "@/components/ds/navax-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/* ── Reusable blocks ── */

function AgendaItem({
  number,
  title,
  description,
  href,
  accentClass,
  icon: Icon,
  isMain,
}: {
  number: string
  title: string
  description: string
  href: string
  accentClass: string
  icon: LucideIcon
  isMain?: boolean
}) {
  return (
    <Link href={href} className="group block">
      <Card
        className={cn(
          "h-full border-border transition-all hover:shadow-sm",
          isMain
            ? "border-primary/30 bg-primary/[0.02] hover:border-primary/50"
            : "hover:border-primary/30"
        )}
      >
        <CardContent className="flex h-full flex-col gap-4 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                  isMain
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground"
                )}
              >
                {number}
              </span>
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl",
                  accentClass
                )}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground/0 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-heading font-semibold text-foreground">
              {title}
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          {isMain && (
            <span className="self-start rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
              Hauptteil
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

function DemoCard({
  title,
  description,
  href,
  icon: Icon,
  concepts,
  accentClass,
}: {
  title: string
  description: string
  href: string
  icon: LucideIcon
  concepts: string[]
  accentClass: string
}) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full border-border transition-all hover:border-primary/30 hover:shadow-sm">
        <CardContent className="flex h-full flex-col gap-4 p-5">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                accentClass
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground/0 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-heading font-semibold text-foreground">
              {title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
            {concepts.map((c) => (
              <span
                key={c}
                className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {c}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

/* ── Reference logos as simple text badges (no external images needed) ── */
const references = [
  { name: "OpenAI", src: "/logos/openai.svg" },
  { name: "Microsoft", src: "/logos/microsoft.svg" },
  { name: "Amazon", src: "/logos/amazon.svg" },
  { name: "BCG", src: "/logos/bcg.svg" },
  { name: "WPP", src: "/logos/wpp.svg" },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavaxLogo variant="brand" width={110} />
          <div className="flex items-center gap-2">
            <Link href="/ai/vercel-v0/vercel">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Triangle className="h-3.5 w-3.5" />
                Vercel & v0
              </Button>
            </Link>
            <Link href="/ai">
              <Button size="sm" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                AI Showcases
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero -- Workshop Welcome */}
        <section className="border-b border-border">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 lg:py-24">
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1.5 rounded-full bg-primary/10 px-3 text-[11px] font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                Workshop
              </span>
            </div>
            <h1 className="max-w-3xl text-4xl font-heading font-semibold tracking-tight text-foreground text-balance lg:text-5xl">
              Willkommen zum
              <span className="text-primary"> Vercel & v0 </span>
              Workshop
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground leading-relaxed lg:text-lg">
              In diesem Workshop erfahrt ihr, wie v0 die Art und Weise
              veraendert, wie Software gebaut wird. Wir schauen uns die Vercel-Plattform an,
              bauen gemeinsam mit v0 und erkunden anhand interaktiver AI Showcases,
              was mit modernen AI Tools heute moeglich ist.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/ai/vercel-v0/vercel">
                <Button size="lg" className="gap-2">
                  <Triangle className="h-4 w-4" />
                  Vercel & v0 kennenlernen
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/ai">
                <Button variant="outline" size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Showcases ansehen
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Workshop Agenda */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-2xl font-heading font-semibold tracking-tight text-foreground text-balance">
              Was wir heute machen
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground leading-relaxed">
              Drei Bloecke -- von der Plattform ueber Hands-on mit v0 bis hin zu
              Inspirationen fuer eigene Projekte.
            </p>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              <AgendaItem
                number="1"
                title="Vercel Platform"
                description="Die Plattform hinter Next.js, Turborepo und dem AI SDK. Open Source Foundation, Framework-Defined Infrastructure, Developer Tools und AI Cloud."
                href="/ai/vercel-v0/vercel"
                accentClass="bg-secondary/10 text-secondary"
                icon={Layers}
              />
              <AgendaItem
                number="2"
                title="v0 -- AI-Powered Development"
                description="Der Hauptteil: v0 veraendert, wer Frontend bauen kann. AI Code Generation, Git-native Workflows, Design System Integration und wie aus Prompts Produkte werden."
                href="/ai/vercel-v0"
                accentClass="bg-primary/10 text-primary"
                icon={Code2}
                isMain
              />
              <AgendaItem
                number="3"
                title="AI Showcases -- Projektideen"
                description="Interaktive Demos als Inspiration: Prompt Coach, Image Studio und Content Pipeline. Fertige Patterns fuer AI SDK, Streaming und Multi-Model Pipelines."
                href="/ai"
                accentClass="bg-info/10 text-info"
                icon={Sparkles}
              />
            </div>
          </div>
        </section>

        {/* Why v0 -- Key value props from the attached content */}
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-2xl font-heading font-semibold tracking-tight text-foreground text-balance">
              Warum v0?
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">
              v0 ist nicht nur ein Code-Generator -- es veraendert grundlegend, wie Teams von der Idee
              zum fertigen Produkt kommen.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Rapid Prototyping",
                  desc: "Product Manager beschreiben eine Idee in natuerlicher Sprache. v0 generiert einen funktionierenden Prototyp in Minuten statt Wochen -- so wie es Okta, eBay und Procore bereits tun.",
                  icon: Zap,
                  accent: "bg-primary/10 text-primary",
                },
                {
                  title: "Vibe Coding fuer Teams",
                  desc: "Engineering-Teams nutzen v0 als Coding-Accelerator. Boilerplate generieren, Components scaffolden, interne Tools bauen -- wie bei Microsoft (6.000+ Entwickler) und Amazon.",
                  icon: Code2,
                  accent: "bg-secondary/10 text-secondary",
                },
                {
                  title: "Design System Integration",
                  desc: "v0 kennt eure Design Tokens, Components und Patterns. Jeder generierte Code folgt automatisch eurem Design System -- konsistent, accessible und on-brand.",
                  icon: Cpu,
                  accent: "bg-info/10 text-info",
                },
              ].map((item) => (
                <Card key={item.title} className="border-border">
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        item.accent
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-heading font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI Showcases preview */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-heading font-semibold tracking-tight text-foreground text-balance">
                AI Showcases -- zum Ausprobieren
              </h2>
              <p className="max-w-lg text-sm text-muted-foreground leading-relaxed">
                Jede Demo ist eine funktionierende AI-Anwendung. Testet verschiedene
                Modelle, schaut euch den Code an und lasst euch fuer eigene Projekte inspirieren.
              </p>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              <DemoCard
                title="Prompt Coach"
                description="AI-gestuetztes Feedback zu euren Prompts. Qualitaets-Scores, Analyse und umgeschriebene Versionen im direkten Vergleich."
                href="/ai/prompt-coach"
                icon={MessageSquare}
                concepts={["useChat", "Tool Calling", "Structured Output"]}
                accentClass="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
              />
              <DemoCard
                title="AI Image Studio"
                description="Bilder generieren und transformieren mit Gemini 3 Pro. Referenzbilder hochladen, Transformationen beschreiben, Ergebnisse sehen."
                href="/ai/image-studio"
                icon={ImagePlus}
                concepts={["Multimodal", "Image Generation", "File Upload"]}
                accentClass="bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground"
              />
              <DemoCard
                title="Content Pipeline"
                description="Eine 4-Schritt AI Pipeline, die in Echtzeit recherchiert, schreibt, reviewt und Bilder generiert -- alles live gestreamt."
                href="/ai/content-pipeline"
                icon={GitBranch}
                concepts={["SSE Streaming", "Chained AI Calls", "Pipeline"]}
                accentClass="bg-info/10 text-info group-hover:bg-info group-hover:text-info-foreground"
              />
            </div>
          </div>
        </section>

        {/* References */}
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              v0 wird bereits eingesetzt bei
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-10 lg:gap-16">
              {references.map((ref) => (
                <div key={ref.name} className="flex items-center justify-center grayscale opacity-60 transition-all hover:grayscale-0 hover:opacity-100">
                  <Image
                    src={ref.src}
                    alt={ref.name}
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
            <h2 className="text-2xl font-heading font-semibold tracking-tight text-primary-foreground text-balance lg:text-3xl">
              Bereit loszulegen?
            </h2>
            <p className="max-w-md text-sm text-primary-foreground/80 leading-relaxed">
              Startet mit der Vercel-Plattform oder springt direkt in die
              interaktiven AI Showcases.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/ai/vercel-v0/vercel">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 bg-background text-foreground hover:bg-background/90"
                >
                  <Triangle className="h-4 w-4" />
                  Vercel & v0
                </Button>
              </Link>
              <Link href="/ai">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 bg-background/20 text-primary-foreground hover:bg-background/30"
                >
                  AI Showcases
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <NavaxLogo variant="dark" width={80} />
          <p className="text-xs text-muted-foreground">
            Built with v0, AI SDK 6, and Vercel AI Gateway
          </p>
        </div>
      </footer>
    </div>
  )
}
