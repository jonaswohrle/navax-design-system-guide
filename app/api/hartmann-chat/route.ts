import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
} from "ai"
import { z } from "zod"

export const maxDuration = 60

const HARTMANN_PRODUCTS = [
  {
    slug: "hydroclean",
    name: "HydroClean\u00AE",
    category: "Wundversorgung",
    description:
      "Die hydroaktive Superabsorber-Wundauflage fur eine wirksame Wundreinigung und die effektive Wundbettvorbereitung.",
  },
  {
    slug: "molicare-mobile",
    name: "MoliCare\u00AE premium Mobile 5 Tropfen",
    category: "Inkontinenz",
    description:
      "Bequem, diskret und einfach anzuwenden - diese Einweghosen bieten zuverlassigen Schutz bei mittlerer Inkontinenz.",
  },
  {
    slug: "sterillium",
    name: "Sterillium\u00AE",
    category: "Desinfektion",
    description:
      "Der Klassiker der alkoholischen Handedesinfektion mit sehr guter Hautvertraglichkeit.",
  },
  {
    slug: "foliodress-eye-protect",
    name: "Foliodress\u00AE Eye Protect",
    category: "OP",
    description: "Der sichere und komfortable Extraschutz fur die Augen.",
  },
  {
    slug: "bacillol-30-sensitive",
    name: "Bacillol\u00AE 30 Sensitive Green Tissues",
    category: "Desinfektion",
    description:
      "Die nachhaltige Losung fur die Flachendesinfektion - weniger Emissionen und Abfall, mehr fur die Umwelt.",
  },
  {
    slug: "zetuvit-plus",
    name: "Zetuvit\u00AE Plus",
    category: "Wundversorgung",
    description:
      "Saugstarke Wundauflage fur die Versorgung stark exsudierender Wunden.",
  },
  {
    slug: "molicare-premium-elastic",
    name: "MoliCare\u00AE Premium Elastic",
    category: "Inkontinenz",
    description:
      "Elastische Inkontinenzversorgung fur schwerere Inkontinenz mit sehr gutem Tragekomfort.",
  },
  {
    slug: "peha-haft",
    name: "Peha-haft\u00AE",
    category: "Wundversorgung",
    description:
      "Kohasive, elastische Fixierbinde fur einen sicheren Verbandhalt.",
  },
]

const tools = {
  searchProducts: tool({
    description:
      "Sucht nach HARTMANN-Produkten nach Kategorie, Name oder Beschreibung. Gibt eine Liste passender Produkte zuruck.",
    inputSchema: z.object({
      query: z
        .string()
        .nullable()
        .describe("Suchbegriff fur Produktname oder Beschreibung"),
      category: z
        .string()
        .nullable()
        .describe("Produktkategorie: Wundversorgung, Inkontinenz, Desinfektion, OP"),
    }),
    execute: async ({ query, category }) => {
      let results = HARTMANN_PRODUCTS

      if (category) {
        const cat = category.toLowerCase()
        results = results.filter((p) => p.category.toLowerCase().includes(cat))
      }

      if (query) {
        const q = query.toLowerCase()
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        )
      }

      return {
        products: results.slice(0, 6),
        totalFound: results.length,
      }
    },
  }),

  getProductDetails: tool({
    description:
      "Gibt Details zu einem bestimmten HARTMANN-Produkt zuruck.",
    inputSchema: z.object({
      slug: z.string().describe("Der Produkt-Slug, z.B. 'sterillium'"),
    }),
    execute: async ({ slug }) => {
      const product = HARTMANN_PRODUCTS.find((p) => p.slug === slug)
      if (!product) return { error: "Produkt nicht gefunden", slug }
      return product
    },
  }),

  showContactInfo: tool({
    description:
      "Zeigt HARTMANN Kontaktinformationen an.",
    inputSchema: z.object({
      reason: z.string().describe("Grund der Kontaktanfrage"),
    }),
    execute: async ({ reason }) => ({
      reason,
      phone: "+49 7321 36-0",
      email: "info@hartmann.info",
      address: "PAUL HARTMANN AG, Paul-Hartmann-Strasse 12, 89522 Heidenheim",
      website: "https://www.hartmann.info",
    }),
  }),
}

const systemPrompt = `Du bist der HARTMANN Gesundheitsassistent, ein freundlicher und kompetenter Berater fur alle HARTMANN Produkte und Losungen im Bereich Medizin und Pflege.

## Uber HARTMANN
Die HARTMANN GRUPPE ist ein fuhrender europaischer Anbieter von Systemlosungen fur Medizin und Pflege. Mit uber 10.000 Mitarbeitenden in 36 Landern bieten wir Produkte in den Kernsegmenten:
- **Wundversorgung**: HydroClean, Zetuvit Plus, Peha-haft und weitere
- **Inkontinenzmanagement**: MoliCare Premium Reihe
- **Infektionsmanagement/Desinfektion**: Sterillium, Bacillol
- **OP-Versorgung**: Foliodress, OP-Abdeckungen

## Dein Verhalten:
- Antworte immer auf Deutsch
- Sei fachlich kompetent aber verstandlich
- Wenn nach Produkten gefragt wird, nutze das searchProducts Tool
- Wenn nach einem bestimmten Produkt gefragt wird, nutze getProductDetails
- Wenn nach Kontakt gefragt wird, nutze showContactInfo
- Verweise bei medizinischen Fragen immer darauf, dass ein Arzt oder medizinisches Fachpersonal konsultiert werden sollte
- Sei hilfreich, empathisch und professionell
- Halte Antworten praznant und nutze die Tools fur Produktinformationen
- Erwahne bei Gelegenheit die vier Kernkompetenzen: Wunde, Inkontinenz, Desinfektion, OP`

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: "openai/gpt-5.2",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(5),
  })

  return result.toUIMessageStreamResponse()
}
