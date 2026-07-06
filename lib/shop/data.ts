export type Category = {
  slug: string
  name: string
  short: string
  description: string
  heading: string
  subcategories: string[]
}

export type Product = {
  slug: string
  name: string
  brand: string
  category: string // category slug
  price: number // current price in EUR
  oldPrice?: number // strike-through price
  unit: string // e.g. "100 ml"
  basePrice: string // e.g. "1 l = 12,90 €"
  image: string
  rating: number
  reviews: number
  badge?: "Neu" | "Angebot" | "Tipp" | "Bio"
  description: string
  ideenwelt?: boolean
}

export const CATEGORIES: Category[] = [
  {
    slug: "make-up",
    name: "Make-up",
    short: "Make-Up",
    heading: "Make-up in allen Formen und Farben",
    description:
      "Foundation, Mascara, Lippenstifte und mehr für deinen perfekten Look. Entdecke unser Make-up im Online-Shop von ROSSMANN.",
    subcategories: [
      "Augen",
      "Augenbrauen",
      "Beauty Tools & Accessoires",
      "Beauty Vorteilssets",
      "Geschenksets",
      "Lippen",
      "Make-Up Paletten",
      "Nägel",
      "Pinsel & Accessoires",
      "Primer & Fixingspray",
      "Teint",
    ],
  },
  {
    slug: "pflege-duft",
    name: "Pflege & Duft",
    short: "Pflege & Duft",
    heading: "Pflege & Duft für dein Wohlbefinden",
    description:
      "Gesichtspflege, Körperpflege, Haarpflege und Düfte für jeden Tag. Entdecke unsere Pflegeprodukte im Online-Shop von ROSSMANN.",
    subcategories: [
      "Gesichtspflege",
      "Körperpflege",
      "Haarpflege",
      "Duschen & Baden",
      "Handpflege",
      "Fußpflege",
      "Sonnenpflege",
      "Zahnpflege",
      "Rasur & Haarentfernung",
      "Damendüfte",
      "Herrendüfte",
    ],
  },
  {
    slug: "baby-spielzeug",
    name: "Baby & Spielzeug",
    short: "Baby & Spielzeug",
    heading: "Alles für dein Baby & Kind",
    description:
      "Alles für dein Baby: Windeln, Pflege, Ernährung und Spielzeug. Entdecke unsere Babywelt im Online-Shop von ROSSMANN.",
    subcategories: [
      "Windeln & Feuchttücher",
      "Babynahrung",
      "Babypflege",
      "Stillen & Fläschchen",
      "Spielzeug",
      "Baby-Textilien",
      "Unterwegs",
      "Sicherheit & Gesundheit",
    ],
  },
  {
    slug: "haushalt",
    name: "Haushalt",
    short: "Haushalt",
    heading: "Haushalt & Reinigung für dein Zuhause",
    description:
      "Wasch-, Putz- und Reinigungsmittel sowie praktische Haushaltshelfer. Entdecke unser Haushaltssortiment im Online-Shop von ROSSMANN.",
    subcategories: [
      "Waschmittel",
      "Weichspüler",
      "Reinigungsmittel",
      "Spülmittel",
      "Papierwaren",
      "Müllbeutel & Folien",
      "Raumdüfte",
      "Batterien",
    ],
  },
  {
    slug: "gesundheit",
    name: "Gesundheit",
    short: "Gesundheit",
    heading: "Gesundheit & Wohlbefinden",
    description:
      "Nahrungsergänzung, Erste Hilfe und Produkte für dein Wohlbefinden. Entdecke unser Gesundheitssortiment im Online-Shop von ROSSMANN.",
    subcategories: [
      "Nahrungsergänzung",
      "Vitamine & Mineralstoffe",
      "Erste Hilfe",
      "Erkältung",
      "Verhütung",
      "Hygiene",
      "Medizinprodukte",
      "Sport & Fitness",
    ],
  },
  {
    slug: "lebensmittel",
    name: "Lebensmittel",
    short: "Lebensmittel",
    heading: "Lebensmittel & Getränke",
    description:
      "Snacks, Getränke, Bio-Produkte und mehr für deinen Vorrat. Entdecke unser Lebensmittelsortiment im Online-Shop von ROSSMANN.",
    subcategories: [
      "Süßigkeiten & Snacks",
      "Getränke",
      "Kaffee & Tee",
      "Bio-Lebensmittel",
      "Frühstück",
      "Kochen & Backen",
      "Vegan & Vegetarisch",
      "Nüsse & Trockenfrüchte",
    ],
  },
]

export const PRODUCTS: Product[] = [
  // ── Make-up ──
  {
    slug: "mascara-volumen-schwarz",
    name: "Volumen Mascara Schwarz",
    brand: "RIVAL DE LOOP",
    category: "make-up",
    price: 3.99,
    unit: "11 ml",
    basePrice: "100 ml = 36,27 €",
    image: "/shop/products/mascara-volumen.png",
    rating: 4.6,
    reviews: 214,
    badge: "Tipp",
    description:
      "Für intensiven Volumeneffekt und ausdrucksstarke Wimpern. Die geschwungene Bürste erreicht auch die feinen Wimpern im Augenwinkel.",
  },
  {
    slug: "foundation-nude-matt",
    name: "Perfect Cover Foundation Nude",
    brand: "RIVAL DE LOOP",
    category: "make-up",
    price: 5.49,
    oldPrice: 6.99,
    unit: "30 ml",
    basePrice: "100 ml = 18,30 €",
    image: "/shop/products/foundation-nude.png",
    rating: 4.3,
    reviews: 98,
    badge: "Angebot",
    description:
      "Langanhaltendes Make-up mit mattem Finish und mittlerer Deckkraft für einen ebenmäßigen Teint den ganzen Tag.",
  },
  {
    slug: "lippenstift-classic-rot",
    name: "Classic Lippenstift Rot",
    brand: "RIVAL DE LOOP",
    category: "make-up",
    price: 4.29,
    unit: "1 St",
    basePrice: "1 St = 4,29 €",
    image: "/shop/products/lippenstift-rot.png",
    rating: 4.7,
    reviews: 156,
    description:
      "Ein klassisches, sattes Rot mit cremiger Textur und pflegenden Ölen für geschmeidige Lippen und intensive Farbe.",
  },
  {
    slug: "nagellack-rose",
    name: "Color Nagellack Rosé",
    brand: "trend IT UP",
    category: "make-up",
    price: 2.49,
    unit: "10 ml",
    basePrice: "100 ml = 24,90 €",
    image: "/shop/products/nagellack-rose.png",
    rating: 4.2,
    reviews: 73,
    badge: "Neu",
    description:
      "Hochdeckender Nagellack in zartem Rosé mit glänzendem Finish und schneller Trocknung.",
  },
  // ── Pflege & Duft ──
  {
    slug: "gesichtscreme-feuchtigkeit",
    name: "Feuchtigkeitscreme Gesicht",
    brand: "ISANA",
    category: "pflege-duft",
    price: 2.95,
    unit: "50 ml",
    basePrice: "100 ml = 5,90 €",
    image: "/shop/products/gesichtscreme.png",
    rating: 4.5,
    reviews: 341,
    badge: "Tipp",
    description:
      "Leichte Feuchtigkeitscreme mit Hyaluron für alle Hauttypen. Zieht schnell ein und spendet 24 Stunden Feuchtigkeit.",
  },
  {
    slug: "duschgel-kokos",
    name: "Cremedusche Kokos",
    brand: "ISANA",
    category: "pflege-duft",
    price: 0.95,
    unit: "300 ml",
    basePrice: "1 l = 3,17 €",
    image: "/shop/products/duschgel-kokos.png",
    rating: 4.4,
    reviews: 512,
    description:
      "Pflegende Cremedusche mit zartem Kokosduft und rückfettenden Inhaltsstoffen für ein geschmeidiges Hautgefühl.",
  },
  {
    slug: "shampoo-repair",
    name: "Repair Shampoo",
    brand: "ISANA",
    category: "pflege-duft",
    price: 1.45,
    oldPrice: 1.95,
    unit: "300 ml",
    basePrice: "1 l = 4,83 €",
    image: "/shop/products/shampoo-repair.png",
    rating: 4.3,
    reviews: 208,
    badge: "Angebot",
    description:
      "Repair Shampoo für strapaziertes Haar. Spendet Feuchtigkeit und macht das Haar wieder geschmeidig und glänzend.",
  },
  {
    slug: "eau-de-toilette-blossom",
    name: "Eau de Toilette Blossom",
    brand: "L'ORÉAL",
    category: "pflege-duft",
    price: 12.99,
    unit: "50 ml",
    basePrice: "100 ml = 25,98 €",
    image: "/shop/products/eau-de-toilette.png",
    rating: 4.8,
    reviews: 89,
    badge: "Neu",
    description:
      "Ein frischer, blumiger Duft mit Noten von Jasmin, weißen Blüten und einem Hauch von Moschus.",
  },
  // ── Baby & Spielzeug ──
  {
    slug: "windeln-groesse-3",
    name: "Windeln Größe 3 (6-10 kg)",
    brand: "babydream",
    category: "baby-spielzeug",
    price: 4.99,
    unit: "44 St",
    basePrice: "1 St = 0,11 €",
    image: "/shop/products/windeln-gr3.png",
    rating: 4.6,
    reviews: 428,
    badge: "Tipp",
    description:
      "Weiche, auslaufsichere Windeln mit hoher Saugkraft und atmungsaktiver Außenseite für einen trockenen Babypo.",
  },
  {
    slug: "feuchttuecher-sensitive",
    name: "Feuchttücher Sensitive",
    brand: "babydream",
    category: "baby-spielzeug",
    price: 0.75,
    unit: "56 St",
    basePrice: "100 St = 1,34 €",
    image: "/shop/products/feuchttuecher.png",
    rating: 4.7,
    reviews: 654,
    description:
      "Besonders sanfte Feuchttücher ohne Parfüm für die empfindliche Babyhaut. Dermatologisch getestet.",
  },
  {
    slug: "baby-shampoo",
    name: "Baby Shampoo & Waschgel",
    brand: "babydream",
    category: "baby-spielzeug",
    price: 1.65,
    unit: "250 ml",
    basePrice: "1 l = 6,60 €",
    image: "/shop/products/baby-shampoo.png",
    rating: 4.5,
    reviews: 187,
    description:
      "Mildes 2-in-1 Shampoo und Waschgel, das nicht in den Augen brennt. Für Haut und Haar deines Babys.",
  },
  {
    slug: "holzbausteine-set",
    name: "Holz-Bausteine 50er Set",
    brand: "IDEENWELT",
    category: "baby-spielzeug",
    price: 9.99,
    unit: "50 St",
    basePrice: "1 Set = 9,99 €",
    image: "/shop/products/holzbausteine.png",
    rating: 4.8,
    reviews: 76,
    badge: "Neu",
    ideenwelt: true,
    description:
      "Bunte Bausteine aus FSC-zertifiziertem Holz. Fördert Motorik und Kreativität bei Kindern ab 12 Monaten.",
  },
  // ── Haushalt ──
  {
    slug: "waschmittel-universal",
    name: "Universal Waschmittel 20 WL",
    brand: "domol",
    category: "haushalt",
    price: 3.49,
    unit: "1,3 l",
    basePrice: "1 WL = 0,17 €",
    image: "/shop/products/waschmittel.png",
    rating: 4.4,
    reviews: 298,
    description:
      "Kraftvolles Vollwaschmittel für strahlend saubere Wäsche bereits ab 20 °C. Für 20 Waschladungen.",
  },
  {
    slug: "kuechenrolle-4er",
    name: "Küchenrolle 4x51 Blatt",
    brand: "Softstar",
    category: "haushalt",
    price: 2.19,
    unit: "4 Rollen",
    basePrice: "1 Rolle = 0,55 €",
    image: "/shop/products/kuechenrolle.png",
    rating: 4.3,
    reviews: 143,
    description:
      "Saugstarke 3-lagige Küchenrolle, besonders reißfest auch im nassen Zustand. 4 Rollen im Vorteilspack.",
  },
  {
    slug: "allzweckreiniger-zitrone",
    name: "Allzweckreiniger Zitrone",
    brand: "domol",
    category: "haushalt",
    price: 0.85,
    oldPrice: 1.19,
    unit: "1 l",
    basePrice: "1 l = 0,85 €",
    image: "/shop/products/allzweckreiniger.png",
    rating: 4.5,
    reviews: 221,
    badge: "Angebot",
    description:
      "Universeller Reiniger mit frischem Zitrusduft für alle wasserfesten Oberflächen im Haushalt.",
  },
  {
    slug: "frischhalteboxen-set",
    name: "Frischhalteboxen 3er-Set",
    brand: "IDEENWELT",
    category: "haushalt",
    price: 4.99,
    unit: "3 St",
    basePrice: "1 Set = 4,99 €",
    image: "/shop/products/frischhalteboxen.png",
    rating: 4.6,
    reviews: 112,
    ideenwelt: true,
    description:
      "Stapelbare, auslaufsichere Frischhalteboxen mit Clip-Deckel. Ideal für Meal Prep und Vorratshaltung.",
  },
  // ── Gesundheit ──
  {
    slug: "vitamin-c-tabletten",
    name: "Vitamin C Brausetabletten",
    brand: "altapharma",
    category: "gesundheit",
    price: 0.95,
    unit: "20 St",
    basePrice: "1 St = 0,05 €",
    image: "/shop/products/vitamin-c.png",
    rating: 4.5,
    reviews: 367,
    badge: "Tipp",
    description:
      "Brausetabletten mit 200 mg Vitamin C zur Unterstützung des Immunsystems. Mit erfrischendem Orangengeschmack.",
  },
  {
    slug: "handdesinfektion",
    name: "Hand-Desinfektionsgel",
    brand: "altapharma",
    category: "gesundheit",
    price: 1.95,
    unit: "100 ml",
    basePrice: "100 ml = 1,95 €",
    image: "/shop/products/handdesinfektion.png",
    rating: 4.4,
    reviews: 145,
    description:
      "Hygienisches Hand-Desinfektionsgel, tötet 99,9 % der Bakterien ab. Mit rückfettenden Komponenten für die Haut.",
  },
  {
    slug: "pflaster-set",
    name: "Pflaster-Set 20 Stück",
    brand: "altapharma",
    category: "gesundheit",
    price: 1.25,
    unit: "20 St",
    basePrice: "1 St = 0,06 €",
    image: "/shop/products/pflaster-set.png",
    rating: 4.6,
    reviews: 88,
    description:
      "Elastische Wundpflaster in verschiedenen Größen. Hautfreundlich, atmungsaktiv und wasserabweisend.",
  },
  {
    slug: "magnesium-kapseln",
    name: "Magnesium 400 Kapseln",
    brand: "altapharma",
    category: "gesundheit",
    price: 3.95,
    oldPrice: 4.95,
    unit: "60 St",
    basePrice: "1 St = 0,07 €",
    image: "/shop/products/magnesium.png",
    rating: 4.7,
    reviews: 254,
    badge: "Angebot",
    description:
      "Hochdosierte Magnesium-Kapseln zur Unterstützung von Muskelfunktion und Energiestoffwechsel.",
  },
  // ── Lebensmittel ──
  {
    slug: "bio-haferflocken",
    name: "Bio Haferflocken zart",
    brand: "enerBiO",
    category: "lebensmittel",
    price: 1.19,
    unit: "500 g",
    basePrice: "1 kg = 2,38 €",
    image: "/shop/products/haferflocken.png",
    rating: 4.8,
    reviews: 419,
    badge: "Bio",
    description:
      "Zarte Bio-Haferflocken aus kontrolliert biologischem Anbau. Ideal für Müsli, Porridge und zum Backen.",
  },
  {
    slug: "protein-riegel-schoko",
    name: "Protein Riegel Schoko",
    brand: "enerBiO",
    category: "lebensmittel",
    price: 1.49,
    unit: "45 g",
    basePrice: "100 g = 3,31 €",
    image: "/shop/products/proteinriegel.png",
    rating: 4.2,
    reviews: 176,
    badge: "Neu",
    description:
      "Proteinreicher Riegel mit 20 g Eiweiß und leckerem Schokoladengeschmack. Der perfekte Snack nach dem Sport.",
  },
  {
    slug: "mandeln-geroestet",
    name: "Mandeln geröstet & gesalzen",
    brand: "enerBiO",
    category: "lebensmittel",
    price: 2.29,
    unit: "200 g",
    basePrice: "1 kg = 11,45 €",
    image: "/shop/products/mandeln.png",
    rating: 4.6,
    reviews: 132,
    description:
      "Knackige geröstete Mandeln mit einer Prise Meersalz. Ein gesunder und sättigender Snack für zwischendurch.",
  },
  {
    slug: "gruener-tee",
    name: "Grüner Tee 20 Beutel",
    brand: "enerBiO",
    category: "lebensmittel",
    price: 1.09,
    unit: "20 Btl",
    basePrice: "1 Btl = 0,05 €",
    image: "/shop/products/gruener-tee.png",
    rating: 4.4,
    reviews: 97,
    badge: "Bio",
    description:
      "Aromatischer grüner Tee aus biologischem Anbau. Belebend und wohltuend – heiß oder als Eistee ein Genuss.",
  },
]

export const TOP_PICKS = [
  { name: "Sonnenpflege", image: "/shop/tiles/sonnenpflege.png", category: "pflege-duft" },
  { name: "Korean Skincare", image: "/shop/tiles/korean-skincare.png", category: "pflege-duft" },
  { name: "Proteinprodukte", image: "/shop/tiles/protein.png", category: "lebensmittel" },
  { name: "Düfte & Parfum", image: "/shop/tiles/duefte.png", category: "pflege-duft" },
  { name: "Beach Hair", image: "/shop/tiles/beach-hair.png", category: "pflege-duft" },
  { name: "Reisegrößen", image: "/shop/tiles/reisegroessen.png", category: "make-up" },
]

export function getProductsByCategory(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.category === slug)
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getOffers(): Product[] {
  return PRODUCTS.filter((p) => p.oldPrice)
}

export function formatPrice(value: number): string {
  return value.toLocaleString("de-DE", { style: "currency", currency: "EUR" })
}
