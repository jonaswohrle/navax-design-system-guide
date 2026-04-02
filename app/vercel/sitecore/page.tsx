"use client"

import Link from "next/link"
import {
  ArrowRight,
  Globe,
  ImagePlus,
  Users,
  Palette,
  FileCheck,
  Code2,
  Cpu,
  Layers,
  type LucideIcon,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Feature Card                                                       */
/* ------------------------------------------------------------------ */
function FeatureCard({
  title,
  description,
  href,
  icon: Icon,
  capabilities,
  codeSnippet,
}: {
  title: string
  description: string
  href: string
  icon: LucideIcon
  capabilities: string[]
  codeSnippet: string
}) {
  return (
    <Link href={href} className="group block">
      <div className="flex h-full flex-col gap-5 rounded-xl border border-[#222] bg-[#0a0a0a] p-6 transition-all duration-200 group-hover:border-[#0045FF]/50 group-hover:bg-[#0d1020]">
        {/* Icon + arrow */}
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0045FF]/10 text-[#0045FF] transition-colors group-hover:bg-[#0045FF] group-hover:text-white">
            <Icon className="h-5 w-5" />
          </div>
          <ArrowRight className="h-5 w-5 text-[#333] transition-all group-hover:translate-x-1 group-hover:text-[#0045FF]" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white transition-colors group-hover:text-[#4d8aff]">
            {title}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-[#888]">
            {description}
          </p>
        </div>

        {/* Code snippet */}
        <div className="overflow-hidden rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-3">
          <pre className="overflow-x-auto text-[11px] font-mono leading-relaxed text-[#666]">
            {codeSnippet}
          </pre>
        </div>

        {/* Capabilities */}
        <div className="flex flex-wrap items-center gap-2 border-t border-[#1a1a1a] pt-4">
          <span className="mr-1 text-[10px] font-medium uppercase tracking-widest text-[#555]">
            Capabilities
          </span>
          {capabilities.map((c) => (
            <span
              key={c}
              className="rounded-full border border-[#0045FF]/20 bg-[#0045FF]/5 px-2.5 py-0.5 text-[10px] font-medium text-[#4d8aff]"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function SitecoreOverviewPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex flex-col gap-10 p-6 lg:p-10">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <span className="flex w-fit items-center gap-1.5 rounded-full border border-[#0045FF]/20 bg-[#0045FF]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#4d8aff]">
            Sitecore AI + HARTMANN
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
            AI-Powered Content Management
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-[#999]">
            Manage HARTMANN&apos;s digital healthcare content with natural language.
            Create pages, manage assets, personalize experiences, and generate marketing
            briefs -- all through conversation with the Sitecore Marketer MCP.
          </p>
        </div>

        {/* ── Tech stack badges ──────────────────────────── */}
        <div className="grid gap-3 sm:grid-cols-3">
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
              className="flex items-center gap-3.5 rounded-xl border border-[#222] bg-[#0a0a0a] px-4 py-3.5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0045FF]/10">
                <t.icon className="h-4 w-4 text-[#0045FF]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{t.label}</p>
                <p className="truncate text-[11px] text-[#777]">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Feature cards ──────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-3">
          <FeatureCard
            title="Content Studio"
            description="Create and manage HARTMANN product pages, wound care guides, and hospital landing pages with AI-powered content tools."
            href="/vercel/sitecore/chat"
            icon={Globe}
            capabilities={["Pages", "Components", "Content", "Sites"]}
            codeSnippet={`callTool("create_page", {\n  siteName: "hartmann.info",\n  pageName: "Sterillium Landing",\n  template: "Product Page"\n})`}
          />
          <FeatureCard
            title="Asset Manager"
            description="Search, organize, and manage HARTMANN product images, medical illustrations, and brand assets in the digital library."
            href="/vercel/sitecore/chat"
            icon={ImagePlus}
            capabilities={["Search", "Upload", "Metadata", "Library"]}
            codeSnippet={`callTool("search_assets", {\n  query: "Sterillium product photo"\n})`}
          />
          <FeatureCard
            title="Personalization Engine"
            description="Create targeted experiences for hospitals, care homes, and pharmacies with AI-powered personalization variants."
            href="/vercel/sitecore/chat"
            icon={Users}
            capabilities={["Variants", "Targeting", "Audiences", "A/B"]}
            codeSnippet={`callTool("create_personalization_variant", {\n  variantName: "Hospital Buyers",\n  audience: "Kliniken"\n})`}
          />
        </div>

        {/* ── Additional capabilities ────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-xl border border-[#222] bg-[#0a0a0a] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0045FF]/10">
                <Palette className="h-5 w-5 text-[#0045FF]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Brand Kits</h3>
                <p className="text-[11px] text-[#777]">
                  Define HARTMANN&apos;s brand identity for AI-generated content
                </p>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-[#888]">
              Store brand colors (#0045FF, #001689), fonts, tone of voice, and guidelines.
              The AI uses these when generating content to ensure brand consistency across
              Sterillium, MoliCare, and all HARTMANN product lines.
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-xl border border-[#222] bg-[#0a0a0a] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0045FF]/10">
                <FileCheck className="h-5 w-5 text-[#0045FF]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Marketing Briefs</h3>
                <p className="text-[11px] text-[#777]">
                  AI-generated campaign briefs for healthcare marketing
                </p>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-[#888]">
              Generate comprehensive marketing briefs for product launches, campaigns,
              and promotions. Target hospital infection control managers, nursing home
              buyers, or pharmacy customers with tailored messaging.
            </p>
          </div>
        </div>

        {/* ── What this showcase demonstrates ─────────────── */}
        <div className="rounded-xl border border-[#222] bg-[#0a0a0a] p-8">
          <h2 className="text-lg font-semibold tracking-tight text-white">
            What this showcase demonstrates
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
              <div key={item.title} className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-[#ccc]">{item.title}</p>
                <p className="text-[12px] leading-relaxed text-[#666]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
