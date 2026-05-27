import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { blobUrl } from "@/lib/blob-image-urls"
import { getAboutSections, getFlexPolicy } from "@/lib/contentful"
import { FlexBanner } from "@/components/explore/flex-banner"

export const metadata: Metadata = {
  title: "Why book with us? | About Explore - Explore",
  description:
    "Discover why Explore has been the UK's leading adventure travel company for over 40 years. Expert leaders, small groups, responsible travel.",
}

const FALLBACK_SECTIONS = [
  { number: "1", title: "Unforgettable experiences", content: "Whether it's seeing famous sights, discovering hidden gems, or connecting with local people and cultures, our trips are designed to create memories that last a lifetime. With over 500 tours across 100+ countries, there's an adventure for everyone.", order: 1 },
  { number: "2", title: "Expert tour leaders", content: "Our tour leaders aren't just guides -- they're passionate experts with insider knowledge and local connections that transform good trips into extraordinary ones. They go above and beyond to make sure every moment counts.", order: 2 },
  { number: "3", title: "Small group trips", content: "With an average group size of just 11, our trips attract a wonderful mix of solos, couples and friends -- all united by a desire for authentic experiences. Smaller groups mean more flexibility, deeper connections and less environmental impact.", order: 3 },
  { number: "4", title: "Guaranteed departures", content: "Nearly every departure is guaranteed to run, so you can book flights and plan with confidence. No last-minute cancellations, no stress -- just the excitement of knowing your adventure is happening.", order: 4 },
  { number: "5", title: "Responsible at heart", content: "We're proud to be a certified B Corp, reflecting our commitment to using business as a force for good. We offset carbon, use local suppliers, and support communities in the destinations we visit.", order: 5 },
  { number: "6", title: "Join the club! Rewarding loyalty programme", content: "After just one trip, you'll join our loyalty programme and receive discounts on future adventures. The more you explore, the more you save -- with up to 10% off your next booking.", order: 6 },
]

export default async function AboutPage() {
  const [sections, flex] = await Promise.all([
    getAboutSections(),
    getFlexPolicy(),
  ])

  const sectionList = sections?.length ? sections : FALLBACK_SECTIONS

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Page hero */}
      <section className="relative min-h-[50vh] overflow-hidden">
        <Image
          src={blobUrl("/images/explore/about-hero.jpg")}
          alt="Group of travelers on an adventure"
          fill
          unoptimized
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[50vh] max-w-7xl items-end px-4 pb-12">
          <div>
            <h1 className="mb-3 font-heading text-4xl font-bold text-white lg:text-5xl">
              Unforgettable adventures.
            </h1>
            <p className="max-w-lg text-lg text-white/80">
              Stories for a lifetime.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-background py-12 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground lg:text-3xl">
            The adventure travel experts
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
            {"Since 1981, we've been pioneering small group adventure travel. Today, we offer over 500 trips to more than 100 countries, led by expert local guides who bring every destination to life. Whether you're a first-time adventurer or a seasoned explorer, our trips are designed to create authentic, unforgettable experiences."}
          </p>
        </div>
      </section>

      {/* Numbered sections */}
      <section className="bg-secondary py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-col gap-8">
            {sectionList.map((section) => (
              <div
                key={section.title}
                className="flex gap-6 rounded-xl border border-border bg-card p-6"
              >
                {section.number && (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-heading text-xl font-bold text-primary">
                    {section.number}
                  </div>
                )}
                <div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                    {section.title}
                  </h3>
                  {section.content && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {section.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              asChild
              size="lg"
              className="bg-primary px-8 font-heading text-base font-semibold text-primary-foreground hover:bg-hover"
            >
              <Link href="/destinations">Show me the trips</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Flex banner */}
      <FlexBanner policy={flex} />
    </div>
  )
}
