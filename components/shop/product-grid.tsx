"use client"

import { useMemo, useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import type { Product } from "@/lib/shop/data"
import { ProductCard } from "./product-card"
import { cn } from "@/lib/utils"

type SortKey = "empfohlen" | "preis-auf" | "preis-ab" | "bewertung"

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "empfohlen", label: "Empfohlen" },
  { key: "preis-auf", label: "Preis aufsteigend" },
  { key: "preis-ab", label: "Preis absteigend" },
  { key: "bewertung", label: "Beste Bewertung" },
]

export function ProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("empfohlen")
  const [activeBrands, setActiveBrands] = useState<string[]>([])
  const [onlyOffers, setOnlyOffers] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products],
  )

  const filtered = useMemo(() => {
    let list = [...products]
    if (activeBrands.length) list = list.filter((p) => activeBrands.includes(p.brand))
    if (onlyOffers) list = list.filter((p) => p.oldPrice)
    switch (sort) {
      case "preis-auf":
        list.sort((a, b) => a.price - b.price)
        break
      case "preis-ab":
        list.sort((a, b) => b.price - a.price)
        break
      case "bewertung":
        list.sort((a, b) => b.rating - a.rating)
        break
    }
    return list
  }, [products, activeBrands, onlyOffers, sort])

  function toggleBrand(brand: string) {
    setActiveBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    )
  }

  const Filters = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-bold uppercase text-foreground">Angebote</h3>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={onlyOffers}
            onChange={(e) => setOnlyOffers(e.target.checked)}
            className="h-4 w-4 accent-[hsl(var(--primary))]"
          />
          Nur reduzierte Artikel
        </label>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-bold uppercase text-foreground">Marke</h3>
        <ul className="space-y-1.5">
          {brands.map((brand) => (
            <li key={brand}>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={activeBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="h-4 w-4 accent-[hsl(var(--primary))]"
                />
                {brand}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Sidebar filters */}
      <aside className="hidden w-56 shrink-0 lg:block">{Filters}</aside>

      <div className="flex-1">
        {/* Toolbar */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filter
          </button>
          <p className="hidden text-sm text-muted-foreground sm:block">
            {filtered.length} Artikel
          </p>
          <label className="ml-auto flex items-center gap-2 text-sm">
            <span className="hidden text-muted-foreground sm:inline">Sortieren:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {sortOptions.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {showFilters && (
          <div className="mb-4 rounded-lg border border-border bg-card p-4 lg:hidden">{Filters}</div>
        )}

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            Keine Artikel gefunden. Bitte passe deine Filter an.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
