// @ts-nocheck
"use client"

import * as React from "react"
import {
  Globe,
  FileText,
  Image as ImageIcon,
  Users,
  Palette,
  FileCheck,
  Loader2,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Monitor,
  Copy,
  Check,
  Search,
  Plus,
  Eye,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ── Helpers ─────────────────────────────────────────────────── */

/** Safely convert unknown value to string for JSX rendering */
function str(v: unknown): string {
  if (v === null || v === undefined) return ""
  if (typeof v === "string") return v
  return String(v)
}

function tryParseContent(raw: unknown): unknown {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw)
    } catch {
      return raw
    }
  }
  if (
    raw &&
    typeof raw === "object" &&
    "content" in (raw as Record<string, unknown>)
  ) {
    const content = (raw as Record<string, unknown>).content
    if (Array.isArray(content)) {
      const textPart = content.find(
        (c: Record<string, unknown>) => c.type === "text"
      ) as Record<string, unknown> | undefined
      if (textPart?.text) {
        try {
          return JSON.parse(textPart.text as string)
        } catch {
          return textPart.text
        }
      }
    }
    return content
  }
  return raw
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="flex h-6 w-6 items-center justify-center rounded-md text-[#777] transition-colors hover:bg-[#333] hover:text-white"
      aria-label="Copy"
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-400" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  )
}

function ToolCard({
  icon: Icon,
  label,
  accentColor = "#0045FF",
  children,
  count,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  accentColor?: string
  children: React.ReactNode
  count?: number
}) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#111] shadow-lg">
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: `1px solid ${accentColor}20` }}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5" style={{ color: accentColor }} />
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            {label}
          </span>
        </div>
        {count !== undefined && (
          <span className="rounded-full bg-[#222] px-2 py-0.5 text-[10px] font-medium text-[#888]">
            {count} {count === 1 ? "item" : "items"}
          </span>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

/* ── Site List Card ──────────────────────────────────────────── */

export function SiteListCard({ data }: { data: unknown }) {
  const parsed = tryParseContent(data)

  // If the parsed result is an error object, don't render it as a site
  if (
    parsed &&
    typeof parsed === "object" &&
    !Array.isArray(parsed) &&
    (parsed as Record<string, unknown>).error === true
  ) {
    return <ErrorResult data={parsed as Record<string, unknown>} />
  }

  const sites = Array.isArray(parsed)
    ? parsed
    : (parsed as Record<string, unknown>)?.sites
      ? ((parsed as Record<string, unknown>).sites as unknown[])
      : parsed && typeof parsed === "object" && ((parsed as Record<string, unknown>).name || (parsed as Record<string, unknown>).siteName)
        ? [parsed]
        : []

  return (
    <ToolCard icon={Globe} label="Sites" count={sites.length}>
      <div className="flex flex-col gap-2">
        {sites.map((site, i) => {
          const s = site as Record<string, unknown>
          const name =
            (s.name as string) || (s.siteName as string) || `Site ${i + 1}`
          return (
            <div
              key={i}
              className="group flex items-center gap-3 rounded-lg border border-[#222] bg-[#0a0a0a] p-3 transition-all hover:border-[#0045FF]/30 hover:bg-[#151515]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0045FF]/10">
                <Globe className="h-4 w-4 text-[#0045FF]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {name}
                </p>
                {s.id && (
                  <p className="flex items-center gap-1 truncate text-[11px] font-mono text-[#666]">
                    {str(s.id)}
                    <CopyButton text={str(s.id)} />
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {s.language && (
                  <span className="rounded-full border border-[#333] px-2 py-0.5 text-[10px] font-medium text-[#888]">
                    {str(s.language)}
                  </span>
                )}
                <ChevronRight className="h-3.5 w-3.5 text-[#555] transition-colors group-hover:text-[#0045FF]" />
              </div>
            </div>
          )
        })}
        {sites.length === 0 && (
          <p className="py-4 text-center text-sm text-[#666]">
            No sites found.
          </p>
        )}
      </div>
    </ToolCard>
  )
}

/* ── Page Tree View ──────────────────────────────────────────── */

function PageNode({
  node,
  depth = 0,
}: {
  node: Record<string, unknown>
  depth?: number
}) {
  const [open, setOpen] = React.useState(depth < 2)
  const children = (node.children || node.pages) as
    | Record<string, unknown>[]
    | undefined
  const hasChildren = Array.isArray(children) && children.length > 0
  const name =
    (node.name as string) || (node.title as string) || "Untitled"

  return (
    <div>
      <button
        onClick={() => hasChildren && setOpen(!open)}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm transition-colors hover:bg-[#1a1a1a]",
          hasChildren && "cursor-pointer"
        )}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {hasChildren ? (
          open ? (
            <ChevronDown className="h-3 w-3 shrink-0 text-[#0045FF]" />
          ) : (
            <ChevronRight className="h-3 w-3 shrink-0 text-[#666]" />
          )
        ) : (
          <FileText className="h-3 w-3 shrink-0 text-[#555]" />
        )}
        <span
          className={cn(
            "flex-1 truncate font-medium",
            hasChildren ? "text-white" : "text-[#ccc]"
          )}
        >
          {name}
        </span>
        {node.template && (
          <span className="shrink-0 rounded bg-[#222] px-1.5 py-0.5 text-[9px] font-medium text-[#777]">
            {str(node.template)}
          </span>
        )}
      </button>
      {open &&
        hasChildren &&
        children!.map((child, i) => (
          <PageNode key={i} node={child} depth={depth + 1} />
        ))}
    </div>
  )
}

export function PageTreeView({ data }: { data: unknown }) {
  const parsed = tryParseContent(data)
  const pages = Array.isArray(parsed)
    ? parsed
    : (parsed as Record<string, unknown>)?.pages
      ? ((parsed as Record<string, unknown>).pages as unknown[])
      : [parsed]

  return (
    <ToolCard icon={Layers} label="Page Tree">
      <div className="-mx-1">
        {(pages as Record<string, unknown>[]).map((page, i) => (
          <PageNode key={i} node={page} />
        ))}
        {pages.length === 0 && (
          <p className="py-4 text-center text-sm text-[#666]">
            No pages found.
          </p>
        )}
      </div>
    </ToolCard>
  )
}

/* ── Page Created / Details ─────────────────────────────────── */

export function PageCreatedCard({ data }: { data: unknown }) {
  const parsed = tryParseContent(data) as Record<string, unknown>
  const name =
    (parsed?.pageName as string) ||
    (parsed?.name as string) ||
    "New Page"
  const path =
    (parsed?.pagePath as string) || (parsed?.path as string) || ""
  const template =
    (parsed?.template as string) || (parsed?.templateName as string) || ""

  return (
    <ToolCard icon={Plus} label="Page Created" accentColor="#10b981">
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">{name}</p>
            {path && (
              <p className="mt-0.5 flex items-center gap-1 text-xs font-mono text-[#888]">
                {path}
                <CopyButton text={path} />
              </p>
            )}
            {template && (
              <span className="mt-2 inline-block rounded bg-[#222] px-2 py-0.5 text-[10px] font-medium text-[#888]">
                Template: {template}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="flex items-center gap-1.5 rounded-lg border border-[#333] bg-[#1a1a1a] px-3 py-1.5 text-[11px] font-medium text-[#ccc] transition-colors hover:border-[#0045FF]/40 hover:text-white">
          <Eye className="h-3 w-3" />
          Preview
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-[#333] bg-[#1a1a1a] px-3 py-1.5 text-[11px] font-medium text-[#ccc] transition-colors hover:border-[#0045FF]/40 hover:text-white">
          <Plus className="h-3 w-3" />
          Add Component
        </button>
      </div>
    </ToolCard>
  )
}

/* ── Page Screenshot ─────────────────────────────────────────── */

export function PageScreenshot({ data }: { data: unknown }) {
  const parsed = tryParseContent(data) as Record<string, unknown>
  const url =
    (parsed?.screenshotUrl as string) ||
    (parsed?.url as string) ||
    (parsed?.imageUrl as string)
  const title =
    (parsed?.title as string) || (parsed?.pageName as string)

  return (
    <ToolCard icon={Monitor} label="Page Preview">
      {title && (
        <p className="mb-3 text-sm font-semibold text-white">{title}</p>
      )}
      {url ? (
        <div className="overflow-hidden rounded-lg border border-[#333]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={title || "Page screenshot"}
            className="w-full"
          />
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-[#333] bg-[#0a0a0a]">
          <p className="text-sm text-[#666]">Screenshot not available</p>
        </div>
      )}
      {parsed?.pageUrl && (
        <a
          href={parsed.pageUrl as string}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#0045FF] hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          Open page
        </a>
      )}
    </ToolCard>
  )
}

/* ── Asset Grid ──────────────────────────────────────────────── */

export function AssetGrid({ data }: { data: unknown }) {
  const parsed = tryParseContent(data)
  const assets = Array.isArray(parsed)
    ? parsed
    : (parsed as Record<string, unknown>)?.assets
      ? ((parsed as Record<string, unknown>).assets as unknown[])
      : (parsed as Record<string, unknown>)?.results
        ? ((parsed as Record<string, unknown>).results as unknown[])
        : [parsed]

  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null)

  return (
    <ToolCard icon={Search} label="Assets Found" accentColor="#8b5cf6" count={assets.length}>
      <div className="grid grid-cols-3 gap-2">
        {(assets as Record<string, unknown>[]).map((asset, i) => {
          const thumb =
            (asset.thumbnailUrl as string) ||
            (asset.url as string) ||
            (asset.imageUrl as string)
          const name =
            (asset.name as string) ||
            (asset.fileName as string) ||
            `Asset ${i + 1}`
          const isSelected = selectedIdx === i
          return (
            <button
              key={i}
              onClick={() => setSelectedIdx(isSelected ? null : i)}
              className={cn(
                "group overflow-hidden rounded-lg border transition-all",
                isSelected
                  ? "border-[#8b5cf6] shadow-[0_0_0_1px_#8b5cf6]"
                  : "border-[#222] hover:border-[#444]"
              )}
            >
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumb}
                  alt={name}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-[#0a0a0a]">
                  <ImageIcon className="h-6 w-6 text-[#333]" />
                </div>
              )}
              <div className="bg-[#0a0a0a] p-1.5">
                <p className="truncate text-[10px] font-medium text-[#ccc]">
                  {name}
                </p>
              </div>
            </button>
          )
        })}
      </div>
      {/* Selected asset detail */}
      {selectedIdx !== null && (
        <div className="mt-3 rounded-lg border border-[#8b5cf6]/30 bg-[#8b5cf6]/5 p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-white">
              {(assets[selectedIdx] as Record<string, unknown>)?.name as string ||
                `Asset ${selectedIdx + 1}`}
            </p>
            <div className="flex gap-1">
              <button className="flex h-6 items-center gap-1 rounded-md bg-[#222] px-2 text-[10px] font-medium text-[#ccc] hover:text-white">
                <Download className="h-2.5 w-2.5" />
                Use
              </button>
            </div>
          </div>
          {(assets[selectedIdx] as Record<string, unknown>)?.fileSize && (
            <p className="mt-1 text-[10px] text-[#666]">
              Size:{" "}
              {
                (assets[selectedIdx] as Record<string, unknown>)
                  .fileSize as string
              }
            </p>
          )}
        </div>
      )}
      {assets.length === 0 && (
        <p className="py-4 text-center text-sm text-[#666]">
          No assets found.
        </p>
      )}
    </ToolCard>
  )
}

/* ── Personalization Card ──────────────────��─────────────────── */

export function PersonalizationCard({ data }: { data: unknown }) {
  const parsed = tryParseContent(data)
  const variants = Array.isArray(parsed)
    ? parsed
    : (parsed as Record<string, unknown>)?.variants
      ? ((parsed as Record<string, unknown>).variants as unknown[])
      : [parsed]

  const [activeIdx, setActiveIdx] = React.useState(0)

  const colors = ["#0045FF", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <ToolCard
      icon={Users}
      label="Personalization Variants"
      accentColor="#f59e0b"
      count={variants.length}
    >
      {/* Variant tabs */}
      <div className="mb-3 flex gap-1 rounded-lg bg-[#0a0a0a] p-1">
        {(variants as Record<string, unknown>[]).map((variant, i) => {
          const name =
            (variant.name as string) ||
            (variant.variantName as string) ||
            `Variant ${i + 1}`
          return (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={cn(
                "flex-1 rounded-md px-3 py-1.5 text-[11px] font-medium transition-all",
                activeIdx === i
                  ? "bg-[#222] text-white shadow-sm"
                  : "text-[#777] hover:text-[#ccc]"
              )}
            >
              {name}
            </button>
          )
        })}
      </div>

      {/* Active variant detail */}
      {variants.length > 0 && (
        <div className="rounded-lg border border-[#222] bg-[#0a0a0a] p-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{
                backgroundColor: `${colors[activeIdx % colors.length]}20`,
                color: colors[activeIdx % colors.length],
              }}
            >
              V{activeIdx + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">
                {(variants[activeIdx] as Record<string, unknown>)?.name as string ||
                  (variants[activeIdx] as Record<string, unknown>)
                    ?.variantName as string ||
                  `Variant ${activeIdx + 1}`}
              </p>
              {((variants[activeIdx] as Record<string, unknown>)?.audience ||
                (variants[activeIdx] as Record<string, unknown>)
                  ?.condition) && (
                <div className="mt-1 flex items-center gap-1.5">
                  <Users className="h-3 w-3 text-[#666]" />
                  <p className="text-xs text-[#999]">
                    {(variants[activeIdx] as Record<string, unknown>)
                      ?.audience as string ||
                      (variants[activeIdx] as Record<string, unknown>)
                        ?.condition as string}
                  </p>
                </div>
              )}
              {(variants[activeIdx] as Record<string, unknown>)
                ?.description && (
                <p className="mt-2 text-xs leading-relaxed text-[#888]">
                  {
                    (variants[activeIdx] as Record<string, unknown>)
                      .description as string
                  }
                </p>
              )}
            </div>
          </div>
          {(variants[activeIdx] as Record<string, unknown>)?.isDefault && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#0045FF]/10 px-2.5 py-1 text-[10px] font-medium text-[#0045FF]">
              <CheckCircle2 className="h-3 w-3" />
              Default Variant
            </div>
          )}
        </div>
      )}
    </ToolCard>
  )
}

/* ── Brand Kit Card ──────────────────────────────────────────── */

export function BrandKitCard({ data }: { data: unknown }) {
  const parsed = tryParseContent(data) as Record<string, unknown>
  const kits = Array.isArray(parsed)
    ? parsed
    : (parsed as Record<string, unknown>)?.brandKits
      ? ((parsed as Record<string, unknown>).brandKits as unknown[])
      : [parsed]

  return (
    <ToolCard icon={Palette} label="Brand Kit" accentColor="#ec4899">
      <div className="flex flex-col gap-4">
        {(kits as Record<string, unknown>[]).map((kit, i) => {
          const colors = (kit.colors || kit.brandColors) as
            | string[]
            | undefined
          const name = (kit.name as string) || `Brand Kit ${i + 1}`
          return (
            <div key={i}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{name}</p>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                  Active
                </span>
              </div>
              {kit.description && (
                <p className="mt-1 text-xs leading-relaxed text-[#888]">
                  {str(kit.description)}
                </p>
              )}

              {/* Color swatches */}
              {colors && Array.isArray(colors) && colors.length > 0 && (
                <div className="mt-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#666]">
                    Brand Colors
                  </p>
                  <div className="flex gap-3">
                    {colors.map((color, ci) => (
                      <div
                        key={ci}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <div
                          className="h-12 w-12 rounded-xl border border-[#333] shadow-sm"
                          style={{
                            backgroundColor:
                              typeof color === "string" ? color : "#ccc",
                          }}
                        />
                        <span className="text-[9px] font-mono text-[#777]">
                          {typeof color === "string" ? color : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fonts */}
              {kit.fonts && (
                <div className="mt-3">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#666]">
                    Typography
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      (Array.isArray(kit.fonts)
                        ? kit.fonts
                        : [kit.fonts]) as string[]
                    ).map((font, fi) => (
                      <span
                        key={fi}
                        className="rounded-md border border-[#333] bg-[#0a0a0a] px-2 py-1 text-[10px] font-medium text-[#ccc]"
                      >
                        {font}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tone of voice */}
              {kit.toneOfVoice && (
                <div className="mt-3">
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#666]">
                    Tone of Voice
                  </p>
                  <p className="rounded-lg border border-[#222] bg-[#0a0a0a] p-3 text-xs leading-relaxed text-[#ccc]">
                    {str(kit.toneOfVoice)}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </ToolCard>
  )
}

/* ── Brief Preview ─────────────────���─────────────────────────── */

export function BriefPreview({ data }: { data: unknown }) {
  const parsed = tryParseContent(data) as Record<string, unknown>
  const [expanded, setExpanded] = React.useState(false)

  return (
    <ToolCard icon={FileCheck} label="Marketing Brief" accentColor="#06b6d4">
      <div className="space-y-4">
        {/* Title */}
        {parsed?.title && (
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-bold text-white">
              {str(parsed?.title)}
            </h4>
            <CopyButton
              text={JSON.stringify(parsed, null, 2)}
            />
          </div>
        )}

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-3">
          {parsed?.objective && (
            <div className="rounded-lg border border-[#222] bg-[#0a0a0a] p-3">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#06b6d4]">
                Objective
              </p>
              <p className="text-xs leading-relaxed text-[#ccc]">
                {str(parsed?.objective)}
              </p>
            </div>
          )}
          {parsed?.targetAudience && (
            <div className="rounded-lg border border-[#222] bg-[#0a0a0a] p-3">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#06b6d4]">
                Target Audience
              </p>
              <p className="text-xs leading-relaxed text-[#ccc]">
                {str(parsed?.targetAudience)}
              </p>
            </div>
          )}
        </div>

        {/* Key messages */}
        {parsed?.keyMessages && Array.isArray(parsed.keyMessages) && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#666]">
              Key Messages
            </p>
            <div className="flex flex-col gap-1.5">
              {(parsed.keyMessages as string[]).map((msg, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-[#0a0a0a] px-3 py-2"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#06b6d4]/10 text-[8px] font-bold text-[#06b6d4]">
                    {i + 1}
                  </span>
                  <p className="text-xs leading-relaxed text-[#ccc]">{msg}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full content */}
        {parsed?.content && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#06b6d4] hover:underline"
            >
              {expanded ? "Hide Full Brief" : "Show Full Brief"}
            </button>
            {expanded && (
              <div className="rounded-lg border border-[#222] bg-[#0a0a0a] p-3 text-xs leading-relaxed text-[#ccc] whitespace-pre-wrap">
                {typeof parsed.content === "string"
                  ? parsed.content
                  : JSON.stringify(parsed.content, null, 2)}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolCard>
  )
}

/* ── Job Status Badge ────────────────────────────────────────── */

export function JobStatusBadge({ data }: { data: unknown }) {
  const parsed = tryParseContent(data) as Record<string, unknown>
  const status = (
    (parsed?.status as string) || "unknown"
  ).toLowerCase()
  const isComplete =
    status === "completed" || status === "done" || status === "success"
  const isError = status === "failed" || status === "error"

  const color = isComplete
    ? "#10b981"
    : isError
      ? "#ef4444"
      : "#f59e0b"
  const Icon = isComplete
    ? CheckCircle2
    : isError
      ? AlertCircle
      : Clock

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#111] p-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">
          {(parsed?.jobName as string) ||
            (parsed?.name as string) ||
            "Job Status"}
        </p>
        <p className="text-xs capitalize" style={{ color }}>
          {status}
        </p>
        {parsed?.message && (
          <p className="mt-0.5 text-[11px] text-[#888]">
            {str(parsed?.message)}
          </p>
        )}
      </div>
      {!isComplete && !isError && (
        <Loader2 className="h-4 w-4 animate-spin" style={{ color }} />
      )}
    </div>
  )
}

/* ── Homepage Updated Card ────────────────────────────────────── */

export function HomepageUpdatedCard({ data }: { data: unknown }) {
  const parsed = tryParseContent(data) as Record<string, unknown>
  const componentName = (parsed?.componentName as string) || "Component"

  return (
    <ToolCard icon={CheckCircle2} label="Homepage Updated" accentColor="#10b981">
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {parsed?.message as string || `${componentName} updated successfully`}
            </p>
            <p className="mt-1 text-xs text-[#888]">
              Changes are live on the{" "}
              <a href="/" target="_blank" rel="noopener noreferrer" className="text-[#0045FF] hover:underline">
                homepage
              </a>
              . Refresh the page to see updates.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#333] bg-[#1a1a1a] px-3 py-1.5 text-[11px] font-medium text-[#ccc] transition-colors hover:border-[#0045FF]/40 hover:text-white"
        >
          <ExternalLink className="h-3 w-3" />
          View Homepage
        </a>
      </div>
    </ToolCard>
  )
}

/* ── Error Result ─────────────────────────────────────────────── */

function ErrorResult({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-red-400">
            {(data.message as string) || "An error occurred"}
          </p>
          {data.suggestion && (
            <p className="mt-1 text-[11px] text-[#888]">
              {str(data.suggestion)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Generic Tool Result (fallback) ──────────────────────────── */

export function GenericToolResult({
  toolName,
  data,
}: {
  toolName: string
  data: unknown
}) {
  const parsed = tryParseContent(data)
  const [expanded, setExpanded] = React.useState(false)

  const displayName = toolName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())

  const jsonStr =
    typeof parsed === "string"
      ? parsed
      : JSON.stringify(parsed, null, 2)
  const isLong = jsonStr.length > 300

  return (
    <ToolCard icon={CheckCircle2} label={displayName} accentColor="#10b981">
      <pre
        className={cn(
          "overflow-x-auto rounded-lg bg-[#0a0a0a] p-3 text-[11px] font-mono leading-relaxed text-[#ccc]",
          !expanded && isLong && "max-h-48 overflow-y-hidden"
        )}
      >
        {jsonStr}
      </pre>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-[10px] font-medium text-[#0045FF] hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </ToolCard>
  )
}

/* ── Tool Loading ────────────────────────────────────────────── */

export function ToolLoading({ toolName }: { toolName: string }) {
  const labels: Record<string, string> = {
    list_sites: "Discovering HARTMANN sites...",
    get_site_details: "Loading site details...",
    get_page_tree: "Building page tree...",
    get_page_details: "Loading page details...",
    get_page_content: "Loading page content...",
    get_page_screenshot: "Capturing page preview...",
    create_page: "Creating new page...",
    update_page: "Updating page...",
    add_component: "Adding component...",
    update_component_content: "Updating component...",
    search_assets: "Searching media library...",
    get_asset_details: "Loading asset info...",
    list_personalization_variants: "Loading personalization variants...",
    create_personalization_variant: "Setting up audience targeting...",
    list_brand_kits: "Loading brand kits...",
    get_brand_kit_details: "Loading brand details...",
    create_brand_kit: "Creating brand kit...",
    create_brief: "Generating marketing brief...",
    list_briefs: "Loading briefs...",
    get_brief_details: "Loading brief content...",
    get_job_status: "Checking job status...",
    update_homepage_content: "Publishing to homepage...",
  }

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-3">
      <div className="relative flex h-6 w-6 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-[#0045FF]/20" />
        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0045FF]" />
      </div>
      <p className="text-xs font-medium text-[#999]">
        {labels[toolName] || `Running ${toolName.replace(/_/g, " ")}...`}
      </p>
    </div>
  )
}

/* ── Router: pick the right component for a tool name ────────── */

export function ToolResultRouter({
  toolName,
  data,
}: {
  toolName: string
  data: unknown
}) {
  // Check for error results first
  const parsed = tryParseContent(data)
  if (
    parsed &&
    typeof parsed === "object" &&
    (parsed as Record<string, unknown>).error === true
  ) {
    return <ErrorResult data={parsed as Record<string, unknown>} />
  }

  if (toolName === "list_sites" || toolName === "get_site_details") {
    return <SiteListCard data={data} />
  }
  if (
    toolName === "get_page_tree" ||
    toolName === "get_page_details" ||
    toolName === "get_page_content"
  ) {
    return <PageTreeView data={data} />
  }
  if (toolName === "create_page") {
    return <PageCreatedCard data={data} />
  }
  if (toolName === "update_page" || toolName === "add_component" || toolName === "update_component_content") {
    return <PageCreatedCard data={data} />
  }
  if (toolName === "get_page_screenshot") {
    return <PageScreenshot data={data} />
  }
  if (
    toolName === "search_assets" ||
    toolName === "get_asset_details"
  ) {
    return <AssetGrid data={data} />
  }
  if (
    toolName === "list_personalization_variants" ||
    toolName === "create_personalization_variant"
  ) {
    return <PersonalizationCard data={data} />
  }
  if (
    toolName === "list_brand_kits" ||
    toolName === "get_brand_kit_details" ||
    toolName === "create_brand_kit"
  ) {
    return <BrandKitCard data={data} />
  }
  if (
    toolName === "create_brief" ||
    toolName === "get_brief_details" ||
    toolName === "list_briefs"
  ) {
    return <BriefPreview data={data} />
  }
  if (toolName === "get_job_status") {
    return <JobStatusBadge data={data} />
  }
  if (toolName === "update_homepage_content") {
    return <HomepageUpdatedCard data={data} />
  }
  return <GenericToolResult toolName={toolName} data={data} />
}
