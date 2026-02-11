import {
  Triangle,
  GitBranch,
  GitPullRequest,
  GitCommit,
  Users,
  Code2,
  Paintbrush,
  Layers,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  Puzzle,
  Lightbulb,
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

/* ── Icon card ── */
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

/* ── Workflow step ── */
function WorkflowStep({
  step,
  title,
  description,
  isLast = false,
}: {
  step: number
  title: string
  description: string
  isLast?: boolean
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {step}
        </div>
        {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
      </div>
      <div className={cn("pb-6", isLast && "pb-0")}>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

/* ── Role card for "Who can do what" ── */
function RoleCard({
  icon: Icon,
  role,
  before,
  after,
  accentClass,
}: {
  icon: LucideIcon
  role: string
  before: string
  after: string
  accentClass: string
}) {
  return (
    <Card className="border-border">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", accentClass)}>
            <Icon className="h-4.5 w-4.5" />
          </div>
          <p className="text-sm font-heading font-semibold text-foreground">{role}</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-lg bg-muted/60 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Before v0</p>
            <p className="mt-1 text-xs text-foreground/80 leading-relaxed">{before}</p>
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">With v0</p>
            <p className="mt-1 text-xs text-foreground leading-relaxed">{after}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VercelV0Page() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Triangle className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-heading font-semibold text-foreground">Vercel & v0</h1>
            <p className="text-[11px] text-muted-foreground">
              Git workflows, design systems, and the future of frontend
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
              Vercel & v0
            </span>
            <h1 className="max-w-2xl text-3xl font-heading font-semibold tracking-tight text-foreground text-balance lg:text-4xl">
              How v0 Is Changing Who Can Build Frontend
            </h1>
            <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
              v0 combines AI-powered code generation with Git-native workflows and design system
              integration, turning everyone from product managers to backend engineers into
              effective frontend contributors.
            </p>
          </section>

          {/* ── What is v0 ── */}
          <section className="border-t border-border py-12">
            <SectionHeading
              badge="The Platform"
              title="What is v0?"
              description="v0 is Vercel's AI-powered development environment. It generates production-ready
              React code from natural language prompts, connected directly to your Git repository
              and your design system."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <FeatureCard
                icon={Code2}
                title="AI Code Generation"
                description="Describe what you need in plain language. v0 generates production-ready Next.js components using your design system, shadcn/ui, and Tailwind CSS."
                accentClass="bg-primary/10 text-primary"
              />
              <FeatureCard
                icon={GitBranch}
                title="Git-Native Workflow"
                description="Every change v0 makes is committed to a branch in your GitHub repository. Review, approve, and merge through the same PR process your team already uses."
                accentClass="bg-secondary/10 text-secondary"
              />
              <FeatureCard
                icon={Globe}
                title="Instant Preview Deployments"
                description="Every commit gets a live preview URL on Vercel's edge network. Share links with stakeholders, test on any device, and iterate in real-time."
                accentClass="bg-info/10 text-info"
              />
            </div>
          </section>

          {/* ── Git Workflow ── */}
          <section className="border-t border-border py-12">
            <SectionHeading
              badge="Git Integration"
              title="Developer Workflows with v0"
              description="v0 doesn't replace your Git workflow -- it plugs directly into it. Every AI-generated
              change follows the same branch-PR-review-merge cycle your team already knows."
            />
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {/* Workflow steps */}
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 pb-5">
                    <GitPullRequest className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-heading font-semibold text-foreground uppercase tracking-wider">
                      The v0 Git Flow
                    </h3>
                  </div>
                  <WorkflowStep
                    step={1}
                    title="Connect Repository"
                    description="Link your GitHub repo to v0. It reads your existing codebase, design tokens, and component library."
                  />
                  <WorkflowStep
                    step={2}
                    title="Prompt & Generate"
                    description="Describe what you want in natural language. v0 generates code that follows your existing patterns and imports your components."
                  />
                  <WorkflowStep
                    step={3}
                    title="Review on Branch"
                    description="All changes are pushed to a feature branch. v0 creates clean, reviewable commits with descriptive messages."
                  />
                  <WorkflowStep
                    step={4}
                    title="Preview & Iterate"
                    description="Each push triggers a Vercel preview deployment. Share the live URL, get feedback, and iterate with more prompts."
                  />
                  <WorkflowStep
                    step={5}
                    title="Merge & Ship"
                    description="Once approved, merge the PR like any other. The code is yours -- no lock-in, no proprietary runtime."
                    isLast
                  />
                </CardContent>
              </Card>

              {/* Key principles */}
              <div className="flex flex-col gap-4">
                <Card className="border-border">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <GitCommit className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Clean Commit History</p>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          v0 creates atomic commits with clear messages. Your Git history stays
                          readable -- no messy "AI-generated code" dumps.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <GitPullRequest className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Pull Requests, Not Magic</p>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          Every change goes through a PR. Your team reviews the code, suggests
                          edits, and merges when ready. The AI assists, humans decide.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <Layers className="mt-0.5 h-4 w-4 shrink-0 text-info" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Codebase-Aware Generation</p>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          v0 reads your existing components, utilities, and patterns. It imports
                          from your code instead of generating duplicates.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--success))]" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">No Vendor Lock-In</p>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          The output is standard React, Next.js, and Tailwind CSS. Eject
                          any time -- the code is yours, runs anywhere.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* ── Design System Integration ── */}
          <section className="border-t border-border py-12">
            <SectionHeading
              badge="Design Systems"
              title="Design System Integration"
              description="v0 doesn't just generate generic code. It reads your design tokens, component library, and
              brand guidelines, then generates components that are already on-brand."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card className="border-border">
                <CardContent className="flex flex-col gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <Paintbrush className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <p className="text-sm font-heading font-semibold text-foreground">Token-Aware Generation</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    v0 reads your CSS variables, Tailwind config, and component library. Generated code
                    uses your exact colors, spacing, typography, and border radius -- not generic defaults.
                  </p>
                  <div className="rounded-lg bg-muted/60 px-3 py-2.5">
                    <pre className="overflow-x-auto font-mono text-[11px] text-muted-foreground leading-relaxed">
{`/* Your design tokens */
--primary: 299 57% 30%;    /* NAVAX magenta */
--secondary: 180 100% 22%; /* NAVAX teal */
--radius: 0.5rem;

/* v0 automatically uses these */
className="bg-primary text-primary-foreground
  rounded-lg"`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="flex flex-col gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10">
                      <Puzzle className="h-4.5 w-4.5 text-secondary" />
                    </div>
                    <p className="text-sm font-heading font-semibold text-foreground">Component Reuse</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Instead of generating new buttons and cards from scratch, v0 imports from your existing
                    component library. This ensures consistency and reduces code duplication.
                  </p>
                  <div className="rounded-lg bg-muted/60 px-3 py-2.5">
                    <pre className="overflow-x-auto font-mono text-[11px] text-muted-foreground leading-relaxed">
{`/* v0 imports YOUR components */
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavaxLogo } from "@/components/ds/navax-logo"

/* Not generic HTML */
<button class="bg-blue-500">  // Never this`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <FeatureCard
                icon={Lightbulb}
                title="Rules & Instructions"
                description="Set custom rules for v0 to follow: coding conventions, accessibility standards, naming patterns, and brand voice."
                accentClass="bg-primary/10 text-primary"
              />
              <FeatureCard
                icon={Layers}
                title="shadcn/ui Foundation"
                description="v0 uses shadcn/ui as its component foundation. Extend, customize, and override -- every component is in your codebase."
                accentClass="bg-secondary/10 text-secondary"
              />
              <FeatureCard
                icon={Paintbrush}
                title="Visual Design Mode"
                description="v0's Design Mode lets you adjust styling, spacing, and colors with UI controls. Changes update the code and push to your branch."
                accentClass="bg-info/10 text-info"
              />
            </div>
          </section>

          {/* ── Who Can Do What ── */}
          <section className="border-t border-border py-12">
            <SectionHeading
              badge="Democratizing Frontend"
              title="Everyone Is a Frontend Developer Now"
              description="v0 doesn't replace developers -- it expands who can contribute meaningful frontend work.
              With design system guardrails and Git-based review, non-engineers can ship real UI."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <RoleCard
                icon={Users}
                role="Product Managers"
                before="Write specs and wait weeks for a mockup. Struggle to communicate exact UI requirements."
                after="Prompt v0 to generate a working prototype. Iterate in real-time. Share a live preview URL with the team."
                accentClass="bg-primary/10 text-primary"
              />
              <RoleCard
                icon={Paintbrush}
                role="Designers"
                before="Hand off static Figma screens. Hope developers interpret spacing, colors, and interactions correctly."
                after="Generate the actual React component from a description. Fine-tune in Design Mode. The code IS the design."
                accentClass="bg-secondary/10 text-secondary"
              />
              <RoleCard
                icon={Code2}
                role="Backend Engineers"
                before="Avoid frontend entirely or write brittle UI code. Get blocked waiting for frontend team availability."
                after="Describe the UI you need in plain language. v0 handles components, styling, responsiveness. Focus on API logic."
                accentClass="bg-info/10 text-info"
              />
              <RoleCard
                icon={Lightbulb}
                role="Solution Architects"
                before="Draw architecture diagrams. Build PowerPoint slides. Rely on dev teams to visualize the solution."
                after="Generate interactive prototypes and working dashboards. Present with live demos instead of static slides."
                accentClass="bg-primary/10 text-primary"
              />
              <RoleCard
                icon={Zap}
                role="Junior Developers"
                before="Spend weeks learning component patterns, CSS specifics, and design system conventions."
                after="Learn by prompting -- see how v0 structures components, applies patterns, and follows conventions. Ramp up in days."
                accentClass="bg-secondary/10 text-secondary"
              />
              <RoleCard
                icon={Globe}
                role="Customer Success"
                before="Request demo customizations weeks before a client call. Work with screenshots and mockups."
                after="Generate customer-branded demo pages on the fly. Show working prototypes in sales calls."
                accentClass="bg-info/10 text-info"
              />
            </div>
          </section>

          {/* ── Key Takeaways ── */}
          <section className="border-t border-border py-12">
            <SectionHeading
              badge="Key Takeaways"
              title="The Shift in Practice"
              description="v0 represents a fundamental change in how frontend work happens -- not replacing the craft,
              but making it accessible to more people while maintaining quality through design system guardrails."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Git is the contract",
                  description: "Everything flows through branches and PRs. AI generates, humans review. The same governance model your team already trusts.",
                },
                {
                  title: "Design systems are guardrails",
                  description: "v0 reads your tokens, imports your components, and follows your conventions. Brand consistency is automatic, not manual.",
                },
                {
                  title: "Prompts are the new specs",
                  description: "Instead of writing 20-page requirements documents, describe what you need in natural language. Iterate in minutes, not sprints.",
                },
                {
                  title: "Code is the deliverable",
                  description: "No more Figma-to-code handoff gap. The generated code IS the design. What you see is what ships to production.",
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
