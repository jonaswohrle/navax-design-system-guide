import { Text } from "@/components/ds"

const COMPONENTS = [
  { name: "heading", cat: "Typography" },
  { name: "text", cat: "Typography" },
  { name: "stack", cat: "Layout" },
  { name: "section", cat: "Layout" },
  { name: "divider", cat: "Layout" },
  { name: "icon-button", cat: "Primitives" },
  { name: "status-badge", cat: "Primitives" },
  { name: "stat-card", cat: "Data Display" },
  { name: "avatar-group", cat: "Data Display" },
  { name: "progress-bar", cat: "Data Display" },
  { name: "timeline", cat: "Data Display" },
  { name: "alert-banner", cat: "Feedback" },
  { name: "empty-state", cat: "Feedback" },
  { name: "skeleton-card", cat: "Feedback" },
  { name: "navbar", cat: "Navigation" },
  { name: "breadcrumbs", cat: "Navigation" },
  { name: "tab-nav", cat: "Navigation" },
  { name: "page-header", cat: "Navigation" },
  { name: "form-field", cat: "Forms" },
  { name: "search-input", cat: "Forms" },
  { name: "toggle-button-group", cat: "Forms" },
  { name: "file-upload", cat: "Forms" },
]

const CATEGORIES = [
  ...new Set(COMPONENTS.map((c) => c.cat)),
]

export function ShowcaseRegistryInfo() {
  return (
    <div className="flex flex-col gap-6">
      {/* Install instructions */}
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-base font-semibold text-foreground mb-2">
          Install via CLI
        </p>
        <Text variant="small" className="mb-4">
          After deploying this project, install any component with a single
          command:
        </Text>
        <pre className="rounded-md bg-muted px-4 py-3 text-sm font-mono text-foreground overflow-x-auto">
          npx shadcn@latest add https://YOUR_DOMAIN/r/stat-card.json
        </pre>
        <Text variant="caption" className="mt-3">
          Replace YOUR_DOMAIN with your deployed URL. Each component resolves
          its own dependencies automatically.
        </Text>
      </div>

      {/* Component index */}
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-base font-semibold text-foreground mb-4">
          {COMPONENTS.length} Components
        </p>
        <div className="flex flex-col gap-6">
          {CATEGORIES.map((cat) => (
            <div key={cat}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {cat}
              </p>
              <div className="flex flex-wrap gap-2">
                {COMPONENTS.filter((c) => c.cat === cat).map((c) => (
                  <span
                    key={c.name}
                    className="inline-flex items-center rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-mono text-foreground"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Open in v0 */}
      <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-6 text-center">
        <p className="text-sm font-medium text-primary mb-1">
          Use in v0
        </p>
        <Text variant="small">
          Add your deployed registry URL in v0 Rules, and every new project
          will have access to your design system components.
        </Text>
      </div>
    </div>
  )
}
