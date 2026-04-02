/**
 * HARTMANN Homepage Content from Sitecore
 *
 * This module represents the content structure as it would be stored
 * in Sitecore XM Cloud pages and components. Each section maps to
 * a Sitecore component with typed fields.
 *
 * In production, this data would be fetched via the Sitecore Layout Service
 * or GraphQL endpoint. Here we provide it as structured content that
 * mirrors the Sitecore content model.
 */

/* ── Types ───────────────────────────────────────────────────── */

export interface HeroBanner {
  componentName: "HeroBanner"
  fields: {
    headline: string
    subheadline: string
    tagline: string
    ctaPrimaryLabel: string
    ctaPrimaryHref: string
    ctaSecondaryLabel: string
    ctaSecondaryHref: string
    backgroundImage: string
    backgroundImageAlt: string
  }
}

export interface TrustItem {
  label: string
  description: string
  icon: string
}

export interface TrustStrip {
  componentName: "TrustStrip"
  fields: {
    items: TrustItem[]
  }
}

export interface ProductArea {
  title: string
  description: string
  imageUrl: string
  href: string
  brands: string[]
}

export interface ProductAreasGrid {
  componentName: "ProductAreasGrid"
  fields: {
    sectionLabel: string
    headline: string
    areas: ProductArea[]
  }
}

export interface MarketSegment {
  title: string
  description: string
  icon: string
}

export interface MarketSegmentsGrid {
  componentName: "MarketSegmentsGrid"
  fields: {
    sectionLabel: string
    headline: string
    segments: MarketSegment[]
  }
}

export interface CtaBanner {
  componentName: "CtaBanner"
  fields: {
    sectionLabel: string
    headline: string
    description: string
    ctaPrimaryLabel: string
    ctaPrimaryHref: string
    ctaSecondaryLabel: string
    ctaSecondaryHref: string
  }
}

export interface AboutSection {
  componentName: "AboutSection"
  fields: {
    sectionLabel: string
    headline: string
    paragraphs: string[]
  }
}

export type SitecoreComponent =
  | HeroBanner
  | TrustStrip
  | ProductAreasGrid
  | MarketSegmentsGrid
  | CtaBanner
  | AboutSection

export interface SitecorePage {
  pageName: string
  pagePath: string
  template: string
  language: string
  siteName: string
  components: SitecoreComponent[]
}

/* ── Homepage Content ────────────────────────────────────────── */

export const homepageContent: SitecorePage = {
  pageName: "Home",
  pagePath: "/Home",
  template: "Landing Page",
  language: "de-DE",
  siteName: "hartmann.info",
  components: [
    {
      componentName: "HeroBanner",
      fields: {
        headline: "Intelligente Loesungen fuer die Gesundheitsversorgung",
        subheadline:
          "Seit ueber 200 Jahren entwickelt PAUL HARTMANN innovative Medizin- und Pflegeprodukte. Entdecken Sie, wie wir mit Sitecore AI die digitale Zukunft gestalten.",
        tagline: "Hilft. Pflegt. Schuetzt.",
        ctaPrimaryLabel: "Sitecore AI erleben",
        ctaPrimaryHref: "/vercel/sitecore/chat",
        ctaSecondaryLabel: "Alle Showcases",
        ctaSecondaryHref: "/vercel/sitecore",
        backgroundImage: "/images/hartmann/hero-healthcare.jpg",
        backgroundImageAlt:
          "HARTMANN healthcare professionals in modern clinical environment",
      },
    },
    {
      componentName: "TrustStrip",
      fields: {
        items: [
          {
            label: "200+ Jahre Erfahrung",
            description: "Seit 1818 im Dienst der Gesundheit",
            icon: "Shield",
          },
          {
            label: "Hilft. Pflegt. Schuetzt.",
            description: "Unser Versprechen an Patienten und Pflegekraefte",
            icon: "Heart",
          },
          {
            label: "Forschung & Innovation",
            description: "Eigene R&D-Zentren weltweit",
            icon: "Microscope",
          },
          {
            label: "Qualitaetsfuehrer",
            description: "Zertifiziert nach hoechsten Standards",
            icon: "Award",
          },
        ],
      },
    },
    {
      componentName: "ProductAreasGrid",
      fields: {
        sectionLabel: "Produktbereiche",
        headline: "Kompetenz in drei Kernbereichen",
        areas: [
          {
            title: "Wundversorgung",
            description:
              "Innovative Wundauflagen und Verbandmaterialien fuer jede Phase der Wundheilung -- von HydroClean bis Hydrosorb.",
            imageUrl: "/images/hartmann/product-wound-care.jpg",
            href: "/vercel/sitecore",
            brands: ["HydroClean", "Hydrosorb", "TenderWet"],
          },
          {
            title: "Desinfektion & Hygiene",
            description:
              "Sterillium, Bacillol und weitere bewaehrte Loesungen fuer Haende-, Flaechen- und Instrumentendesinfektion.",
            imageUrl: "/images/hartmann/product-hygiene.jpg",
            href: "/vercel/sitecore",
            brands: ["Sterillium", "Bacillol", "Dismozon"],
          },
          {
            title: "Inkontinenzversorgung",
            description:
              "MoliCare-Produkte fuer ein selbstbestimmtes Leben -- diskret, zuverlaessig und hautfreundlich.",
            imageUrl: "/images/hartmann/product-incontinence.jpg",
            href: "/vercel/sitecore",
            brands: ["MoliCare", "MoliNea", "MoliForm"],
          },
        ],
      },
    },
    {
      componentName: "MarketSegmentsGrid",
      fields: {
        sectionLabel: "Branchen",
        headline: "Loesungen fuer jede Versorgungsstufe",
        segments: [
          {
            title: "Kliniken",
            description:
              "Umfassende Loesungen fuer stationaere Versorgung, OP und Intensivmedizin.",
            icon: "Building2",
          },
          {
            title: "Pflegeheime",
            description:
              "Produkte und Services fuer die Langzeitpflege und Betreuung.",
            icon: "Users",
          },
          {
            title: "Ambulante Pflege",
            description:
              "Zuverlaessige Versorgung fuer haeusliche Pflege und mobile Teams.",
            icon: "Heart",
          },
          {
            title: "Apotheken & Fachhandel",
            description:
              "Beratung und Produkte fuer Endverbraucher und Fachpersonal.",
            icon: "Shield",
          },
        ],
      },
    },
    {
      componentName: "CtaBanner",
      fields: {
        sectionLabel: "Sitecore AI + HARTMANN",
        headline: "Erleben Sie die Zukunft des Content Managements",
        description:
          "Unser AI-gestuetztes Content Studio verbindet Sitecore MCP mit 48 intelligenten Tools. Erstellen Sie Seiten, verwalten Sie Assets und personalisieren Sie Erlebnisse -- alles durch natuerliche Sprache.",
        ctaPrimaryLabel: "Content Studio starten",
        ctaPrimaryHref: "/vercel/sitecore/chat",
        ctaSecondaryLabel: "Mehr erfahren",
        ctaSecondaryHref: "/vercel/sitecore",
      },
    },
    {
      componentName: "AboutSection",
      fields: {
        sectionLabel: "Ueber HARTMANN",
        headline: "Seit 1818 im Dienst der Gesundheit",
        paragraphs: [
          "Die PAUL HARTMANN AG mit Sitz in Heidenheim an der Brenz ist ein international fuehrender Hersteller von Medizin- und Pflegeprodukten. Mit ueber 10.000 Mitarbeitern in ueber 30 Laendern entwickeln und produzieren wir Loesungen in den Bereichen Wundversorgung, Inkontinenzmanagement, Desinfektion und OP-Versorgung.",
          "Unsere Marken wie Sterillium, MoliCare und HydroClean stehen weltweit fuer Qualitaet, Innovation und Zuverlaessigkeit. Mit der Integration von Sitecore AI treiben wir die digitale Transformation unserer Kommunikation voran.",
        ],
      },
    },
  ],
}

/* ── Runtime state (mutable for demo) ────────────────────────── */

/**
 * Runtime overlay: the AI chat can push content updates here,
 * and the homepage will merge them on top of the base content.
 * This simulates Sitecore publishing changes in real time.
 */
let runtimeOverrides: Partial<Record<string, SitecoreComponent>> = {}

/**
 * Apply an override for a specific component.
 * Called by the API when the AI creates/updates content.
 */
export function applyContentOverride(
  componentName: string,
  fields: Record<string, unknown>
): void {
  const base = homepageContent.components.find(
    (c) => c.componentName === componentName
  )
  if (base) {
    runtimeOverrides[componentName] = {
      ...base,
      fields: { ...base.fields, ...fields },
    } as SitecoreComponent
  }
}

/**
 * Get all applied overrides (for the API to report back).
 */
export function getContentOverrides(): Record<string, unknown> {
  return { ...runtimeOverrides }
}

/**
 * Fetch homepage content.
 * Merges base content with any runtime overrides from the AI chat.
 * In production this would call the Sitecore Layout Service API.
 */
export function getHomepageContent(): SitecorePage {
  const components = homepageContent.components.map((comp) => {
    const override = runtimeOverrides[comp.componentName]
    return override || comp
  })
  return { ...homepageContent, components }
}
