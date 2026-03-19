"use client"

import Link from "next/link"
import {
  MessageSquare,
  ImagePlus,
  GitBranch,
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  type LucideIcon,
} from "lucide-react"

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
      <div className="flex h-full flex-col gap-5 border-t border-foreground/20 pt-6 transition-all">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/20 transition-colors group-hover:bg-hover group-hover:text-hover-foreground group-hover:border-hover">
            <Icon className="h-5 w-5" />
          </div>
          <ArrowRight className="h-5 w-5 text-foreground/0 transition-all group-hover:translate-x-1 group-hover:text-hover" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-heading font-normal tracking-tight text-foreground text-balance transition-colors group-hover:text-hover">
            {title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="overflow-hidden rounded-none border border-foreground/10 bg-accent px-4 py-3">
          <pre className="overflow-x-auto text-[11px] font-mono text-muted-foreground leading-relaxed">
            {sdkPattern}
          </pre>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-foreground/10 pt-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground mr-2 self-center">
            Konzepte
          </span>
          {concepts.map((c) => (
            <span
              key={c}
              className="rounded-full border border-foreground/15 px-3 py-1 text-[10px] font-medium text-muted-foreground"
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <span className="flex w-fit items-center gap-1.5 rounded-full border border-foreground/30 px-4 py-1.5 text-xs font-medium tracking-wide uppercase text-foreground/70">
              KI-Anwendungen
            </span>
            <h1 className="text-3xl font-heading font-normal tracking-tight text-foreground text-balance lg:text-4xl">
              Interaktive KI-Showcases
            </h1>
            <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
              Jede Demo zeigt ein anderes AI SDK-Pattern. Entdecken Sie Streaming,
              Tool Calling, Bildgenerierung oder mehrstufige Pipelines.
            </p>
          </div>
        </div>

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
              desc: "Einheitliches Modell-Routing: GPT-5.2, Claude, Gemini, Grok",
            },
            {
              icon: Layers,
              label: "Pipeline-Patterns",
              desc: "Verkettete KI-Aufrufe mit SSE-Streaming je Schritt",
            },
          ].map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-4 border border-foreground/10 bg-accent px-5 py-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/20">
                <t.icon className="h-4 w-4 text-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{t.label}</p>
                <p className="truncate text-xs text-muted-foreground">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <DemoCard
            title="Prompt Coach"
            description="Erhalten Sie KI-Feedback zu Ihren Prompts. Qualitätsbewertungen, Analysen und umgeschriebene Versionen in Echtzeit."
            href="/vercel/prompt-coach"
            icon={MessageSquare}
            concepts={["useChat", "Tool Calling", "Structured Output", "Streaming"]}
            sdkPattern={`streamText({\n  model: "openai/gpt-5.2",\n  tools: { analyzePrompt, rewritePrompt }\n})`}
          />
          <DemoCard
            title="KI-Bildstudio"
            description="Generieren und transformieren Sie Bilder mit Gemini 3 Pro. Referenzbilder hochladen und Transformationen beschreiben."
            href="/vercel/image-studio"
            icon={ImagePlus}
            concepts={["Multimodal Input", "Bildgenerierung", "Datei-Upload", "Base64"]}
            sdkPattern={`generateText({\n  model: "google/gemini-3-pro-image",\n  providerOptions: { google: {\n    responseModalities: ["TEXT","IMAGE"]\n  }}\n})`}
          />
          <DemoCard
            title="Content Pipeline"
            description="Multi-Model-Agent: Gemini recherchiert, GPT-5.2 textet, Gemini generiert ein Hero-Bild -- alles per Streaming in einen Live-Blog."
            href="/vercel/content-pipeline"
            icon={GitBranch}
            concepts={["Multi-Model", "Parallel AI", "SSE Streaming", "Pipeline"]}
            sdkPattern={`// 3 Modelle parallel\nawait Promise.allSettled([\n  generateText({ model: "openai/..." }),\n  generateText({ model: "google/..." })\n])`}
          />
        </div>

        <div className="border border-foreground/10 bg-accent p-8">
          <h2 className="text-xl font-heading font-normal tracking-tight text-foreground">
            Was diese Demos vermitteln
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Effektives Prompting",
                desc: "System-Prompts, Few-Shot-Patterns, strukturierte Output-Schemas und Chain-of-Thought-Reasoning.",
              },
              {
                title: "AI SDK Patterns",
                desc: "useChat, streamText, generateText, Tool-Definitionen, Output.object() und Agent-Stop-Bedingungen.",
              },
              {
                title: "Multimodale KI",
                desc: "Bildgenerierung mit Gemini, Datei-Uploads, Base64-Handling und gemischte Text+Bild-Antworten.",
              },
              {
                title: "Multi-Model-Orchestrierung",
                desc: "Gemini Search, GPT-5.2 und Gemini Image parallel mit SSE-Streaming in eine Live-Vorschau.",
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
