"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Minus, Plus, Trash2, ShoppingCart, ChevronRight, Tag, ShieldCheck } from "lucide-react"
import { useCart } from "@/components/shop/cart-provider"
import { formatPrice } from "@/lib/shop/data"

const FREE_SHIPPING = 49
const SHIPPING_COST = 4.95

export default function CartPage() {
  const { items, getProduct, setQty, remove, total, clear, count } = useCart()
  const [coupon, setCoupon] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)

  const discount = couponApplied ? total * 0.1 : 0
  const subtotal = total - discount
  const shipping = subtotal >= FREE_SHIPPING || subtotal === 0 ? 0 : SHIPPING_COST
  const grandTotal = subtotal + shipping
  const remaining = Math.max(0, FREE_SHIPPING - subtotal)

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-16 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-extrabold text-foreground">Dein Warenkorb ist leer</h1>
        <p className="mt-2 text-muted-foreground">
          Entdecke unsere Angebote und lege deine Lieblingsprodukte in den Warenkorb.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-hover"
        >
          Jetzt einkaufen
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Startseite</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Warenkorb</span>
      </nav>

      <h1 className="mb-6 text-2xl font-extrabold text-foreground sm:text-3xl">
        Warenkorb <span className="text-lg font-normal text-muted-foreground">({count} Artikel)</span>
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          {remaining > 0 && (
            <div className="mb-4 rounded-lg bg-accent p-4 text-sm text-accent-foreground">
              Noch <strong>{formatPrice(remaining)}</strong> bis zum <strong>kostenlosen Versand</strong>!
            </div>
          )}

          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {items.map((item) => {
              const p = getProduct(item.slug)
              if (!p) return null
              return (
                <li key={item.slug} className="flex gap-4 p-4">
                  <Link href={`/p/${p.slug}`} className="relative h-24 w-24 shrink-0 rounded-md border border-border">
                    <Image src={p.image || "/placeholder.svg"} alt={p.name} fill sizes="96px" className="object-contain p-1" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground">{p.brand}</p>
                        <Link href={`/p/${p.slug}`} className="text-sm font-medium text-foreground hover:text-primary">
                          {p.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">{p.unit} · {p.basePrice}</p>
                      </div>
                      <button
                        type="button"
                        aria-label="Artikel entfernen"
                        onClick={() => remove(item.slug)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          aria-label="Menge verringern"
                          onClick={() => setQty(item.slug, item.qty - 1)}
                          className="flex h-9 w-9 items-center justify-center text-foreground hover:text-primary"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                        <button
                          type="button"
                          aria-label="Menge erhöhen"
                          onClick={() => setQty(item.slug, item.qty + 1)}
                          className="flex h-9 w-9 items-center justify-center text-foreground hover:text-primary"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-foreground">
                          {formatPrice(p.price * item.qty)}
                        </span>
                        {product_oldPrice(p.oldPrice, item.qty)}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={clear}
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Warenkorb leeren
            </button>
            <Link href="/" className="text-sm font-semibold text-primary hover:text-hover">
              Weiter einkaufen
            </Link>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-1">
          <div className="sticky top-40 rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-lg font-bold text-foreground">Zusammenfassung</h2>

            {/* Coupon */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-foreground">Gutscheincode</label>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="z.B. ROSSMANN10"
                  className="h-10 flex-1 rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setCouponApplied(coupon.trim().length > 0)}
                  className="flex h-10 items-center gap-1 rounded-md bg-foreground px-3 text-sm font-semibold text-card hover:opacity-90"
                >
                  <Tag className="h-4 w-4" /> Einlösen
                </button>
              </div>
              {couponApplied && (
                <p className="mt-1 text-xs font-medium text-success">10% Rabatt angewendet!</p>
              )}
            </div>

            <dl className="space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Zwischensumme</dt>
                <dd className="font-medium text-foreground">{formatPrice(total)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <dt>Rabatt (10%)</dt>
                  <dd className="font-medium">-{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Versand</dt>
                <dd className="font-medium text-foreground">
                  {shipping === 0 ? "Kostenlos" : formatPrice(shipping)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
              <span className="text-base font-bold text-foreground">Gesamt</span>
              <span className="text-2xl font-extrabold text-primary">{formatPrice(grandTotal)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">inkl. MwSt.</p>

            <button
              type="button"
              className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-hover"
            >
              Zur Kasse
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-success" /> Sicher & SSL-verschlüsselt bezahlen
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function product_oldPrice(oldPrice: number | undefined, qty: number) {
  if (!oldPrice) return null
  return (
    <p className="text-xs text-muted-foreground line-through">{formatPrice(oldPrice * qty)}</p>
  )
}
