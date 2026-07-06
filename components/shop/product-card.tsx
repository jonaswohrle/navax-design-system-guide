"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Plus, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { formatPrice, type Product } from "@/lib/shop/data"
import { useCart } from "./cart-provider"

const badgeStyles: Record<string, string> = {
  Neu: "bg-info text-info-foreground",
  Angebot: "bg-primary text-primary-foreground",
  Tipp: "bg-warning text-warning-foreground",
  Bio: "bg-success text-success-foreground",
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    add(product.slug)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  return (
    <div className="group relative flex h-full flex-col rounded-md border border-border bg-card p-3 transition-shadow hover:shadow-md">
      {product.badge && (
        <span
          className={cn(
            "absolute left-3 top-3 z-10 rounded px-2 py-0.5 text-xs font-bold",
            badgeStyles[product.badge],
          )}
        >
          {product.badge}
        </span>
      )}
      {discount > 0 && (
        <span className="absolute right-3 top-3 z-10 rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
          -{discount}%
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

      <div className="mt-2 flex flex-1 flex-col">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </p>
        <Link
          href={`/p/${product.slug}`}
          className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-foreground hover:text-primary"
        >
          {product.name}
        </Link>

        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden />
          <span className="font-medium text-foreground">
            {product.rating.toLocaleString("de-DE", { minimumFractionDigits: 1 })}
          </span>
          <span>({product.reviews})</span>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">{product.unit}</p>

        <div className="mt-auto pt-2">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={cn(
                    "text-lg font-extrabold",
                    product.oldPrice ? "text-primary" : "text-foreground",
                  )}
                >
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
              <p className="text-[10px] leading-tight text-muted-foreground">{product.basePrice}</p>
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
