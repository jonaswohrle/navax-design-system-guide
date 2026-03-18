"use client"

import { useState } from "react"
import { ChevronDown, UtensilsCrossed, Hotel } from "lucide-react"
import type { TourItineraryDay } from "@/lib/tour-data"

interface TourItineraryProps {
  days: TourItineraryDay[]
}

export function TourItinerary({ days }: TourItineraryProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(0)

  return (
    <div>
      <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Itinerary</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        {"A day-by-day breakdown of what to expect on this trip. Itineraries are provided as a guide only and may be subject to change."}
      </p>

      <div className="space-y-0">
        {days.map((day, idx) => {
          const isOpen = expandedDay === idx
          return (
            <div key={day.day} className="border-b border-border last:border-b-0">
              <button
                onClick={() => setExpandedDay(isOpen ? null : idx)}
                className="flex w-full items-center gap-4 px-0 py-4 text-left transition-colors hover:bg-muted/30"
                aria-expanded={isOpen}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {day.day}
                </span>
                <span className="flex-1 text-sm font-semibold text-foreground">
                  {day.title}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="pb-4 pl-12">
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                    {day.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {day.meals && (
                      <span className="flex items-center gap-1">
                        <UtensilsCrossed className="h-3.5 w-3.5 text-primary" />
                        {day.meals}
                      </span>
                    )}
                    {day.accommodation && (
                      <span className="flex items-center gap-1">
                        <Hotel className="h-3.5 w-3.5 text-primary" />
                        {day.accommodation}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
