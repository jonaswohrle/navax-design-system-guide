import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ChevronRight } from "lucide-react"
import { CATEGORIES, getCategory, getProductsByCategory } from "@/lib/shop/data"
import { ProductGrid } from "@/components/shop/product-grid"

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) return { title: "Kategorie nicht gefunden | ROSSMANN" }
  return {
    title: `${cat.name} online kaufen | ROSSMANN`,
    description: cat.description,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) notFound()

  const products = getProductsByCategory(cat.slug)

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm">
        <Link href="/" className="text-muted-foreground hover:text-primary">
          Startseite
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground">{cat.name}</span>
      </nav>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Category sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <h2 className="mb-4 text-xl font-bold text-foreground">{cat.name}</h2>
          <ul className="space-y-3 border-b border-border pb-4">
            {cat.subcategories.map((sub) => (
              <li key={sub}>
                <Link
                  href={`/c/${cat.slug}`}
                  className="text-sm text-foreground transition-colors hover:text-primary"
                >
                  {sub}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-4 space-y-3">
            <li>
              <Link href="/angebote" className="text-sm text-foreground transition-colors hover:text-primary">
                Schön für mich – Aktionen &amp; Ratgeber
              </Link>
            </li>
            <li>
              <Link href="/c/pflege-duft" className="text-sm text-foreground transition-colors hover:text-primary">
                Marken A–Z
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <h1 className="mb-5 text-2xl font-bold text-foreground sm:text-3xl">{cat.heading}</h1>
          <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {cat.description}
          </p>

          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  )
}
