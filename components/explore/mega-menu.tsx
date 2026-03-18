"use client"

import { useState } from "react"
import Link from "next/link"

/* ------------------------------------------------------------------ */
/*  Destinations mega-menu data                                        */
/* ------------------------------------------------------------------ */
const DESTINATION_REGIONS = [
  {
    label: "Europe",
    slug: "europe",
    countries: [
      "Albania", "Andorra", "Austria", "Bosnia and Herzegovina", "Bulgaria", "Croatia",
      "Czechia", "Denmark", "Estonia", "Faroes Islands", "Finland", "France", "Greece",
      "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", "Latvia", "Lithuania", "Malta",
      "Montenegro", "North Cyprus", "North Macedonia", "Norway", "Poland", "Portugal",
      "Romania", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Turkey", "Ukraine",
      "United Kingdom",
    ],
    regionsOfInterest: [
      "Amalfi Coast", "Azores", "Balkans", "Baltic States", "Canary Islands",
      "Cappadocia", "Madeira", "Scandinavia", "Sicily",
    ],
  },
  {
    label: "Africa",
    slug: "africa",
    countries: [
      "Botswana", "Egypt", "Ethiopia", "Ghana", "Kenya", "Madagascar", "Malawi",
      "Morocco", "Mozambique", "Namibia", "Rwanda", "Senegal", "South Africa",
      "Tanzania", "Tunisia", "Uganda", "Zambia", "Zimbabwe",
    ],
  },
  {
    label: "Asia",
    slug: "asia",
    countries: [
      "Borneo", "Cambodia", "China", "India", "Indonesia", "Japan", "Laos",
      "Malaysia", "Mongolia", "Myanmar", "Nepal", "Philippines", "South Korea",
      "Sri Lanka", "Taiwan", "Thailand", "Vietnam",
    ],
  },
  {
    label: "Australasia",
    slug: "australasia",
    countries: ["Australia", "New Zealand", "Papua New Guinea"],
  },
  {
    label: "Caribbean",
    slug: "caribbean",
    countries: ["Cuba", "Dominican Republic", "Guadeloupe", "Jamaica", "Martinique"],
  },
  {
    label: "Central America",
    slug: "central-america",
    countries: ["Belize", "Costa Rica", "El Salvador", "Guatemala", "Honduras", "Mexico", "Nicaragua", "Panama"],
  },
  {
    label: "Middle East",
    slug: "middle-east",
    countries: ["Iran", "Israel", "Jordan", "Lebanon", "Oman", "Saudi Arabia", "UAE"],
  },
  {
    label: "North America",
    slug: "north-america",
    countries: ["Canada", "USA"],
  },
  {
    label: "Polar",
    slug: "polar",
    countries: ["Antarctica", "Arctic", "Greenland", "Svalbard"],
  },
  {
    label: "South America",
    slug: "south-america",
    countries: [
      "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador",
      "Galapagos", "Guyana", "Patagonia", "Peru", "Suriname", "Uruguay",
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Experiences mega-menu data                                         */
/* ------------------------------------------------------------------ */
const EXPERIENCE_CATEGORIES = [
  {
    label: "Classic Discovery",
    slug: "classic-discovery",
    tripTypes: [
      "Classic Discovery tours", "Explore Upgraded tours", "Festival tours",
      "Food & drink tours", "Wildlife holidays", "Rail journeys",
      "Boat journeys", "Eclipse trips", "Activity holidays",
    ],
    topDestinations: ["Jordan", "Vietnam", "India", "Peru", "Japan", "Morocco", "Costa Rica", "Cuba"],
  },
  {
    label: "Walking & Trekking",
    slug: "walking-and-trekking",
    tripTypes: [
      "Easy walks", "Moderate walks", "Challenging treks",
      "Mountain treks", "Coastal walks", "Multi-country walks",
    ],
    topDestinations: ["Nepal", "Peru", "Italy", "Spain", "Portugal", "Greece"],
  },
  {
    label: "Cycling Holidays",
    slug: "cycling-holidays",
    tripTypes: [
      "Easy cycling", "Moderate cycling", "Challenging cycling",
      "E-bike tours", "Road cycling", "Mountain biking",
    ],
    topDestinations: ["France", "Italy", "Vietnam", "Cuba", "Sri Lanka", "Croatia"],
  },
  {
    label: "Wildlife",
    slug: "wildlife",
    tripTypes: [
      "Safari holidays", "Whale watching", "Bird watching",
      "Gorilla trekking", "Bear watching", "Marine wildlife",
    ],
    topDestinations: ["Tanzania", "Kenya", "Botswana", "South Africa", "Rwanda", "Costa Rica"],
  },
  {
    label: "Family Adventures",
    slug: "family-adventures",
    tripTypes: [
      "Family discovery", "Family wildlife", "Family walking",
      "Family cycling", "Teen adventures",
    ],
    topDestinations: ["Morocco", "Sri Lanka", "Costa Rica", "Iceland", "Italy"],
  },
  {
    label: "Explore Upgraded",
    slug: "explore-upgraded",
    tripTypes: [
      "Premium accommodation", "Private transfers", "Exclusive experiences",
      "Fine dining", "Boutique hotels",
    ],
    topDestinations: ["Japan", "Italy", "Peru", "India", "Vietnam"],
  },
  { label: "Solo", slug: "solo" },
  { label: "Polar", slug: "polar" },
  { label: "Food & Drink", slug: "food-and-drink" },
  { label: "Trip Types", slug: "trip-types" },
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
interface MegaMenuProps {
  type: "destinations" | "experiences"
  onClose: () => void
}

export function MegaMenu({ type, onClose }: MegaMenuProps) {
  const items = type === "destinations" ? DESTINATION_REGIONS : EXPERIENCE_CATEGORIES
  const [activeIdx, setActiveIdx] = useState(0)
  const active = items[activeIdx]

  return (
    <div
      className="absolute left-0 top-full z-40 w-full border-t border-white/10 bg-white shadow-xl"
      onMouseLeave={onClose}
    >
      {/* Sub-nav tabs -- red bar with category pills */}
      <div className="bg-primary">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2">
          {items.map((item, i) => (
            <button
              key={item.slug}
              onMouseEnter={() => setActiveIdx(i)}
              onClick={() => {
                onClose()
              }}
              className={`whitespace-nowrap rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                i === activeIdx
                  ? "bg-white/20 text-white underline underline-offset-4"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Link
                href={type === "destinations" ? `/destinations/${item.slug}` : `/experiences/${item.slug}`}
                onClick={onClose}
              >
                {item.label}
              </Link>
            </button>
          ))}
        </div>
      </div>

      {/* Panel content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {type === "destinations" && "countries" in active && (
          <div className="flex gap-12">
            {/* Countries grid */}
            <div className="flex-1">
              <h3 className="mb-3 text-sm font-bold text-foreground">Countries</h3>
              <div className="columns-4 gap-x-8">
                {(active as typeof DESTINATION_REGIONS[0]).countries.map((c) => (
                  <Link
                    key={c}
                    href={`/destinations/${active.slug}`}
                    onClick={onClose}
                    className="mb-1.5 block text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {c} tours
                  </Link>
                ))}
              </div>
              <Link
                href={`/destinations/${active.slug}`}
                onClick={onClose}
                className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
              >
                View all {active.label} tours &raquo;
              </Link>
            </div>

            {/* Regions of interest (only for regions that have them) */}
            {"regionsOfInterest" in active && (active as typeof DESTINATION_REGIONS[0]).regionsOfInterest && (
              <div className="w-56 shrink-0">
                <h3 className="mb-3 text-sm font-bold text-foreground">Regions of interest</h3>
                {(active as typeof DESTINATION_REGIONS[0]).regionsOfInterest!.map((r) => (
                  <Link
                    key={r}
                    href={`/destinations/${active.slug}`}
                    onClick={onClose}
                    className="mb-1.5 block text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {r} tours
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {type === "experiences" && (
          <div className="flex gap-12">
            {"tripTypes" in active && (active as typeof EXPERIENCE_CATEGORIES[0]).tripTypes && (
              <div className="flex-1">
                <h3 className="mb-3 text-sm font-bold text-foreground">Trip Types</h3>
                <div className="columns-2 gap-x-8">
                  {(active as typeof EXPERIENCE_CATEGORIES[0]).tripTypes!.map((t) => (
                    <Link
                      key={t}
                      href={`/experiences/${active.slug}`}
                      onClick={onClose}
                      className="mb-1.5 block text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/experiences/${active.slug}`}
                  onClick={onClose}
                  className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  View all {active.label} &raquo;
                </Link>
              </div>
            )}

            {"topDestinations" in active && (active as typeof EXPERIENCE_CATEGORIES[0]).topDestinations && (
              <div className="w-48 shrink-0">
                <h3 className="mb-3 text-sm font-bold text-foreground">
                  Top {active.label} Destinations
                </h3>
                {(active as typeof EXPERIENCE_CATEGORIES[0]).topDestinations!.map((d) => (
                  <Link
                    key={d}
                    href={`/experiences/${active.slug}`}
                    onClick={onClose}
                    className="mb-1.5 block text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {d} tours
                  </Link>
                ))}
              </div>
            )}

            {!("tripTypes" in active) && (
              <div className="py-4 text-center text-sm text-muted-foreground">
                <Link
                  href={`/experiences/${active.slug}`}
                  onClick={onClose}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  View all {active.label} trips &raquo;
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
