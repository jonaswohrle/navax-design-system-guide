import {
  IconUnforgettableExperiences,
  IconExpertTourLeaders,
  IconSmallGroupTours,
  IconResponsibleAtHeart,
} from "./brand-icons"
import { WaveUnderline } from "./wave-underline"

interface TrustPillar {
  title: string
  description?: string
  icon?: string
  order?: number
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <IconUnforgettableExperiences className="h-16 w-16 lg:h-20 lg:w-20" />,
  Users: <IconExpertTourLeaders className="h-16 w-16 lg:h-20 lg:w-20" />,
  UserCheck: <IconSmallGroupTours className="h-16 w-16 lg:h-20 lg:w-20" />,
  Heart: <IconResponsibleAtHeart className="h-16 w-16 lg:h-20 lg:w-20" />,
}

const PILLARS: TrustPillar[] = [
  {
    title: "100% Ökostrom",
    description:
      "Unser Strom stammt zu 100% aus erneuerbaren Energiequellen. So leisten Sie einen aktiven Beitrag zur Energiewende.",
    icon: "Sparkles",
    order: 1,
  },
  {
    title: "Persönlicher Service",
    description:
      "Unser Kundenservice wurde mehrfach ausgezeichnet. Wir sind für Sie da -- telefonisch, online und in Ihrem E.ON Shop.",
    icon: "Users",
    order: 2,
  },
  {
    title: "Faire Preise",
    description:
      "Transparente Tarife mit Preisgarantie. Keine versteckten Kosten -- Sie wissen immer, was Sie bezahlen.",
    icon: "UserCheck",
    order: 3,
  },
  {
    title: "Nachhaltig handeln",
    description:
      "Bis 2040 streben wir CO2-Neutralität an. Als Unternehmen treiben wir die Energiewende aktiv voran.",
    icon: "Heart",
    order: 4,
  },
]

export function TrustStrip() {
  return (
    <section className="bg-card py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-16">
          {/* Left heading */}
          <div className="lg:col-span-1">
            <h2 className="font-heading text-3xl font-bold text-foreground lg:text-4xl text-balance">
              Ihr zuverlässiger Energiepartner
            </h2>
            <WaveUnderline className="mt-4 w-40 lg:w-52" />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground lg:text-base">
              Über 14 Millionen Kunden vertrauen E.ON. Erfahren Sie, warum wir die erste Wahl für Energie in Deutschland sind.
            </p>
          </div>

          {/* Right pillars grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {PILLARS.map((pillar) => (
                <div key={pillar.title} className="flex flex-col">
                  <div className="mb-3 text-primary">
                    {ICON_MAP[pillar.icon || "Sparkles"] ?? (
                      <IconUnforgettableExperiences className="h-16 w-16 lg:h-20 lg:w-20" />
                    )}
                  </div>
                  <h3 className="mb-2 font-heading text-base font-bold text-primary">
                    {pillar.title}
                  </h3>
                  {pillar.description && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
