"use client"

import Link from "next/link"
import {
  ArrowRight,
  Globe,
  ImagePlus,
  Users,
  Palette,
  FileCheck,
  Layers,
  Code2,
  Cpu,
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
      <div className="flex h-full flex-col gap-5 rounded-lg border border-border p-6 transition-all group-hover:border-[#0045FF] group-hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0045FF]/10 text-[#0045FF] transition-colors group-hover:bg-[#0045FF] group-hover:text-white">
            <Icon className="h-5 w-5" />
          </div>
          <ArrowRight className="h-5 w-5 text-transparent transition-all group-hover:translate-x-1 group-hover:text-[#0045FF]" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold tracking-tight text-foreground text-balance transition-colors group-hover:text-[#0045FF]">
            {title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-secondary px-4 py-3">
          <pre className="overflow-x-auto text-[11px] font-mono text-muted-foreground leading-relaxed">
            {sdkPattern}
          </pre>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-foreground/10 pt-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground mr-2 self-center">
            Capabilities
          </span>
          {concepts.map((c) => (
            <span
              key={c}
              className="rounded-full bg-[#0045FF]/10 px-3 py-1 text-[10px] font-medium text-[#0045FF]"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default function SitecoreOverviewPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex flex-col gap-12 p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <span className="flex w-fit items-center gap-1.5 rounded-full bg-[#0045FF]/10 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase text-[#0045FF]">
              Sitecore AI + HARTMANN
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance lg:text-4xl">
              AI-Powered Content Management
            </h1>
            <p className="max-w-lg text-sm text-muted-foreground leading-relaxed">
              Manage HARTMANN&apos;s digital healthcare content with natural language.
              Create pages, manage assets, personalize experiences, and generate marketing
              briefs -- all through conversation with the Sitecore Marketer MCP.
            </p>
          </div>
        </div>

        {/* Tech stack pills */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Code2,
              label: "Sitecore MCP",
              desc: "48 tools via Marketer MCP Streamable HTTP transport",
            },
            {
              icon: Cpu,
              label: "AI SDK 6",
              desc: "streamText, tool calling, multi-step agent flows",
            },
            {
              icon: Layers,
              label: "Client Credentials",
              desc: "Server-side JWT auth -- works in all environments",
            },
          ].map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-4 rounded-lg border border-border bg-secondary px-5 py-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0045FF]/10">
                <t.icon className="h-4 w-4 text-[#0045FF]" />
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
            title="Content Studio"
            description="Create and manage HARTMANN product pages, wound care guides, and hospital landing pages with AI-powered content tools."
            href="/vercel/sitecore/chat"
            icon={Globe}
            concepts={["Pages", "Components", "Content", "Site Management"]}
            sdkPattern={`callTool("create_page", {\n  siteName: "hartmann.info",\n  pageName: "Sterillium Landing",\n  template: "Product Page"\n})`}
          />
          <DemoCard
            title="Asset Manager"
            description="Search, organize, and manage HARTMANN product images, medical illustrations, and brand assets in the digital library."
            href="/vercel/sitecore/chat"
            icon={ImagePlus}
            concepts={["Search", "Upload", "Metadata", "Media Library"]}
            sdkPattern={`callTool("search_assets", {\n  query: "Sterillium product photo"\n})`}
          />
          <DemoCard
            title="Personalization Engine"
            description="Create targeted experiences for hospitals, care homes, and pharmacies with AI-powered personalization variants."
            href="/vercel/sitecore/chat"
            icon={Users}
            concepts={["Variants", "Targeting", "Audiences", "A/B Testing"]}
            sdkPattern={`callTool("create_personalization_variant", {\n  variantName: "Hospital Buyers",\n  audience: "Kliniken"\n})`}
          />
        </div>

        {/* Additional capabilities */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-5 rounded-lg border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0045FF]/10">
                <Palette className="h-5 w-5 text-[#0045FF]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Brand Kits</h3>
                <p className="text-xs text-muted-foreground">
                  Define HARTMANN&apos;s brand identity for AI-generated content
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Store brand colors (#0045FF, #001689), fonts, tone of voice, and guidelines.
              The AI uses these when generating content to ensure brand consistency across
              Sterillium, MoliCare, and all HARTMANN product lines.
            </p>
          </div>
          <div className="flex flex-col gap-5 rounded-lg border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0045FF]/10">
                <FileCheck className="h-5 w-5 text-[#0045FF]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Marketing Briefs
                </h3>
                <p className="text-xs text-muted-foreground">
                  AI-generated campaign briefs for healthcare marketing
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Generate comprehensive marketing briefs for product launches, campaigns,
              and promotions. Target hospital infection control managers, nursing home
              buyers, or pharmacy customers with tailored messaging.
            </p>
          </div>
        </div>

        {/* What these demos teach */}
        <div className="rounded-lg border border-border bg-secondary p-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            What this showcase demonstrates
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "MCP Protocol",
                desc: "Streamable HTTP transport connecting to Sitecore's 48-tool Marketer MCP server with session management.",
              },
              {
                title: "Sitecore AI",
                desc: "Full content lifecycle: site creation, page building, component management, asset search, and publishing.",
              },
              {
                title: "Content Operations",
                desc: "AI-assisted content creation for healthcare products with brand-aware personalization and targeting.",
              },
              {
                title: "Healthcare Digital",
                desc: "Real-world B2B healthcare use case with HARTMANN product lines, market segments, and medical terminology.",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
