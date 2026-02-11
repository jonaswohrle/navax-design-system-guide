import Link from "next/link"
import { PageHeader } from "@/components/ds/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Blocks, GitBranch, ArrowRight, Sparkles, Cpu, Zap } from "lucide-react"

const demos = [
  {
    title: "Prompt Coach",
    description:
      "An AI chat that teaches prompting techniques. Write a prompt and get instant analysis, quality scoring, and improved rewrites.",
    href: "/ai/prompt-coach",
    icon: MessageSquare,
    tags: ["AI SDK", "AI Gateway", "Streaming", "Structured Output"],
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Interactive Tools",
    description:
      "Chat with interactive UI components. The AI triggers template pickers, confirmation dialogs, and code generators right inside the conversation.",
    href: "/ai/interactive-tools",
    icon: Blocks,
    tags: ["Tool Calling", "Client-Side Tools", "Agent Loop"],
    color: "bg-secondary/10 text-secondary",
  },
  {
    title: "Content Pipeline",
    description:
      "A durable multi-step workflow that researches, drafts, reviews, and polishes content. Watch each step execute in real-time.",
    href: "/ai/content-pipeline",
    icon: GitBranch,
    tags: ["Vercel Workflows", "Durable Steps", "Streaming"],
    color: "bg-info/10 text-info",
  },
]

const techStack = [
  { icon: Sparkles, label: "AI SDK 6", desc: "Latest streaming, tools, agents" },
  { icon: Cpu, label: "AI Gateway", desc: "Model routing + selector" },
  { icon: Zap, label: "Workflows", desc: "Durable multi-step pipelines" },
]

export default function AIShowcasesPage() {
  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8">
      <PageHeader
        title="AI Showcases"
        description="Interactive demos showing how to prompt effectively and vibe code with AI. Built with AI SDK 6, Vercel AI Gateway, and Workflows."
      />

      {/* Tech stack badges */}
      <div className="flex flex-wrap gap-4">
        {techStack.map((tech) => (
          <div
            key={tech.label}
            className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
          >
            <tech.icon className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">{tech.label}</p>
              <p className="text-xs text-muted-foreground">{tech.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Demo cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {demos.map((demo) => (
          <Card key={demo.title} className="flex flex-col">
            <CardHeader>
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${demo.color}`}>
                <demo.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-heading font-semibold text-balance">
                {demo.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <p className="flex-1 text-sm text-muted-foreground leading-relaxed">
                {demo.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {demo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button asChild variant="outline" className="mt-auto w-full">
                <Link href={demo.href}>
                  Try Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
