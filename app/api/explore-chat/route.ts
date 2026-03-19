import { streamText, convertToModelMessages, tool, stepCountIs } from "ai"
import { z } from "zod"
import { TOURS, type TourDetail } from "@/lib/tour-data"

const toursArray = Object.values(TOURS)

const systemPrompt = `Du bist der E.ON Energie-Berater, ein freundlicher und kompetenter Experte für alle E.ON Energie-Produkte und -Tarife. Du hilfst Kunden, den passenden Strom- oder Gastarif zu finden, beantwortest Fragen zu Tarifen, Solaranlagen, Wärmepumpen und E-Mobilität und begleitest sie zur Bestellung.

Wichtige Verhaltensregeln:
- Sei freundlich, kompetent und professionell — wie ein vertrauenswürdiger Energieberater
- Wenn ein Nutzer nach Tarifen sucht, verwende das searchTrips-Tool
- Wenn ein Nutzer Details zu einem bestimmten Tarif wissen möchte, verwende getTripDetails
- Wenn ein Nutzer nach Verfügbarkeit oder Konditionen fragt, verwende getAvailableDepartures
- Wenn ein Nutzer unsicher ist oder sagt "hilf mir" / "finde den richtigen Tarif" / "ich weiß nicht welcher Tarif", verwende startGuidedSelling um den interaktiven Tarifberater zu starten
- NIEMALS startGuidedSelling mehr als einmal pro Gespräch aufrufen. Sobald der Tarifberater abgeschlossen ist, verwende searchTrips mit den angegebenen Präferenzen
- Nach Abschluss von startGuidedSelling sofort searchTrips mit den Präferenzen aufrufen
- Gib immer hilfreichen Kontext zu den Ergebnissen — ein bis zwei Sätze zur Einordnung
- Erwähne E.ON Plus bei Gelegenheit (Verträge bündeln und bis zu 200 Euro Rabatt pro Jahr sichern)
- Preise sind in Euro (EUR)
- Sei prägnant — halte Textantworten kurz und lass die Komponenten die Hauptarbeit machen
- IMMER das searchTrips-Tool verwenden um Tarife anzuzeigen. NIEMALS Tarife als reine Textliste auflisten
- Du bist Experte für ALLE E.ON Produkte: Ökostrom, Erdgas, Solaranlagen, Wärmepumpen, Wallbox & E-Mobilität, Smart Home und E.ON Plus
- Erfinde niemals Tarife, die es nicht gibt
- Antworte immer auf Deutsch`

// Normalize German energy terms for flexible matching
function normalizeEnergyTerm(term: string): string {
  const t = term.toLowerCase().trim()
  const map: Record<string, string> = {
    "strom": "strom", "ökostrom": "strom", "oekostrom": "strom", "elektrizität": "strom",
    "gas": "gas", "erdgas": "gas", "biogas": "gas", "heizgas": "gas",
    "solar": "solar", "solaranlage": "solar", "photovoltaik": "solar", "pv": "solar",
    "wärmepumpe": "wärmepumpe", "waermepumpe": "wärmepumpe", "heizung": "wärmepumpe",
    "e-auto": "e-auto", "wallbox": "e-auto", "elektroauto": "e-auto", "e-mobilität": "e-auto", "emobilität": "e-auto", "laden": "e-auto",
    "smart home": "smart home", "smarthome": "smart home", "smart": "smart home", "energiemanagement": "smart home",
  }
  return map[t] || t
}

function searchToursFiltered(filters: {
  destination?: string | null
  tripType?: string | null
  maxBudget?: number | null
  minDuration?: number | null
  maxDuration?: number | null
  maxPhysicalRating?: number | null
}): Pick<TourDetail, "slug" | "title" | "destination" | "tripType" | "duration" | "durationDays" | "price" | "originalPrice" | "imageUrl" | "physicalRating" | "groupSize">[] {
  let results = toursArray

  if (filters.destination) {
    const normalized = normalizeEnergyTerm(filters.destination)
    results = results.filter(
      (t) =>
        normalizeEnergyTerm(t.destination) === normalized ||
        t.destination.toLowerCase().includes(filters.destination!.toLowerCase()) ||
        t.country.toLowerCase().includes(filters.destination!.toLowerCase())
    )
  }

  if (filters.tripType) {
    const normalized = normalizeEnergyTerm(filters.tripType)
    results = results.filter((t) => {
      const tourNorm = normalizeEnergyTerm(t.tripType)
      return tourNorm === normalized ||
        t.tripType.toLowerCase().includes(filters.tripType!.toLowerCase())
    })
  }

  if (filters.maxBudget) {
    results = results.filter((t) => t.price <= filters.maxBudget!)
  }

  if (filters.minDuration) {
    results = results.filter((t) => t.durationDays >= filters.minDuration!)
  }

  if (filters.maxDuration) {
    results = results.filter((t) => t.durationDays <= filters.maxDuration!)
  }

  if (filters.maxPhysicalRating) {
    results = results.filter(
      (t) => t.physicalRating <= filters.maxPhysicalRating!
    )
  }

  // If no results found with strict filtering, return all tariffs
  if (results.length === 0) {
    results = toursArray
  }

  return results.slice(0, 6).map((t) => ({
    slug: t.slug,
    title: t.title,
    destination: t.destination,
    tripType: t.tripType,
    duration: t.duration,
    durationDays: t.durationDays,
    price: t.price,
    originalPrice: t.originalPrice,
    imageUrl: t.imageUrl,
    physicalRating: t.physicalRating,
    groupSize: t.groupSize,
  }))
}

const tools = {
  searchTrips: tool({
    description:
      "Suche nach E.ON Energietarifen nach Energieart, Tariftyp, Budget, Laufzeit und Nachhaltigkeitsbewertung. Gibt eine Liste passender Tarife zurück.",
    inputSchema: z.object({
      destination: z
        .string()
        .nullable()
        .describe("Energieart zum Filtern, z.B. 'Strom', 'Gas', 'Solar'"),
      tripType: z
        .string()
        .nullable()
        .describe("Tariftyp: Ökostrom, Gas, Solar, E-Mobilität, Wärmepumpe, oder null für alle"),
      maxBudget: z
        .number()
        .nullable()
        .describe("Maximales Budget pro Monat in EUR"),
      minDuration: z
        .number()
        .nullable()
        .describe("Minimale Vertragslaufzeit in Monaten"),
      maxDuration: z
        .number()
        .nullable()
        .describe("Maximale Vertragslaufzeit in Monaten"),
      maxPhysicalRating: z
        .number()
        .nullable()
        .describe("Maximale Nachhaltigkeitsbewertung 1-5"),
    }),
    execute: async (filters) => {
      const results = searchToursFiltered(filters)
      return {
        trips: results,
        totalFound: results.length,
        filtersApplied: Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v != null)
        ),
      }
    },
  }),

  getTripDetails: tool({
    description:
      "Details zu einem bestimmten E.ON Tarif abrufen, einschließlich Übersicht, Highlights, Konditionen, Inklusivleistungen und Preise.",
    inputSchema: z.object({
      slug: z.string().describe("Der Tarif-Slug, z.B. 'oekostrom'"),
    }),
    execute: async ({ slug }) => {
      const tour = TOURS[slug]
      if (!tour) {
        return { error: "Trip not found", slug }
      }
      return {
        slug: tour.slug,
        title: tour.title,
        destination: tour.destination,
        tripType: tour.tripType,
        duration: tour.duration,
        durationDays: tour.durationDays,
        groupSize: tour.groupSize,
        physicalRating: tour.physicalRating,
        maxAltitude: tour.maxAltitude,
        price: tour.price,
        originalPrice: tour.originalPrice,
        imageUrl: tour.imageUrl,
        tripCode: tour.tripCode,
        overview: tour.overview,
        highlights: tour.highlights,
        included: tour.included,
        notIncluded: tour.notIncluded,
        itinerary: tour.itinerary.slice(0, 5),
        totalDays: tour.itinerary.length,
        departureCount: tour.departures.filter((d) => d.status !== "Sold Out").length,
      }
    },
  }),

  getAvailableDepartures: tool({
    description:
      "Verfügbare Tarifoptionen und Konditionen für einen bestimmten Tarif abrufen.",
    inputSchema: z.object({
      slug: z.string().describe("Der Tarif-Slug"),
    }),
    execute: async ({ slug }) => {
      const tour = TOURS[slug]
      if (!tour) {
        return { error: "Trip not found", slug }
      }
      return {
        tourTitle: tour.title,
        tourSlug: tour.slug,
        departures: tour.departures,
      }
    },
  }),

  startGuidedSelling: tool({
    description:
      "Startet den interaktiven Tarifberater-Fragebogen. Verwende dies, wenn ein Nutzer unsicher ist, welchen Tarif er wählen soll, 'hilf mir den richtigen Tarif zu finden' sagt, oder personalisierte Empfehlungen braucht.",
    inputSchema: z.object({
      greeting: z
        .string()
        .describe("Eine kurze, freundliche Begrüßung, die vor dem Fragebogen angezeigt wird"),
    }),
    // No execute - this is a client-side tool
  }),
}

export async function POST(req: Request) {
  const { messages, visitorAudience, visitorTraits, visitorEvents } = await req.json()

  // Build personalization context for the system prompt
  let personalizationContext = ""
  if (visitorAudience && visitorAudience !== "default") {
    const audienceLabels: Record<string, string> = {
      adventure: "Ökostrom und erneuerbare Energien",
      culture: "Smart Home und Energiemanagement",
      family: "Familientarife und Sparlösungen",
      returning: "Bestandskunde mit E.ON Plus Potenzial",
    }
    personalizationContext += `\n\nBesucher-Personalisierung:
- Dieser Besucher wurde als "${visitorAudience}"-Segment identifiziert, interessiert an ${audienceLabels[visitorAudience] || visitorAudience}.
- Priorisiere Empfehlungen, die zu seinen Interessen passen.
- Passe deine Sprache und Beispiele an seine Präferenzen an.`
  }
  if (visitorTraits?.name) {
    personalizationContext += `\n- Der Name des Besuchers ist ${visitorTraits.name}. Verwende ihn gelegentlich, um das Gespräch persönlich zu gestalten.`
  }
  if (visitorEvents?.book_trip) {
    personalizationContext += `\n- Dieser Besucher hat bereits einen Vertrag abgeschlossen. Er ist ein Bestandskunde — erkenne dies an und empfehle ergänzende Produkte wie E.ON Plus.`
  }

  const result = streamText({
    model: "openai/gpt-4.1",
    system: systemPrompt + personalizationContext,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(5),
  })

  return result.toUIMessageStreamResponse()
}
