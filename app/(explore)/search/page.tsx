"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { TOURS } from "@/lib/tour-data"
import { TripCard } from "@/components/explore/trip-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ALL_TOURS = Object.values(TOURS)

const REGIONS = [...new Set(ALL_TOURS.map((t) => t.destination))].sort()
const TRIP_TYPES = [...new Set(ALL_TOURS.map((t) => t.tripType))].sort()

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [maxBudget, setMaxBudget] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const toggleFilter = (list: string[], item: string, setter: (v: string[]) => void) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
  }

  const results = useMemo(() => {
    return ALL_TOURS.filter((tour) => {
      if (query) {
        const q = query.toLowerCase()
        const match =
          tour.title.toLowerCase().includes(q) ||
          tour.destination.toLowerCase().includes(q) ||
          tour.country.toLowerCase().includes(q) ||
          tour.tripType.toLowerCase().includes(q) ||
          tour.tripCode.toLowerCase().includes(q)
        if (!match) return false
      }
      if (selectedRegions.length > 0 && !selectedRegions.includes(tour.destination)) return false
      if (selectedTypes.length > 0 && !selectedTypes.includes(tour.tripType)) return false
      if (maxBudget && tour.price > maxBudget) return false
      return true
    })
  }, [query, selectedRegions, selectedTypes, maxBudget])

  const activeFilterCount = selectedRegions.length + selectedTypes.length + (maxBudget ? 1 : 0)

  const clearFilters = () => {
    setSelectedRegions([])
    setSelectedTypes([])
    setMaxBudget(null)
    setQuery("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Search hero */}
      <section className="bg-primary py-10 lg:py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="mb-4 font-heading text-3xl font-bold text-primary-foreground lg:text-4xl">
            Find your perfect trip
          </h1>
          <p className="mb-6 text-sm text-primary-foreground/80">
            Search across all our tours by destination, experience type, or keyword
          </p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by destination, tour name, or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 rounded-xl bg-card pl-12 text-base text-foreground shadow-lg"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        {/* Filter toggle + active count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {results.length} trip{results.length !== 1 ? "s" : ""} found
          </p>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-xs text-muted-foreground">
                <X className="h-3 w-3" /> Clear filters
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1.5 text-xs"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mb-8 rounded-lg border border-border bg-card p-5">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Regions */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Destination</h3>
                <div className="flex flex-wrap gap-1.5">
                  {REGIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => toggleFilter(selectedRegions, r, setSelectedRegions)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        selectedRegions.includes(r)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trip types */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Experience type</h3>
                <div className="flex flex-wrap gap-1.5">
                  {TRIP_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleFilter(selectedTypes, t, setSelectedTypes)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        selectedTypes.includes(t)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max budget per person</h3>
                <div className="flex flex-wrap gap-1.5">
                  {[1500, 2000, 3000, 5000, null].map((b) => (
                    <button
                      key={b ?? "any"}
                      onClick={() => setMaxBudget(b)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        maxBudget === b
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {b ? `Up to \u00A3${b.toLocaleString()}` : "Any"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((tour) => (
              <TripCard
                key={tour.slug}
                trip={{
                  title: tour.title,
                  destination: tour.destination,
                  tripType: tour.tripType,
                  duration: tour.duration,
                  price: tour.price,
                  originalPrice: tour.originalPrice,
                  imageUrl: tour.imageUrl,
                  tripCode: tour.tripCode,
                  slug: tour.slug,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <Search className="mx-auto mb-4 h-10 w-10 text-muted-foreground/40" />
            <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">No trips found</h3>
            <p className="mb-4 text-sm text-muted-foreground">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}
