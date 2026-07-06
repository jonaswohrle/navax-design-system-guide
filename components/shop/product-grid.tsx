"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import type { Product } from "@/lib/shop/data"
import { ProductCard } from "./product-card"
import { cn } from "@/lib/utils"

type SortKey = "relevanz" | "preis-auf" | "preis-ab" | "bewertung"

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "relevanz", label: "Relevanz" },
  { key: "preis-auf", label: "Preis aufsteigend" },
  { key: "preis-ab", label: "Preis absteigend" },
  { key: "bewertung", label: "Beste Bewertung" },
]

/** ROSSMANN-style filter pill with a dropdown panel. */
function FilterDropdown({
  label,
  value,
  disabled,
  children,
}: {
  label: string
  value?: string
  disabled?: boolean
  children?: (close: () => void) => React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between gap-2 border px-4 py-2.5 text-sm transition-colors",
          open ? "border-primary text-foreground" : "border-border text-foreground",
          disabled ? "cursor-default text-muted-foreground" : "hover:border-primary",
        )}
      >
        <span className="truncate">{value ? `${label}: ${value}` : label}</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && children && (
        <div className="absolute left-0 top-full z-20 mt-1 max-h-72 w-64 overflow-y-auto border border-border bg-card p-2 shadow-lg">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("relevanz")
  const [activeBrands, setActiveBrands] = useState<string[]>([])
  const [onlyOffers, setOnlyOffers] = useState(false)

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

  const sortLabel = sortOptions.find((o) => o.key === sort)?.label ?? "Relevanz"

  return (
    <div>
      {/* Filter row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <FilterDropdown label="Sortieren nach" value={sortLabel}>
          {(close) => (
            <ul className="space-y-0.5">
              {sortOptions.map((o) => (
                <li key={o.key}>
                  <button
                    type="button"
                    onClick={() => {
                      setSort(o.key)
                      close()
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                      sort === o.key ? "font-semibold text-primary" : "text-foreground",
                    )}
                  >
                    {o.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </FilterDropdown>

        <FilterDropdown label="Marke" value={activeBrands.length ? `${activeBrands.length}` : undefined}>
          {() => (
            <ul className="space-y-0.5">
              {brands.map((brand) => (
                <li key={brand}>
                  <label className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted">
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
          )}
        </FilterDropdown>

        <FilterDropdown label="Verfügbarkeit" value={onlyOffers ? "Angebote" : undefined}>
          {(close) => (
            <ul className="space-y-0.5">
              <li>
                <label className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted">
                  <input
                    type="checkbox"
                    checked={onlyOffers}
                    onChange={(e) => {
                      setOnlyOffers(e.target.checked)
                      close()
                    }}
                    className="h-4 w-4 accent-[hsl(var(--primary))]"
                  />
                  Nur reduzierte Artikel
                </label>
              </li>
            </ul>
          )}
        </FilterDropdown>

        <FilterDropdown label="Bewertungen" disabled />
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{filtered.length} Artikel</p>

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
  )
}
