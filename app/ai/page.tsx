"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MessageSquare,
  ImagePlus,
  GitBranch,
  ArrowRight,
  Sparkles,
  Cpu,
  Zap,
  Code2,
  Layers,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DemoCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
  concepts: string[]
  accentClass: string
  featured?: boolean
}

function DemoCard({ title, description, href, icon: Icon, concepts, accentClass, featured }: DemoCardProps) {
  return (
    <Link href={href} className="group block">
      <Card
        className={cn(
          "relative h-full overflow-hidden border transition-all",
          featured
            ? "border-primary/20 hover:border-primary/40 hover:shadow-md"
            : "border-border hover:border-primary/30 hover:shadow-sm"
        )}
      >
        <CardContent className="flex h-full flex-col gap-4 p-6">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
                accentClass
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground/0 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-heading font-semibold text-foreground text-balance">
              {title}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              Key Concepts
            </p>
            <div className="flex flex-wrap gap-1.5">
              {concepts.map((concept) => (
                <span
                  key={concept}
                  className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function TechPill({
  icon: Icon,
  label,
  description,
}: {
  icon: LucideIcon
  label: string
  description: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export default function AIShowcasesPage() {
  return (
    <div className="flex flex-col gap-10 overflow-y-auto p-6 lg:p-10">
      {/* Hero */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 items-center gap-1.5 rounded-full bg-primary/10 px-3">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">AI Use Cases</span>
          </div>
        </div>
        <h1 className="max-w-xl text-3xl font-heading font-semibold tracking-tight text-foreground text-balance lg:text-4xl">
          Learn to Prompt and Vibe Code
        </h1>
        <p className="max-w-lg text-base text-muted-foreground leading-relaxed">
          Interactive showcases demonstrating AI SDK 6, the Vercel AI Gateway,
          and multi-step workflows. Each demo is a hands-on lesson in building
          real AI features.
        </p>
      </div>

      {/* Tech stack */}
      <div className="grid gap-3 sm:grid-cols-3">
        <TechPill
          icon={Code2}
          label="AI SDK 6"
          description="Streaming, tool calling, structured output, and agent loops"
        />
        <TechPill
          icon={Cpu}
          label="AI Gateway"
          description="Unified model access across OpenAI, Anthropic, Google, xAI"
        />
        <TechPill
          icon={Layers}
          label="Multi-Step Pipelines"
          description="Chained AI calls with structured output at each stage"
        />
      </div>

      {/* Demo grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        <DemoCard
          title="Prompt Coach"
          description="Get instant AI-powered feedback on your prompts. See quality scores, detailed analysis, and rewritten versions side-by-side."
          href="/ai/prompt-coach"
          icon={MessageSquare}
          concepts={["useChat", "Tool Calling", "Structured Output", "Streaming"]}
          accentClass="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
          featured
        />
        <DemoCard
          title="AI Image Studio"
          description="Generate and transform images using Gemini 3 Pro. Upload reference images and describe transformations in natural language."
          href="/ai/image-studio"
          icon={ImagePlus}
          concepts={["Multimodal Input", "Image Generation", "File Upload", "Base64 Handling"]}
          accentClass="bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground"
        />
        <DemoCard
          title="Content Pipeline"
          description="Watch a 4-step AI pipeline research, draft, review, and polish content in real-time. Each step streams structured data."
          href="/ai/content-pipeline"
          icon={GitBranch}
          concepts={["SSE Streaming", "Chained AI Calls", "Structured Output", "Pipeline Pattern"]}
          accentClass="bg-info/10 text-info group-hover:bg-info group-hover:text-info-foreground"
        />
      </div>

      {/* What you'll learn */}
      <Card className="border-border">
        <CardContent className="p-6">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            What these demos teach
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Effective Prompting",
                desc: "System prompts, few-shot patterns, structured output schemas, and chain-of-thought reasoning.",
              },
              {
                title: "AI SDK Patterns",
                desc: "useChat, streamText, generateText, tool definitions, Output.object(), and agent stop conditions.",
              },
              {
                title: "Multimodal AI",
                desc: "Image generation with Gemini, file uploads, base64 handling, and mixed text+image responses.",
              },
              {
                title: "Pipeline Architecture",
                desc: "Chaining multiple AI calls with Server-Sent Events, structured data passing between steps.",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
