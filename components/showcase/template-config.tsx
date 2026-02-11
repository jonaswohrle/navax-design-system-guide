"use client"

import { useState } from "react"
import { Check, Copy, Info, ExternalLink } from "lucide-react"
import { Text } from "@/components/ds"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const REGISTRY_URL = "https://v0-navax-design-system-guide.vercel.app"

const COMPONENT_NAMES = [
  "heading", "text", "stack", "section", "divider", "icon-button",
  "status-badge", "navax-logo", "stat-card", "avatar-group", "progress-bar",
  "timeline", "alert-banner", "empty-state", "skeleton-card", "navbar",
  "breadcrumbs", "tab-nav", "page-header", "app-header", "app-sidebar",
  "app-footer", "data-table", "form-field", "search-input",
  "toggle-button-group", "file-upload", "pricing-card", "testimonial-card",
  "feature-card", "command-menu", "user-menu", "stepper", "kbd",
]

const V0_RULES_TEXT = `Always use the NAVAX design system registry at ${REGISTRY_URL}/r when building UI.

Install components via: npx shadcn@latest add ${REGISTRY_URL}/r/<component-name>.json

Available components: ${COMPONENT_NAMES.join(", ")}

Use NAVAX design system components instead of custom implementations. The registry resolves all dependencies automatically.`

const MCP_CONFIG = `{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "${REGISTRY_URL}/r/registry.json"
      }
    }
  }
}`

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={label || "Copy to clipboard"}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-500" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  )
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-lg border border-border bg-card p-6 ${className || ""}`}>
      {children}
    </div>
  )
}

export function ShowcaseTemplateConfig() {
  return (
    <div className="flex flex-col gap-6">
      {/* How it works callout */}
      <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-6">
        <p className="text-sm font-medium text-primary mb-1">
          How does this work?
        </p>
        <Text variant="small">
          The NAVAX design system is a{" "}
          <strong>shadcn registry</strong> -- a collection of components served
          from a URL. There is no NPM package to install. Instead, you add
          components on demand via the CLI or import them into v0 directly. Each
          component resolves its own dependencies automatically.
        </Text>
      </div>

      {/* ─── OPTION A: v0 Rules ─── */}
      <SectionCard>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            1
          </span>
          <p className="text-base font-semibold text-foreground">
            Add v0 Rules
          </p>
        </div>
        <Text variant="small" className="mb-4 ml-9">
          In v0, open the sidebar and click{" "}
          <strong>Rules</strong>. Paste the text below so v0 uses your design
          system for every generation.
        </Text>
        <div className="relative rounded-md bg-muted p-4">
          <div className="flex items-start justify-between gap-3">
            <pre className="flex-1 whitespace-pre-wrap break-words text-xs font-mono text-foreground leading-relaxed">
              {V0_RULES_TEXT}
            </pre>
            <div className="shrink-0">
              <CopyButton text={V0_RULES_TEXT} label="Copy v0 rules" />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ─── OPTION B: Create Template ─── */}
      <SectionCard>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            2
          </span>
          <p className="text-base font-semibold text-foreground">
            Create a v0 Template
          </p>
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Optional
          </span>
        </div>
        <Text variant="small" className="mb-6 ml-9">
          Create a template so every new v0 project starts with the design
          system pre-loaded. Use these values in the{" "}
          <strong>Create Template</strong> dialog.
        </Text>

        {/* NPM Packages */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-foreground">NPM Packages</p>
            <InfoTooltip text="This field is for npm packages to pre-install in every project created from the template. Since the design system is a registry (not an npm package), leave this empty." />
          </div>
          <div className="rounded-md border border-border bg-muted/50 p-4">
            <p className="text-sm font-mono text-muted-foreground italic">
              Leave empty
            </p>
          </div>
          <Text variant="caption" className="mt-2">
            The design system is not an npm package. Components are installed
            from the registry URL and each one declares its own npm
            dependencies, which get installed automatically.
          </Text>
        </div>

        {/* Environment Variables */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-foreground">
              Environment Variables
            </p>
            <InfoTooltip text="Only needed if your registry or npm packages require authentication (e.g. a private npm scope)." />
          </div>
          <div className="rounded-md border border-border bg-muted/50 p-4">
            <p className="text-sm font-mono text-muted-foreground italic">
              None required
            </p>
          </div>
          <Text variant="caption" className="mt-2">
            This is a public registry -- no tokens or secrets needed. If you
            fork this and host it behind auth, add{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono">
              NPM_TOKEN
            </code>{" "}
            here with your token value.
          </Text>
        </div>

        {/* Tech Stack */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-foreground">Tech Stack</p>
            <InfoTooltip text="Both must be enabled -- the design system extends shadcn/ui with NAVAX brand tokens and uses Tailwind CSS for styling." />
          </div>
          <div className="flex flex-col rounded-md border border-border overflow-hidden">
            <div className="flex items-center justify-between bg-muted/50 px-4 py-3 border-b border-border">
              <span className="text-sm font-medium text-foreground">
                Tailwind CSS
              </span>
              <Switch checked disabled aria-label="Tailwind CSS enabled" />
            </div>
            <div className="flex items-center justify-between bg-muted/50 px-4 py-3">
              <span className="text-sm font-medium text-foreground">
                shadcn/ui
              </span>
              <Switch checked disabled aria-label="shadcn/ui enabled" />
            </div>
          </div>
          <Text variant="caption" className="mt-2">
            Enable both toggles when creating the template.
          </Text>
        </div>
      </SectionCard>

      {/* ─── CLI Install ─── */}
      <SectionCard>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            3
          </span>
          <p className="text-base font-semibold text-foreground">
            Install components via CLI
          </p>
        </div>
        <Text variant="small" className="mb-4 ml-9">
          Add any component to an existing project with a single command.
        </Text>

        <div className="rounded-md bg-muted p-4">
          <div className="flex items-center justify-between gap-3">
            <pre className="flex-1 text-sm font-mono text-foreground overflow-x-auto">
              npx shadcn@latest add {REGISTRY_URL}/r/stat-card.json
            </pre>
            <CopyButton
              text={`npx shadcn@latest add ${REGISTRY_URL}/r/stat-card.json`}
              label="Copy install command"
            />
          </div>
        </div>

        <Text variant="caption" className="mt-3">
          Replace{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono">
            stat-card
          </code>{" "}
          with any component name from the registry. Run multiple times to add
          more components.
        </Text>
      </SectionCard>

      {/* ─── MCP for AI editors ─── */}
      <SectionCard>
        <div className="flex items-center gap-3 mb-1">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-bold">
            <ExternalLink className="h-3 w-3" />
          </span>
          <p className="text-base font-semibold text-foreground">
            AI Code Editors (Cursor, Windsurf)
          </p>
        </div>
        <Text variant="small" className="mb-4 ml-9">
          Add this MCP configuration to use the registry with Cursor, Windsurf,
          or other AI editors.
        </Text>

        <div className="relative rounded-md bg-muted p-4">
          <div className="flex items-start justify-between gap-3">
            <pre className="flex-1 whitespace-pre-wrap break-all text-xs font-mono text-foreground leading-relaxed">
              {MCP_CONFIG}
            </pre>
            <div className="shrink-0">
              <CopyButton text={MCP_CONFIG} label="Copy MCP config" />
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
