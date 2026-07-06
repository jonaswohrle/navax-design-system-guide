import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ChevronRight, Star, Truck, RotateCcw, ShieldCheck } from "lucide-react"
import { PRODUCTS, getProduct, getCategory, getProductsByCategory, formatPrice } from "@/lib/shop/data"
import { AddToCart } from "@/components/shop/add-to-cart"
import { ProductCarousel } from "@/components/shop/home/product-carousel"

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return { title: "Produkt nicht gefunden | ROSSMANN" }
  return {
    title: `${product.brand} ${product.name} | ROSSMANN`,
    description: product.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const category = getCategory(product.category)
  const related = getProductsByCategory(product.category).filter((p) => p.slug !== product.slug)
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Startseite</Link>
        <ChevronRight className="h-4 w-4" />
        {category && (
          <>
            <Link href={`/c/${category.slug}`} className="hover:text-primary">{category.name}</Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="line-clamp-1 font-medium text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="relative flex items-center justify-center rounded-xl border border-border bg-card p-8">
          {discount > 0 && (
            <span className="absolute left-4 top-4 rounded bg-primary px-2.5 py-1 text-sm font-bold text-primary-foreground">
              -{discount}%
            </span>
          )}
          {product.badge && discount === 0 && (
            <span className="absolute left-4 top-4 rounded bg-warning px-2.5 py-1 text-sm font-bold text-warning-foreground">
              {product.badge}
            </span>
          )}
          <div className="relative aspect-square w-full max-w-md">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={`${product.brand} ${product.name}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-contain"
            />
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{product.brand}</p>
          <h1 className="mt-1 text-2xl font-extrabold text-foreground sm:text-3xl">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < Math.round(product.rating)
                      ? "h-4 w-4 fill-warning text-warning"
                      : "h-4 w-4 text-border"
                  }
                />
              ))}
            </div>
            <span className="font-medium text-foreground">
              {product.rating.toLocaleString("de-DE", { minimumFractionDigits: 1 })}
            </span>
            <span className="text-muted-foreground">({product.reviews} Bewertungen)</span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <span className={`text-3xl font-extrabold ${product.oldPrice ? "text-primary" : "text-foreground"}`}>
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="mb-1 text-lg text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {product.unit} ({product.basePrice}) · inkl. MwSt.
          </p>

          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-success">
            <span className="h-2.5 w-2.5 rounded-full bg-success" /> Auf Lager · Lieferung in 2-4 Werktagen
          </p>

          <div className="mt-6">
            <AddToCart product={product} />
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            <li className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="h-5 w-5 text-primary" /> Gratis Versand ab 49 €
            </li>
            <li className="flex items-center gap-2 text-xs text-muted-foreground">
              <RotateCcw className="h-5 w-5 text-primary" /> 30 Tage Rückgabe
            </li>
            <li className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" /> Sicher bezahlen
            </li>
          </ul>
        </div>
      </div>

      {/* Details */}
      <section className="mt-10 grid gap-6 rounded-xl border border-border bg-card p-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">Produktbeschreibung</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-bold text-foreground">Produktdetails</h2>
          <dl className="divide-y divide-border text-sm">
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">Marke</dt>
              <dd className="font-medium text-foreground">{product.brand}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">Inhalt</dt>
              <dd className="font-medium text-foreground">{product.unit}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">Grundpreis</dt>
              <dd className="font-medium text-foreground">{product.basePrice}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-muted-foreground">Kategorie</dt>
              <dd className="font-medium text-foreground">{category?.name}</dd>
            </div>
          </dl>
        </div>
      </section>

      {related.length > 0 && (
        <div className="mt-6">
          <ProductCarousel title="Das könnte dir auch gefallen" products={related} moreHref={`/c/${product.category}`} />
        </div>
      )}
    </div>
  )
}
