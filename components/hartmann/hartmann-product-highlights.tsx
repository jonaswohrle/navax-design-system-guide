import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { HartmannProductHighlight } from "@/lib/sitecore"

interface HartmannProductHighlightsProps {
  products: HartmannProductHighlight[]
}

export function HartmannProductHighlights({ products }: HartmannProductHighlightsProps) {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-10 text-center text-[22px] font-bold text-[#1a1a2e] lg:text-[28px]">
          Produkthighlights
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col"
            >
              {/* Product image */}
              <div className="relative mb-4 aspect-square overflow-hidden rounded-sm bg-[#f8f8f8]">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover p-2 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Product info */}
              <div className="flex flex-1 flex-col">
                <p className="mb-1 text-[11px] text-[#555]">
                  {product.subtitle}
                </p>
                <h3 className="mb-2 text-[15px] font-bold leading-tight text-[#002F6C]">
                  {product.title}
                </h3>
                <p className="mb-3 flex-1 text-[11px] leading-[1.7] text-[#555]">
                  {product.description}
                </p>
                <Link
                  href={product.linkUrl}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#002F6C] transition-colors hover:text-[#001d44]"
                >
                  Mehr erfahren
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* "Alle Produkte ansehen" button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="#"
            className="inline-block rounded-sm bg-[#002F6C] px-8 py-3 text-[13px] font-bold text-white transition-colors hover:bg-[#001d44]"
          >
            Alle Produkte ansehen
          </Link>
        </div>
      </div>
    </section>
  )
}
