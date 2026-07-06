"use client"

import { useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/lib/shop/data"
import { ProductCard } from "@/components/shop/product-card"

export function ProductCarousel({
  title,
  products,
  moreHref,
}: {
  title: string
  products: Product[]
  moreHref?: string
}) {
  const scroller = useRef<HTMLDivElement>(null)

  function scroll(dir: 1 | -1) {
    scroller.current?.scrollBy({ left: dir * 640, behavior: "smooth" })
  }

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">{title}</h2>
        <div className="flex items-center gap-2">
          {moreHref && (
            <Link
              href={moreHref}
              className="hidden text-sm font-semibold text-primary hover:text-hover sm:inline"
            >
              Alle entdecken
            </Link>
          )}
          <button
            type="button"
            aria-label="Zurück"
            onClick={() => scroll(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Weiter"
            onClick={() => scroll(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-primary hover:text-primary"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <div key={p.slug} className="w-[200px] shrink-0 snap-start sm:w-[220px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  )
}
