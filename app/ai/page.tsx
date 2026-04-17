"use client"

import Link from "next/link"
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
  sdkPattern,
}: {
  title: string
  description: string
  href: string
  icon: LucideIcon
  concepts: string[]
  sdkPattern: string
}) {
  return (
    <Link href={href} className="group block">
      <div className="flex h-full flex-col gap-5 rounded-lg border border-border p-6 transition-all group-hover:border-primary group-hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-hover-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <ArrowRight className="h-5 w-5 text-transparent transition-all group-hover:translate-x-1 group-hover:text-primary" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold tracking-tight text-foreground text-balance transition-colors group-hover:text-primary">
            {title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* SDK pattern preview */}
        <div className="overflow-hidden rounded-lg border border-border bg-secondary px-4 py-3">
          <pre className="overflow-x-auto text-[11px] font-mono text-muted-foreground leading-relaxed">
            {sdkPattern}
          </pre>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-foreground/10 pt-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground mr-2 self-center">
            Concepts
          </span>
          {concepts.map((c) => (
            <span
              key={c}
              className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-medium text-primary"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default function AIShowcasesPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex flex-col gap-12 p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <span className="flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase text-primary">
              AI Use Cases
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance lg:text-4xl">
              Interactive AI Showcases
            </h1>
            <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
              Each demo teaches a different AI SDK pattern. Pick one to explore
              streaming, tool calling, image generation, or multi-step pipelines.
            </p>
          </div>
        </div>

        {/* Tech stack pills */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Code2,
              label: "AI SDK 6",
              desc: "useChat, streamText, tool calling, Output.object()",
            },
            {
              icon: Cpu,
              label: "AI Gateway",
              desc: "Unified model routing: GPT-5.2, Claude, Gemini, Grok",
            },
            {
              icon: Layers,
              label: "Pipeline Patterns",
              desc: "Chained AI calls with SSE streaming at each step",
            },
          ].map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-4 rounded-lg border border-border bg-secondary px-5 py-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <t.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{t.label}</p>
                <p className="truncate text-xs text-muted-foreground">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Demo grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <DemoCard
            title="Prompt Coach"
            description="Get AI feedback on your prompts. See quality scores, detailed analysis, and rewritten versions in real-time."
            href="/vercel/prompt-coach"
            icon={MessageSquare}
            concepts={["useChat", "Tool Calling", "Structured Output", "Streaming"]}
            sdkPattern={`streamText({\n  model: "openai/gpt-5.2",\n  tools: { analyzePrompt, rewritePrompt }\n})`}
          />
          <DemoCard
            title="AI Image Studio"
            description="Generate and transform images with Gemini 3 Pro. Upload reference images and describe transformations."
            href="/vercel/image-studio"
            icon={ImagePlus}
            concepts={["Multimodal Input", "Image Generation", "File Upload", "Base64"]}
            sdkPattern={`generateText({\n  model: "google/gemini-3-pro-image",\n  providerOptions: { google: {\n    responseModalities: ["TEXT","IMAGE"]\n  }}\n})`}
          />
          <DemoCard
            title="Content Pipeline"
            description="Multi-model agent: Gemini researches the web, GPT-5.2 drafts, Gemini generates a hero image -- all streaming into a live blog."
            href="/vercel/content-pipeline"
            icon={GitBranch}
            concepts={["Multi-Model", "Parallel AI", "SSE Streaming", "Pipeline"]}
            sdkPattern={`// 3 models in parallel\nawait Promise.allSettled([\n  generateText({ model: "openai/..." }),\n  generateText({ model: "google/..." })\n])`}
          />
        </div>

        {/* What you'll learn */}
        <div className="rounded-lg border border-border bg-secondary p-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            What these demos teach
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
                title: "Multi-Model Orchestration",
                desc: "Running Gemini Search, GPT-5.2, and Gemini Image in parallel with SSE streaming into a live preview.",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
