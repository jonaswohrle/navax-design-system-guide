import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { HartmannProductHighlight } from "@/lib/sitecore"

interface HartmannProductHighlightsProps {
  products: HartmannProductHighlight[]
}

export function HartmannProductHighlights({ products }: HartmannProductHighlightsProps) {
  return (
    <section className="bg-secondary py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground lg:text-3xl">
          Produkthighlights
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-md border border-border bg-background transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-1 font-heading text-base font-bold text-foreground">
                  {product.title}
                </h3>
                <p className="mb-2 text-xs font-medium text-primary">
                  {product.subtitle}
                </p>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
                <Link
                  href={product.linkUrl}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-hover"
                >
                  Mehr erfahren
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
