"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Plus, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { type Product } from "@/lib/shop/data"
import { useCart } from "./cart-provider"

const badgeStyles: Record<string, string> = {
  Neu: "bg-info text-info-foreground",
  Angebot: "bg-primary text-primary-foreground",
  Tipp: "bg-warning text-warning-foreground",
  Bio: "bg-success text-success-foreground",
}

/** ROSSMANN-style price: large integer, superscript cents, trailing €. */
function PriceTag({ value, highlight }: { value: number; highlight?: boolean }) {
  const euros = Math.floor(value)
  const cents = Math.round((value - euros) * 100)
    .toString()
    .padStart(2, "0")
  return (
    <span
      className={cn(
        "inline-flex items-start font-extrabold leading-none",
        highlight ? "text-primary" : "text-foreground",
      )}
    >
      <span className="text-2xl">{euros}.</span>
      <span className="mt-0.5 text-sm">{cents}</span>
      <span className="mt-0.5 ml-0.5 text-sm">€</span>
    </span>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    add(product.slug)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const rounded = Math.round(product.rating)

  return (
    <div className="group relative flex h-full flex-col border border-border bg-card p-3 transition-shadow hover:shadow-md">
      {product.badge && (
        <span
          className={cn(
            "absolute left-0 top-0 z-10 px-2 py-0.5 text-xs font-semibold",
            badgeStyles[product.badge],
          )}
        >
          {product.badge}
        </span>
      )}

      <Link href={`/p/${product.slug}`} className="block">
        <div className="relative mx-auto aspect-square w-full max-w-[180px]">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="180px"
            className="object-contain p-2"
          />
        </div>
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex" aria-label={`Bewertung ${product.rating} von 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < rounded ? "fill-primary text-primary" : "fill-muted text-muted",
                )}
                aria-hidden
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{product.reviews}</span>
        </div>

        <p className="mt-2 text-sm text-foreground">{product.brand}</p>
        <Link
          href={`/p/${product.slug}`}
          className="mt-0.5 line-clamp-2 text-sm leading-snug text-muted-foreground hover:text-primary"
        >
          {product.name}
        </Link>

        <p className="mt-1 text-xs text-muted-foreground">{product.unit}</p>

        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <PriceTag value={product.price} highlight={!!product.oldPrice} />
                {product.oldPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {product.oldPrice.toFixed(2).replace(".", ",")} €
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                {product.basePrice}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              aria-label={`${product.name} in den Warenkorb`}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary-foreground transition-colors",
                added ? "bg-success" : "bg-primary hover:bg-hover",
              )}
            >
              {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
