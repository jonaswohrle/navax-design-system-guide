"use client"

import { useRouter } from "next/navigation"
import { X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

const REGION_LABELS: Record<string, string> = {
  europe: "Europe",
  asia: "Asia",
  africa: "Africa",
  "south-america": "South America",
  "central-america": "Central America",
  "middle-east": "Middle East",
  polar: "Polar Regions",
  "north-america": "North America",
  caribbean: "Caribbean",
  australasia: "Australasia",
}

const TYPE_LABELS: Record<string, string> = {
  discovery: "Discovery",
  walking: "Walking & Trekking",
  cycling: "Cycling",
  wildlife: "Wildlife",
  family: "Family",
  polar: "Polar",
  boat: "Boat Journeys",
  upgraded: "Explore Upgraded",
}

interface DestinationFiltersProps {
  region: string | null
  type: string | null
  date: string | null
  resultCount: number
}

export function DestinationFilters({
  region,
  type,
  date,
  resultCount,
}: DestinationFiltersProps) {
  const router = useRouter()

  function removeFilter(key: string) {
    const params = new URLSearchParams()
    if (key !== "region" && region) params.set("region", region)
    if (key !== "type" && type) params.set("type", type)
    if (key !== "date" && date) params.set("date", date)
    const qs = params.toString()
    router.push(`/destinations${qs ? `?${qs}` : ""}`)
  }

  function clearAll() {
    router.push("/destinations")
  }

  const filters: { key: string; label: string }[] = []
  if (region) filters.push({ key: "region", label: REGION_LABELS[region] || region })
  if (type) filters.push({ key: "type", label: TYPE_LABELS[type] || type })
  if (date) filters.push({ key: "date", label: date.replace("-", " ") })

  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {filters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
            >
              {f.label}
              <button
                onClick={() => removeFilter(f.key)}
                className="rounded-full p-0.5 transition-colors hover:bg-primary/20"
                aria-label={`Remove ${f.label} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <span className="text-sm text-muted-foreground">
            {resultCount > 0
              ? `${resultCount} trip${resultCount !== 1 ? "s" : ""} found`
              : "No exact matches -- showing all trips"}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs text-muted-foreground">
          Clear all
        </Button>
      </div>
    </section>
  )
}
