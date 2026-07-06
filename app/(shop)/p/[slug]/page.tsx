import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ChevronRight, Star, MapPin, Search, Truck } from "lucide-react"
import { PRODUCTS, getProduct, getCategory, getProductsByCategory } from "@/lib/shop/data"
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
    title: `${product.brand} ${product.name} online kaufen | ROSSMANN`,
    description: product.description,
  }
}

function PriceTag({ value, highlight }: { value: number; highlight?: boolean }) {
  const euros = Math.floor(value)
  const cents = Math.round((value - euros) * 100)
    .toString()
    .padStart(2, "0")
  return (
    <span
      className={`inline-flex items-start font-extrabold leading-none ${highlight ? "text-primary" : "text-foreground"}`}
    >
      <span className="text-4xl">{euros}.</span>
      <span className="mt-1 text-lg">{cents}</span>
      <span className="mt-1 ml-1 text-lg">€</span>
    </span>
  )
}

function deliveryRange() {
  const fmt = (d: Date) =>
    d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" })
  const from = new Date()
  from.setDate(from.getDate() + 2)
  const to = new Date()
  to.setDate(to.getDate() + 3)
  const weekday = (d: Date) =>
    d.toLocaleDateString("de-DE", { weekday: "long" })
  return { fromLabel: `${weekday(from)}, den ${fmt(from)}`, toLabel: `${weekday(to)}, den ${fmt(to)}` }
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
  const rounded = Math.round(product.rating)
  const { fromLabel, toLabel } = deliveryRange()
  const artNr = String(100000 + (product.slug.length * 4231) % 899999)

  const details: { title: string; body: string }[] = [
    { title: "Anwendung und Gebrauch", body: product.description },
    {
      title: "Gebrauch, Aufbewahrung und Verwendung",
      body: "Kühl und trocken lagern. Vor Sonneneinstrahlung schützen und außerhalb der Reichweite von Kindern aufbewahren.",
    },
    {
      title: "Inhaltsstoffe",
      body: "Die vollständige Liste der Inhaltsstoffe finden Sie auf der Produktverpackung.",
    },
  ]

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm">
        <Link href="/" className="text-muted-foreground hover:text-primary">Startseite</Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        {category && (
          <>
            <Link href={`/c/${category.slug}`} className="text-muted-foreground hover:text-primary">
              {category.name}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </>
        )}
        <span className="line-clamp-1 text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* ── Left: gallery + description ── */}
        <div>
          <div className="flex gap-4">
            {/* Thumbnail rail */}
            <div className="hidden shrink-0 flex-col gap-3 sm:flex">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`relative h-16 w-16 border bg-card ${i === 0 ? "border-foreground" : "border-border"}`}
                >
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>
              ))}
            </div>

            {/* Main image */}
            <div className="relative flex-1">
              {product.badge && (
                <span className="absolute left-0 top-0 z-10 bg-info px-2.5 py-1 text-sm font-semibold text-info-foreground">
                  {product.badge}
                </span>
              )}
              <div className="relative aspect-square w-full bg-card">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={`${product.brand} ${product.name}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-contain p-6"
                />
              </div>
            </div>
          </div>

          {/* Description block */}
          <div className="mt-10 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              Artikelnummer: <span className="text-foreground">{artNr}</span>
            </p>
            <h2 className="mt-6 text-lg font-bold text-foreground">Produktbeschreibung und -details</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <dl className="mt-6 divide-y divide-border border-t border-border text-sm">
              <div className="flex justify-between py-3">
                <dt className="text-muted-foreground">Marke</dt>
                <dd className="text-foreground">{product.brand}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-muted-foreground">Inhalt</dt>
                <dd className="text-foreground">{product.unit}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-muted-foreground">Grundpreis</dt>
                <dd className="text-foreground">{product.basePrice}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-muted-foreground">Kategorie</dt>
                <dd className="text-foreground">{category?.name}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* ── Right: buy box ── */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">{product.name}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={i < rounded ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 fill-muted text-muted"}
                    />
                  ))}
                </div>
                <span className="text-foreground">
                  {product.rating.toLocaleString("de-DE", { minimumFractionDigits: 1 })} ({product.reviews})
                </span>
                <span className="text-muted-foreground">·</span>
                <button className="text-primary hover:underline">Produkt bewerten</button>
              </div>

              <p className="mt-3 text-sm text-foreground">{product.unit}</p>
              <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
                zzgl. Versand, Preis inkl. gesetzl. MwSt. Preise können in den Filialen von den angezeigten
                Preisen abweichen.
              </p>
            </div>

            <div className="shrink-0 text-right">
              <PriceTag value={product.price} highlight={!!product.oldPrice} />
              {product.oldPrice && (
                <p className="mt-1 text-sm text-muted-foreground line-through">
                  {product.oldPrice.toFixed(2).replace(".", ",")} €
                </p>
              )}
            </div>
          </div>

          <hr className="my-6 border-border" />

          {/* Variant */}
          <p className="mb-2 text-sm font-medium text-foreground">Erhältlich in 1 Variante</p>
          <div className="mb-6 flex items-center gap-3 border border-border px-4 py-3">
            <span className="h-5 w-5 rounded-full border border-border bg-muted" aria-hidden />
            <span className="text-sm text-foreground">{product.name}</span>
          </div>

          {/* Buy box */}
          <AddToCart product={product} />

          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 text-foreground" />
            Lieferung zwischen {fromLabel} und {toLabel}
          </p>

          <hr className="my-6 border-border" />

          {/* Store availability */}
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <MapPin className="h-4 w-4" /> Verfügbarkeit in deiner Filiale
          </div>
          <div className="mt-3 flex gap-3">
            <div className="flex flex-1 items-center border border-border px-3">
              <input
                type="text"
                placeholder="PLZ oder Stadt"
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <button className="h-11 border border-primary px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              Filiale finden
            </button>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-success">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/15 text-success">
              <Truck className="h-3.5 w-3.5" />
            </span>
            Kostenlos lieferbar in deine Wunschfiliale
          </p>

          <hr className="my-6 border-border" />

          {/* Accordions */}
          <div className="border-t border-border">
            {details.map((d) => (
              <details key={d.title} className="group border-b border-border">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-medium text-foreground">
                  {d.title}
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <ProductCarousel
            title="Das könnte dir auch gefallen"
            products={related}
            moreHref={`/c/${product.category}`}
          />
        </div>
      )}
    </div>
  )
}
