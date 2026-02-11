import { ShowcaseColors } from "@/components/showcase/colors"
import { ShowcaseTypography } from "@/components/showcase/typography"
import { ShowcaseButtons } from "@/components/showcase/buttons"
import { ShowcaseCards } from "@/components/showcase/cards"
import { ShowcaseBadges } from "@/components/showcase/badges"
import { ShowcaseInputs } from "@/components/showcase/inputs"
import { ShowcaseLayout } from "@/components/showcase/layout"
import { Section } from "@/components/ds"
import { Heading, Text, Divider } from "@/components/ds"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Section className="border-b border-border py-10 md:py-14">
        <Heading level={1}>Design System</Heading>
        <Text variant="lead" className="mt-3 max-w-2xl">
          A reusable set of tokens, rules, and components built around your
          brand. Copy the rules into v0 to enforce this system across every
          project.
        </Text>
      </Section>

      {/* Colors */}
      <Section>
        <Heading level={2}>Colors</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Your 5-color palette with semantic extensions.
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
          All button variants and sizes.
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

      {/* Inputs */}
      <Section>
        <Heading level={2}>Inputs & Forms</Heading>
        <Text variant="small" className="mt-1 mb-6">
          Form controls following the design system conventions.
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
          Built with shadcn/ui, Tailwind CSS, and your custom tokens.
        </Text>
      </Section>
    </main>
  )
}
