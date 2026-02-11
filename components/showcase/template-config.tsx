"use client"

import { useState } from "react"
import { Check, Copy, Info } from "lucide-react"
import { Text } from "@/components/ds"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const NPM_PACKAGES = [
  "class-variance-authority",
  "clsx",
  "tailwind-merge",
  "lucide-react",
  "@radix-ui/react-avatar",
  "@radix-ui/react-dialog",
  "@radix-ui/react-dropdown-menu",
  "@radix-ui/react-label",
  "@radix-ui/react-popover",
  "@radix-ui/react-progress",
  "@radix-ui/react-scroll-area",
  "@radix-ui/react-select",
  "@radix-ui/react-separator",
  "@radix-ui/react-slot",
  "@radix-ui/react-switch",
  "@radix-ui/react-tabs",
  "@radix-ui/react-toggle",
  "@radix-ui/react-toggle-group",
  "@radix-ui/react-tooltip",
  "@radix-ui/react-collapsible",
  "@radix-ui/react-checkbox",
  "tailwindcss-animate",
  "cmdk",
]

const NPM_PACKAGES_STRING = NPM_PACKAGES.join(", ")

const ENV_VARS = [
  {
    name: "NPM_TOKEN",
    value: "npm_xxxxx",
    description:
      "Required only if your registry packages are published to a private npm scope.",
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
      {/* Intro */}
      <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-6">
        <p className="text-sm font-medium text-primary mb-1">
          v0 Template Configuration
        </p>
        <Text variant="small">
          When creating a v0 template with this design system, use the values
          below in the <strong>Create Template</strong> dialog. Copy each field
          directly into the corresponding input.
        </Text>
      </div>

      {/* NPM Packages */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-base font-semibold text-foreground">
            NPM Packages
          </p>
          <InfoTooltip text="These are the runtime dependencies required by the design system components. Paste the full list into the NPM Packages field." />
        </div>
        <Text variant="small" className="mb-4">
          Comma-separated list of all packages required by the design system
          components.
        </Text>

        <div className="relative rounded-md bg-muted p-4">
          <div className="flex items-start justify-between gap-3">
            <pre className="flex-1 whitespace-pre-wrap break-all text-xs font-mono text-foreground leading-relaxed">
              {NPM_PACKAGES_STRING}
            </pre>
            <div className="shrink-0">
              <CopyButton text={NPM_PACKAGES_STRING} label="Copy NPM packages" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {NPM_PACKAGES.map((pkg) => (
            <span
              key={pkg}
              className="inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-mono text-muted-foreground"
            >
              {pkg}
            </span>
          ))}
        </div>
      </div>

      {/* Environment Variables */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-base font-semibold text-foreground">
            Environment Variables
          </p>
          <InfoTooltip text="Add these environment variables in the template configuration. Replace placeholder values with your actual tokens." />
        </div>
        <Text variant="small" className="mb-4">
          Required environment variables for private registry access.
        </Text>

        <div className="flex flex-col gap-3">
          {ENV_VARS.map((envVar) => (
            <div
              key={envVar.name}
              className="rounded-md bg-muted p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 flex-1">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Name
                      </span>
                      <code className="text-sm font-mono font-semibold text-foreground">
                        {envVar.name}
                      </code>
                    </div>
                    <div className="hidden sm:block h-8 w-px bg-border" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Value
                      </span>
                      <code className="text-sm font-mono text-muted-foreground">
                        {envVar.value}
                      </code>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex gap-2">
                  <CopyButton
                    text={envVar.name}
                    label={`Copy ${envVar.name} name`}
                  />
                  <CopyButton
                    text={envVar.value}
                    label={`Copy ${envVar.name} value`}
                  />
                </div>
              </div>
              <Text variant="caption" className="mt-2">
                {envVar.description}
              </Text>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-base font-semibold text-foreground">Tech Stack</p>
          <InfoTooltip text="Enable these toggles in the Create Template dialog to include Tailwind CSS and shadcn/ui in the template." />
        </div>
        <Text variant="small" className="mb-4">
          Enable both toggles when creating the template.
        </Text>

        <div className="flex flex-col gap-0 rounded-md border border-border overflow-hidden">
          <div className="flex items-center justify-between bg-muted/50 px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                Tailwind CSS
              </span>
            </div>
            <Switch checked disabled aria-label="Tailwind CSS enabled" />
          </div>
          <div className="flex items-center justify-between bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                shadcn/ui
              </span>
            </div>
            <Switch checked disabled aria-label="shadcn/ui enabled" />
          </div>
        </div>

        <Text variant="caption" className="mt-3">
          Both must be enabled since the design system is built on top of
          shadcn/ui and Tailwind CSS.
        </Text>
      </div>
    </div>
  )
}
