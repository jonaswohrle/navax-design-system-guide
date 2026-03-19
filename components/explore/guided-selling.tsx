"use client"

import { useState, useCallback } from "react"
import { Zap, Flame, Sun, Car, Home, ArrowLeft, Check, Sparkles } from "lucide-react"
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

const ENERGY_TYPES = [
  { id: "Strom", label: "Strom", icon: Zap, description: "Ökostrom für Ihren Haushalt" },
  { id: "Gas", label: "Erdgas", icon: Flame, description: "Heizen & Kochen mit Gas" },
  { id: "Solar", label: "Solaranlage", icon: Sun, description: "Eigenen Strom erzeugen" },
  { id: "E-Auto", label: "E-Auto laden", icon: Car, description: "Wallbox & Autostrom-Tarife" },
  { id: "Waermepumpe", label: "Wärmepumpe", icon: Home, description: "Nachhaltig heizen" },
]

const HOUSEHOLD_SIZES = [
  { id: "1", label: "1 Person", emoji: "1P" },
  { id: "2", label: "2 Personen", emoji: "2P" },
  { id: "3", label: "3 Personen", emoji: "3P" },
  { id: "4", label: "4 Personen", emoji: "4P" },
  { id: "5", label: "5+ Personen", emoji: "5P" },
  { id: "gewerbe", label: "Gewerbe", emoji: "GW" },
]

const CONTRACT_DURATIONS = [
  { id: "flex", label: "Flexibel", description: "Monatlich kündbar", range: "flex" },
  { id: "12", label: "12 Monate", description: "Stabile Preise für 1 Jahr", range: "12" },
  { id: "24", label: "24 Monate", description: "Beste Konditionen", range: "24" },
]

const PRIORITIES = [
  { id: "guenstig", label: "Günstigster Preis", description: "Den niedrigsten Preis pro kWh" },
  { id: "oeko", label: "100% Ökostrom", description: "Erneuerbare Energie aus Wind & Solar" },
  { id: "preisgarantie", label: "Preisgarantie", description: "Feste Preise über die Laufzeit" },
  { id: "regional", label: "Regionaler Strom", description: "Energie aus Ihrer Region" },
]

const IMPORTANCE_LEVELS = [
  { id: 1, label: "Preis", description: "Der Preis ist am wichtigsten" },
  { id: 2, label: "Preis & Nachhaltigkeit", description: "Gute Balance aus Preis und Ökostrom" },
  { id: 3, label: "Nachhaltigkeit", description: "Nachhaltige Energie ist entscheidend" },
  { id: 4, label: "Service & Komfort", description: "Beste Betreuung und digitale Tools" },
  { id: 5, label: "Alles inklusive", description: "Rundum-sorglos-Paket mit allen Extras" },
]

const STEPS = [
  { title: "Energieart", question: "Welche Energie suchen Sie?" },
  { title: "Haushalt", question: "Wie groß ist Ihr Haushalt?" },
  { title: "Laufzeit", question: "Welche Vertragslaufzeit bevorzugen Sie?" },
  { title: "Priorität", question: "Was ist Ihnen besonders wichtig?" },
  { title: "Gewichtung", question: "Wie stark gewichten Sie Nachhaltigkeit?" },
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
            Ihren passenden Tarif suchen...
          </h4>
          <p className="text-xs text-muted-foreground">
            Wir finden die besten Angebote basierend auf Ihren Angaben
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
          Schritt {step + 1} von {STEPS.length}
        </p>
      </div>

      <CardContent className="p-4">
        <h4 className="mb-3 text-sm font-semibold text-foreground">
          {STEPS[step].question}
        </h4>

        {/* Step 0: Energy types */}
        {step === 0 && (
          <div className="grid grid-cols-1 gap-2">
            {ENERGY_TYPES.map((type) => {
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

        {/* Step 1: Household size */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-2">
            {HOUSEHOLD_SIZES.map((dest) => {
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
                  <Home
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

        {/* Step 2: Contract duration */}
        {step === 2 && (
          <div className="grid grid-cols-1 gap-2">
            {CONTRACT_DURATIONS.map((dur) => {
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

        {/* Step 3: Priority */}
        {step === 3 && (
          <div className="grid grid-cols-1 gap-2">
            {PRIORITIES.map((bud) => {
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

        {/* Step 4: Sustainability weighting */}
        {step === 4 && (
          <div className="grid grid-cols-1 gap-2">
            {IMPORTANCE_LEVELS.map((level) => {
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
              Zurück
            </Button>
          )}
          <Button
            size="sm"
            className="ml-auto bg-primary text-xs text-primary-foreground hover:bg-hover"
            disabled={!canAdvance}
            onClick={handleNext}
          >
            {step === 4 ? "Tarife finden" : "Weiter"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
