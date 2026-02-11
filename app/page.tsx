import { ShowcaseColors } from "@/components/showcase/colors"
import { ShowcaseTypography } from "@/components/showcase/typography"
import { ShowcaseButtons } from "@/components/showcase/buttons"
import { ShowcaseCards } from "@/components/showcase/cards"
import { ShowcaseBadges } from "@/components/showcase/badges"
import { ShowcaseInputs } from "@/components/showcase/inputs"
import { ShowcaseLayout } from "@/components/showcase/layout"
import { ShowcaseDataDisplay } from "@/components/showcase/data-display"
import { ShowcaseFeedback } from "@/components/showcase/feedback"
import { ShowcaseNavigation } from "@/components/showcase/navigation"
import { ShowcaseForms } from "@/components/showcase/forms"
import { ShowcaseRegistryInfo } from "@/components/showcase/registry-info"
import { Section, Heading, Text, Divider, StatusBadge } from "@/components/ds"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Section className="border-b border-border py-10 md:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Heading level={1}>Design System</Heading>
              <StatusBadge status="default" dot={false}>
                22 components
              </StatusBadge>
            </div>
            <Text variant="lead" className="max-w-2xl">
              A complete shadcn registry with design tokens, rules, and
              components built around your brand. Install any component with a
              single CLI command.
            </Text>
          </div>
        </div>
      </Section>

      {/* Registry Info */}
      <Section>
        <Heading level={2}>Registry</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Install components via the shadcn CLI from your deployed URL.
        </Text>
        <ShowcaseRegistryInfo />
      </Section>

      <Divider className="mx-auto max-w-6xl px-4 md:px-6" />

      {/* Colors */}
      <Section>
        <Heading level={2}>Colors</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Your palette with semantic extensions for light and dark mode.
        </Text>
        <ShowcaseColors />
      </Section>

      <Divider className="mx-auto max-w-6xl px-4 md:px-6" />

      {/* Typography */}
      <Section>
        <Heading level={2}>Typography</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Inter for body, DM Serif Display for display headings, JetBrains
          Mono for code.
        </Text>
        <ShowcaseTypography />
      </Section>

      <Divider className="mx-auto max-w-6xl px-4 md:px-6" />

      {/* Buttons */}
      <Section>
        <Heading level={2}>Buttons</Heading>
        <Text variant="small" className="mt-1 mb-6">
          All button variants, sizes, and icon configurations.
        </Text>
        <ShowcaseButtons />
      </Section>

      <Divider className="mx-auto max-w-6xl px-4 md:px-6" />

      {/* Badges */}
      <Section>
        <Heading level={2}>Badges & Status</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Standard badges and semantic status indicators.
        </Text>
        <ShowcaseBadges />
      </Section>

      <Divider className="mx-auto max-w-6xl px-4 md:px-6" />

      {/* Data Display */}
      <Section>
        <Heading level={2}>Data Display</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Stat cards, avatar groups, progress bars, and timelines.
        </Text>
        <ShowcaseDataDisplay />
      </Section>

      <Divider className="mx-auto max-w-6xl px-4 md:px-6" />

      {/* Feedback */}
      <Section>
        <Heading level={2}>Feedback</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Alert banners, empty states, and loading skeletons.
        </Text>
        <ShowcaseFeedback />
      </Section>

      <Divider className="mx-auto max-w-6xl px-4 md:px-6" />

      {/* Navigation */}
      <Section>
        <Heading level={2}>Navigation</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Navbar, breadcrumbs, tab navigation, and page headers.
        </Text>
        <ShowcaseNavigation />
      </Section>

      <Divider className="mx-auto max-w-6xl px-4 md:px-6" />

      {/* Forms */}
      <Section>
        <Heading level={2}>Forms</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Form fields, search inputs, toggle groups, and file uploads.
        </Text>
        <ShowcaseForms />
      </Section>

      <Divider className="mx-auto max-w-6xl px-4 md:px-6" />

      {/* Inputs (original) */}
      <Section>
        <Heading level={2}>Inputs & Textarea</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Base input and textarea controls from shadcn.
        </Text>
        <ShowcaseInputs />
      </Section>

      <Divider className="mx-auto max-w-6xl px-4 md:px-6" />

      {/* Cards */}
      <Section>
        <Heading level={2}>Cards</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Card patterns for content containers.
        </Text>
        <ShowcaseCards />
      </Section>

      <Divider className="mx-auto max-w-6xl px-4 md:px-6" />

      {/* Layout helpers */}
      <Section>
        <Heading level={2}>Layout Helpers</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Stack, Section, and Divider utilities.
        </Text>
        <ShowcaseLayout />
      </Section>

      {/* Footer */}
      <Section className="border-t border-border py-10 md:py-10">
        <Text variant="small">
          Built with shadcn/ui, Tailwind CSS, and your custom design tokens.
          Deploy this project and use the registry URL to install components
          anywhere.
        </Text>
      </Section>
    </main>
  )
}
