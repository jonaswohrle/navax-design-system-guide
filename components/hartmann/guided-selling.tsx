"use client"

import { useState, useCallback } from "react"
import { Stethoscope, Building2, ShieldCheck, Bandage, ArrowLeft, Check, Sparkles, Droplets, Hospital, Home, Pill, Scissors, HeartPulse, Users, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Types & Data                                                              */
/* -------------------------------------------------------------------------- */

interface GuidedSellingResult {
  categories: string[]
  setting: string
  needs: string[]
  patientGroup: string
  priority: string
}

interface GuidedSellingProps {
  greeting: string
  onComplete: (result: GuidedSellingResult) => void
}

const CATEGORIES = [
  { id: "Wundversorgung", label: "Wundversorgung", icon: Bandage, description: "Wundauflagen, Verbandmittel & Wundmanagement" },
  { id: "Inkontinenz", label: "Inkontinenzversorgung", icon: Droplets, description: "Einlagen, Pants & Schutzprodukte" },
  { id: "Desinfektion", label: "Desinfektion & Hygiene", icon: ShieldCheck, description: "H\u00E4nde-, Haut- & Fl\u00E4chendesinfektion" },
  { id: "OP", label: "OP-Versorgung", icon: Scissors, description: "Abdeckungen, Schutzkleidung & Zubeh\u00F6r" },
]

const SETTINGS = [
  { id: "klinik", label: "Klinik / Krankenhaus", icon: Hospital, description: "Station\u00E4re Akutversorgung" },
  { id: "pflege", label: "Pflegeheim / Senioreneinrichtung", icon: Building2, description: "Station\u00E4re Langzeitpflege" },
  { id: "ambulant", label: "Ambulante Pflege / Homecare", icon: Home, description: "H\u00E4usliche Versorgung" },
  { id: "praxis", label: "Arztpraxis / MVZ", icon: Stethoscope, description: "Ambulante medizinische Versorgung" },
  { id: "apotheke", label: "Apotheke / Fachhandel", icon: Pill, description: "Einzelhandel & Beratung" },
  { id: "privat", label: "Privatanwender", icon: HeartPulse, description: "Versorgung zu Hause" },
]

const NEEDS = [
  { id: "chronisch", label: "Chronische Wunden", description: "Dekubitus, Ulcus cruris, diabet. Fu\u00DF" },
  { id: "akut", label: "Akute Wunden", description: "Postoperativ, Verbrennungen, Traumata" },
  { id: "leicht", label: "Leichte Inkontinenz", description: "Tropfen- bis leichte Blasenschw\u00E4che" },
  { id: "schwer", label: "Mittlere bis schwere Inkontinenz", description: "Zuverl\u00E4ssiger Schutz Tag & Nacht" },
  { id: "haende", label: "H\u00E4ndedesinfektion", description: "Hygienische & chirurgische Desinfektion" },
  { id: "flaechen", label: "Fl\u00E4chendesinfektion", description: "Oberfl\u00E4chen, Ger\u00E4te & Instrumente" },
  { id: "op-abdeckung", label: "OP-Abdeckung & Schutz", description: "Sterile Abdeckungen & Schutzkleidung" },
  { id: "fixierung", label: "Fixierung & Verb\u00E4nde", description: "Binden, Pflaster & Fixiermaterial" },
]

const PATIENT_GROUPS = [
  { id: "erwachsene", label: "Erwachsene", icon: Users },
  { id: "senioren", label: "Senioren (65+)", icon: Users },
  { id: "kinder", label: "Kinder & Jugendliche", icon: Users },
  { id: "alle", label: "Alle Altersgruppen", icon: Users },
]

const PRIORITIES = [
  { id: "wirksamkeit", label: "Wirksamkeit & klinische Evidenz", description: "H\u00F6chste medizinische Standards" },
  { id: "komfort", label: "Tragekomfort & Hautfreundlichkeit", description: "Sanfte, hautschonende Materialien" },
  { id: "nachhaltigkeit", label: "Nachhaltigkeit & Umwelt", description: "Ressourcenschonende Produkte" },
  { id: "wirtschaftlichkeit", label: "Wirtschaftlichkeit", description: "Optimales Preis-Leistungs-Verh\u00E4ltnis" },
  { id: "einfachheit", label: "Einfache Anwendung", description: "Intuitive Handhabung & Zeitersparnis" },
]

const STEPS = [
  { title: "Kategorie", question: "Welcher Produktbereich interessiert Sie?" },
  { title: "Einsatzort", question: "In welchem Umfeld werden die Produkte eingesetzt?" },
  { title: "Bedarf", question: "Welche konkreten Bedarfe m\u00F6chten Sie abdecken?" },
  { title: "Patienten", question: "F\u00FCr welche Patientengruppe suchen Sie?" },
  { title: "Priorit\u00E4t", question: "Was ist Ihnen bei der Produktwahl am wichtigsten?" },
]

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function HartmannGuidedSelling({ greeting, onComplete }: GuidedSellingProps) {
  const [step, setStep] = useState(0)
  const [categories, setCategories] = useState<string[]>([])
  const [setting, setSetting] = useState("")
  const [needs, setNeeds] = useState<string[]>([])
  const [patientGroup, setPatientGroup] = useState("")
  const [priority, setPriority] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const toggleMulti = useCallback(
    (list: string[], setList: (v: string[]) => void, id: string) => {
      setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
    },
    []
  )

  const canAdvance =
    (step === 0 && categories.length > 0) ||
    (step === 1 && setting !== "") ||
    (step === 2 && needs.length > 0) ||
    (step === 3 && patientGroup !== "") ||
    (step === 4 && priority !== "")

  const handleNext = useCallback(() => {
    if (step < 4) {
      setStep((s) => s + 1)
    } else {
      setSubmitted(true)
      onComplete({ categories, setting, needs, patientGroup, priority })
    }
  }, [step, categories, setting, needs, patientGroup, priority, onComplete])

  if (submitted) {
    return (
      <Card className="overflow-hidden border-border bg-card">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">
            Ihre Produktempfehlungen werden erstellt...
          </h4>
          <p className="text-xs text-muted-foreground">
            Basierend auf Ihren Angaben finden wir die optimalen HARTMANN Produkte
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-border bg-card">
      {/* Header with progress */}
      <div className="border-b border-border bg-primary/5 px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
            <Stethoscope className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">HARTMANN Produktberater</p>
            <p className="text-[10px] text-muted-foreground">{greeting}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s.title} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={cn(
                  "h-1.5 w-full rounded-full transition-all duration-300",
                  i < step ? "bg-primary" : i === step ? "bg-primary/60" : "bg-border"
                )}
              />
              <span className={cn(
                "text-[9px] hidden sm:block",
                i <= step ? "text-primary font-medium" : "text-muted-foreground"
              )}>{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      <CardContent className="p-5">
        <h4 className="mb-4 text-sm font-semibold text-foreground">
          {STEPS[step].question}
        </h4>

        {/* Step 0: Categories (multi-select) */}
        {step === 0 && (
          <div className="grid grid-cols-1 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const selected = categories.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleMulti(categories, setCategories, cat.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-medium text-foreground">{cat.label}</span>
                    <span className="block text-[10px] text-muted-foreground">{cat.description}</span>
                  </div>
                  {selected && <Check className="ml-auto h-4 w-4 shrink-0 text-primary" />}
                </button>
              )
            })}
          </div>
        )}

        {/* Step 1: Setting (single select) */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-2">
            {SETTINGS.map((s) => {
              const Icon = s.icon
              const selected = setting === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setSetting(s.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-all",
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-medium text-foreground leading-tight">{s.label}</span>
                  {selected && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              )
            })}
          </div>
        )}

        {/* Step 2: Needs (multi-select, filtered by category) */}
        {step === 2 && (
          <div className="grid grid-cols-1 gap-2">
            {NEEDS.map((need) => {
              const selected = needs.includes(need.id)
              return (
                <button
                  key={need.id}
                  onClick={() => toggleMulti(needs, setNeeds, need.id)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3 text-left transition-all",
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <div>
                    <span className="text-xs font-medium text-foreground">{need.label}</span>
                    <span className="block text-[10px] text-muted-foreground">{need.description}</span>
                  </div>
                  {selected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </button>
              )
            })}
          </div>
        )}

        {/* Step 3: Patient Group */}
        {step === 3 && (
          <div className="grid grid-cols-2 gap-2">
            {PATIENT_GROUPS.map((pg) => {
              const selected = patientGroup === pg.id
              return (
                <button
                  key={pg.id}
                  onClick={() => setPatientGroup(pg.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-3 text-left transition-all",
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <Users className={cn("h-4 w-4 shrink-0", selected ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-xs font-medium text-foreground">{pg.label}</span>
                  {selected && <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-primary" />}
                </button>
              )
            })}
          </div>
        )}

        {/* Step 4: Priority */}
        {step === 4 && (
          <div className="grid grid-cols-1 gap-2">
            {PRIORITIES.map((p) => {
              const selected = priority === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setPriority(p.id)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-3 text-left transition-all",
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <div>
                    <span className="text-xs font-medium text-foreground">{p.label}</span>
                    <span className="block text-[10px] text-muted-foreground">{p.description}</span>
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
              {"Zur\u00FCck"}
            </Button>
          )}
          <Button
            size="sm"
            className="ml-auto bg-primary text-xs text-primary-foreground hover:bg-hover"
            disabled={!canAdvance}
            onClick={handleNext}
          >
            {step === 4 ? (
              <>
                Produkte finden
                <Sparkles className="ml-1 h-3 w-3" />
              </>
            ) : (
              <>
                Weiter
                <ChevronRight className="ml-1 h-3 w-3" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
