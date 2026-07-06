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
    title: `${cat.name} günstig online kaufen | ROSSMANN`,
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
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Startseite</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{cat.name}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{cat.name}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{cat.description}</p>
      </header>

      {/* Sub-category chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/c/${c.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              c.slug === cat.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <ProductGrid products={products} />
    </div>
  )
}
