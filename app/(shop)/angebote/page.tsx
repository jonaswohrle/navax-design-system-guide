import Link from "next/link"
import type { Metadata } from "next"
import { ChevronRight } from "lucide-react"
import { getOffers } from "@/lib/shop/data"
import { ProductGrid } from "@/components/shop/product-grid"

export const metadata: Metadata = {
  title: "Aktuelle Angebote & Prospekt | ROSSMANN",
  description: "Entdecke die aktuellen ROSSMANN Angebote der Woche und spare bei deinen Lieblingsprodukten.",
}

export default function OffersPage() {
  const offers = getOffers()

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Startseite</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Angebote</span>
      </nav>

      <div className="mb-6 rounded-xl bg-primary p-6 text-primary-foreground sm:p-8">
        <span className="text-sm font-bold uppercase tracking-wide">Nur für kurze Zeit</span>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Aktuelle Angebote der Woche</h1>
        <p className="mt-1 max-w-xl text-sm opacity-90">
          Jede Woche neue Spitzen-Angebote: Sichere dir jetzt deine Lieblingsprodukte zum kleinen Preis.
        </p>
      </div>

      <ProductGrid products={offers} />
    </div>
  )
}
