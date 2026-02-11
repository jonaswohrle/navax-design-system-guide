"use client"

import { useState } from "react"
import { Check, Copy, Info, ExternalLink, Package, Terminal, FileCode2 } from "lucide-react"
import { Text } from "@/components/ds"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const REGISTRY_URL = "https://v0-navax-design-system-guide.vercel.app"
const NPM_PACKAGE = "@navax/design-system"

const COMPONENT_NAMES = [
  "heading", "text", "stack", "section", "divider", "icon-button",
  "status-badge", "navax-logo", "stat-card", "avatar-group", "progress-bar",
  "timeline", "alert-banner", "empty-state", "skeleton-card", "navbar",
  "breadcrumbs", "tab-nav", "page-header", "app-header", "app-sidebar",
  "app-footer", "data-table", "form-field", "search-input",
  "toggle-button-group", "file-upload", "pricing-card", "testimonial-card",
  "feature-card", "command-menu", "user-menu", "stepper", "kbd",
]

const V0_RULES_TEXT = `Always use the NAVAX design system when building UI.

The package "${NPM_PACKAGE}" is pre-installed. Import components from it directly:
import { StatCard, Heading, Text, NavaxLogo } from "${NPM_PACKAGE}"

For components not in the package, install from the registry:
npx shadcn@latest add ${REGISTRY_URL}/r/<component-name>.json

Available components: ${COMPONENT_NAMES.join(", ")}

Use NAVAX design system components instead of custom implementations.`

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

const PACKAGE_JSON_EXAMPLE = `{
  "name": "${NPM_PACKAGE}",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./globals.css": "./dist/globals.css"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18",
    "tailwindcss": ">=3"
  }
}`

const TSUP_CONFIG = `import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
})`

const INDEX_TS_EXAMPLE = `// src/index.ts
// Re-export all design system components
export { Heading } from "./components/heading"
export { Text } from "./components/text"
export { StatCard } from "./components/stat-card"
export { NavaxLogo } from "./components/navax-logo"
export { StatusBadge } from "./components/status-badge"
// ... export all 34 components`

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

function StepNumber({ n }: { n: number }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
      {n}
    </span>
  )
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="relative rounded-md bg-muted p-4">
      <div className="flex items-start justify-between gap-3">
        <pre className="flex-1 whitespace-pre-wrap break-words text-xs font-mono text-foreground leading-relaxed overflow-x-auto">
          {code}
        </pre>
        <div className="shrink-0">
          <CopyButton text={code} label={label} />
        </div>
      </div>
    </div>
  )
}

export function ShowcaseTemplateConfig() {
  return (
    <div className="flex flex-col gap-8">

      {/* ─────────────────────────────────────────────────────
          SECTION A: Create the npm package
         ───────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <Package className="h-5 w-5 text-primary" />
          <p className="text-lg font-semibold text-foreground">
            Publish the npm package
          </p>
        </div>
        <Text variant="small" className="mb-6">
          Create a separate repo for{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono font-semibold">
            {NPM_PACKAGE}
          </code>{" "}
          that bundles all 34 components into a single installable package.
        </Text>

        <div className="flex flex-col gap-4">
          {/* Step 1 -- scaffold */}
          <SectionCard>
            <div className="flex items-center gap-3 mb-3">
              <StepNumber n={1} />
              <p className="text-sm font-semibold text-foreground">
                Scaffold the package
              </p>
            </div>
            <Text variant="small" className="mb-4 ml-9">
              Create a new repo with the following structure. Use{" "}
              <strong>tsup</strong> to bundle and generate type declarations.
            </Text>
            <div className="ml-9 flex flex-col gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">
                  package.json
                </p>
                <CodeBlock code={PACKAGE_JSON_EXAMPLE} label="Copy package.json" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">
                  tsup.config.ts
                </p>
                <CodeBlock code={TSUP_CONFIG} label="Copy tsup config" />
              </div>
            </div>
          </SectionCard>

          {/* Step 2 -- add components */}
          <SectionCard>
            <div className="flex items-center gap-3 mb-3">
              <StepNumber n={2} />
              <p className="text-sm font-semibold text-foreground">
                Add the components
              </p>
            </div>
            <Text variant="small" className="mb-4 ml-9">
              Copy all DS components into{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                src/components/
              </code>{" "}
              and re-export them from a barrel file.
            </Text>
            <div className="ml-9">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                src/index.ts
              </p>
              <CodeBlock code={INDEX_TS_EXAMPLE} label="Copy index.ts" />
            </div>
          </SectionCard>

          {/* Step 3 -- publish */}
          <SectionCard>
            <div className="flex items-center gap-3 mb-3">
              <StepNumber n={3} />
              <p className="text-sm font-semibold text-foreground">
                Build and publish
              </p>
            </div>
            <div className="ml-9 flex flex-col gap-3">
              <CodeBlock
                code={`npm install tsup typescript --save-dev\nnpm run build\nnpm publish --access public`}
                label="Copy publish commands"
              />
              <Text variant="caption">
                Make sure you have an npm account with access to the{" "}
                <strong>@navax</strong> scope. Run{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono">
                  npm login
                </code>{" "}
                first if needed.
              </Text>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────
          SECTION B: Use in v0
         ───────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <Terminal className="h-5 w-5 text-primary" />
          <p className="text-lg font-semibold text-foreground">
            Use in v0
          </p>
        </div>
        <Text variant="small" className="mb-6">
          Once published, configure a v0 template so every new project
          starts with the design system ready to import.
        </Text>

        <div className="flex flex-col gap-4">
          {/* Create Template values */}
          <SectionCard>
            <div className="flex items-center gap-3 mb-3">
              <StepNumber n={1} />
              <p className="text-sm font-semibold text-foreground">
                Create Template values
              </p>
            </div>
            <Text variant="small" className="mb-6 ml-9">
              In v0, go to <strong>Settings &rarr; Templates &rarr; Create Template</strong> and fill in these fields:
            </Text>

            {/* NPM Packages */}
            <div className="mb-5 ml-9">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-foreground">
                  NPM Packages
                </p>
                <InfoTooltip text="Comma-separated list of npm packages to pre-install in every project created from this template." />
              </div>
              <div className="rounded-md border border-border bg-muted/50 px-4 py-3 flex items-center justify-between gap-3">
                <code className="text-sm font-mono text-foreground">
                  {NPM_PACKAGE}
                </code>
                <CopyButton text={NPM_PACKAGE} label="Copy package name" />
              </div>
            </div>

            {/* Environment Variables */}
            <div className="mb-5 ml-9">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-foreground">
                  Environment Variables
                </p>
                <InfoTooltip text="Not needed for a public npm package. Only required if you publish to a private scope." />
              </div>
              <div className="rounded-md border border-border bg-muted/50 px-4 py-3">
                <p className="text-sm text-muted-foreground italic">
                  None required (public package)
                </p>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="ml-9">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-foreground">
                  Tech Stack
                </p>
                <InfoTooltip text="The design system uses Tailwind CSS for styling and extends shadcn/ui components." />
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
                Enable both toggles.
              </Text>
            </div>
          </SectionCard>

          {/* v0 Rules */}
          <SectionCard>
            <div className="flex items-center gap-3 mb-3">
              <StepNumber n={2} />
              <p className="text-sm font-semibold text-foreground">
                Add v0 Rules
              </p>
            </div>
            <Text variant="small" className="mb-4 ml-9">
              Open the sidebar in v0 and click <strong>Rules</strong>.
              Paste the following so v0 always uses the design system:
            </Text>
            <div className="ml-9">
              <CodeBlock code={V0_RULES_TEXT} label="Copy v0 rules" />
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────
          SECTION C: CLI / Registry fallback
         ───────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <FileCode2 className="h-5 w-5 text-primary" />
          <p className="text-lg font-semibold text-foreground">
            Alternative: Registry CLI
          </p>
        </div>
        <Text variant="small" className="mb-4">
          You can also install individual components directly from the
          registry without the npm package:
        </Text>
        <CodeBlock
          code={`npx shadcn@latest add ${REGISTRY_URL}/r/stat-card.json`}
          label="Copy install command"
        />
        <Text variant="caption" className="mt-3">
          Replace{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono">
            stat-card
          </code>{" "}
          with any component name. This copies the source into your project
          (like shadcn/ui itself) rather than importing from a package.
        </Text>
      </div>

      {/* ─────────────────────────────────────────────────────
          SECTION D: MCP for AI editors
         ───────────────────────────────────────────────────── */}
      <SectionCard>
        <div className="flex items-center gap-3 mb-1">
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
          <p className="text-base font-semibold text-foreground">
            AI Code Editors (Cursor, Windsurf)
          </p>
        </div>
        <Text variant="small" className="mb-4 ml-7">
          Add this MCP configuration to use the registry with Cursor,
          Windsurf, or other AI editors.
        </Text>
        <div className="ml-7">
          <CodeBlock code={MCP_CONFIG} label="Copy MCP config" />
        </div>
      </SectionCard>
    </div>
  )
}
