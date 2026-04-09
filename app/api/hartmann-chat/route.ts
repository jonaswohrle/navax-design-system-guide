import { streamText, convertToModelMessages, tool, stepCountIs } from "ai"
import { z } from "zod"

/* ── HARTMANN Product Catalog ─────────────────────────────────── */

const PRODUCTS = [
  {
    id: "hydroclean",
    name: "HydroClean plus",
    category: "Wundversorgung",
    brand: "HydroClean",
    description: "Wundspuelkissen mit Saug-Spuel-Mechanismus fuer die aktive Wundreinigung. Loest Belaege, Fibrin und Detritus zuverlaessig ab.",
    applications: ["Chronische Wunden", "Dekubitus", "Ulcus cruris", "Diabetisches Fuss-Syndrom"],
    features: ["Saug-Spuel-Mechanismus", "Superabsorber-Kern", "Ringer-Loesung", "Schmerzarmer Verbandwechsel"],
    imageUrl: "/images/hartmann/product-wound-care.jpg",
    price: "Ab 12,50 EUR / Stueck",
    sizes: ["4 cm rund", "7,5 x 7,5 cm", "10 x 10 cm"],
  },
  {
    id: "hydrosorb",
    name: "Hydrosorb",
    category: "Wundversorgung",
    brand: "Hydrosorb",
    description: "Transparenter Hydrogel-Verband fuer die feuchte Wundbehandlung. Foerdert Granulation und Epithelisierung.",
    applications: ["Oberflaechliche Wunden", "Verbrennungen Grad I-II", "Schuerfwunden", "Spalthaut-Entnahmestellen"],
    features: ["Transparenz zur Wundkontrolle", "Kuehlender Effekt", "Spendet Feuchtigkeit", "Atraumatischer Verbandwechsel"],
    imageUrl: "/images/hartmann/product-wound-care.jpg",
    price: "Ab 8,90 EUR / Stueck",
    sizes: ["5 x 7,5 cm", "10 x 10 cm", "20 x 20 cm"],
  },
  {
    id: "tenderwet",
    name: "TenderWet plus",
    category: "Wundversorgung",
    brand: "TenderWet",
    description: "Wundkissen mit Superabsorber-Kern fuer die Nasstherapie. Aktiviert mit Ringer-Loesung fuer kontinuierliche Wundspuelung.",
    applications: ["Tiefe Wunden", "Wundhoehlen", "Dekubitus Grad III-IV", "Postoperative Wunden"],
    features: ["24-Stunden-Nasstherapie", "Superabsorber-Kern", "Hohe Absorption", "Reduziert Verbandwechsel"],
    imageUrl: "/images/hartmann/product-wound-care.jpg",
    price: "Ab 15,20 EUR / Stueck",
    sizes: ["4 cm rund", "7,5 x 7,5 cm", "10 x 10 cm"],
  },
  {
    id: "sterillium",
    name: "Sterillium",
    category: "Desinfektion",
    brand: "Sterillium",
    description: "Das weltweit meistverwendete Haendedesinfektionsmittel. Wirkt bakterizid, fungizid und viruzid bei nur 30 Sekunden Einwirkzeit.",
    applications: ["Hygienische Haendedesinfektion", "Chirurgische Haendedesinfektion", "Kliniken", "Arztpraxen"],
    features: ["30 Sek. Einwirkzeit", "Hautvertraeglichkeit", "Dermatologisch getestet", "Rrueckfettend"],
    imageUrl: "/images/hartmann/product-hygiene.jpg",
    price: "Ab 4,50 EUR / 100 ml",
    sizes: ["100 ml", "500 ml", "1000 ml", "5 Liter"],
  },
  {
    id: "bacillol",
    name: "Bacillol AF",
    category: "Desinfektion",
    brand: "Bacillol",
    description: "Alkoholisches Schnelldesinfektionsmittel fuer Flaechen. Umfassendes Wirkungsspektrum bei kurzer Einwirkzeit.",
    applications: ["Flaechendesinfektion", "Medizinprodukte", "Inventar", "Transportinkubatoren"],
    features: ["Aldehydfrei", "Schnelle Wirkung", "Materialvertraeglich", "Farbstoff- und duftstofffrei"],
    imageUrl: "/images/hartmann/product-hygiene.jpg",
    price: "Ab 6,80 EUR / 500 ml",
    sizes: ["50 ml", "500 ml", "1000 ml"],
  },
  {
    id: "molicare-premium",
    name: "MoliCare Premium",
    category: "Inkontinenz",
    brand: "MoliCare",
    description: "Hochwertiges Inkontinenz-Sortiment fuer mittlere bis schwerste Inkontinenz. Trockenes Hautgefuehl durch Drei-Lagen-Saugkern.",
    applications: ["Mittlere Inkontinenz", "Schwere Inkontinenz", "Stationaere Pflege", "Haeusliche Pflege"],
    features: ["Drei-Lagen-Saugkern", "pH-Hautneutralisation", "Geruchsbinder", "Textile Aussenseite"],
    imageUrl: "/images/hartmann/product-incontinence.jpg",
    price: "Ab 0,85 EUR / Stueck",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "molicare-mobile",
    name: "MoliCare Mobile",
    category: "Inkontinenz",
    brand: "MoliCare",
    description: "Inkontinenz-Pants fuer aktive Menschen. Wie normale Unterwaesche anzuziehen -- diskret und zuverlaessig.",
    applications: ["Leichte bis mittlere Inkontinenz", "Mobile Patienten", "Tagesversorgung", "Nachtversorgung"],
    features: ["Einfaches An-/Ausziehen", "Diskretes Tragen", "Elastischer Hueftbund", "Auslaufschutz"],
    imageUrl: "/images/hartmann/product-incontinence.jpg",
    price: "Ab 0,95 EUR / Stueck",
    sizes: ["S", "M", "L", "XL"],
  },
]

const PRODUCT_CATEGORIES = [
  { id: "wundversorgung", name: "Wundversorgung", description: "Wundauflagen, Verbandmaterialien, Wundspuelkissen" },
  { id: "desinfektion", name: "Desinfektion & Hygiene", description: "Haende-, Flaechen- und Instrumentendesinfektion" },
  { id: "inkontinenz", name: "Inkontinenzversorgung", description: "Vorlagen, Pants, Bettschutz" },
]

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: `You are the HARTMANN Product Advisor, a helpful customer-facing assistant for hartmann.info.
You help healthcare professionals and patients find the right PAUL HARTMANN medical and care products.

## Your Personality
- Professional, warm, and knowledgeable
- Speak German (the website is German) unless the user writes in English
- Use "Sie" (formal) when speaking German
- Be specific about product recommendations with real details
- Always recommend contacting HARTMANN Kundenservice for complex medical questions

## Key Product Areas
1. **Wundversorgung** (Wound Care): HydroClean, Hydrosorb, TenderWet
2. **Desinfektion & Hygiene** (Disinfection): Sterillium, Bacillol, Dismozon
3. **Inkontinenzversorgung** (Incontinence Care): MoliCare Premium, MoliCare Mobile, MoliNea

## Tool Usage
- Use searchProducts to find relevant products based on the user's needs
- Use getProductDetails for detailed information about a specific product
- Use startProductFinder for guided product selection when the user is unsure
- Use findNearbyPartner when the user asks where to buy products

## Important
- NEVER invent product data. Only share information returned by tools.
- When displaying products, always mention key features and applications.
- For wound care questions, always recommend professional medical assessment.`,
    messages: await convertToModelMessages(messages),
    tools: {
      searchProducts: tool({
        description: "Search HARTMANN products by category, application, or keyword. Returns matching products with details.",
        inputSchema: z.object({
          query: z.string().optional().describe("Search keyword"),
          category: z.enum(["Wundversorgung", "Desinfektion", "Inkontinenz", "all"]).optional().describe("Product category filter"),
        }),
        execute: async ({ query, category }) => {
          let results = [...PRODUCTS]
          if (category && category !== "all") {
            results = results.filter((p) => p.category === category)
          }
          if (query) {
            const q = query.toLowerCase()
            results = results.filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.applications.some((a) => a.toLowerCase().includes(q))
            )
          }
          return {
            products: results,
            totalFound: results.length,
            categories: PRODUCT_CATEGORIES,
          }
        },
      }),
      getProductDetails: tool({
        description: "Get detailed information about a specific HARTMANN product by its ID.",
        inputSchema: z.object({
          productId: z.string().describe("Product ID (e.g., 'sterillium', 'hydroclean')"),
        }),
        execute: async ({ productId }) => {
          const product = PRODUCTS.find((p) => p.id === productId)
          if (!product) return { error: true, message: "Product not found" }
          return { ...product, relatedProducts: PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).map((p) => ({ id: p.id, name: p.name, brand: p.brand })) }
        },
      }),
      startProductFinder: tool({
        description: "Start an interactive guided product finder. Use this when the user is unsure which product they need. Returns a greeting and the tool call ID for the guided flow.",
        inputSchema: z.object({
          greeting: z.string().describe("A warm greeting to start the product finder"),
        }),
      }),
      findNearbyPartner: tool({
        description: "Find nearby HARTMANN partner pharmacies or medical supply stores.",
        inputSchema: z.object({
          postalCode: z.string().optional().describe("German postal code (PLZ)"),
          city: z.string().optional().describe("City name"),
        }),
        execute: async ({ postalCode, city }) => {
          return {
            partners: [
              { name: "Sanitaetshaus Mueller", address: `${city || "Heidenheim"}, Hauptstr. 12`, phone: "07321 12345", type: "Sanitaetshaus" },
              { name: "Apotheke am Markt", address: `${city || "Heidenheim"}, Marktplatz 3`, phone: "07321 67890", type: "Apotheke" },
              { name: "MedTech Fachhandel", address: `${city || "Heidenheim"}, Industriestr. 45`, phone: "07321 11111", type: "Fachhandel" },
            ],
            searchArea: postalCode || city || "Heidenheim",
            note: "Kontaktieren Sie die Partner fuer aktuelle Verfuegbarkeit.",
          }
        },
      }),
    },
    stopWhen: stepCountIs(5),
  })

  return result.toUIMessageStreamResponse()
}
