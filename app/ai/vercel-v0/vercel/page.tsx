import {
  Triangle,
  Globe,
  Code2,
  Layers,
  Zap,
  Server,
  GitBranch,
  Shield,
  Cloud,
  Bot,
  Cpu,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/* ── Reusable section heading ── */
function SectionHeading({
  badge,
  title,
  description,
}: {
  badge: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
        {badge}
      </span>
      <h2 className="text-2xl font-heading font-semibold tracking-tight text-foreground text-balance">
        {title}
      </h2>
      <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

/* ── Icon feature card ── */
function FeatureCard({
  icon: Icon,
  title,
  description,
  accentClass,
}: {
  icon: LucideIcon
  title: string
  description: string
  accentClass: string
}) {
  return (
    <Card className="border-border">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", accentClass)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-heading font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

/* ── OSS project card ── */
function OssCard({
  name,
  description,
  stats,
  accentClass,
}: {
  name: string
  description: string
  stats: string
  accentClass: string
}) {
  return (
    <Card className="border-border">
      <CardContent className="flex flex-col gap-2 p-5">
        <div className="flex items-center justify-between">
          <p className="font-heading text-sm font-semibold text-foreground">{name}</p>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", accentClass)}>{stats}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

/* ── Infrastructure layer ── */
function InfraLayer({
  icon: Icon,
  title,
  description,
  accentClass,
}: {
  icon: LucideIcon
  title: string
  description: string
  accentClass: string
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/30">
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", accentClass)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

export default function VercelPlatformPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Triangle className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-heading font-semibold text-foreground">Vercel Platform</h1>
            <p className="text-[11px] text-muted-foreground">
              Open source, framework-defined infrastructure, and AI Cloud
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">

          {/* ── Hero ── */}
          <section className="flex flex-col gap-4 pb-12">
            <span className="flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
              <Triangle className="h-3 w-3" />
              Vercel Platform
            </span>
            <h1 className="max-w-2xl text-3xl font-heading font-semibold tracking-tight text-foreground text-balance lg:text-4xl">
              The Platform Behind Modern Web Development
            </h1>
            <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
              Vercel is where developers build, ship, and scale the modern web. From open-source
              frameworks to self-driving infrastructure and a purpose-built AI Cloud, Vercel handles
              the complexity so teams can focus on creating exceptional user experiences.
            </p>

            {/* Tech pills */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Code2, label: "v0", desc: "AI-powered code generation with design system integration", accent: "bg-primary/10 text-primary" },
                { icon: Zap, label: "Workflows", desc: "Durable, resumable multi-step agent orchestration", accent: "bg-secondary/10 text-secondary" },
                { icon: Cloud, label: "AI Gateway", desc: "Unified routing to OpenAI, Anthropic, Google, Bedrock", accent: "bg-info/10 text-info" },
                { icon: Globe, label: "Edge Network", desc: "Global CDN with 100+ points of presence", accent: "bg-primary/10 text-primary" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted/30">
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", t.accent)}>
                    <t.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{t.label}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Open Source Foundation ── */}
          <section className="border-t border-border py-12">
            <SectionHeading
              badge="Open Source"
              title="Built on Open Source"
              description="Vercel's most impactful tools are free and open-source -- downloaded over 100 million times per week. The open-source foundation ensures no vendor lock-in and a thriving community that shapes the modern web."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OssCard
                name="Next.js"
                description="The React framework for production. Hybrid static and server rendering, TypeScript support, smart bundling, route pre-fetching, file-system routing, and API routes."
                stats="130k+ Stars"
                accentClass="bg-foreground/10 text-foreground"
              />
              <OssCard
                name="Turborepo"
                description="High-performance monorepo build system. Incremental computation, content-aware hashing, parallel execution, and remote caching for teams of any size."
                stats="27k+ Stars"
                accentClass="bg-primary/10 text-primary"
              />
              <OssCard
                name="AI SDK"
                description="The TypeScript toolkit for building AI applications. Unified provider API, streaming UI, structured outputs, tool calling, and agent patterns -- framework-agnostic."
                stats="15k+ Stars"
                accentClass="bg-secondary/10 text-secondary"
              />
              <OssCard
                name="Nuxt"
                description="The intuitive Vue framework. Server-side rendering, file-based routing, auto imports, and a rich module ecosystem. Vercel provides first-class deployment support."
                stats="56k+ Stars"
                accentClass="bg-info/10 text-info"
              />
              <OssCard
                name="SvelteKit"
                description="The Svelte application framework for building fast web apps. Server-side rendering, code splitting, and zero-JS hydration patterns. Natively supported on Vercel."
                stats="19k+ Stars"
                accentClass="bg-muted text-muted-foreground"
              />
              <OssCard
                name="shadcn/ui"
                description="Beautifully designed, accessible UI components built with Radix UI and Tailwind CSS. Copy-paste into your project -- you own the code. Powers design systems worldwide."
                stats="82k+ Stars"
                accentClass="bg-primary/10 text-primary"
              />
            </div>

            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
              <div className="flex items-start gap-3">
                <Code2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Why Open Source Matters</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Every line of code you write with Next.js, Turborepo, or the AI SDK is yours.
                    No proprietary runtime, no lock-in. Deploy anywhere -- Vercel just makes it faster.
                    The community contributes features, finds bugs, and shapes the roadmap.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Framework-Defined Infrastructure ── */}
          <section className="border-t border-border py-12">
            <SectionHeading
              badge="Infrastructure"
              title="Framework-Defined Infrastructure"
              description="Traditional infrastructure requires manual configuration of servers, CDNs, databases, and scaling
              policies. Vercel inverts this: your framework defines the infrastructure. Write code, and the platform
              automatically provisions what you need."
            />

            <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-2">
              <div className="flex flex-col justify-between gap-4">
                <InfraLayer
                  icon={Globe}
                  title="Edge Network"
                  description="Content is served from the edge location closest to each user. Static assets, serverless functions, and ISR pages are distributed across 100+ points of presence worldwide."
                  accentClass="bg-primary/10 text-primary"
                />
                <InfraLayer
                  icon={Server}
                  title="Serverless Functions"
                  description="API routes and server components run as serverless functions. Automatic scaling from zero to millions of requests. Pay only for what you use -- no idle servers."
                  accentClass="bg-secondary/10 text-secondary"
                />
                <InfraLayer
                  icon={Layers}
                  title="Zero-Config Backends"
                  description="Deploy Python (FastAPI, Flask, Django) and TypeScript (Express, Hono) backends with zero configuration. Vercel reads the framework and provisions the right runtime."
                  accentClass="bg-info/10 text-info"
                />
                <InfraLayer
                  icon={Shield}
                  title="Enterprise Security"
                  description="SOC 2 Type II compliance, DDoS protection, WAF, and automatic HTTPS. Security headers, CSP policies, and audit logs for enterprise governance."
                  accentClass="bg-primary/10 text-primary"
                />
              </div>

              <Card className="border-border h-full">
                <CardContent className="flex h-full flex-col gap-5 p-6">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-heading font-semibold text-foreground uppercase tracking-wider">
                      Self-Driving Infrastructure
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Vercel is moving beyond &quot;infrastructure as code&quot; to infrastructure that drives itself.
                    The platform learns from production data to automatically optimize performance, detect
                    issues before they impact users, and recommend code improvements.
                  </p>
                  <div className="flex flex-col gap-3">
                    {[
                      {
                        title: "Express Intent, Not Configuration",
                        desc: "Tell the platform what you need, not how to set it up. Vercel reads your framework, your routes, your data patterns, and provisions the optimal infrastructure.",
                      },
                      {
                        title: "Automatic Issue Detection",
                        desc: "Production monitoring that doesn't just alert -- it diagnoses. Vercel AI identifies performance regressions, error patterns, and scaling bottlenecks.",
                      },
                      {
                        title: "Proactive Optimization",
                        desc: "The platform continuously analyzes traffic patterns, resource usage, and response times. It adjusts caching strategies, function regions, and edge rules without manual intervention.",
                      },
                      {
                        title: "AI-Powered Recommendations",
                        desc: "Vercel Agent surfaces actionable suggestions: unused dependencies, slow database queries, suboptimal image formats, missing cache headers. Fix with one click.",
                      },
                    ].map((item) => (
                      <div key={item.title} className="rounded-lg bg-muted/60 px-3 py-2.5">
                        <p className="text-xs font-semibold text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ── Developer Tools ── */}
          <section className="border-t border-border py-12">
            <SectionHeading
              badge="Developer Experience"
              title="Developer Tools That Scale"
              description="From local development to global production, Vercel provides a seamless developer experience.
              Every tool is designed to reduce friction and help teams ship faster."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={GitBranch}
                title="Preview Deployments"
                description="Every Git push gets a unique URL. Share with stakeholders, run E2E tests, and validate changes before they hit production. Integrated with GitHub, GitLab, and Bitbucket."
                accentClass="bg-primary/10 text-primary"
              />
              <FeatureCard
                icon={Layers}
                title="Vercel Toolbar"
                description="In-page collaboration for your team. Visual feedback, feature flags, draft mode, and performance insights -- all accessible directly in the preview deployment."
                accentClass="bg-secondary/10 text-secondary"
              />
              <FeatureCard
                icon={Globe}
                title="Observability"
                description="Full-stack visibility with Vercel Analytics, Speed Insights, and Logs. Track Core Web Vitals (LCP, CLS, INP), real-user metrics, audience insights, and function performance."
                accentClass="bg-info/10 text-info"
              />
              <FeatureCard
                icon={Cloud}
                title="AI Gateway"
                description="Unified API for every AI provider. Route requests to OpenAI, Anthropic, Google, or AWS Bedrock through a single endpoint. Built-in rate limiting, cost tracking, and fallback routing."
                accentClass="bg-primary/10 text-primary"
              />
              <FeatureCard
                icon={Zap}
                title="Workflows"
                description="Durable, resumable workflows that survive restarts. Multi-step orchestration, pause for external events, retry on failure, and long-running agent tasks with built-in observability."
                accentClass="bg-secondary/10 text-secondary"
              />
              <FeatureCard
                icon={Shield}
                title="Firewall & Protection"
                description="Built-in web application firewall, bot protection, and rate limiting. Block malicious traffic at the edge before it reaches your application."
                accentClass="bg-info/10 text-info"
              />
            </div>
          </section>

          {/* ── AI Cloud ── */}
          <section className="border-t border-border py-12">
            <SectionHeading
              badge="AI Cloud"
              title="The AI Cloud"
              description="Vercel AI Cloud is a unified platform for AI workloads. It extends the Frontend Cloud with
              the infrastructure primitives, SDKs, and security needed to build, deploy, and scale
              intelligent, agent-powered applications."
            />

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <Card className="border-border">
                <CardContent className="flex flex-col gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <Cloud className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <p className="text-sm font-heading font-semibold text-foreground">AI Gateway</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A unified API for every AI provider. Route requests to OpenAI, Anthropic, Google,
                    Fireworks, or AWS Bedrock through a single endpoint. Switch models without code changes.
                    Built-in rate limiting, cost tracking, and fallback routing.
                  </p>
                  <div className="rounded-lg bg-muted/60 px-3 py-2.5">
                    <pre className="overflow-x-auto font-mono text-[11px] text-muted-foreground leading-relaxed">
{`import { streamText } from "ai"

// No provider package needed
const result = streamText({
  model: "openai/gpt-5.2",     // or
  // model: "anthropic/claude-opus-4.5",
  // model: "google/gemini-2.5-pro",
  prompt: "Explain quantum computing",
})`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="flex flex-col gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10">
                      <Bot className="h-4.5 w-4.5 text-secondary" />
                    </div>
                    <p className="text-sm font-heading font-semibold text-foreground">Agent Infrastructure</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Build and deploy AI agents that can browse the web, call APIs, manage deployments,
                    and interact with users. Vercel provides the runtime, observability, and security
                    for production-grade agents.
                  </p>
                  <div className="flex flex-col gap-2">
                    {[
                      "Durable execution for long-running agent tasks",
                      "Built-in tool calling with external API integrations",
                      "Streaming UI for real-time agent feedback",
                      "Secure sandboxed execution environments",
                      "Agent-to-agent communication protocols",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-secondary" />
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <FeatureCard
                icon={Cpu}
                title="AI SDK 6"
                description="The open-source TypeScript toolkit for AI apps. Unified provider API, streaming responses, structured outputs, tool calling, and multi-step agent patterns."
                accentClass="bg-primary/10 text-primary"
              />
              <FeatureCard
                icon={Layers}
                title="Vercel AI Integrations"
                description="One-click integrations with Supabase, Neon, Upstash, Stripe, and more. Databases, caching, auth, and payments -- all connected to your AI application."
                accentClass="bg-secondary/10 text-secondary"
              />
              <FeatureCard
                icon={Shield}
                title="Enterprise AI Governance"
                description="Model access policies, usage quotas, audit trails, and content filtering. Control which models your team can use and track spending across projects."
                accentClass="bg-info/10 text-info"
              />
            </div>
          </section>

          {/* ── Key Takeaways ── */}
          <section className="border-t border-border py-12">
            <SectionHeading
              badge="Summary"
              title="Why Vercel"
              description="Vercel removes the gap between writing code and running it in production.
              From open-source foundations to self-driving infrastructure, every layer is designed
              to let teams ship faster without compromising quality."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Open source, not open trap",
                  description: "Next.js, Turborepo, AI SDK -- all MIT-licensed. Build with confidence knowing the core tools are community-owned and vendor-neutral.",
                },
                {
                  title: "Infrastructure that disappears",
                  description: "No Terraform files, no Kubernetes configs, no capacity planning. Your framework defines the infrastructure. Vercel provisions it automatically.",
                },
                {
                  title: "AI-native by design",
                  description: "AI Gateway, AI SDK, agent infrastructure, and streaming UI. Every primitive you need to build production AI applications, integrated into the platform.",
                },
                {
                  title: "From commit to global in seconds",
                  description: "Push code, get a preview URL. Merge to main, deploy to 100+ edge locations. Automatic HTTPS, CDN, and serverless scaling. Zero operational overhead.",
                },
              ].map((item) => (
                <Card key={item.title} className="border-border">
                  <CardContent className="flex items-start gap-3 p-5">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
