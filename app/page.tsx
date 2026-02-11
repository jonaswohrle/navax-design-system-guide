import Link from "next/link"
import {
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  Code2,
  Cpu,
  Layers,
  MessageSquare,
  ImagePlus,
  GitBranch,
  type LucideIcon,
} from "lucide-react"
import { NavaxLogo } from "@/components/ds/navax-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-3xl font-heading font-semibold tracking-tight text-foreground lg:text-4xl">
        {value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}

function TechCard({
  icon: Icon,
  label,
  description,
  accentClass,
}: {
  icon: LucideIcon
  label: string
  description: string
  accentClass: string
}) {
  return (
    <Card className="border-border">
      <CardContent className="flex flex-col gap-3 p-5">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            accentClass
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-heading font-semibold text-foreground">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
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
            <h3 className="text-sm font-heading font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</p>
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

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Minimal top bar */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavaxLogo variant="brand" width={110} />
          <Link href="/ai">
            <Button size="sm" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              AI Showcases
            </Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="border-b border-border">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 lg:py-24">
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1.5 rounded-full bg-primary/10 px-3 text-[11px] font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                v0 + AI SDK + AI Gateway
              </span>
            </div>
            <h1 className="max-w-2xl text-4xl font-heading font-semibold tracking-tight text-foreground text-balance lg:text-5xl">
              From 24-Week Cycles to
              <span className="text-primary"> 12-Day Shipping</span>
            </h1>
            <p className="max-w-xl text-base text-muted-foreground leading-relaxed lg:text-lg">
              How prompt engineering and AI-powered development tools are
              transforming the way NAVAX builds products. A practical deep-dive
              into vibe coding, effective prompting, and modern AI integration.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/ai">
                <Button size="lg" className="gap-2">
                  Explore AI Use Cases
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/ai/prompt-coach">
                <Button variant="outline" size="lg" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Try Prompt Coach
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* The paradigm shift */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-2xl font-heading font-semibold tracking-tight text-foreground text-balance">
              The Paradigm Shift
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground leading-relaxed">
              Traditional product cycles follow a linear path through idea,
              requirements, design, build, and test. With prompt engineering,
              this collapses dramatically.
            </p>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {/* Traditional */}
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-heading font-semibold text-muted-foreground uppercase tracking-wider">
                      Traditional Workflow
                    </h3>
                  </div>
                  <p className="mt-4 text-4xl font-heading font-semibold tracking-tight text-foreground">
                    24 Weeks
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">Full development cycle</p>
                  <div className="mt-6 flex flex-col gap-2">
                    {["Idea & Discovery", "Requirements", "Design", "Build", "Test & Ship"].map(
                      (step, i) => (
                        <div key={step} className="flex items-center gap-3">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-[10px] font-semibold text-muted-foreground">
                            {i + 1}
                          </div>
                          <span className="text-sm text-foreground">{step}</span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Prompt Engineering */}
              <Card className="border-primary/20 bg-primary/[0.02]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-heading font-semibold text-primary uppercase tracking-wider">
                      Prompt Engineering
                    </h3>
                  </div>
                  <p className="mt-4 text-4xl font-heading font-semibold tracking-tight text-primary">
                    12 Days
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    With AI-assisted development
                  </p>
                  <div className="mt-6 flex flex-col gap-2">
                    {["Idea & Prompt", "Iterate & Build", "Ship"].map((step, i) => (
                      <div key={step} className="flex items-center gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                          {i + 1}
                        </div>
                        <span className="text-sm font-medium text-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              <StatBlock value="10M+" label="AI SDK weekly downloads" />
              <StatBlock value="500K+" label="GitHub stars (Next.js)" />
              <StatBlock value="4.3M" label="shadcn/ui weekly downloads" />
              <StatBlock value="12x" label="Faster delivery cycles" />
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-2xl font-heading font-semibold tracking-tight text-foreground text-balance">
              The Technology Stack
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground leading-relaxed">
              Three building blocks that make AI integration practical,
              production-ready, and model-agnostic.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <TechCard
                icon={Code2}
                label="AI SDK 6"
                description="The open-source toolkit for streaming, tool calling, structured output, and agent loops. Works with any LLM provider."
                accentClass="bg-primary/10 text-primary"
              />
              <TechCard
                icon={Cpu}
                label="Vercel AI Gateway"
                description="Unified API for OpenAI, Anthropic, Google, xAI, and more. Switch models with a single string change."
                accentClass="bg-secondary/10 text-secondary"
              />
              <TechCard
                icon={Layers}
                label="Multi-Step Pipelines"
                description="Chain AI calls with structured output at each stage. SSE streaming for real-time progress on every step."
                accentClass="bg-info/10 text-info"
              />
            </div>
          </div>
        </section>

        {/* Live demos preview */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-heading font-semibold tracking-tight text-foreground text-balance">
                Live AI Use Cases
              </h2>
              <p className="max-w-lg text-sm text-muted-foreground leading-relaxed">
                Each demo is a fully functional AI feature you can interact with.
                See the code patterns, try different models, and learn by doing.
              </p>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              <DemoCard
                title="Prompt Coach"
                description="Get AI-powered feedback on your prompts. See quality scores, analysis, and rewritten versions side-by-side."
                href="/ai/prompt-coach"
                icon={MessageSquare}
                concepts={["useChat", "Tool Calling", "Structured Output"]}
                accentClass="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
              />
              <DemoCard
                title="AI Image Studio"
                description="Generate and transform images with Gemini 3 Pro. Upload references, describe transformations, see results."
                href="/ai/image-studio"
                icon={ImagePlus}
                concepts={["Multimodal", "Image Generation", "File Upload"]}
                accentClass="bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground"
              />
              <DemoCard
                title="Content Pipeline"
                description="Watch a 4-step AI pipeline research, draft, review, and polish content in real-time with structured data."
                href="/ai/content-pipeline"
                icon={GitBranch}
                concepts={["SSE Streaming", "Chained AI Calls", "Pipeline"]}
                accentClass="bg-info/10 text-info group-hover:bg-info group-hover:text-info-foreground"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
            <h2 className="text-2xl font-heading font-semibold tracking-tight text-primary-foreground text-balance lg:text-3xl">
              Ready to explore AI-powered development?
            </h2>
            <p className="max-w-md text-sm text-primary-foreground/80 leading-relaxed">
              Jump into the interactive showcases and see how AI SDK, the
              AI Gateway, and prompt engineering work in practice.
            </p>
            <Link href="/ai">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 bg-background text-foreground hover:bg-background/90"
              >
                Open AI Showcases
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
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
