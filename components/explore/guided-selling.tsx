"use client"

import { useState, useCallback } from "react"
import { Compass, Footprints, Bike, Ship, Camera, MapPin, ArrowLeft, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Types & Data                                                              */
/* -------------------------------------------------------------------------- */

interface GuidedSellingResult {
  tripTypes: string[]
  destinations: string[]
  durationRange: string
  budgetRange: string
  physicalRating: number
}

interface GuidedSellingProps {
  greeting: string
  onComplete: (result: GuidedSellingResult) => void
}

const TRIP_TYPES = [
  { id: "Discovery", label: "Discovery", icon: Compass, description: "Culture, sightseeing & local experiences" },
  { id: "Walking", label: "Walking", icon: Footprints, description: "Trails, treks & coastal paths" },
  { id: "Cycling", label: "Cycling", icon: Bike, description: "Ride through stunning landscapes" },
  { id: "Boat", label: "Boat", icon: Ship, description: "Rivers, coasts & island hopping" },
  { id: "Wildlife", label: "Wildlife", icon: Camera, description: "Safari, nature & animal encounters" },
]

const DESTINATIONS = [
  { id: "Europe", label: "Europe", emoji: "EU" },
  { id: "Asia", label: "Asia", emoji: "AS" },
  { id: "Africa", label: "Africa", emoji: "AF" },
  { id: "Americas", label: "Americas", emoji: "AM" },
  { id: "Middle East", label: "Middle East", emoji: "ME" },
  { id: "Polar", label: "Polar", emoji: "PO" },
]

const DURATIONS = [
  { id: "short", label: "Up to 8 days", description: "A quick getaway", range: "1-8" },
  { id: "medium", label: "9-14 days", description: "The perfect length", range: "9-14" },
  { id: "long", label: "15+ days", description: "A deep dive", range: "15-30" },
]

const BUDGETS = [
  { id: "under-2000", label: "Under \u00A32,000", description: "Great value trips" },
  { id: "2000-3500", label: "\u00A32,000 - \u00A33,500", description: "Mid-range adventures" },
  { id: "3500-5000", label: "\u00A33,500 - \u00A35,000", description: "Premium experiences" },
  { id: "5000-plus", label: "\u00A35,000+", description: "Ultimate journeys" },
]

const ACTIVITY_LEVELS = [
  { id: 1, label: "Relaxed", description: "Easy-going, minimal walking" },
  { id: 2, label: "Moderate", description: "Some walking, comfortable pace" },
  { id: 3, label: "Active", description: "Regular activity, good fitness" },
  { id: 4, label: "Challenging", description: "Demanding, strong fitness needed" },
  { id: 5, label: "Extreme", description: "Very demanding, high fitness required" },
]

const STEPS = [
  { title: "Trip type", question: "What kind of experience interests you?" },
  { title: "Destination", question: "Where in the world would you like to go?" },
  { title: "Duration", question: "How long do you want to travel?" },
  { title: "Budget", question: "What is your budget per person?" },
  { title: "Activity", question: "How active do you want to be?" },
]

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function GuidedSellingFlow({ greeting, onComplete }: GuidedSellingProps) {
  const [step, setStep] = useState(0)
  const [tripTypes, setTripTypes] = useState<string[]>([])
  const [destinations, setDestinations] = useState<string[]>([])
  const [durationRange, setDurationRange] = useState("")
  const [budgetRange, setBudgetRange] = useState("")
  const [physicalRating, setPhysicalRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const toggleSelection = useCallback(
    (list: string[], setList: (v: string[]) => void, id: string) => {
      setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
    },
    []
  )

  const canAdvance =
    (step === 0 && tripTypes.length > 0) ||
    (step === 1 && destinations.length > 0) ||
    (step === 2 && durationRange !== "") ||
    (step === 3 && budgetRange !== "") ||
    (step === 4 && physicalRating > 0)

  const handleNext = useCallback(() => {
    if (step < 4) {
      setStep((s) => s + 1)
    } else {
      setSubmitted(true)
      onComplete({
        tripTypes,
        destinations,
        durationRange,
        budgetRange,
        physicalRating,
      })
    }
  }, [step, tripTypes, destinations, durationRange, budgetRange, physicalRating, onComplete])

  if (submitted) {
    return (
      <Card className="overflow-hidden border-border bg-card">
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">
            Searching for your perfect trip...
          </h4>
          <p className="text-xs text-muted-foreground">
            Finding the best matches based on your preferences
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-border bg-card">
      {/* Header */}
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <p className="mb-2 text-xs text-muted-foreground">{greeting}</p>
        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i < step
                  ? "bg-primary"
                  : i === step
                  ? "bg-primary/60"
                  : "bg-border"
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>

      <CardContent className="p-4">
        <h4 className="mb-3 text-sm font-semibold text-foreground">
          {STEPS[step].question}
        </h4>

        {/* Step 0: Trip types */}
        {step === 0 && (
          <div className="grid grid-cols-1 gap-2">
            {TRIP_TYPES.map((type) => {
              const Icon = type.icon
              const selected = tripTypes.includes(type.id)
              return (
                <button
                  key={type.id}
                  onClick={() => toggleSelection(tripTypes, setTripTypes, type.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                      selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-foreground">{type.label}</span>
                    <span className="block text-[10px] text-muted-foreground">{type.description}</span>
                  </div>
                  {selected && <Check className="ml-auto h-4 w-4 shrink-0 text-primary" />}
                </button>
              )
            })}
          </div>
        )}

        {/* Step 1: Destinations */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-2">
            {DESTINATIONS.map((dest) => {
              const selected = destinations.includes(dest.id)
              return (
                <button
                  key={dest.id}
                  onClick={() => toggleSelection(destinations, setDestinations, dest.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-3 text-left transition-all",
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  )}
                >
                  <MapPin
                    className={cn(
                      "h-4 w-4 shrink-0",
                      selected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span className="text-xs font-medium text-foreground">{dest.label}</span>
                  {selected && <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-primary" />}
                </button>
              )
            })}
          </div>
        )}

        {/* Step 2: Duration */}
        {step === 2 && (
          <div className="grid grid-cols-1 gap-2">
            {DURATIONS.map((dur) => {
              const selected = durationRange === dur.range
              return (
                <button
                  key={dur.id}
                  onClick={() => setDurationRange(dur.range)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3 text-left transition-all",
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  )}
                >
                  <div>
                    <span className="text-xs font-medium text-foreground">{dur.label}</span>
                    <span className="block text-[10px] text-muted-foreground">{dur.description}</span>
                  </div>
                  {selected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </button>
              )
            })}
          </div>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <div className="grid grid-cols-1 gap-2">
            {BUDGETS.map((bud) => {
              const selected = budgetRange === bud.id
              return (
                <button
                  key={bud.id}
                  onClick={() => setBudgetRange(bud.id)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3 text-left transition-all",
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  )}
                >
                  <div>
                    <span className="text-xs font-medium text-foreground">{bud.label}</span>
                    <span className="block text-[10px] text-muted-foreground">{bud.description}</span>
                  </div>
                  {selected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </button>
              )
            })}
          </div>
        )}

        {/* Step 4: Activity level */}
        {step === 4 && (
          <div className="grid grid-cols-1 gap-2">
            {ACTIVITY_LEVELS.map((level) => {
              const selected = physicalRating === level.id
              return (
                <button
                  key={level.id}
                  onClick={() => setPhysicalRating(level.id)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3 text-left transition-all",
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-2 w-2 rounded-full",
                            i < level.id ? "bg-primary" : "bg-border"
                          )}
                        />
                      ))}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-foreground">{level.label}</span>
                      <span className="block text-[10px] text-muted-foreground">{level.description}</span>
                    </div>
                  </div>
                  {selected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </button>
              )
            })}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-4 flex items-center gap-2">
          {step > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              className="text-xs"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back
            </Button>
          )}
          <Button
            size="sm"
            className="ml-auto bg-primary text-xs text-primary-foreground hover:bg-hover"
            disabled={!canAdvance}
            onClick={handleNext}
          >
            {step === 4 ? "Find my trips" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
