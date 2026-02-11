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
  Code2,
  Cpu,
  Layers,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

function DemoCard({
  title,
  description,
  href,
  icon: Icon,
  concepts,
  accentClass,
  sdkPattern,
}: {
  title: string
  description: string
  href: string
  icon: LucideIcon
  concepts: string[]
  accentClass: string
  sdkPattern: string
}) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full border-border transition-all hover:border-primary/30 hover:shadow-sm">
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

          {/* SDK pattern preview */}
          <div className="rounded-lg bg-muted/60 px-3 py-2">
            <pre className="text-[11px] font-mono text-muted-foreground leading-relaxed">
              {sdkPattern}
            </pre>
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mr-1 self-center">
              Concepts:
            </span>
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

export default function AIShowcasesPage() {
  return (
    <div className="flex h-screen flex-col overflow-y-auto">
      <div className="flex flex-col gap-10 p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1.5 rounded-full bg-primary/10 px-3 text-[11px] font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                AI Use Cases
              </span>
            </div>
            <h1 className="text-3xl font-heading font-semibold tracking-tight text-foreground text-balance">
              Interactive AI Showcases
            </h1>
            <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
              Each demo teaches a different AI SDK pattern. Pick one to explore
              streaming, tool calling, image generation, or multi-step pipelines.
            </p>
          </div>
        </div>

        {/* Tech stack pills */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: Code2,
              label: "AI SDK 6",
              desc: "useChat, streamText, tool calling, Output.object()",
              accent: "bg-primary/10 text-primary",
            },
            {
              icon: Cpu,
              label: "AI Gateway",
              desc: "Unified model routing: GPT-5.2, Claude, Gemini, Grok",
              accent: "bg-secondary/10 text-secondary",
            },
            {
              icon: Layers,
              label: "Pipeline Patterns",
              desc: "Chained AI calls with SSE streaming at each step",
              accent: "bg-info/10 text-info",
            },
          ].map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", t.accent)}>
                <t.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.label}</p>
                <p className="text-[11px] text-muted-foreground">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Demo grid */}
        <div className="grid gap-5 lg:grid-cols-3">
          <DemoCard
            title="Prompt Coach"
            description="Get AI feedback on your prompts. See quality scores, detailed analysis, and rewritten versions in real-time."
            href="/ai/prompt-coach"
            icon={MessageSquare}
            concepts={["useChat", "Tool Calling", "Structured Output", "Streaming"]}
            accentClass="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
            sdkPattern={`streamText({\n  model: "openai/gpt-5.2",\n  tools: { analyzePrompt, rewritePrompt }\n})`}
          />
          <DemoCard
            title="AI Image Studio"
            description="Generate and transform images with Gemini 3 Pro. Upload reference images and describe transformations."
            href="/ai/image-studio"
            icon={ImagePlus}
            concepts={["Multimodal Input", "Image Generation", "File Upload", "Base64"]}
            accentClass="bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground"
            sdkPattern={`generateText({\n  model: "google/gemini-3-pro-image",\n  providerOptions: { google: {\n    responseModalities: ["TEXT","IMAGE"]\n  }}\n})`}
          />
          <DemoCard
            title="Content Pipeline"
            description="Watch a 4-step AI pipeline research, draft, review, and polish content. Each step streams structured data."
            href="/ai/content-pipeline"
            icon={GitBranch}
            concepts={["SSE Streaming", "Chained AI", "Structured Output", "Pipeline"]}
            accentClass="bg-info/10 text-info group-hover:bg-info group-hover:text-info-foreground"
            sdkPattern={`generateText({\n  model, output: Output.object({\n    schema: z.object({ ... })\n  })\n})`}
          />
        </div>

        {/* What you'll learn */}
        <Card className="border-border">
          <CardContent className="p-6">
            <h2 className="text-lg font-heading font-semibold text-foreground">
              What these demos teach
            </h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
    </div>
  )
}
