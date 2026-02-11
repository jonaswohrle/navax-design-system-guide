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

const V0_RULES_TEXT = `Always use the NAVAX design system registry at ${REGISTRY_URL}/r when building components.

When I ask you to build UI, use the NAVAX design system components from the registry:
- Install components via: npx shadcn@latest add ${REGISTRY_URL}/r/<component-name>.json
- Available components: heading, text, stack, section, divider, icon-button, status-badge, navax-logo, stat-card, avatar-group, progress-bar, timeline, alert-banner, empty-state, skeleton-card, navbar, breadcrumbs, tab-nav, page-header, app-header, app-sidebar, app-footer, data-table, form-field, search-input, toggle-button-group, file-upload, pricing-card, testimonial-card, feature-card, command-menu, user-menu, stepper, kbd
- Use the NAVAX brand colors and design tokens from the registry
- Prefer design system components over custom implementations`

const STEPS = [
  {
    number: 1,
    title: "Deploy this registry",
    description:
      "Deploy this project to Vercel (or any host). Your deployed URL becomes the registry base URL.",
  },
  {
    number: 2,
    title: "Add v0 Rules",
    description:
      'In v0, go to the sidebar and click "Rules". Paste the rules below so v0 knows about your design system.',
  },
  {
    number: 3,
    title: "Create a v0 Template (optional)",
    description:
      "If you want every new v0 chat to start with the design system pre-loaded, create a template with the settings below.",
  },
]

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
          <Check className="h-3.5 w-3.5 text-success" />
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

export function ShowcaseTemplateConfig() {
  return (
    <div className="flex flex-col gap-6">
      {/* How it works */}
      <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-6">
        <p className="text-sm font-medium text-primary mb-1">
          How the design system works with v0
        </p>
        <Text variant="small">
          This project is a <strong>shadcn registry</strong> -- a collection of
          components served from a URL. When you install a component via{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono">
            npx shadcn
          </code>
          , it fetches the source code and its dependencies automatically. You
          do not need to install all packages upfront.
        </Text>
      </div>

      {/* Steps overview */}
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-base font-semibold text-foreground mb-4">
          Setup Steps
        </p>
        <div className="flex flex-col gap-4">
          {STEPS.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                {step.number}
              </div>
              <div className="flex flex-col gap-0.5 pt-0.5">
                <p className="text-sm font-medium text-foreground">
                  {step.title}
                </p>
                <Text variant="caption">{step.description}</Text>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registry URL */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-base font-semibold text-foreground">
            Registry URL
          </p>
          <InfoTooltip text="This is the base URL where your component registry is hosted. Replace with your own deployed URL if different." />
        </div>
        <Text variant="small" className="mb-4">
          The base URL for installing components. Replace with your own domain
          after deploying.
        </Text>

        <div className="rounded-md bg-muted p-4">
          <div className="flex items-center justify-between gap-3">
            <pre className="flex-1 text-sm font-mono text-foreground overflow-x-auto">
              {REGISTRY_URL}/r
            </pre>
            <CopyButton
              text={`${REGISTRY_URL}/r`}
              label="Copy registry URL"
            />
          </div>
        </div>

        <Text variant="caption" className="mt-3">
          Example install command:{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono">
            npx shadcn@latest add {REGISTRY_URL}/r/stat-card.json
          </code>
        </Text>
      </div>

      {/* v0 Rules */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-base font-semibold text-foreground">
            v0 Rules
          </p>
          <InfoTooltip text="Paste these rules into v0's Rules panel (sidebar) so it knows to use your design system components when generating code." />
        </div>
        <Text variant="small" className="mb-4">
          Copy and paste into{" "}
          <strong>
            v0 Sidebar {">"} Rules
          </strong>{" "}
          so v0 automatically uses your design system.
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
      </div>

      {/* Template Config section */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-base font-semibold text-foreground">
            v0 Template Settings
          </p>
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Optional
          </span>
        </div>
        <Text variant="small" className="mb-6">
          If you want to create a reusable v0 template, use these values in the{" "}
          <strong>Create Template</strong> dialog.
        </Text>

        {/* NPM Packages */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-foreground">NPM Packages</p>
            <InfoTooltip text="Leave this empty. Component dependencies are resolved automatically when you install via the registry. Only add packages here if you want them pre-installed in every new project from this template." />
          </div>
          <div className="rounded-md bg-muted p-4">
            <p className="text-xs font-mono text-muted-foreground italic">
              Leave empty -- dependencies are auto-resolved per component
            </p>
          </div>
          <Text variant="caption" className="mt-2">
            Each registry component declares its own dependencies (e.g.{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono">
              class-variance-authority
            </code>
            ,{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono">
              lucide-react
            </code>
            ). They get installed automatically when you add a component via the
            CLI.
          </Text>
        </div>

        {/* Environment Variables */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-foreground">
              Environment Variables
            </p>
            <InfoTooltip text="Only required if your registry is behind authentication or your npm packages are in a private scope." />
          </div>

          <div className="rounded-md bg-muted p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 flex-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Name
                  </span>
                  <code className="text-sm font-mono font-semibold text-foreground">
                    NPM_TOKEN
                  </code>
                </div>
                <div className="hidden sm:block h-8 w-px bg-border" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Value
                  </span>
                  <code className="text-sm font-mono text-muted-foreground">
                    npm_xxxxx
                  </code>
                </div>
              </div>
              <div className="shrink-0 flex gap-2">
                <CopyButton text="NPM_TOKEN" label="Copy variable name" />
              </div>
            </div>
          </div>
          <Text variant="caption" className="mt-2">
            Only needed if you publish packages to a private npm scope. For
            public registries like this one, you can skip this.
          </Text>
        </div>

        {/* Tech Stack */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-foreground">Tech Stack</p>
            <InfoTooltip text="Enable both toggles -- the design system is built on shadcn/ui + Tailwind CSS." />
          </div>
          <div className="flex flex-col gap-0 rounded-md border border-border overflow-hidden">
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
            Both must be enabled. The design system extends shadcn/ui
            primitives with NAVAX brand tokens.
          </Text>
        </div>
      </div>

      {/* MCP for AI editors */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-base font-semibold text-foreground">
            AI Code Editors (Cursor, Windsurf)
          </p>
          <InfoTooltip text="Use this MCP config to integrate the registry with AI-powered code editors." />
        </div>
        <Text variant="small" className="mb-4">
          Add this to your editor&apos;s MCP configuration to use the registry
          with Cursor, Windsurf, or other AI editors.
        </Text>

        <div className="relative rounded-md bg-muted p-4">
          <div className="flex items-start justify-between gap-3">
            <pre className="flex-1 whitespace-pre-wrap break-all text-xs font-mono text-foreground leading-relaxed">
{`{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "${REGISTRY_URL}/r/registry.json"
      }
    }
  }
}`}
            </pre>
            <div className="shrink-0">
              <CopyButton
                text={`{\n  "mcpServers": {\n    "shadcn": {\n      "command": "npx",\n      "args": ["-y", "shadcn@canary", "registry:mcp"],\n      "env": {\n        "REGISTRY_URL": "${REGISTRY_URL}/r/registry.json"\n      }\n    }\n  }\n}`}
                label="Copy MCP config"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
