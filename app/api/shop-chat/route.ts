import { streamText, convertToModelMessages, tool, stepCountIs } from "ai"
import { z } from "zod"
import { PRODUCTS, CATEGORIES, type Product } from "@/lib/shop/data"

const catalogueSummary = CATEGORIES.map(
  (c) => `- ${c.name} (slug: ${c.slug}): ${c.description}`,
).join("\n")

const brands = Array.from(new Set(PRODUCTS.map((p) => p.brand))).join(", ")

const systemPrompt = `Du bist der ROSSMANN Einkaufsassistent – ein freundlicher, kompetenter Berater für die ROSSMANN Online-Drogerie. Du hilfst Kundinnen und Kunden, die passenden Produkte aus unserem Sortiment zu finden, beantwortest Fragen zu Produkten, Preisen und Anwendung und gibst hilfreiche Drogerie-Tipps.

Wichtige Verhaltensregeln:
- Sprich Deutsch und siez die Kundschaft immer (formelles „Sie", niemals „du").
- Sei sachlich, klar und vertrauenswürdig – im Stil einer echten Drogerie-Beratung, ohne übertriebene Werbesprache.
- Wenn jemand ein Produkt sucht, eine Kategorie nennt oder nach Empfehlungen fragt, nutze das Tool searchProducts, damit die Produkte als Karten angezeigt werden. Liste Produkte NIEMALS als reinen Text auf.
- Wenn jemand Details zu einem bestimmten Produkt möchte, nutze getProductDetails.
- Gib zu den Tool-Ergebnissen immer ein bis zwei Sätze Kontext oder eine kurze Empfehlung.
- Preise sind in Euro (€). Erfinde niemals Produkte, Preise oder Angebote, die nicht im Sortiment sind.
- Halte Textantworten kurz – die Produktkarten übernehmen die Details.
- Unser Sortiment umfasst folgende Kategorien:
${catalogueSummary}
- Beispiele für Eigenmarken und Marken im Sortiment: ${brands}.
- Bei Fragen zu Bestellung, Versand oder Filialen: Wir bieten schnelle Lieferung, kostenlosen Versand ab 49 € und Abholung in vielen Filialen.`

function searchProductsFiltered(filters: {
  query?: string | null
  category?: string | null
  maxPrice?: number | null
  onlyOffers?: boolean | null
}): Product[] {
  let results = PRODUCTS

  if (filters.category) {
    const cat = filters.category.toLowerCase()
    results = results.filter(
      (p) =>
        p.category.toLowerCase().includes(cat) ||
        CATEGORIES.find((c) => c.slug === p.category)?.name.toLowerCase().includes(cat),
    )
  }

  if (filters.query) {
    const q = filters.query.toLowerCase()
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }

  if (filters.maxPrice) {
    results = results.filter((p) => p.price <= filters.maxPrice!)
  }

  if (filters.onlyOffers) {
    results = results.filter((p) => p.oldPrice != null || p.badge === "Angebot")
  }

  return results.slice(0, 6)
}

const tools = {
  searchProducts: tool({
    description:
      "Sucht ROSSMANN Produkte nach Suchbegriff, Kategorie, Höchstpreis oder Angeboten. Gibt eine Liste passender Produkte zurück.",
    inputSchema: z.object({
      query: z
        .string()
        .nullable()
        .describe("Suchbegriff, Produktname oder Marke, z. B. 'Mascara', 'Shampoo', 'Windeln'"),
      category: z
        .string()
        .nullable()
        .describe(
          "Kategorie: make-up, pflege-duft, baby-spielzeug, haushalt, gesundheit, lebensmittel – oder null für alle",
        ),
      maxPrice: z.number().nullable().describe("Höchstpreis pro Produkt in Euro"),
      onlyOffers: z.boolean().nullable().describe("Nur Angebote / reduzierte Produkte anzeigen"),
    }),
    execute: async (filters) => {
      const results = searchProductsFiltered(filters)
      return {
        products: results.map((p) => ({
          slug: p.slug,
          name: p.name,
          brand: p.brand,
          price: p.price,
          oldPrice: p.oldPrice ?? null,
          unit: p.unit,
          image: p.image,
          rating: p.rating,
          reviews: p.reviews,
          badge: p.badge ?? null,
        })),
        totalFound: results.length,
        filtersApplied: Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v != null),
        ),
      }
    },
  }),

  getProductDetails: tool({
    description: "Liefert vollständige Details zu einem bestimmten ROSSMANN Produkt inklusive Beschreibung, Preis und Grundpreis.",
    inputSchema: z.object({
      slug: z.string().describe("Der Produkt-Slug, z. B. 'mascara-volumen-schwarz'"),
    }),
    execute: async ({ slug }) => {
      const product = PRODUCTS.find((p) => p.slug === slug)
      if (!product) return { error: "Produkt nicht gefunden", slug }
      return {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        oldPrice: product.oldPrice ?? null,
        unit: product.unit,
        basePrice: product.basePrice,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        badge: product.badge ?? null,
        description: product.description,
        category: product.category,
      }
    },
  }),
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: "openai/gpt-5.5",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(5),
  })

  return result.toUIMessageStreamResponse()
}
