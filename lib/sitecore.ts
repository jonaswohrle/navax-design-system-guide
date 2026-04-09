/**
 * Sitecore XM Cloud data layer for HARTMANN
 *
 * Content is mapped to the Sitecore content tree structure:
 * /sitecore/content/HARTMANN/Home (ce18f98c-c0d1-4c89-b5f7-03a864f58ea1)
 *
 * Since the Sitecore MCP (Marketer MCP) manages content items,
 * we reference them by their Sitecore IDs and provide the data
 * in a structured format that mirrors the XM Cloud layout.
 */

// ─── Sitecore Content IDs ───
export const SITECORE_IDS = {
  site: "133248c2-da8d-46ec-9fd0-330402e7b5dd",
  home: "ce18f98c-c0d1-4c89-b5f7-03a864f58ea1",
  produkte: "897fc56d-0e69-468d-bc58-fbb2a2fa7934",
  wundversorgung: "526e249e-eaa4-46b0-b6b0-d32c52ecde7d",
  desinfektion: "ad83baff-3d5f-4e8a-956a-10119de27441",
  inkontinenzversorgung: "5e1272a3-6e3b-4008-b16e-cf24c06d2e4f",
  branchen: "7db53e42-107f-4f4c-b131-6ec1761bac47",
  kliniken: "9669a7ad-8ab9-4d09-86f9-cabd31da283b",
  pflegeheime: "93471bcb-e023-457c-8e2b-abf8b70c1ac0",
  ambulantePflege: "f32fa4b5-5926-4a91-afb7-2a7bbe412d28",
  apotheken: "cc514830-0877-43f1-8606-764165b8dc38",
  unternehmen: "885d52e2-a6dd-4e34-9a59-a0f939244b68",
  ueberHartmann: "33d9cb3b-b52c-4e9f-8c35-babbd4380418",
  karriere: "19cfd50f-81b0-4f10-b44b-9be4c6cf19cc",
  nachhaltigkeit: "5537af98-1323-4672-88f5-2968f8c88e23",
  investorRelations: "d52cd23b-1498-4238-a47b-14cb94bf7191",
  service: "f4498e87-b801-49e5-9caa-17ced636958d",
  kontakt: "c0d2fefc-2c87-45cd-a491-6d44da7a3609",
  schulungen: "dc4d03e3-120a-48e8-8f02-882b2b59ce34",
  downloads: "e3a9f879-b4aa-445f-841f-50631aef369c",
  impressum: "8cd8bc57-5ede-47b8-a761-1281aa8d0c8f",
  datenschutz: "ed5b4bc6-7c0b-4b3b-a00f-65bdf991321d",
  agb: "c2ebd460-5f47-4d84-a4b8-ac5279a1078d",
} as const

// ─── Type definitions ───

export interface HartmannHero {
  id: string
  title: string
  subtitle: string
  backgroundImageUrl: string
}

export interface HartmannPartnerCategory {
  id: string
  name: string
  order: number
}

export interface HartmannCompetency {
  id: string
  title: string
  label: string
  description: string
  imageUrl: string
  linkUrl: string
  order: number
}

export interface HartmannProductHighlight {
  id: string
  title: string
  subtitle: string
  description: string
  imageUrl: string
  linkUrl: string
  order: number
}

export interface HartmannAboutCard {
  id: string
  title: string
  label: string
  description: string
  imageUrl: string
  linkUrl: string
  order: number
}

export interface HartmannBacillolPromo {
  id: string
  title: string
  subtitle: string
  description: string
  imageUrl: string
  linkUrl: string
}

export interface HartmannPrivatanwender {
  id: string
  title: string
  description: string
  benefits: string[]
  linkUrl: string
  linkLabel: string
}

export interface HartmannNavigation {
  id: string
  items: {
    label: string
    href: string
    children?: { label: string; href: string }[]
  }[]
}

export interface HartmannFooter {
  id: string
  columns: {
    title: string
    links: { label: string; href: string }[]
  }[]
  legalLinks: { label: string; href: string }[]
  companyInfo: string
}

export interface HartmannIntroSection {
  id: string
  title: string
  description: string
}

// ─── Data fetchers (from Sitecore content tree) ───

export async function getHartmannHero(): Promise<HartmannHero> {
  return {
    id: SITECORE_IDS.home,
    title: "Hilft. Pflegt. Sch\u00FCtzt.",
    subtitle:
      "Die HARTMANN GRUPPE ist ein f\u00FChrender europ\u00E4ischer Anbieter von Systeml\u00F6sungen f\u00FCr Medizin und Pflege. Medizinisches Fachpersonal und Patienten verlassen sich tagt\u00E4glich auf unsere Produkte.",
    backgroundImageUrl: "/images/hartmann-hero.png",
  }
}

export async function getHartmannIntro(): Promise<HartmannIntroSection> {
  return {
    id: `${SITECORE_IDS.home}-intro`,
    title: "Innovative L\u00F6sungen f\u00FCr Medizin und Pflege",
    description:
      "Wir bei HARTMANN setzen unser klinisches und medizinisches Fachwissen f\u00FCr L\u00F6sungen ein, die stets einem zentralen Zweck dienen: Sie sollen das Leben und die Arbeit des medizinischen Fachpersonals und Patienten verbessern.\n\nStrategisch verfolgen wir klare Ziele: Wir bringen innovative Produkte mit echtem Mehrwert auf den Markt. Wir verbessern signifikant unsere Kostenposition. Wir entwickeln digitale Services und Gesch\u00E4ftsmodelle. Und wir richten unsere Kernsegmente Wundversorgung, Inkontinenz- und Infektionsmanagement auf attraktive Marktsegmente aus. Dabei investieren wir gezielt in ein langfristig profitables Wachstum.",
  }
}

export async function getHartmannPartnerCategories(): Promise<HartmannPartnerCategory[]> {
  return [
    { id: `${SITECORE_IDS.branchen}-1`, name: "Ambulante medizinische Zentren", order: 1 },
    { id: `${SITECORE_IDS.branchen}-2`, name: "Ambulante Pflegedienste", order: 2 },
    { id: `${SITECORE_IDS.branchen}-3`, name: "Apotheken", order: 3 },
    { id: `${SITECORE_IDS.branchen}-4`, name: "Arztpraxen", order: 4 },
    { id: `${SITECORE_IDS.branchen}-5`, name: "Betriebe & Instutionen", order: 5 },
    { id: `${SITECORE_IDS.branchen}-6`, name: "Fachhandel medical & hygiene", order: 6 },
    { id: `${SITECORE_IDS.branchen}-7`, name: "Homecare & Sanit\u00E4tsh\u00E4user", order: 7 },
    { id: `${SITECORE_IDS.branchen}-8`, name: "Kliniken", order: 8 },
    { id: `${SITECORE_IDS.branchen}-9`, name: "Pflegeheime", order: 9 },
    { id: `${SITECORE_IDS.branchen}-10`, name: "Privatanwender", order: 10 },
    { id: `${SITECORE_IDS.branchen}-11`, name: "Rettungsdienste", order: 11 },
  ]
}

export async function getHartmannCompetencies(): Promise<HartmannCompetency[]> {
  return [
    {
      id: SITECORE_IDS.wundversorgung,
      title: "Wunde",
      label: "Academy",
      description:
        "HARTMANN bietet Produkte f\u00FCr eine einfachere und schnellere Wundheilung. Entdecken Sie ein breites Spektrum an Lern- und Wissensinhalten f\u00FCr das Wundmanagement.",
      imageUrl: "/images/hartmann-wunde.jpg",
      linkUrl: "#",
      order: 1,
    },
    {
      id: SITECORE_IDS.inkontinenzversorgung,
      title: "Inkontinenz",
      label: "Academy",
      description:
        "Wir bem\u00FChen uns, die Lebensqualit\u00E4t von Menschen, die mit Inkontinenz leben, zu verbessern.",
      imageUrl: "/images/hartmann-inkontinenz.jpg",
      linkUrl: "#",
      order: 2,
    },
    {
      id: SITECORE_IDS.desinfektion,
      title: "Desinfektion",
      label: "Academy",
      description:
        "Eine zuverl\u00E4ssige Hygiene ist entscheidend bei allen Ma\u00DFnahmen in Therapie und Pflege. Dazu z\u00E4hlt auch eine durchdachte Desinfektion von H\u00E4nden, Haut und Fl\u00E4chen.",
      imageUrl: "/images/hartmann-desinfektion.jpg",
      linkUrl: "#",
      order: 3,
    },
    {
      id: `${SITECORE_IDS.produkte}-op`,
      title: "OP",
      label: "Academy",
      description:
        "Eine kompetente OP-Planung und -Durchf\u00FChrung, besonders bei komplexen Eingriffen, erfordert umfassendes und aktuelles Wissen.",
      imageUrl: "/images/hartmann-op.jpg",
      linkUrl: "#",
      order: 4,
    },
  ]
}

export async function getHartmannProductHighlights(): Promise<HartmannProductHighlight[]> {
  return [
    {
      id: `${SITECORE_IDS.produkte}-hydroclean`,
      title: "HydroClean\u00AE",
      subtitle: "Polyacrylat-Wundauflagen",
      description:
        "Die hydroaktive Superabsorber-Wundauflage f\u00FCr eine wirksame Wundreinigung und die effektive Wundbettvorbereitung.",
      imageUrl: "/images/hartmann-hydroclean.jpg",
      linkUrl: "#",
      order: 1,
    },
    {
      id: `${SITECORE_IDS.produkte}-molicare`,
      title: "MoliCare\u00AE premium Mobile 5 Tropfen",
      subtitle: "Mittlere Inkontinenz",
      description:
        "Bequem, diskret und einfach anzuwenden - diese Einweghosen bieten zuverl\u00E4ssigen Schutz bei mittlerer Inkontinenz. Jetzt mit einer verbesserten Passform f\u00FCr mehr Komfort und Diskretion.*",
      imageUrl: "/images/hartmann-molicare.jpg",
      linkUrl: "#",
      order: 2,
    },
    {
      id: `${SITECORE_IDS.produkte}-sterillium`,
      title: "Sterillium\u00AE",
      subtitle: "H\u00E4ndedesinfektion",
      description:
        "Der Klassiker der alkoholischen H\u00E4ndedesinfektion mit sehr guter Hautvertr\u00E4glichkeit. Inaktiviert Noroviren innerhalb der hygienischen H\u00E4ndedesinfektion.",
      imageUrl: "/images/hartmann-sterillium.jpg",
      linkUrl: "#",
      order: 3,
    },
    {
      id: `${SITECORE_IDS.produkte}-foliodress`,
      title: "Foliodress\u00AE Eye Protect",
      subtitle: "Mehrweg-Schutzbrillen",
      description: "Der sichere und komfortable Extraschutz f\u00FCr die Augen.",
      imageUrl: "/images/hartmann-foliodress.jpg",
      linkUrl: "#",
      order: 4,
    },
  ]
}

export async function getHartmannBacillolPromo(): Promise<HartmannBacillolPromo> {
  return {
    id: `${SITECORE_IDS.produkte}-bacillol`,
    title: "Bacillol\u00AE 30 Sensitive Green Tissues",
    subtitle: "Unser Bestseller \u2013 jetzt nachhaltig",
    description:
      "Weniger Emissionen und Abfall, mehr f\u00FCr die Umwelt: Die neuen Bacillol\u00AE 30 Sensitive Green Tissues helfen Gesundheitseinrichtungen dabei, nachhaltiger zu werden. Entdecken Sie jetzt die Vorteile unserer neuesten Innovation im Bereich der Fl\u00E4chendesinfektion.",
    imageUrl: "/images/hartmann-bacillol.jpg",
    linkUrl: "#",
  }
}

export async function getHartmannPrivatanwender(): Promise<HartmannPrivatanwender> {
  return {
    id: `${SITECORE_IDS.home}-privatanwender`,
    title: "Entdecken Sie unsere Produktwelten f\u00FCr Privatanwender!",
    description:
      "Unsere Expertise im Professional-Bereich setzen wir auch f\u00FCr Sie als Privatkunden ein! Auf unserer HARTMANN direct Plattform bieten wir Ihnen hochwertige Produkte in den Bereichen Inkontinenz, Desinfektion, Wund- und Hautpflege \u2013 alles, was Sie f\u00FCr Ihre Gesundheit und Pflege ben\u00F6tigen.",
    benefits: [
      "Gro\u00DFe Produktauswahl",
      "Musterbestellungen",
      "Fachwissen zur Gesundheit und Pflege",
    ],
    linkUrl: "#",
    linkLabel: "Besuchen Sie HARTMANN direct Plattform",
  }
}

export async function getHartmannAboutCards(): Promise<HartmannAboutCard[]> {
  return [
    {
      id: SITECORE_IDS.ueberHartmann,
      title: "\u00DCber HARTMANN",
      label: "Unternehmensseite",
      description:
        "Eine lange Geschichte innovativer Gesundheitsl\u00F6sungen, starke Unternehmenswerte, \u00FCber 10.000 Mitarbeitende in 36 L\u00E4ndern, vier Segmente medizinischer Expertise \u2013 das sind einige der vielen Bausteine der einzigartigen DNA von HARTMANN. Was uns sonst noch ausmacht, erfahren Sie hier.",
      imageUrl: "/images/hartmann-about.jpg",
      linkUrl: "#",
      order: 1,
    },
    {
      id: SITECORE_IDS.karriere,
      title: "Ihre Karriere bei HARTMANN",
      label: "Karriere",
      description:
        "Sie brennen f\u00FCr Gesundheitsthemen und m\u00F6chten medizinischem Fachpersonal und Patienten das Leben erleichtern? Hier erfahren Sie, warum Sie bei HARTMANN genau richtig sind.",
      imageUrl: "/images/hartmann-karriere.jpg",
      linkUrl: "#",
      order: 2,
    },
    {
      id: SITECORE_IDS.kontakt,
      title: "Treten Sie mit uns in Kontakt",
      label: "Kontakt",
      description:
        "Wir freuen uns auf Ihre Fragen, Kommentare und Anmerkungen.",
      imageUrl: "/images/hartmann-kontakt.jpg",
      linkUrl: "#",
      order: 3,
    },
  ]
}

export async function getHartmannNavigation(): Promise<HartmannNavigation> {
  return {
    id: `${SITECORE_IDS.home}-nav`,
    items: [
      {
        label: "Produkte",
        href: "#",
        children: [
          { label: "Wundversorgung", href: "#" },
          { label: "Desinfektion", href: "#" },
          { label: "Inkontinenzversorgung", href: "#" },
          { label: "OP-Produkte", href: "#" },
        ],
      },
      {
        label: "Academy",
        href: "#",
        children: [
          { label: "Wunde", href: "#" },
          { label: "Inkontinenz", href: "#" },
          { label: "Desinfektion", href: "#" },
          { label: "OP", href: "#" },
        ],
      },
      {
        label: "L\u00F6sungen",
        href: "#",
        children: [
          { label: "Kliniken", href: "#" },
          { label: "Pflegeheime", href: "#" },
          { label: "Ambulante Pflege", href: "#" },
          { label: "Apotheken", href: "#" },
        ],
      },
    ],
  }
}

export async function getHartmannFooter(): Promise<HartmannFooter> {
  return {
    id: `${SITECORE_IDS.home}-footer`,
    columns: [
      {
        title: "Produkte",
        links: [
          { label: "Wundversorgung", href: "#" },
          { label: "Desinfektion", href: "#" },
          { label: "Inkontinenzversorgung", href: "#" },
          { label: "OP-Produkte", href: "#" },
        ],
      },
      {
        title: "Branchen",
        links: [
          { label: "Kliniken", href: "#" },
          { label: "Pflegeheime", href: "#" },
          { label: "Ambulante Pflege", href: "#" },
          { label: "Apotheken", href: "#" },
        ],
      },
      {
        title: "Unternehmen",
        links: [
          { label: "\u00DCber HARTMANN", href: "#" },
          { label: "Karriere", href: "#" },
          { label: "Nachhaltigkeit", href: "#" },
          { label: "Investor Relations", href: "#" },
        ],
      },
      {
        title: "Service",
        links: [
          { label: "Kontakt", href: "#" },
          { label: "Schulungen", href: "#" },
          { label: "Downloads", href: "#" },
        ],
      },
    ],
    legalLinks: [
      { label: "Impressum", href: "#" },
      { label: "Datenschutz", href: "#" },
      { label: "AGB", href: "#" },
    ],
    companyInfo:
      "PAUL HARTMANN AG, Paul-Hartmann-Strasse 12, 89522 Heidenheim, Deutschland",
  }
}
