import type { Metadata } from "next"
import Link from "next/link"
import { Tag, Gift, Percent, ArrowRight, Zap, Home } from "lucide-react"

export const metadata: Metadata = {
  title: "Angebote & Aktionen | E.ON Energie",
  description:
    "Sparen Sie mit unseren aktuellen Angeboten und Aktionen. E.ON Plus, Neukundenrabatte, Treueboni und mehr.",
}

const ICON_MAP: Record<string, React.ReactNode> = {
  "E.ON Plus Vorteil": <Gift className="h-8 w-8" />,
  "Neukundenbonus": <Zap className="h-8 w-8" />,
  "Treuerabatt": <Percent className="h-8 w-8" />,
  "Strom + Gas Kombi": <Home className="h-8 w-8" />,
  "Freunde werben": <ArrowRight className="h-8 w-8" />,
}

const OFFERS = [
  { title: "E.ON Plus Vorteil", description: "Bündeln Sie mehrere Energieverträge und sparen Sie bis zu 200 EUR pro Jahr. Je mehr Verträge, desto größer Ihr Vorteil.", discountText: "Bis zu 200 EUR/Jahr", linkUrl: "/about-us", order: 1 },
  { title: "Neukundenbonus", description: "Als Neukunde erhalten Sie einen attraktiven Sofortbonus auf Ihren ersten Strom- oder Gastarif bei E.ON.", discountText: "Sofortbonus sichern", linkUrl: "/destinations", order: 2 },
  { title: "Treuerabatt", description: "Langjährige Kunden profitieren von exklusiven Treuerabatten und Sonderkonditionen auf alle Tarife.", discountText: "Exklusive Rabatte", linkUrl: "/about-us", order: 3 },
  { title: "Strom + Gas Kombi", description: "Beziehen Sie Strom und Gas von E.ON und sichern Sie sich einen dauerhaften Kombirabatt auf beide Verträge.", discountText: "Dauerhaft sparen", linkUrl: "/destinations", order: 4 },
  { title: "Freunde werben", description: "Empfehlen Sie E.ON weiter und erhalten Sie für jeden geworbenen Neukunden eine Prämie von 50 EUR.", discountText: "50 EUR Prämie", linkUrl: "/destinations", order: 5 },
]

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="bg-secondary py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-4 font-heading text-4xl font-bold text-foreground lg:text-5xl">
            Angebote & Aktionen
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            {"Entdecken Sie unsere aktuellen Angebote und sichern Sie sich attraktive Rabatte auf Strom, Gas und weitere Energieprodukte."}
          </p>
        </div>
      </section>

      {/* Offer cards */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {OFFERS.map((offer) => (
              <Link
                key={offer.title}
                href={offer.linkUrl || "/offers"}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {ICON_MAP[offer.title] ?? <Tag className="h-8 w-8" />}
                </div>
                {offer.discountText && (
                  <span className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                    {offer.discountText}
                  </span>
                )}
                <h3 className="mb-2 font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                  {offer.title}
                </h3>
                {offer.description && (
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {offer.description}
                  </p>
                )}
                <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                  {"Mehr erfahren"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
