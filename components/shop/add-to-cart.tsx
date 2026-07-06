"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart, Check } from "lucide-react"
import { useCart } from "./cart-provider"
import type { Product } from "@/lib/shop/data"

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    add(product.slug, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center border border-border">
        <button
          type="button"
          aria-label="Menge verringern"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-12 w-12 items-center justify-center text-foreground transition-colors hover:text-primary"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-10 text-center text-base font-semibold" aria-live="polite">
          {qty}
        </span>
        <button
          type="button"
          aria-label="Menge erhöhen"
          onClick={() => setQty((q) => q + 1)}
          className="flex h-12 w-12 items-center justify-center text-foreground transition-colors hover:text-primary"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="flex h-12 flex-1 min-w-[220px] items-center justify-center gap-2 bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-hover"
      >
        {added ? (
          <>
            <Check className="h-5 w-5" /> Zum Warenkorb hinzugefügt
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" /> In den Warenkorb
          </>
        )}
      </button>
    </div>
  )
}
