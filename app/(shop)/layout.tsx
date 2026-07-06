import type { Metadata } from "next"
import type { ReactNode } from "react"
import { CartProvider } from "@/components/shop/cart-provider"
import { SiteHeader } from "@/components/shop/site-header"
import { SiteFooter } from "@/components/shop/site-footer"

export const metadata: Metadata = {
  title: "ROSSMANN – Deine Online-Drogerie für alles, was dir wichtig ist",
  description:
    "Drogerie, Kosmetik, Baby, Haushalt, Gesundheit und Lebensmittel günstig online kaufen. Aktuelle Angebote, Coupons und schnelle Lieferung bei ROSSMANN.",
}

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-rossmann flex min-h-screen flex-col bg-background text-foreground">
      <CartProvider>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </CartProvider>
    </div>
  )
}
