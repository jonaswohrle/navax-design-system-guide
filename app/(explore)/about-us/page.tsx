import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { blobUrl } from "@/lib/blob-image-urls"
import { FlexBanner } from "@/components/explore/flex-banner"

export const metadata: Metadata = {
  title: "Über E.ON | Ihr Energiepartner",
  description:
    "Erfahren Sie, warum über 50 Millionen Kunden E.ON vertrauen. Nachhaltigkeit, Innovation und erstklassiger Service.",
}

const SECTIONS = [
  { number: "1", title: "100% Ökostrom", content: "Unser Strom stammt vollständig aus erneuerbaren Energiequellen. Mit jedem Tarif leisten Sie einen aktiven Beitrag zur Energiewende und schützen unser Klima für kommende Generationen.", order: 1 },
  { number: "2", title: "Persönlicher Service", content: "Unser mehrfach ausgezeichneter Kundenservice ist für Sie da -- telefonisch, online und in über 50 E.ON Shops deutschlandweit. Kompetent, freundlich und immer erreichbar.", order: 2 },
  { number: "3", title: "Faire & transparente Preise", content: "Bei E.ON wissen Sie immer, was Sie bezahlen. Unsere Tarife bieten Preisgarantien, keine versteckten Kosten und volle Transparenz über Ihre Energiekosten.", order: 3 },
  { number: "4", title: "Nachhaltig handeln", content: "Bis 2040 streben wir CO2-Neutralität an. Als eines der größten Energieunternehmen Europas treiben wir die Energiewende mit Investitionen in erneuerbare Energien aktiv voran.", order: 4 },
  { number: "5", title: "Innovation & Digitalisierung", content: "Von Smart-Home-Lösungen über intelligente Zähler bis hin zu KI-gestützter Energieberatung -- wir setzen auf modernste Technologie, damit Sie Energie effizienter nutzen können.", order: 5 },
  { number: "6", title: "E.ON Plus: Mehr sparen", content: "Mit E.ON Plus kombinieren Sie verschiedene Energieverträge und sichern sich jährlich bis zu 200 Euro Rabatt sowie weitere exklusive Vorteile. Je mehr Sie bündeln, desto mehr sparen Sie.", order: 6 },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative min-h-[50vh] overflow-hidden">
        <Image
          src={blobUrl("/images/explore/hero-energy.jpg")}
          alt="E.ON -- Ihr Energiepartner"
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
              Energie für eine bessere Zukunft.
            </h1>
            <p className="max-w-lg text-lg text-white/80">
              Ihr zuverlässiger Partner seit über 20 Jahren.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-background py-12 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground lg:text-3xl">
            Europas größtes Energienetzwerk
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
            {"E.ON versorgt über 50 Millionen Kunden in Europa mit Strom und Gas. Mit unseren Lösungen für Ökostrom, Solaranlagen, Wärmepumpen und E-Mobilität gestalten wir die Energiezukunft aktiv mit. Unser Ziel: bezahlbare, nachhaltige Energie für alle."}
          </p>
        </div>
      </section>

      {/* Numbered sections */}
      <section className="bg-secondary py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-col gap-8">
            {SECTIONS.map((section) => (
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
              <Link href="/destinations">Tarife entdecken</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Flex banner */}
      <FlexBanner />
    </div>
  )
}
