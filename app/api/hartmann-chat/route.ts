import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
} from "ai"
import { z } from "zod"

export const maxDuration = 60

/* ── Extended product catalog ── */
const HARTMANN_PRODUCTS = [
  {
    slug: "hydroclean",
    name: "HydroClean\u00AE",
    category: "Wundversorgung",
    description:
      "Die hydroaktive Superabsorber-Wundauflage f\u00FCr eine wirksame Wundreinigung und die effektive Wundbettvorbereitung. Aktiviert die k\u00F6rpereigene Wundreinigung durch kontinuierliche Sp\u00FClung.",
    imageUrl: "/images/hartmann-hydroclean.jpg",
    isNew: false,
    isBestseller: true,
    features: [
      "Kontinuierliche Wundsp\u00FClung \u00FCber bis zu 72 Stunden",
      "Superabsorber bindet Wundexsudat und Keime",
      "Aktiviert die k\u00F6rpereigene Wundreinigung",
      "Reduziert den Bedarf an chirurgischem Debridement",
      "Feuchtes Wundmilieu f\u00F6rdert die Heilung",
    ],
    applications: ["Chronische Wunden", "Dekubitus", "Ulcus cruris", "Diabetischer Fu\u00DF", "Postoperative Wunden"],
    certifications: ["CE-gekennzeichnet", "Medizinprodukt Klasse IIb"],
    relatedProducts: ["zetuvit-plus", "peha-haft"],
  },
  {
    slug: "molicare-mobile",
    name: "MoliCare\u00AE premium Mobile 5 Tropfen",
    category: "Inkontinenz",
    description:
      "Bequem, diskret und einfach anzuwenden \u2013 diese Einweghosen bieten zuverl\u00E4ssigen Schutz bei mittlerer Inkontinenz. Jetzt mit einer verbesserten Passform f\u00FCr mehr Komfort und Diskretion.*",
    imageUrl: "/images/hartmann-molicare.jpg",
    isNew: true,
    isBestseller: false,
    features: [
      "3-lagiges Saugk\u00F6rper-System f\u00FCr zuverl\u00E4ssigen Schutz",
      "Verbesserte Passform mit elastischem H\u00FCftbund",
      "Hautfreundliches Innenvlies",
      "Geruchsneutralisierende Technologie",
      "Textilartige Au\u00DFenseite f\u00FCr Diskretion",
    ],
    applications: ["Mittlere Inkontinenz", "Mobile Patienten", "Alltag & Freizeit", "Nachtversorgung"],
    certifications: ["Dermatologisch getestet", "OEKO-TEX Standard 100"],
    relatedProducts: ["molicare-premium-elastic"],
  },
  {
    slug: "sterillium",
    name: "Sterillium\u00AE",
    category: "Desinfektion",
    description:
      "Der Klassiker der alkoholischen H\u00E4ndedesinfektion mit sehr guter Hautvertr\u00E4glichkeit. Inaktiviert Noroviren innerhalb der hygienischen H\u00E4ndedesinfektion.",
    imageUrl: "/images/hartmann-sterillium.jpg",
    isNew: false,
    isBestseller: true,
    features: [
      "Breites Wirkungsspektrum (bakterizid, fungizid, viruzid)",
      "Sehr gute Hautvertr\u00E4glichkeit",
      "R\u00FCckfettende Pflegekomponenten",
      "Inaktiviert Noroviren",
      "Schnelle Einwirkzeit von 30 Sekunden",
    ],
    applications: ["Hygienische H\u00E4ndedesinfektion", "Chirurgische H\u00E4ndedesinfektion", "Kliniken", "Pflegeheime", "Arztpraxen"],
    certifications: ["VAH-gelistet", "CE-gekennzeichnet", "RKI-konform"],
    relatedProducts: ["bacillol-30-sensitive"],
  },
  {
    slug: "foliodress-eye-protect",
    name: "Foliodress\u00AE Eye Protect",
    category: "OP",
    description: "Der sichere und komfortable Extraschutz f\u00FCr die Augen. Mehrweg-Schutzbrillen f\u00FCr den OP-Bereich mit klarer Sicht und angenehmem Tragekomfort.",
    imageUrl: "/images/hartmann-foliodress.jpg",
    isNew: false,
    isBestseller: false,
    features: [
      "Anti-Beschlag-Beschichtung f\u00FCr klare Sicht",
      "Leichtes, komfortables Design",
      "Kompatibel mit Korrekturbrille und Maske",
      "Einfach zu reinigen und zu desinfizieren",
    ],
    applications: ["OP-Bereich", "Endoskopie", "Labort\u00E4tigkeiten", "Zahnmedizin"],
    certifications: ["CE-gekennzeichnet", "EN 166"],
    relatedProducts: ["foliodress-suit"],
  },
  {
    slug: "bacillol-30-sensitive",
    name: "Bacillol\u00AE 30 Sensitive Green Tissues",
    category: "Desinfektion",
    description:
      "Die nachhaltige L\u00F6sung f\u00FCr die Fl\u00E4chendesinfektion \u2013 weniger Emissionen und Abfall, mehr f\u00FCr die Umwelt. Die neuen Green Tissues helfen Gesundheitseinrichtungen dabei, nachhaltiger zu werden.",
    imageUrl: "/images/hartmann-bacillol.jpg",
    isNew: true,
    isBestseller: false,
    features: [
      "Nachhaltigeres Tuchsubstrat aus erneuerbaren Rohstoffen",
      "Reduzierter CO\u2082-Fu\u00DFabdruck in der Herstellung",
      "Wirksam gegen Bakterien, Pilze und Viren",
      "Materialschonende Formulierung",
      "Alkoholfreie Rezeptur",
    ],
    applications: ["Fl\u00E4chendesinfektion", "Medizinprodukte", "Patientennahe Fl\u00E4chen", "Inventar"],
    certifications: ["VAH-gelistet", "CE-gekennzeichnet", "Nachhaltigkeitszertifiziert"],
    relatedProducts: ["sterillium"],
  },
  {
    slug: "zetuvit-plus",
    name: "Zetuvit\u00AE Plus",
    category: "Wundversorgung",
    description:
      "Saugstarke Wundauflage f\u00FCr die Versorgung stark exsudierender Wunden. Zuverl\u00E4ssige Absorption und R\u00FCcknassschutz.",
    imageUrl: "/images/hartmann-wunde.jpg",
    isNew: false,
    isBestseller: false,
    features: [
      "Superabsorbierender Kern",
      "R\u00FCcknassschutz h\u00E4lt die Wunde trocken",
      "Weiches, hautfreundliches Vlies",
      "Hohe Saugkapazit\u00E4t",
    ],
    applications: ["Stark exsudierende Wunden", "Postoperative Versorgung", "Akute Wunden"],
    certifications: ["CE-gekennzeichnet", "Medizinprodukt Klasse IIb"],
    relatedProducts: ["hydroclean"],
  },
  {
    slug: "molicare-premium-elastic",
    name: "MoliCare\u00AE Premium Elastic",
    category: "Inkontinenz",
    description:
      "Elastische Inkontinenzversorgung f\u00FCr schwerere Inkontinenz mit sehr gutem Tragekomfort und zuverl\u00E4ssigem Auslaufschutz.",
    imageUrl: "/images/hartmann-inkontinenz.jpg",
    isNew: false,
    isBestseller: true,
    features: [
      "Elastisches H\u00FCftband f\u00FCr sicheren Sitz",
      "Anatomisch geformter Saugk\u00F6rper",
      "Dreifacher Auslaufschutz",
      "N\u00E4sse-Indikator",
      "Dermatologisch getestet",
    ],
    applications: ["Schwere Inkontinenz", "Bettl\u00E4gerige Patienten", "N\u00E4chtliche Versorgung"],
    certifications: ["Dermatologisch getestet", "OEKO-TEX Standard 100"],
    relatedProducts: ["molicare-mobile"],
  },
  {
    slug: "peha-haft",
    name: "Peha-haft\u00AE",
    category: "Wundversorgung",
    description:
      "Koh\u00E4sive, elastische Fixierbinde f\u00FCr einen sicheren Verbandhalt. Haftet nur auf sich selbst und nicht auf Haut oder Haaren.",
    imageUrl: "/images/hartmann-wunde.jpg",
    isNew: false,
    isBestseller: false,
    features: [
      "Koh\u00E4siv \u2013 haftet nur auf sich selbst",
      "Kein Haftmittel auf der Haut",
      "Elastisch und anschmiegsam",
      "Einfache Anwendung ohne Klemmen",
    ],
    applications: ["Verbandsfixierung", "Kompressionsverb\u00E4nde", "Sportmedizin"],
    certifications: ["CE-gekennzeichnet"],
    relatedProducts: ["zetuvit-plus"],
  },
]

/* ── Tools ── */
const tools = {
  startGuidedSelling: tool({
    description:
      "Startet den interaktiven Produktberater (Guided Selling), um dem Nutzer bei der Produktauswahl zu helfen. Verwende dieses Tool, wenn der Nutzer nach einer Beratung fragt, Hilfe bei der Produktwahl ben\u00F6tigt, oder sagt 'Hilfe bei der Auswahl', 'Beratung', 'welches Produkt passt zu mir', etc. Das Tool wird auf der rechten Seite als interaktives Formular angezeigt. Der Nutzer beantwortet die Fragen dort, und die Antworten kommen als Tool-Ergebnis zur\u00FCck.",
    inputSchema: z.object({
      greeting: z
        .string()
        .describe(
          "Eine pers\u00F6nliche Begr\u00FC\u00DFungsnachricht f\u00FCr den Produktberater, z.B. 'Lassen Sie uns das passende Produkt f\u00FCr Sie finden!'"
        ),
    }),
    // No execute function - this is a client-side tool
  }),

  searchProducts: tool({
    description:
      "Sucht nach HARTMANN-Produkten nach Kategorie, Name oder Beschreibung. Gibt eine Liste passender Produkte zur\u00FCck. Nutze dies, wenn der Nutzer nach Produkten fragt oder nach dem Guided Selling die Ergebnisse angezeigt werden sollen.",
    inputSchema: z.object({
      query: z
        .string()
        .nullable()
        .describe("Suchbegriff f\u00FCr Produktname oder Beschreibung"),
      category: z
        .string()
        .nullable()
        .describe(
          "Produktkategorie: Wundversorgung, Inkontinenz, Desinfektion, OP"
        ),
    }),
    execute: async ({ query, category }) => {
      let results = HARTMANN_PRODUCTS

      if (category) {
        const cat = category.toLowerCase()
        results = results.filter((p) =>
          p.category.toLowerCase().includes(cat)
        )
      }

      if (query) {
        const q = query.toLowerCase()
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.applications.some((a) => a.toLowerCase().includes(q)) ||
            p.features.some((f) => f.toLowerCase().includes(q))
        )
      }

      return {
        products: results.slice(0, 6).map((p) => ({
          slug: p.slug,
          name: p.name,
          category: p.category,
          description: p.description,
          imageUrl: p.imageUrl,
          isNew: p.isNew,
          isBestseller: p.isBestseller,
        })),
        totalFound: results.length,
      }
    },
  }),

  getProductDetails: tool({
    description:
      "Gibt vollst\u00E4ndige Details zu einem bestimmten HARTMANN-Produkt zur\u00FCck, inklusive Eigenschaften, Anwendungsbereiche und Zertifizierungen.",
    inputSchema: z.object({
      slug: z
        .string()
        .describe("Der Produkt-Slug, z.B. 'sterillium', 'hydroclean'"),
    }),
    execute: async ({ slug }) => {
      const product = HARTMANN_PRODUCTS.find((p) => p.slug === slug)
      if (!product) return { error: "Produkt nicht gefunden", slug }
      return product
    },
  }),

  showContactInfo: tool({
    description:
      "Zeigt HARTMANN Kontaktinformationen an mit einem interaktiven Kontaktformular. Nutze dies, wenn der Nutzer Kontakt aufnehmen m\u00F6chte, eine Beratung anfragt, oder einen Vertriebskontakt ben\u00F6tigt.",
    inputSchema: z.object({
      reason: z
        .string()
        .describe("Grund der Kontaktanfrage, z.B. 'Produktberatung', 'Musterbestellung'"),
    }),
    execute: async ({ reason }) => ({
      reason,
      phone: "+49 7321 36-0",
      email: "info@hartmann.info",
      address:
        "PAUL HARTMANN AG, Paul-Hartmann-Stra\u00DFe 12, 89522 Heidenheim",
      website: "https://www.hartmann.info",
    }),
  }),

  showAcademyInfo: tool({
    description:
      "Zeigt Informationen \u00FCber die HARTMANN Academy und Schulungsangebote. Nutze dies, wenn nach Fortbildungen, Schulungen oder Weiterbildung gefragt wird.",
    inputSchema: z.object({
      topic: z
        .string()
        .describe("Das Themengebiet: Wunde, Inkontinenz, Desinfektion, OP, oder allgemein"),
    }),
    execute: async ({ topic }) => ({
      topic,
      title: "HARTMANN Academy",
      description: `Die HARTMANN Academy bietet umfassende Fort- und Weiterbildungsangebote im Bereich ${topic}. Unsere Experten vermitteln praxisnahes Wissen f\u00FCr medizinisches Fachpersonal.`,
      offerings: [
        "Online-Seminare und Webinare",
        "Pr\u00E4senzschulungen vor Ort",
        "E-Learning Module mit Zertifikat",
        "Fachpublikationen und Leitlinien",
        "Individuelle Inhouse-Schulungen",
      ],
      website: "https://www.hartmann.info/de-de/academy",
    }),
  }),
}

/* ── System prompt ── */
const systemPrompt = `Du bist der HARTMANN Gesundheitsassistent, ein freundlicher und kompetenter Berater f\u00FCr alle HARTMANN Produkte und L\u00F6sungen im Bereich Medizin und Pflege.

## \u00DCber HARTMANN
Die HARTMANN GRUPPE ist ein f\u00FChrender europ\u00E4ischer Anbieter von Systeml\u00F6sungen f\u00FCr Medizin und Pflege. Mit \u00FCber 10.000 Mitarbeitenden in 36 L\u00E4ndern bieten wir Produkte in den Kernsegmenten:
- **Wundversorgung**: HydroClean, Zetuvit Plus, Peha-haft und weitere
- **Inkontinenzmanagement**: MoliCare Premium Reihe (Mobile, Elastic)
- **Infektionsmanagement/Desinfektion**: Sterillium, Bacillol 30 Sensitive Green Tissues
- **OP-Versorgung**: Foliodress Eye Protect, OP-Abdeckungen

## Dein Verhalten:
- Antworte immer auf Deutsch
- Sei fachlich kompetent aber verst\u00E4ndlich
- **WICHTIG**: Wenn der Nutzer nach einer Produktberatung fragt, Hilfe bei der Auswahl ben\u00F6tigt, oder allgemein sagt "Hilf mir das richtige Produkt zu finden", nutze IMMER das \`startGuidedSelling\` Tool
- Wenn nach Produkten gefragt wird, nutze das \`searchProducts\` Tool um die Produkte visuell anzuzeigen
- Wenn nach einem bestimmten Produkt gefragt wird, nutze \`getProductDetails\` f\u00FCr die vollst\u00E4ndige Produktdarstellung
- Wenn nach Kontakt gefragt wird, nutze \`showContactInfo\` f\u00FCr das interaktive Kontaktformular
- Wenn nach Schulungen oder der Academy gefragt wird, nutze \`showAcademyInfo\`
- Verweise bei medizinischen Fragen darauf, dass Fachpersonal konsultiert werden sollte
- Sei hilfreich, empathisch und professionell
- Halte Antworten pr\u00E4gnant und nutze die Tools f\u00FCr visuelle Darstellungen
- Wenn das Guided-Selling Ergebnis zur\u00FCckkommt, nutze die Pr\u00E4ferenzen um mit \`searchProducts\` passende Produkte zu suchen und eine personalisierte Empfehlung zu geben

## Guided Selling Ergebnisse:
Wenn du ein Ergebnis vom \`startGuidedSelling\` Tool bekommst, analysiere die Nutzerpr\u00E4ferenzen (Kategorien, Einsatzort, Bedarfe, Patientengruppe, Priorit\u00E4t) und:
1. Nutze \`searchProducts\` mit der passenden Kategorie
2. Gib eine personalisierte Empfehlung basierend auf den Pr\u00E4ferenzen
3. Erkl\u00E4re, warum die empfohlenen Produkte besonders gut passen`

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: "openai/gpt-4.1-mini",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(8),
  })

  return result.toUIMessageStreamResponse()
}
