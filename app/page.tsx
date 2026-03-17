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
import { BrightlyLogo } from "@/components/ds/brightly-logo"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar -- Brightly style: clean, white, green accents */}
      <header className="fixed top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/">
            <BrightlyLogo variant="dark" width={140} />
          </Link>
          <nav className="hidden items-center gap-10 lg:flex">
            <Link
              href="/ai/vercel-v0/vercel"
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              Vercel & v0
            </Link>
            <Link
              href="/ai"
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
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
        {/* Hero -- Full-screen Brightly-style hero with green background */}
        <section className="relative flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-16 pt-32">
          {/* Background image */}
          <Image
            src="/images/brightly-hero.png"
            alt=""
            fill
            className="pointer-events-none object-cover object-center"
            priority
          />
          {/* Overlay for text readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C2340]/80 via-transparent to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-white text-balance lg:text-7xl">
              Welcome to the
              <br />
              Vercel & v0 Workshop
            </h1>
            <p className="mt-4 max-w-lg text-lg text-white/80 leading-relaxed">
              Empowering teams through partnership and innovation with AI-powered development.
            </p>
          </div>
        </section>

        {/* Workshop Agenda */}
        <section className="bg-secondary">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance lg:text-5xl">
              What we'll cover today
            </h2>
            <p className="mt-4 max-w-lg text-base text-muted-foreground leading-relaxed">
              Three blocks -- from the platform through hands-on with v0 to
              inspiration for your own projects.
            </p>
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              <Link href="/ai/vercel-v0/vercel" className="group block">
                <div className="flex h-full flex-col gap-6 rounded-lg border border-border bg-background p-6 transition-all group-hover:border-primary group-hover:shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-muted-foreground">01</span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-hover-foreground">
                        <Layers className="h-5 w-5" />
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-transparent transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      Vercel Platform
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      The platform behind Next.js, Turborepo and the AI SDK. Open Source Foundation, Framework-Defined Infrastructure, Developer Tools and AI Cloud.
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="/ai/vercel-v0" className="group block">
                <div className="flex h-full flex-col gap-6 rounded-lg border-2 border-primary bg-background p-6 transition-all group-hover:shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-muted-foreground">02</span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-hover-foreground">
                        <Code2 className="h-5 w-5" />
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-transparent transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      v0 -- AI-Powered Development
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      The main event: v0 changes who can build frontends. AI Code Generation, Git-native Workflows, Design System Integration and how prompts become products.
                    </p>
                  </div>
                  <span className="self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Main part
                  </span>
                </div>
              </Link>
              <Link href="/ai" className="group block">
                <div className="flex h-full flex-col gap-6 rounded-lg border border-border bg-background p-6 transition-all group-hover:border-primary group-hover:shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-muted-foreground">03</span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-hover-foreground">
                        <Sparkles className="h-5 w-5" />
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-transparent transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      AI Showcases -- Project Ideas
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      Interactive demos for inspiration: Prompt Coach, Image Studio and Content Pipeline. Ready-made patterns for AI SDK, Streaming and Multi-Model Pipelines.
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance lg:text-5xl">
              Why v0?
            </h2>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
              v0 is not just a code generator -- it fundamentally changes how teams go from idea
              to finished product.
            </p>
            <div className="mt-16 grid gap-12 sm:grid-cols-3">
              {[
                {
                  title: "Rapid Prototyping",
                  desc: "Product managers describe an idea in natural language. v0 generates a working prototype in minutes instead of weeks -- how Okta, eBay and Procore already do it.",
                  icon: Zap,
                },
                {
                  title: "Vibe Coding for Teams",
                  desc: "Engineering teams use v0 as a coding accelerator. Generate boilerplate, scaffold components, build internal tools -- like Microsoft (6,000+ developers) and Amazon.",
                  icon: Code2,
                },
                {
                  title: "Design System Integration",
                  desc: "v0 knows your design tokens, components and patterns. Every generated code automatically follows your design system -- consistent, accessible and on-brand.",
                  icon: Cpu,
                },
              ].map((item) => (
                <div key={item.title} className="flex flex-col gap-4 rounded-lg border border-border p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
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
        <section className="bg-secondary">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance lg:text-5xl">
                AI Showcases -- Try them out
              </h2>
              <p className="max-w-lg text-base text-muted-foreground leading-relaxed">
                Each demo is a working AI application. Test different
                models, look at the code and get inspired for your own projects.
              </p>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {[
                {
                  title: "Prompt Coach",
                  description: "AI-powered feedback on your prompts. Quality scores, analysis and rewritten versions side by side.",
                  href: "/ai/prompt-coach",
                  icon: MessageSquare,
                  concepts: ["useChat", "Tool Calling", "Structured Output"],
                },
                {
                  title: "AI Image Studio",
                  description: "Generate and transform images with Gemini 3 Pro. Upload reference images, describe transformations, see results.",
                  href: "/ai/image-studio",
                  icon: ImagePlus,
                  concepts: ["Multimodal", "Image Generation", "File Upload"],
                },
                {
                  title: "Content Pipeline",
                  description: "A 4-step AI pipeline that researches, writes, reviews and generates images in real-time -- all streamed live.",
                  href: "/ai/content-pipeline",
                  icon: GitBranch,
                  concepts: ["SSE Streaming", "Chained AI Calls", "Pipeline"],
                },
              ].map((demo) => (
                <Link key={demo.title} href={demo.href} className="group block">
                  <div className="flex h-full flex-col gap-5 rounded-lg border border-border bg-background p-6 transition-all group-hover:border-primary group-hover:shadow-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-hover-foreground">
                        <demo.icon className="h-5 w-5" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-transparent transition-all group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {demo.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {demo.description}
                      </p>
                    </div>
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
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* References */}
        <section>
          <div className="mx-auto max-w-7xl px-6 py-16">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              v0 is already used by
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-12 lg:gap-20">
              {["OpenAI", "Microsoft", "Amazon", "BCG", "WPP"].map((name) => (
                <span
                  key={name}
                  className="text-lg font-semibold tracking-tight text-foreground/30 transition-colors hover:text-primary"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 lg:py-28">
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-primary-foreground text-balance lg:text-5xl">
              Ready to get started?
            </h2>
            <p className="max-w-md text-base text-primary-foreground/80 leading-relaxed">
              Start with the Vercel platform or jump directly into the
              interactive AI showcases.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/ai/vercel-v0/vercel">
                <Button
                  size="lg"
                  className="gap-2 bg-primary-foreground text-primary hover:bg-background hover:text-foreground"
                >
                  Vercel & v0
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/ai">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-primary-foreground/30 text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground/10"
                >
                  AI Showcases
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer -- Brightly style: navy background */}
      <footer className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <BrightlyLogo variant="light" width={120} />
            <nav className="flex flex-wrap gap-8 text-sm text-background/60">
              <Link href="/ai/vercel-v0/vercel" className="transition-colors hover:text-primary">Vercel & v0</Link>
              <Link href="/ai" className="transition-colors hover:text-primary">AI Showcases</Link>
              <Link href="/ai/prompt-coach" className="transition-colors hover:text-primary">Prompt Coach</Link>
              <Link href="/ai/image-studio" className="transition-colors hover:text-primary">Image Studio</Link>
              <Link href="/ai/content-pipeline" className="transition-colors hover:text-primary">Content Pipeline</Link>
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
