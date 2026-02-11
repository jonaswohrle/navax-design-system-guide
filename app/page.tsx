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
import { ShowcaseComposite } from "@/components/showcase/composite"
import { ShowcaseAdvanced } from "@/components/showcase/advanced"
import { Section, Heading, Text, Divider, StatusBadge, NavaxLogo } from "@/components/ds"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero header */}
      <section className="relative overflow-hidden bg-secondary py-14 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(299_57%_30%/0.25),transparent_60%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-5 px-4 md:px-6">
          <NavaxLogo variant="light" width={140} />
          <div className="flex items-center gap-3">
            <Heading level={1} className="text-white">
              Design System
            </Heading>
            <StatusBadge status="success" dot={false}>
              34 components
            </StatusBadge>
          </div>
          <Text className="max-w-2xl text-white/80">
            A complete shadcn registry built around the NAVAX brand.
            Install any component with a single CLI command, or use it
            directly in v0 via your Rules panel.
          </Text>
        </div>
      </section>

      {/* Registry Info */}
      <Section>
        <Heading level={2}>Registry</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Install components via the shadcn CLI from your deployed URL.
        </Text>
        <ShowcaseRegistryInfo />
      </Section>

      <Divider className="mx-auto max-w-6xl px-4 md:px-6" />

      {/* Composite Components */}
      <Section>
        <Heading level={2}>Composite Components</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Full-scale header, sidebar, and footer patterns for app layouts.
        </Text>
        <ShowcaseComposite />
      </Section>

      <Divider className="mx-auto max-w-6xl px-4 md:px-6" />

      {/* Advanced Components */}
      <Section>
        <Heading level={2}>{"Advanced & Marketing"}</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Data tables, stepper, command menu, pricing, testimonials, feature cards, and more.
        </Text>
        <ShowcaseAdvanced />
      </Section>

      <Divider className="mx-auto max-w-6xl px-4 md:px-6" />

      {/* Colors */}
      <Section>
        <Heading level={2}>Colors</Heading>
        <Text variant="small" className="mt-1 mb-6">
          NAVAX brand palette: magenta, teal, and blue with semantic extensions.
        </Text>
        <ShowcaseColors />
      </Section>

      <Divider className="mx-auto max-w-6xl px-4 md:px-6" />

      {/* Typography */}
      <Section>
        <Heading level={2}>Typography</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Inter for body, DM Sans for headings, JetBrains Mono for code.
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
        <Heading level={2}>{"Badges & Status"}</Heading>
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

      {/* Inputs */}
      <Section>
        <Heading level={2}>{"Inputs & Textarea"}</Heading>
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
          Built with shadcn/ui, Tailwind CSS, and NAVAX brand tokens.
          Deploy this project and use the registry URL to install components
          anywhere.
        </Text>
      </Section>
    </main>
  )
}
