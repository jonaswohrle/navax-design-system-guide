import { Sparkles, Users, UserCheck, Heart } from "lucide-react"
import type { TrustPillarFields } from "@/lib/contentful"

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-8 w-8" />,
  Users: <Users className="h-8 w-8" />,
  UserCheck: <UserCheck className="h-8 w-8" />,
  Heart: <Heart className="h-8 w-8" />,
}

const FALLBACK_PILLARS: TrustPillarFields[] = [
  {
    title: "Unforgettable experiences",
    description: "From big wows to hidden gems, our tours leave you feeling that you've really explored.",
    icon: "Sparkles",
    order: 1,
  },
  {
    title: "Expert tour leaders",
    description: "Chosen for their great knowledge of your destination and a passion to make your trip extraordinary.",
    icon: "Users",
    order: 2,
  },
  {
    title: "Small group tours",
    description: "Average groups of 11; solos, couples and friends, united by a desire for authentic experiences.",
    icon: "UserCheck",
    order: 3,
  },
  {
    title: "Responsible at heart",
    description: "How we operate sets us apart; our flexible booking policy, our loyalty scheme and sustainable approach.",
    icon: "Heart",
    order: 4,
  },
]

interface TrustStripProps {
  pillars?: TrustPillarFields[]
}

export function TrustStrip({ pillars }: TrustStripProps) {
  const items = pillars && pillars.length > 0 ? pillars : FALLBACK_PILLARS

  return (
    <section className="bg-secondary py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <p className="mb-10 text-center text-base text-muted-foreground lg:text-lg">
          {"There's a reason why 98% of customers say they'd book an adventure with us again."}
        </p>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((pillar) => (
            <div key={pillar.title} className="text-center">
              <div className="mb-3 flex justify-center text-primary">
                {ICON_MAP[pillar.icon || "Sparkles"] ?? <Sparkles className="h-8 w-8" />}
              </div>
              <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
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
    </section>
  )
}
