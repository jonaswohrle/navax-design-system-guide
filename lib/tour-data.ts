// E.ON Energie-Tarife und Produkte
export interface TourDeparture {
  id: string
  startDate: string
  endDate: string
  price: number
  originalPrice?: number
  status: "Available" | "Limited" | "Guaranteed" | "Sold Out"
  note?: string
}

export interface TourItineraryDay {
  day: number
  title: string
  description: string
  meals?: string
  accommodation?: string
}

export interface TourDetail {
  slug: string
  title: string
  destination: string
  country: string
  tripType: string
  duration: string
  durationDays: number
  groupSize: string
  physicalRating: number
  maxAltitude?: string
  price: number
  originalPrice?: number
  imageUrl: string
  galleryImages: string[]
  tripCode: string
  overview: string
  highlights: string[]
  included: string[]
  notIncluded: string[]
  itinerary: TourItineraryDay[]
  departures: TourDeparture[]
  relatedSlugs: string[]
}

export const TOURS: Record<string, TourDetail> = {
  "oekostrom-classic": {
    slug: "oekostrom-classic",
    title: "E.ON ÖkoStrom Classic",
    destination: "Strom",
    country: "Deutschland",
    tripType: "Ökostrom",
    duration: "12 Monate",
    durationDays: 12,
    groupSize: "1-5 Personen",
    physicalRating: 4,
    price: 29,
    imageUrl: "/images/explore/eon-strom.jpg",
    galleryImages: ["/images/explore/eon-strom.jpg"],
    tripCode: "OSC",
    overview:
      "Der E.ON ÖkoStrom Classic ist unser beliebtester Stromtarif mit 100% erneuerbarer Energie aus Wind- und Solarkraft. Mit einer Vertragslaufzeit von 12 Monaten und Preisgarantie sichern Sie sich stabile Kosten und tun gleichzeitig etwas Gutes für die Umwelt. Der Tarif ist ideal für Haushalte jeder Größe.",
    highlights: [
      "100% Ökostrom aus erneuerbaren Energien",
      "12 Monate Preisgarantie",
      "Einfacher Online-Wechsel in nur 5 Minuten",
      "Kostenloser Zählerablesung-Service",
      "E.ON Plus fähig -- bis zu 200 EUR/Jahr sparen",
      "CO2-neutral zertifiziert",
    ],
    included: [
      "100% Ökostrom aus Wind & Solar",
      "Preisgarantie über die gesamte Laufzeit",
      "Kostenloser Online-Kundenbereich",
      "E.ON App zur Verbrauchskontrolle",
      "24/7 Kundenservice",
      "Kostenloser Wechselservice",
    ],
    notIncluded: [
      "Hardware-Installationen",
      "Smart Home Geräte",
      "Netzentgelte (gesetzlich geregelt)",
    ],
    itinerary: [
      { day: 1, title: "Tarifauswahl", description: "Wählen Sie Ihren passenden Stromtarif online oder telefonisch. Geben Sie Ihre PLZ und Ihren geschätzten Jahresverbrauch an." },
      { day: 2, title: "Vertrag abschließen", description: "Schließen Sie Ihren Vertrag bequem online ab. Wir kümmern uns um die Kündigung bei Ihrem alten Anbieter." },
      { day: 3, title: "Wechsel", description: "Der nahtlose Wechsel erfolgt automatisch. Ihre Stromversorgung wird zu keinem Zeitpunkt unterbrochen." },
      { day: 4, title: "Willkommen bei E.ON", description: "Erhalten Sie Ihre Vertragsbestätigung und Zugangsdaten zum E.ON Kundenportal." },
    ],
    departures: [
      { id: "OSC-FLEX", startDate: "2026-04-01", endDate: "2027-03-31", price: 29, status: "Available", note: "Grundversorgung" },
      { id: "OSC-12M", startDate: "2026-04-01", endDate: "2027-03-31", price: 27, originalPrice: 29, status: "Guaranteed", note: "12 Monate Preisgarantie" },
      { id: "OSC-24M", startDate: "2026-04-01", endDate: "2028-03-31", price: 25, originalPrice: 29, status: "Available", note: "24 Monate Preisgarantie" },
    ],
    relatedSlugs: ["oekostrom-premium", "oekostrom-home-drive", "eon-plus"],
  },

  "oekostrom-premium": {
    slug: "oekostrom-premium",
    title: "E.ON ÖkoStrom Premium",
    destination: "Strom",
    country: "Deutschland",
    tripType: "Ökostrom",
    duration: "24 Monate",
    durationDays: 24,
    groupSize: "1-5 Personen",
    physicalRating: 5,
    price: 32,
    originalPrice: 36,
    imageUrl: "/images/explore/eon-strom.jpg",
    galleryImages: ["/images/explore/eon-strom.jpg"],
    tripCode: "OSP",
    overview:
      "Der E.ON ÖkoStrom Premium bietet Ihnen das Rundum-sorglos-Paket: 100% regionaler Ökostrom aus deutschen Wind- und Solarparks, erweiterte Preisgarantie für 24 Monate und exklusiven Premium-Service mit persönlichem Ansprechpartner.",
    highlights: [
      "100% regionaler Ökostrom aus Deutschland",
      "24 Monate Preisgarantie",
      "Persönlicher Energieberater",
      "Smart Meter inklusive",
      "Monatliche Verbrauchsanalyse",
      "E.ON Plus kompatibel",
    ],
    included: [
      "100% regionaler Ökostrom",
      "24 Monate volle Preisgarantie",
      "Persönlicher Ansprechpartner",
      "Smart Meter Installation & Betrieb",
      "Monatliche Verbrauchsanalyse per App",
      "Priority-Kundenservice",
    ],
    notIncluded: [
      "Smart Home Geräte",
      "Netzentgelte (gesetzlich geregelt)",
      "Wallbox-Installation",
    ],
    itinerary: [
      { day: 1, title: "Premium-Beratung", description: "Individuelle Beratung durch Ihren persönlichen Energieberater -- online, telefonisch oder vor Ort." },
      { day: 2, title: "Vertragsabschluss", description: "Maßgeschneiderter Vertrag mit den besten Konditionen für Ihren Verbrauch." },
      { day: 3, title: "Smart Meter Installation", description: "Kostenlose Installation eines Smart Meters zur intelligenten Verbrauchsmessung." },
      { day: 4, title: "Premium-Service", description: "Zugang zum Premium-Kundenportal mit detaillierten Analysen und Spartipps." },
    ],
    departures: [
      { id: "OSP-12M", startDate: "2026-04-01", endDate: "2027-03-31", price: 32, originalPrice: 36, status: "Guaranteed", note: "12 Monate Preisgarantie" },
      { id: "OSP-24M", startDate: "2026-04-01", endDate: "2028-03-31", price: 30, originalPrice: 36, status: "Available", note: "24 Monate Preisgarantie" },
    ],
    relatedSlugs: ["oekostrom-classic", "oekostrom-home-drive", "eon-plus"],
  },

  "oekostrom-home-drive": {
    slug: "oekostrom-home-drive",
    title: "E.ON ÖkoStrom Home & Drive",
    destination: "Strom",
    country: "Deutschland",
    tripType: "Ökostrom",
    duration: "24 Monate",
    durationDays: 24,
    groupSize: "1-5 Personen",
    physicalRating: 5,
    price: 34,
    originalPrice: 39,
    imageUrl: "/images/explore/eon-emobility.jpg",
    galleryImages: ["/images/explore/eon-emobility.jpg"],
    tripCode: "OHD",
    overview:
      "Der perfekte Tarif für E-Auto-Fahrer: E.ON ÖkoStrom Home & Drive kombiniert Ihren Haushaltsstrom mit einem speziellen Autostromtarif. Laden Sie Ihr Elektroauto zu Hause günstig mit 100% Ökostrom und profitieren Sie von getrennter Messung und niedrigeren kWh-Preisen für Ihren Ladestrom.",
    highlights: [
      "Separater günstiger Autostromtarif",
      "100% Ökostrom für Haus und Auto",
      "Bis zu 30% günstiger als Haushaltsstrom",
      "Wallbox-Kompatibel mit allen Modellen",
      "Intelligentes Laden zu Niedrigtarifzeiten",
      "E.ON Plus Kombirabatt möglich",
    ],
    included: [
      "Haushaltsstrom 100% Öko",
      "Separater Autostromtarif",
      "24 Monate Preisgarantie",
      "E.ON App mit Ladestrom-Tracking",
      "Kompatibel mit allen gängigen Wallboxen",
      "24/7 E-Mobility Kundenservice",
    ],
    notIncluded: [
      "Wallbox-Hardware",
      "Wallbox-Installation",
      "Netzentgelte",
      "Öffentliches Laden unterwegs",
    ],
    itinerary: [
      { day: 1, title: "Konfiguration", description: "Wählen Sie Ihren Tarif und geben Sie Ihre Fahrzeugdaten an." },
      { day: 2, title: "Zähler-Setup", description: "Installation eines separaten Zählers für Ihren Ladestrom (falls benötigt)." },
      { day: 3, title: "Vertragsbeginn", description: "Nahtloser Wechsel -- Ihr Auto lädt ab sofort mit günstigem Ökostrom." },
      { day: 4, title: "Smart Charging", description: "Nutzen Sie die E.ON App für intelligentes Laden zu den günstigsten Zeiten." },
    ],
    departures: [
      { id: "OHD-12M", startDate: "2026-04-01", endDate: "2027-03-31", price: 34, originalPrice: 39, status: "Available", note: "12 Monate Laufzeit" },
      { id: "OHD-24M", startDate: "2026-04-01", endDate: "2028-03-31", price: 31, originalPrice: 39, status: "Guaranteed", note: "24 Monate -- Bestpreis" },
    ],
    relatedSlugs: ["oekostrom-classic", "wallbox-home", "eon-plus"],
  },

  "erdgas-classic": {
    slug: "erdgas-classic",
    title: "E.ON Erdgas Classic",
    destination: "Gas",
    country: "Deutschland",
    tripType: "Gas",
    duration: "12 Monate",
    durationDays: 12,
    groupSize: "1-5 Personen",
    physicalRating: 2,
    price: 8,
    imageUrl: "/images/explore/eon-gas.jpg",
    galleryImages: ["/images/explore/eon-gas.jpg"],
    tripCode: "EGC",
    overview:
      "Der E.ON Erdgas Classic bietet Ihnen eine zuverlässige und günstige Gasversorgung mit Preisgarantie. Ideal zum Heizen und Kochen -- mit transparenten Konditionen und ohne versteckte Kosten. Als einer der größten Gasanbieter Deutschlands garantieren wir Versorgungssicherheit.",
    highlights: [
      "Günstige ct/kWh Preise",
      "12 Monate Preisgarantie",
      "Keine versteckten Kosten",
      "Einfacher Online-Wechsel",
      "Kombinierbar mit E.ON Plus",
      "Optionaler Klimabeitrag",
    ],
    included: [
      "Erdgas-Grundversorgung",
      "Preisgarantie über Vertragslaufzeit",
      "Online-Kundenportal",
      "E.ON App zur Verbrauchskontrolle",
      "Kostenloser Wechselservice",
      "24/7 Kundenservice",
    ],
    notIncluded: [
      "Heizungswartung",
      "Geräte-Installation",
      "Netzentgelte (gesetzlich geregelt)",
    ],
    itinerary: [
      { day: 1, title: "Tarifauswahl", description: "PLZ eingeben und Jahresverbrauch angeben -- wir berechnen Ihren persönlichen Preis." },
      { day: 2, title: "Vertrag", description: "Online-Abschluss in 5 Minuten. Wir kündigen bei Ihrem alten Anbieter." },
      { day: 3, title: "Wechsel", description: "Nahtloser Wechsel ohne Unterbrechung Ihrer Gasversorgung." },
    ],
    departures: [
      { id: "EGC-12M", startDate: "2026-04-01", endDate: "2027-03-31", price: 8, status: "Available", note: "12 Monate Preisgarantie" },
      { id: "EGC-24M", startDate: "2026-04-01", endDate: "2028-03-31", price: 7, originalPrice: 8, status: "Guaranteed", note: "24 Monate -- Bestpreis" },
      { id: "EGC-FLEX", startDate: "2026-04-01", endDate: "2027-03-31", price: 9, status: "Available", note: "Monatlich kündbar" },
    ],
    relatedSlugs: ["erdgas-bio", "oekostrom-classic", "eon-plus"],
  },

  "erdgas-bio": {
    slug: "erdgas-bio",
    title: "E.ON BioErdgas",
    destination: "Gas",
    country: "Deutschland",
    tripType: "Gas",
    duration: "12 Monate",
    durationDays: 12,
    groupSize: "1-5 Personen",
    physicalRating: 4,
    price: 10,
    originalPrice: 12,
    imageUrl: "/images/explore/eon-gas.jpg",
    galleryImages: ["/images/explore/eon-gas.jpg"],
    tripCode: "EGB",
    overview:
      "E.ON BioErdgas ist unser klimafreundlicher Gastarif mit bis zu 10% Biogasanteil. Heizen Sie nachhaltig und reduzieren Sie Ihren CO2-Fußabdruck, ohne auf den Komfort von Erdgas verzichten zu müssen. Ideal für umweltbewusste Haushalte.",
    highlights: [
      "Bis zu 10% Biogasanteil",
      "CO2-Kompensation inklusive",
      "Klimaneutral zertifiziert",
      "Preisgarantie",
      "E.ON Plus kompatibel",
      "TÜV-geprüft",
    ],
    included: [
      "Erdgas mit Biogasanteil",
      "CO2-Kompensation über zertifizierte Projekte",
      "Preisgarantie",
      "Online-Kundenportal & App",
      "Wechselservice inklusive",
      "Klimazertifikat",
    ],
    notIncluded: [
      "Heizungswartung",
      "Geräte",
      "Netzentgelte",
    ],
    itinerary: [
      { day: 1, title: "Beratung", description: "Finden Sie heraus, wie viel CO2 Sie mit BioErdgas einsparen können." },
      { day: 2, title: "Vertragsabschluss", description: "Online oder telefonisch -- mit allen Details zu Ihrem Klimabeitrag." },
      { day: 3, title: "Klimaschutz", description: "Ab Tag 1 heizen Sie klimafreundlicher und erhalten Ihr persönliches Klimazertifikat." },
    ],
    departures: [
      { id: "EGB-12M", startDate: "2026-04-01", endDate: "2027-03-31", price: 10, originalPrice: 12, status: "Guaranteed", note: "12 Monate Preisgarantie" },
      { id: "EGB-24M", startDate: "2026-04-01", endDate: "2028-03-31", price: 9, originalPrice: 12, status: "Available", note: "24 Monate Bestpreis" },
    ],
    relatedSlugs: ["erdgas-classic", "oekostrom-premium", "eon-plus"],
  },

  "solar-komplett": {
    slug: "solar-komplett",
    title: "E.ON Solaranlage Komplett",
    destination: "Solar",
    country: "Deutschland",
    tripType: "Solar",
    duration: "Einmalig",
    durationDays: 0,
    groupSize: "Eigenheim",
    physicalRating: 5,
    price: 9990,
    imageUrl: "/images/explore/eon-solar.jpg",
    galleryImages: ["/images/explore/eon-solar.jpg"],
    tripCode: "SOL",
    overview:
      "Mit der E.ON Solaranlage Komplett erzeugen Sie Ihren eigenen Strom auf dem Dach. Das Komplettpaket beinhaltet Planung, hochwertige Module, Wechselrichter, Installation und Inbetriebnahme. Dank 0% MwSt. auf Solaranlagen war der Einstieg nie günstiger.",
    highlights: [
      "0% MwSt. auf Solaranlagen",
      "Bis zu 70% eigenen Strom erzeugen",
      "25 Jahre Leistungsgarantie auf Module",
      "Komplettpaket: Planung bis Inbetriebnahme",
      "Optionaler Batteriespeicher",
      "Einspeisevergütung für Überschuss",
    ],
    included: [
      "Dachplanung & Statikprüfung",
      "Premium-Solarmodule (mind. 400W)",
      "Wechselrichter",
      "Montage & Installation",
      "Netzanmeldung beim Netzbetreiber",
      "10 Jahre Garantie auf Installation",
    ],
    notIncluded: [
      "Batteriespeicher (optional buchbar)",
      "Dachsanierung (falls nötig)",
      "Wallbox",
      "Smart Home Integration",
    ],
    itinerary: [
      { day: 1, title: "Beratung & Planung", description: "Kostenlose Vor-Ort-Analyse Ihres Dachs und Berechnung des optimalen Anlagendesigns." },
      { day: 2, title: "Angebot & Vertrag", description: "Transparentes Festpreisangebot mit allen Kosten -- keine versteckten Gebühren." },
      { day: 3, title: "Installation", description: "Professionelle Montage durch zertifizierte E.ON Partnerbetriebe in 1-2 Tagen." },
      { day: 4, title: "Inbetriebnahme", description: "Anmeldung beim Netzbetreiber und Einweisung in Ihre neue Solaranlage." },
      { day: 5, title: "Eigenstrom", description: "Ab sofort erzeugen Sie Ihren eigenen Strom und sparen bei jeder Sonnenstunde." },
    ],
    departures: [
      { id: "SOL-SMALL", startDate: "2026-04-01", endDate: "2026-12-31", price: 9990, status: "Available", note: "Bis 5 kWp -- Wohnung/Reihenhaus" },
      { id: "SOL-MEDIUM", startDate: "2026-04-01", endDate: "2026-12-31", price: 14990, status: "Guaranteed", note: "5-10 kWp -- Einfamilienhaus" },
      { id: "SOL-LARGE", startDate: "2026-04-01", endDate: "2026-12-31", price: 19990, status: "Available", note: "10-15 kWp -- Großes Dach" },
      { id: "SOL-SPEICHER", startDate: "2026-04-01", endDate: "2026-12-31", price: 17990, status: "Limited", note: "5-10 kWp + Batteriespeicher" },
    ],
    relatedSlugs: ["oekostrom-classic", "wallbox-home", "waermepumpe-comfort"],
  },

  "waermepumpe-comfort": {
    slug: "waermepumpe-comfort",
    title: "E.ON Wärmepumpe Comfort",
    destination: "Wärmepumpe",
    country: "Deutschland",
    tripType: "Waermepumpe",
    duration: "Einmalig",
    durationDays: 0,
    groupSize: "Eigenheim",
    physicalRating: 5,
    price: 15900,
    imageUrl: "/images/explore/eon-waermepumpe.jpg",
    galleryImages: ["/images/explore/eon-waermepumpe.jpg"],
    tripCode: "WPC",
    overview:
      "Die E.ON Wärmepumpe Comfort ist Ihre Komplettlösung für nachhaltiges Heizen. Nutzen Sie die kostenlose Umweltwärme aus Luft, Wasser oder Erde und senken Sie Ihre Heizkosten um bis zu 50%. Mit staatlicher Förderung von bis zu 70% wird die Investition noch attraktiver.",
    highlights: [
      "Bis zu 70% staatliche Förderung",
      "Bis zu 50% Heizkostenersparnis",
      "CO2-freies Heizen",
      "Kombinierbar mit Solaranlage",
      "Kühlfunktion im Sommer",
      "15 Jahre Herstellergarantie",
    ],
    included: [
      "Wärmepumpe (Luft-Wasser)",
      "Planung & Dimensionierung",
      "Installation durch zertifizierte Fachbetriebe",
      "Hydraulischer Abgleich",
      "Förderantrag-Unterstützung",
      "5 Jahre Vollgarantie",
    ],
    notIncluded: [
      "Heizkörper-Austausch (falls nötig)",
      "Fußbodenheizung-Nachrüstung",
      "Erdwärmesonde (bei Sole-Wärmepumpe)",
      "Betriebsstrom",
    ],
    itinerary: [
      { day: 1, title: "Energiecheck", description: "Kostenlose Analyse Ihres Gebäudes und Berechnung des Wärmebedarfs." },
      { day: 2, title: "Förderberatung", description: "Wir prüfen alle Fördermöglichkeiten und unterstützen beim Antrag (BEG, KfW)." },
      { day: 3, title: "Angebot", description: "Transparentes Festpreisangebot inklusive aller Installationskosten." },
      { day: 4, title: "Installation", description: "Professionelle Installation in 2-3 Tagen durch zertifizierte Fachbetriebe." },
      { day: 5, title: "Einweisung", description: "Einweisung in die Bedienung und Einrichtung der Smart-Steuerung." },
    ],
    departures: [
      { id: "WPC-LUFT-S", startDate: "2026-04-01", endDate: "2026-12-31", price: 15900, status: "Available", note: "Luft-Wasser -- bis 120m\u00B2" },
      { id: "WPC-LUFT-L", startDate: "2026-04-01", endDate: "2026-12-31", price: 21900, status: "Available", note: "Luft-Wasser -- bis 200m\u00B2" },
      { id: "WPC-SOLE", startDate: "2026-04-01", endDate: "2026-12-31", price: 28900, status: "Limited", note: "Sole-Wasser -- Höchste Effizienz" },
    ],
    relatedSlugs: ["solar-komplett", "oekostrom-classic", "smarthome-comfort"],
  },

  "wallbox-home": {
    slug: "wallbox-home",
    title: "E.ON Wallbox Home",
    destination: "E-Auto",
    country: "Deutschland",
    tripType: "E-Auto",
    duration: "Einmalig",
    durationDays: 0,
    groupSize: "1-5 Personen",
    physicalRating: 4,
    price: 1299,
    imageUrl: "/images/explore/eon-emobility.jpg",
    galleryImages: ["/images/explore/eon-emobility.jpg"],
    tripCode: "WBH",
    overview:
      "Die E.ON Wallbox Home ist Ihre persönliche Ladestation für Ihr Elektroauto. Laden Sie bis zu 5x schneller als an der Haushaltssteckdose -- sicher, effizient und smart. Kombinieren Sie die Wallbox mit unserem Home & Drive Tarif für maximale Ersparnis.",
    highlights: [
      "Bis zu 22 kW Ladeleistung",
      "5x schneller als Haushaltssteckdose",
      "App-Steuerung & Ladeplanung",
      "Kompatibel mit allen E-Autos",
      "Eichrechtskonform",
      "Kombinierbar mit Solarladen",
    ],
    included: [
      "Wallbox (11 kW oder 22 kW)",
      "Professionelle Installation",
      "Anmeldung beim Netzbetreiber",
      "E.ON Charge App",
      "3 Jahre Herstellergarantie",
      "Einweisung & Inbetriebnahme",
    ],
    notIncluded: [
      "Autostrom-Tarif (separat buchbar)",
      "Ladekabel (je nach Modell)",
      "Tiefbauarbeiten (falls nötig)",
      "Zählerschrank-Umbau (falls nötig)",
    ],
    itinerary: [
      { day: 1, title: "Installations-Check", description: "Online-Prüfung Ihrer Hausinstallation und Empfehlung der passenden Wallbox." },
      { day: 2, title: "Bestellung", description: "Wählen Sie zwischen 11 kW und 22 kW Ladeleistung." },
      { day: 3, title: "Installation", description: "Professionelle Installation durch E.ON Elektriker-Partner in ca. 3 Stunden." },
      { day: 4, title: "Laden", description: "Laden Sie Ihr E-Auto ab sofort bequem und günstig zu Hause." },
    ],
    departures: [
      { id: "WBH-11KW", startDate: "2026-04-01", endDate: "2026-12-31", price: 1299, status: "Guaranteed", note: "11 kW Wallbox + Installation" },
      { id: "WBH-22KW", startDate: "2026-04-01", endDate: "2026-12-31", price: 1799, status: "Available", note: "22 kW Wallbox + Installation" },
      { id: "WBH-SOLAR", startDate: "2026-04-01", endDate: "2026-12-31", price: 1599, status: "Limited", note: "11 kW + Solar-Ladeoptimierung" },
    ],
    relatedSlugs: ["oekostrom-home-drive", "solar-komplett", "oekostrom-classic"],
  },

  "smarthome-comfort": {
    slug: "smarthome-comfort",
    title: "E.ON Smart Home Comfort",
    destination: "Smart Home",
    country: "Deutschland",
    tripType: "SmartHome",
    duration: "Monatlich",
    durationDays: 1,
    groupSize: "1-5 Personen",
    physicalRating: 3,
    price: 12,
    imageUrl: "/images/explore/eon-smarthome.jpg",
    galleryImages: ["/images/explore/eon-smarthome.jpg"],
    tripCode: "SHC",
    overview:
      "E.ON Smart Home Comfort macht Ihr Zuhause intelligent: Steuern Sie Heizung, Beleuchtung und Geräte per App und sparen Sie bis zu 30% Energie. Das Starterpaket enthält alle Komponenten für den sofortigen Einstieg ins smarte Energiemanagement.",
    highlights: [
      "Bis zu 30% Energieeinsparung",
      "App-Steuerung von überall",
      "Automatische Heizungsoptimierung",
      "Kompatibel mit Alexa, Google Home",
      "Einfache Selbstinstallation",
      "Monatlich kündbar",
    ],
    included: [
      "Smart Home Gateway",
      "2x Heizkörper-Thermostate",
      "1x Tür-/Fensterkontakt",
      "1x Zwischenstecker",
      "E.ON Smart Home App",
      "Automatische Software-Updates",
    ],
    notIncluded: [
      "Zusätzliche Sensoren & Aktoren",
      "Professionelle Installation",
      "Sprachassistenten (Alexa, Google Home)",
      "Internet-Anschluss",
    ],
    itinerary: [
      { day: 1, title: "Starterpaket bestellen", description: "Wählen Sie Ihr Smart Home Paket und erhalten Sie alle Geräte bequem nach Hause." },
      { day: 2, title: "Selbstinstallation", description: "Einfache Plug & Play Installation in unter 30 Minuten -- ohne Handwerker." },
      { day: 3, title: "App einrichten", description: "Verbinden Sie alle Geräte mit der E.ON Smart Home App und erstellen Sie Ihre Automatisierungen." },
      { day: 4, title: "Energie sparen", description: "Die intelligente Heizungssteuerung optimiert automatisch Ihren Verbrauch." },
    ],
    departures: [
      { id: "SHC-START", startDate: "2026-04-01", endDate: "2027-03-31", price: 12, status: "Available", note: "Starterpaket -- monatlich kündbar" },
      { id: "SHC-PLUS", startDate: "2026-04-01", endDate: "2027-03-31", price: 19, status: "Guaranteed", note: "Plus-Paket mit extra Sensoren" },
      { id: "SHC-PRO", startDate: "2026-04-01", endDate: "2027-03-31", price: 29, status: "Available", note: "Pro-Paket mit Energiemanager" },
    ],
    relatedSlugs: ["oekostrom-classic", "solar-komplett", "eon-plus"],
  },

  "eon-plus": {
    slug: "eon-plus",
    title: "E.ON Plus Kombipaket",
    destination: "Strom",
    country: "Deutschland",
    tripType: "Ökostrom",
    duration: "24 Monate",
    durationDays: 24,
    groupSize: "1-5 Personen",
    physicalRating: 5,
    price: 0,
    imageUrl: "/images/explore/eon-strom.jpg",
    galleryImages: ["/images/explore/eon-strom.jpg"],
    tripCode: "EOP",
    overview:
      "Mit E.ON Plus sparen Sie bares Geld, wenn Sie mehrere E.ON Verträge bündeln. Kombinieren Sie z.B. Strom + Gas, Strom + Internet oder Strom + Solar und sichern Sie sich bis zu 200 EUR Rabatt pro Jahr. Je mehr Verträge, desto mehr sparen Sie!",
    highlights: [
      "Bis zu 200 EUR Rabatt pro Jahr",
      "Verträge frei kombinierbar",
      "Strom + Gas, Internet, Solar, etc.",
      "Automatische Rabattverrechnung",
      "Ein Ansprechpartner für alles",
      "Kein Mindestverbrauch",
    ],
    included: [
      "Jährlicher Kombirabatt",
      "Zentrale Vertragsverwaltung",
      "Ein Ansprechpartner für alle Verträge",
      "E.ON Plus App-Dashboard",
      "Flexible Vertragskombinationen",
      "Automatische Rabattverrechnung",
    ],
    notIncluded: [
      "Die einzelnen Verträge selbst (separat buchbar)",
      "Hardware (Wallbox, Smart Home, etc.)",
    ],
    itinerary: [
      { day: 1, title: "Verträge prüfen", description: "Prüfen Sie, welche E.ON Verträge Sie bereits haben oder abschließen möchten." },
      { day: 2, title: "E.ON Plus aktivieren", description: "Aktivieren Sie E.ON Plus kostenlos in Ihrem Kundenkonto." },
      { day: 3, title: "Kombinieren & Sparen", description: "Jeder weitere E.ON Vertrag erhöht Ihren jährlichen Rabatt automatisch." },
    ],
    departures: [
      { id: "EOP-2V", startDate: "2026-04-01", endDate: "2028-03-31", price: 0, status: "Available", note: "2 Verträge -- 50 EUR/Jahr Rabatt" },
      { id: "EOP-3V", startDate: "2026-04-01", endDate: "2028-03-31", price: 0, status: "Guaranteed", note: "3 Verträge -- 120 EUR/Jahr Rabatt" },
      { id: "EOP-4V", startDate: "2026-04-01", endDate: "2028-03-31", price: 0, status: "Available", note: "4+ Verträge -- 200 EUR/Jahr Rabatt" },
    ],
    relatedSlugs: ["oekostrom-classic", "erdgas-classic", "solar-komplett"],
  },
}

export function getTour(slug: string): TourDetail | undefined {
  return TOURS[slug]
}

export function getAllTourSlugs(): string[] {
  return Object.keys(TOURS)
}

export function getAllTours(): TourDetail[] {
  return Object.values(TOURS)
}

const REGION_COUNTRY_MAP: Record<string, string[]> = {
  strom: ["Strom"],
  gas: ["Gas"],
  solar: ["Solar"],
  waermepumpe: ["Wärmepumpe"],
  "e-auto": ["E-Auto"],
  smarthome: ["Smart Home"],
}

export function getToursByRegion(region: string): TourDetail[] {
  const categories = REGION_COUNTRY_MAP[region] || []
  return getAllTours().filter((tour) => {
    const dest = tour.destination.toLowerCase()
    return categories.some((c) => c.toLowerCase() === dest)
  })
}

export function getTourCountByRegion(region: string): number {
  return getToursByRegion(region).length
}
