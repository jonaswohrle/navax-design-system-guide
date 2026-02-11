import Link from "next/link"
import { ArrowRight, Layers, ShieldCheck, Zap, BarChart3 } from "lucide-react"
import { AppHeader } from "@/components/ds/app-header"
import { AppFooter } from "@/components/ds/app-footer"
import { Section } from "@/components/ds/section"
import { Heading } from "@/components/ds/heading"
import { Text } from "@/components/ds/text"
import { FeatureCard } from "@/components/ds/feature-card"
import { StatCard } from "@/components/ds/stat-card"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-secondary py-20 md:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(299_57%_30%/0.2),transparent_60%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 md:px-6">
            <Heading level={1} className="max-w-2xl text-secondary-foreground">
              Future-proof business solutions based on Microsoft technology
            </Heading>
            <Text variant="lead" className="max-w-xl text-secondary-foreground/80">
              With over 30 years of experience, NAVAX delivers ERP, CRM, and
              Business Intelligence solutions that grow with your business.
            </Text>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="#">
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10" asChild>
                <Link href="#">Learn more</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <Section>
          <div className="flex flex-col gap-2 text-center">
            <Heading level={2}>What we offer</Heading>
            <Text variant="small" className="mx-auto max-w-lg">
              End-to-end solutions tailored to your industry and business processes.
            </Text>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Layers />}
              title="ERP Solutions"
              description="Streamline operations with Microsoft Dynamics 365 Business Central."
              href="#"
            />
            <FeatureCard
              icon={<ShieldCheck />}
              title="CRM Solutions"
              description="Manage customer relationships and sales pipelines effectively."
              href="#"
            />
            <FeatureCard
              icon={<BarChart3 />}
              title="Business Intelligence"
              description="Turn data into insights with Power BI and custom analytics."
              href="#"
            />
            <FeatureCard
              icon={<Zap />}
              title="Automation"
              description="Automate workflows with Power Automate and custom integrations."
              href="#"
            />
          </div>
        </Section>

        {/* Stats */}
        <Section className="bg-muted/50">
          <div className="flex flex-col gap-2 text-center">
            <Heading level={2}>Trusted by industry leaders</Heading>
            <Text variant="small" className="mx-auto max-w-lg">
              Numbers that speak for themselves.
            </Text>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Years of experience" value="30+" trend="up" description="Since 1994" />
            <StatCard label="Customers" value="1,200+" trend="up" description="Across industries" />
            <StatCard label="Certified consultants" value="250+" trend="up" description="Microsoft certified" />
            <StatCard label="Countries" value="15+" trend="neutral" description="Across Europe" />
          </div>
        </Section>

        {/* CTA */}
        <Section>
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-secondary px-6 py-14 text-center md:px-12">
            <Heading level={2} className="max-w-lg text-secondary-foreground">
              Ready to transform your business?
            </Heading>
            <Text variant="lead" className="max-w-md text-secondary-foreground/80">
              Talk to our experts and find the right solution for your needs.
            </Text>
            <Button size="lg" asChild>
              <Link href="#">
                Contact us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Section>
      </main>

      <AppFooter />
    </div>
  )
}
