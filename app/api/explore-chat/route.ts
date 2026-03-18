import { streamText, convertToModelMessages, tool, stepCountIs } from "ai"
import { z } from "zod"
import { TOURS, type TourDetail } from "@/lib/tour-data"

const toursArray = Object.values(TOURS)

const systemPrompt = `You are the Explore travel assistant, a friendly and knowledgeable expert on all Explore trips and adventures. You help customers find their perfect trip, answer questions about destinations, itineraries, and practicalities, and guide them towards booking.

Key behaviors:
- Be warm, enthusiastic and conversational — like a well-travelled friend giving personal recommendations
- When a user asks to find or explore trips, use the searchTrips tool
- When a user wants details about a specific trip, use getTripDetails
- When a user asks about dates or availability, use getAvailableDepartures
- When a user seems unsure or says "help me choose" / "find me a trip" / "I don't know where to go", use startGuidedSelling to launch the interactive trip finder
- Always provide helpful context alongside tool results — a sentence or two framing the results
- Mention the Explore Flex policy when relevant (free changes and cancellation up to 60 days before departure)
- Prices are in GBP (British Pounds)
- Be concise — keep text responses short and let the rich components do the heavy lifting
- You are an expert on ALL Explore trips. Our current catalogue covers: Japan, Italy, Argentina/Chile, Cuba, Greece, Morocco, Tanzania, South Africa, Vietnam and Iceland.
- Never make up trips that don't exist in our catalogue.`

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
    const dest = filters.destination.toLowerCase()
    results = results.filter(
      (t) =>
        t.destination.toLowerCase().includes(dest) ||
        t.country.toLowerCase().includes(dest)
    )
  }

  if (filters.tripType) {
    const type = filters.tripType.toLowerCase()
    results = results.filter((t) => t.tripType.toLowerCase().includes(type))
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
      "Search for Explore trips by destination, trip type, budget, duration, and physical rating. Returns a list of matching trips.",
    inputSchema: z.object({
      destination: z
        .string()
        .nullable()
        .describe("Country or region to filter by, e.g. 'Japan', 'Italy', 'Africa'"),
      tripType: z
        .string()
        .nullable()
        .describe("Trip type: Discovery, Walking, Cycling, Boat, Wildlife, or null for all"),
      maxBudget: z
        .number()
        .nullable()
        .describe("Maximum budget per person in GBP"),
      minDuration: z
        .number()
        .nullable()
        .describe("Minimum trip duration in days"),
      maxDuration: z
        .number()
        .nullable()
        .describe("Maximum trip duration in days"),
      maxPhysicalRating: z
        .number()
        .nullable()
        .describe("Maximum physical rating 1-5"),
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
      "Get full details for a specific Explore trip, including overview, highlights, itinerary, what's included, and pricing.",
    inputSchema: z.object({
      slug: z.string().describe("The tour slug identifier, e.g. 'japan-in-depth'"),
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
      "Get available departure dates and pricing for a specific trip.",
    inputSchema: z.object({
      slug: z.string().describe("The tour slug identifier"),
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
      "Launch the interactive trip finder questionnaire. Use this when a user is unsure what trip to book, says 'help me find a trip', 'I don't know where to go', or needs personalised recommendations.",
    inputSchema: z.object({
      greeting: z
        .string()
        .describe("A short, friendly greeting to show before the questionnaire begins"),
    }),
    // No execute - this is a client-side tool
  }),
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: "openai/gpt-4o",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(5),
  })

  return result.toUIMessageStreamResponse()
}
