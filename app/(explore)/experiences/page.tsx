import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { blobUrl } from "@/lib/blob-image-urls"
import { TripCard } from "@/components/explore/trip-card"
import { TrustStrip } from "@/components/explore/trust-strip"
import { ReviewCarousel } from "@/components/explore/review-carousel"
import { WaveDivider } from "@/components/explore/wave-divider"

export const metadata: Metadata = {
  title: "Produkte & Lösungen - E.ON Energie",
  description:
    "Entdecken Sie unsere Energieprodukte: Ökostrom, Erdgas, Solaranlagen, Wärmepumpen, E-Mobilität und Smart Home Lösungen.",
}

const EXPERIENCES = [
  { name: "Ökostrom", description: "100% erneuerbare Energie aus Wind und Solar für Ihren Haushalt.", imageUrl: "/images/explore/eon-strom.jpg", slug: "oekostrom", order: 1 },
  { name: "Erdgas", description: "Zuverlässige Gasversorgung mit flexiblen Tarifen und Preisgarantie.", imageUrl: "/images/explore/eon-gas.jpg", slug: "erdgas", order: 2 },
  { name: "Solaranlagen", description: "Eigenen Strom erzeugen und Energiekosten dauerhaft senken.", imageUrl: "/images/explore/eon-solar.jpg", slug: "solar", order: 3 },
  { name: "Wärmepumpen", description: "Nachhaltig heizen mit moderner Wärmepumpentechnologie.", imageUrl: "/images/explore/eon-waermepumpe.jpg", slug: "waermepumpe", order: 4 },
  { name: "E-Mobilität", description: "Wallbox und Autostrom-Tarife für Ihr Elektroauto.", imageUrl: "/images/explore/eon-emobility.jpg", slug: "e-mobilitaet", order: 5 },
  { name: "Smart Home", description: "Intelligentes Energiemanagement für maximalen Komfort und Effizienz.", imageUrl: "/images/explore/eon-smarthome.jpg", slug: "smart-home", order: 6 },
]

const TRIPS = [
  { title: "E.ON ÖkoStrom", destination: "Strom", tripType: "Ökostrom", duration: "12 Monate", price: 29, imageUrl: "/images/explore/eon-strom.jpg", badges: ["Bestseller"], tripCode: "OKO", slug: "oekostrom", order: 1 },
  { title: "E.ON Solar", destination: "Solaranlage", tripType: "Solar", duration: "Einmalig", price: 9990, imageUrl: "/images/explore/eon-solar.jpg", badges: ["0% MwSt."], tripCode: "SOL", slug: "solar", order: 2 },
  { title: "E.ON Erdgas", destination: "Erdgas", tripType: "Gas", duration: "12 Monate", price: 8, imageUrl: "/images/explore/eon-gas.jpg", badges: ["Preisgarantie"], tripCode: "GAS", slug: "erdgas", order: 3 },
]

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative flex min-h-[45vh] items-end overflow-hidden lg:min-h-[55vh]">
        <Image
          src={blobUrl("/images/explore/hero-energy.jpg")}
          alt="E.ON Produkte und Lösungen"
          fill
          unoptimized
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 lg:px-8 lg:pb-32">
          <h1 className="mb-3 font-heading text-4xl font-bold text-white lg:text-5xl">
            Produkte & Lösungen
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/85 lg:text-lg">
            {"Von Ökostrom über Solaranlagen bis hin zu Wärmepumpen und E-Mobilität -- entdecken Sie die passende Energielösung für Ihr Zuhause."}
          </p>
        </div>
      </section>

      <WaveDivider />

      {/* Products grid */}
      <section className="bg-primary pb-12 pt-4 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 font-heading text-2xl font-bold text-white lg:text-3xl">
            Unsere Energieprodukte
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXPERIENCES.map((exp) => (
              <Link
                key={exp.name}
                href={`/experiences/${exp.slug || ""}`}
                className="group relative block overflow-hidden rounded-xl"
              >
                <div className="relative aspect-[16/9]">
                  <Image
                    src={blobUrl(exp.imageUrl)}
                    alt={exp.name}
                    fill
                    unoptimized
                    className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="font-heading text-lg font-bold text-white">{exp.name}</h3>
                    {exp.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-white/75">
                        {exp.description}
                      </p>
                    )}
                  </div>
                  <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular tariffs */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
              Beliebte Tarife
            </h2>
            <Link
              href="/search"
              className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-hover md:flex"
            >
              Alle Tarife ansehen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TRIPS.map((trip) => (
              <TripCard key={trip.title} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <TrustStrip />

      {/* Reviews */}
      <ReviewCarousel />
    </div>
  )
}
