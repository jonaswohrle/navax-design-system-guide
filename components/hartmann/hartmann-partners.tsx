import { Building2, Stethoscope, Pill, Home, Truck, Store, HeartPulse, Hospital, Users, UserRound, Ambulance } from "lucide-react"
import type { HartmannPartnerCategory } from "@/lib/sitecore"

interface HartmannPartnersProps {
  categories: HartmannPartnerCategory[]
}

const PARTNER_ICONS: Record<string, React.ElementType> = {
  "Ambulante medizinische Zentren": Stethoscope,
  "Ambulante Pflegedienste": HeartPulse,
  "Apotheken": Pill,
  "Arztpraxen": Building2,
  "Betriebe & Institutionen": Building2,
  "Fachhandel medical & hygiene": Store,
  "Homecare & Sanitatshauser": Home,
  "Kliniken": Hospital,
  "Pflegeheime": Users,
  "Privatanwender": UserRound,
  "Rettungsdienste": Ambulance,
}

export function HartmannPartners({ categories }: HartmannPartnersProps) {
  return (
    <section className="bg-secondary py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground lg:text-3xl text-balance">
          HARTMANN Ihr Partner im Gesundheitswesen
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat) => {
            const Icon = PARTNER_ICONS[cat.name] || Building2
            return (
              <button
                key={cat.id}
                className="flex flex-col items-center gap-2 rounded-md border border-border bg-background p-4 text-center transition-all hover:border-primary hover:shadow-md"
              >
                <Icon className="h-6 w-6 text-primary" />
                <span className="text-xs font-medium text-foreground leading-tight">{cat.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
