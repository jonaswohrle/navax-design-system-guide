"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ── Helpers ─────────────────────────────────────────────────── */

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

function SectionHeader({
  icon: Icon,
  label,
  accentClass = "text-[#0045FF]",
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  accentClass?: string
}) {
  return (
    <div className="flex items-center gap-2 border-b border-border/40 bg-muted/30 px-5 py-3">
      <Icon className={cn("h-4 w-4", accentClass)} />
      <span
        className={cn(
          "text-xs font-heading font-bold uppercase tracking-wider",
          accentClass
        )}
      >
        {label}
      </span>
    </div>
  )
}

/* ── Site List Card ──────────────────────────────────────────── */

export function SiteListCard({ data }: { data: unknown }) {
  const parsed = tryParseContent(data)
  const sites = Array.isArray(parsed)
    ? parsed
    : (parsed as Record<string, unknown>)?.sites
      ? ((parsed as Record<string, unknown>).sites as unknown[])
      : [parsed]

  return (
    <Card className="w-full overflow-hidden border-border/60 shadow-sm">
      <SectionHeader icon={Globe} label="Sites" />
      <CardContent className="p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {sites.map((site, i) => {
            const s = site as Record<string, unknown>
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0045FF]/10">
                  <Globe className="h-4 w-4 text-[#0045FF]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {(s.name as string) || (s.siteName as string) || `Site ${i + 1}`}
                  </p>
                  {s.id && (
                    <p className="truncate text-xs text-muted-foreground font-mono">
                      {s.id as string}
                    </p>
                  )}
                </div>
                {s.language && (
                  <Badge variant="outline" className="text-[10px]">
                    {s.language as string}
                  </Badge>
                )}
              </div>
            )
          })}
        </div>
        {sites.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No sites found. Use the chat to create a new site.
          </p>
        )}
      </CardContent>
    </Card>
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

  return (
    <div>
      <button
        onClick={() => hasChildren && setOpen(!open)}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50",
          hasChildren && "cursor-pointer"
        )}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {hasChildren ? (
          open ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )
        ) : (
          <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
        )}
        <span className="flex-1 truncate font-medium text-foreground">
          {(node.name as string) || (node.title as string) || "Untitled"}
        </span>
        {node.template && (
          <Badge variant="outline" className="text-[9px] shrink-0">
            {node.template as string}
          </Badge>
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
    <Card className="w-full overflow-hidden border-border/60 shadow-sm">
      <SectionHeader icon={Layers} label="Page Tree" />
      <CardContent className="p-2">
        {(pages as Record<string, unknown>[]).map((page, i) => (
          <PageNode key={i} node={page} />
        ))}
        {pages.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center px-4">
            No pages found.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

/* ── Page Screenshot ─────────────────────────────────────────── */

export function PageScreenshot({ data }: { data: unknown }) {
  const parsed = tryParseContent(data) as Record<string, unknown>
  const url =
    (parsed?.screenshotUrl as string) ||
    (parsed?.url as string) ||
    (parsed?.imageUrl as string)
  const title = (parsed?.title as string) || (parsed?.pageName as string)

  return (
    <Card className="w-full overflow-hidden border-border/60 shadow-sm">
      <SectionHeader icon={Monitor} label="Page Preview" />
      <CardContent className="p-4">
        {title && (
          <p className="mb-3 text-sm font-semibold text-foreground">{title}</p>
        )}
        {url ? (
          <div className="overflow-hidden rounded-lg border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={title || "Page screenshot"}
              className="w-full"
            />
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Screenshot not available
            </p>
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
      </CardContent>
    </Card>
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

  return (
    <Card className="w-full overflow-hidden border-border/60 shadow-sm">
      <SectionHeader icon={ImageIcon} label="Assets" />
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(assets as Record<string, unknown>[]).map((asset, i) => {
            const thumb =
              (asset.thumbnailUrl as string) ||
              (asset.url as string) ||
              (asset.imageUrl as string)
            return (
              <div
                key={i}
                className="group overflow-hidden rounded-lg border border-border transition-all hover:shadow-md"
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt={(asset.name as string) || `Asset ${i + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-muted/30">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
                <div className="p-2">
                  <p className="truncate text-xs font-medium text-foreground">
                    {(asset.name as string) ||
                      (asset.fileName as string) ||
                      `Asset ${i + 1}`}
                  </p>
                  {asset.fileSize && (
                    <p className="text-[10px] text-muted-foreground">
                      {asset.fileSize as string}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        {assets.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No assets found.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

/* ── Personalization Card ────────────────────────────────────── */

export function PersonalizationCard({ data }: { data: unknown }) {
  const parsed = tryParseContent(data)
  const variants = Array.isArray(parsed)
    ? parsed
    : (parsed as Record<string, unknown>)?.variants
      ? ((parsed as Record<string, unknown>).variants as unknown[])
      : [parsed]

  return (
    <Card className="w-full overflow-hidden border-border/60 shadow-sm">
      <SectionHeader icon={Users} label="Personalization Variants" />
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {(variants as Record<string, unknown>[]).map((variant, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-border p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0045FF]/10 text-xs font-bold text-[#0045FF]">
                V{i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {(variant.name as string) ||
                    (variant.variantName as string) ||
                    `Variant ${i + 1}`}
                </p>
                {(variant.audience || variant.condition) && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Audience:{" "}
                    {(variant.audience as string) ||
                      (variant.condition as string)}
                  </p>
                )}
                {variant.description && (
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {variant.description as string}
                  </p>
                )}
              </div>
              {variant.isDefault && (
                <Badge
                  variant="outline"
                  className="border-[#0045FF]/20 text-[#0045FF] text-[10px]"
                >
                  Default
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
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
    <Card className="w-full overflow-hidden border-border/60 shadow-sm">
      <SectionHeader icon={Palette} label="Brand Kits" />
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {(kits as Record<string, unknown>[]).map((kit, i) => {
            const colors = (kit.colors || kit.brandColors) as
              | string[]
              | undefined
            return (
              <div key={i} className="rounded-xl border border-border p-4">
                <p className="text-sm font-semibold text-foreground">
                  {(kit.name as string) || `Brand Kit ${i + 1}`}
                </p>
                {kit.description && (
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {kit.description as string}
                  </p>
                )}
                {colors && Array.isArray(colors) && (
                  <div className="mt-3 flex gap-2">
                    {colors.map((color, ci) => (
                      <div key={ci} className="flex flex-col items-center gap-1">
                        <div
                          className="h-8 w-8 rounded-lg border border-border"
                          style={{
                            backgroundColor:
                              typeof color === "string" ? color : "#ccc",
                          }}
                        />
                        <span className="text-[9px] font-mono text-muted-foreground">
                          {typeof color === "string" ? color : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {kit.fonts && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(
                      (Array.isArray(kit.fonts)
                        ? kit.fonts
                        : [kit.fonts]) as string[]
                    ).map((font, fi) => (
                      <Badge key={fi} variant="outline" className="text-[10px]">
                        {font}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

/* ── Brief Preview ───────────────────────────────────────────── */

export function BriefPreview({ data }: { data: unknown }) {
  const parsed = tryParseContent(data) as Record<string, unknown>

  return (
    <Card className="w-full overflow-hidden border-border/60 shadow-sm">
      <SectionHeader icon={FileCheck} label="Marketing Brief" />
      <CardContent className="p-5">
        {parsed?.title && (
          <h4 className="text-sm font-heading font-bold text-foreground mb-2">
            {parsed.title as string}
          </h4>
        )}
        {parsed?.objective && (
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Objective
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {parsed.objective as string}
            </p>
          </div>
        )}
        {parsed?.targetAudience && (
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Target Audience
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {parsed.targetAudience as string}
            </p>
          </div>
        )}
        {parsed?.keyMessages && Array.isArray(parsed.keyMessages) && (
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Key Messages
            </p>
            <ul className="list-disc pl-4 text-sm text-foreground leading-relaxed">
              {(parsed.keyMessages as string[]).map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
        {parsed?.content && (
          <div className="rounded-lg bg-muted/30 p-3 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {typeof parsed.content === "string"
              ? parsed.content
              : JSON.stringify(parsed.content, null, 2)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/* ── Job Status Badge ────────────────────────────────────────── */

export function JobStatusBadge({ data }: { data: unknown }) {
  const parsed = tryParseContent(data) as Record<string, unknown>
  const status = ((parsed?.status as string) || "unknown").toLowerCase()
  const isComplete = status === "completed" || status === "done" || status === "success"
  const isError = status === "failed" || status === "error"
  const isPending = !isComplete && !isError

  return (
    <Card className="w-full overflow-hidden border-border/60 shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            isComplete && "bg-success/10",
            isError && "bg-destructive/10",
            isPending && "bg-warning/10"
          )}
        >
          {isComplete && <CheckCircle2 className="h-5 w-5 text-success" />}
          {isError && <AlertCircle className="h-5 w-5 text-destructive" />}
          {isPending && <Clock className="h-5 w-5 text-warning" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {(parsed?.jobName as string) ||
              (parsed?.name as string) ||
              "Job Status"}
          </p>
          <p className="text-xs text-muted-foreground capitalize">{status}</p>
          {parsed?.message && (
            <p className="mt-1 text-xs text-muted-foreground">
              {parsed.message as string}
            </p>
          )}
        </div>
        {isPending && <Loader2 className="h-4 w-4 animate-spin text-warning" />}
      </CardContent>
    </Card>
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
    <Card className="w-full overflow-hidden border-border/60 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-5 py-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-success">
            {displayName}
          </span>
        </div>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] font-medium text-[#0045FF] hover:underline"
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        )}
      </div>
      <CardContent className="p-4">
        <pre
          className={cn(
            "overflow-x-auto rounded-lg bg-muted/50 p-3 text-[11px] font-mono text-foreground leading-relaxed",
            !expanded && isLong && "max-h-48 overflow-y-hidden"
          )}
        >
          {jsonStr}
        </pre>
        {!expanded && isLong && (
          <div className="relative -mt-8 flex h-8 items-end justify-center bg-gradient-to-t from-card to-transparent">
            <button
              onClick={() => setExpanded(true)}
              className="text-[10px] font-medium text-[#0045FF] hover:underline"
            >
              Show more
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/* ── Tool Loading ────────────────────────────────────────────── */

export function ToolLoading({ toolName }: { toolName: string }) {
  const labels: Record<string, string> = {
    list_sites: "Loading sites...",
    get_page_tree: "Building page tree...",
    get_page_screenshot: "Capturing screenshot...",
    search_assets: "Searching assets...",
    list_personalization_variants: "Loading variants...",
    list_brand_kits: "Loading brand kits...",
    create_page: "Creating page...",
    create_brief: "Generating brief...",
    get_job_status: "Checking status...",
  }

  const displayName = toolName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card px-4 py-3 shadow-sm">
      <div className="relative flex h-6 w-6 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-[#0045FF]/20" />
        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0045FF]" />
      </div>
      <p className="text-xs font-medium text-muted-foreground">
        {labels[toolName] || `Running ${displayName}...`}
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
  if (toolName === "get_page_screenshot") {
    return <PageScreenshot data={data} />
  }
  if (
    toolName === "search_assets" ||
    toolName === "get_asset_details" ||
    toolName === "upload_asset"
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
  return <GenericToolResult toolName={toolName} data={data} />
}
