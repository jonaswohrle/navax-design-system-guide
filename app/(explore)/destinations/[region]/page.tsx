import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { TOURS } from "@/lib/tour-data"
import { TripCard } from "@/components/explore/trip-card"
import { TrustStrip } from "@/components/explore/trust-strip"

const REGION_DATA: Record<string, { name: string; description: string; countries: string[] }> = {
  europe: {
    name: "Europe",
    description: "From the sun-soaked Amalfi Coast to the rugged peaks of the Dolomites, Europe is a playground of culture, cuisine and adventure. Walk ancient trails, cycle through vineyards, and discover vibrant cities with our expert-led small group tours.",
    countries: ["Italy", "Spain", "Portugal", "Turkey", "Greece", "Croatia"],
  },
  asia: {
    name: "Asia",
    description: "Explore the ancient temples of Japan, the lush rice terraces of Vietnam, and the colorful bazaars of India. Asia offers an extraordinary kaleidoscope of cultures, landscapes, and cuisines waiting to be discovered on our small group adventures.",
    countries: ["Japan", "Vietnam", "India", "Sri Lanka", "Nepal", "Thailand"],
  },
  africa: {
    name: "Africa",
    description: "From the Big Five on safari to the vibrant markets of Marrakech, Africa is a continent of breathtaking diversity. Our tours take you beyond the postcard to experience authentic encounters with incredible wildlife and warm-hearted communities.",
    countries: ["South Africa", "Morocco", "Tanzania", "Kenya", "Namibia", "Ethiopia"],
  },
  "south-america": {
    name: "South America",
    description: "From the glaciers of Patagonia to the Amazon rainforest, South America is a land of superlatives. Trek to Machu Picchu, dance the tango in Buenos Aires, and discover the world's most dramatic landscapes on our award-winning tours.",
    countries: ["Argentina", "Chile", "Peru", "Colombia", "Brazil", "Ecuador"],
  },
  "central-america": {
    name: "Central America",
    description: "Vibrant, colorful, and bursting with life, Central America and the Caribbean are where rainforest meets reef. Discover ancient Maya ruins, volcanic landscapes, and pristine beaches on our small group adventures.",
    countries: ["Costa Rica", "Cuba", "Guatemala", "Mexico", "Panama", "Nicaragua"],
  },
  "middle-east": {
    name: "Middle East",
    description: "Ancient civilizations, dramatic desert landscapes, and legendary hospitality make the Middle East one of the world's most fascinating regions to explore. Walk in the footsteps of history on our expert-led tours.",
    countries: ["Jordan", "Oman", "Egypt", "Iran"],
  },
  polar: {
    name: "Polar Regions",
    description: "The ultimate frontier for intrepid explorers. From the ice-sculpted fjords of the Arctic to the vast white continent of Antarctica, our polar expeditions offer once-in-a-lifetime encounters with the most remote places on Earth.",
    countries: ["Antarctica", "Arctic", "Svalbard", "Iceland"],
  },
  "north-america": {
    name: "North America",
    description: "From the soaring peaks of the Rockies to the red deserts of the Southwest, North America offers diverse adventures. Hike through national parks, discover indigenous cultures, and experience the great outdoors.",
    countries: ["USA", "Canada"],
  },
  caribbean: {
    name: "Caribbean",
    description: "Crystal clear waters, rhythmic music, and colorful colonial towns define the Caribbean islands. Our tours take you beyond the beach resorts to discover the authentic heart of these tropical paradises.",
    countries: ["Cuba", "Jamaica", "Dominican Republic"],
  },
  australasia: {
    name: "Australasia",
    description: "From the red centre of Australia to the fiords of New Zealand, Australasia offers extraordinary natural wonders. Our small group tours showcase the best of these epic landscapes alongside unique wildlife encounters.",
    countries: ["Australia", "New Zealand", "Papua New Guinea"],
  },
}

export function generateStaticParams() {
  return Object.keys(REGION_DATA).map((region) => ({ region }))
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region } = await params
  const data = REGION_DATA[region]
  if (!data) return { title: "Destination Not Found" }
  return {
    title: `${data.name} Tours & Holidays | Explore`,
    description: data.description.slice(0, 160),
  }
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params
  const data = REGION_DATA[region]
  if (!data) notFound()

  const allTours = Object.values(TOURS)
  const regionTours = allTours.filter((tour) => {
    const dest = tour.destination.toLowerCase()
    const country = tour.country.toLowerCase()
    return (
      data.countries.some((c) => c.toLowerCase() === dest || c.toLowerCase() === country) ||
      dest.includes(data.name.toLowerCase())
    )
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-10 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <Link href="/destinations" className="mb-4 inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            All destinations
          </Link>
          <h1 className="mb-4 font-heading text-3xl font-bold text-primary-foreground lg:text-5xl">
            {data.name}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-primary-foreground/80">
            {data.description}
          </p>
        </div>
      </section>

      {/* Country pills */}
      <section className="border-b border-border bg-card py-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap gap-2">
            {data.countries.map((c) => (
              <span key={c} className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tours */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
          {regionTours.length > 0
            ? `${data.name} tours (${regionTours.length})`
            : `More ${data.name} tours coming soon`}
        </h2>
        {regionTours.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regionTours.map((tour) => (
              <TripCard
                key={tour.slug}
                trip={{
                  title: tour.title,
                  destination: tour.destination,
                  tripType: tour.tripType,
                  duration: tour.duration,
                  price: tour.price,
                  originalPrice: tour.originalPrice,
                  imageUrl: tour.imageUrl,
                  tripCode: tour.tripCode,
                  slug: tour.slug,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              {"We're adding new tours to this region. Check back soon or contact us for bespoke trip planning."}
            </p>
            <Link href="/destinations" className="text-sm font-semibold text-primary hover:underline">
              View all destinations
            </Link>
          </div>
        )}
      </section>

      <TrustStrip />
    </div>
  )
}
