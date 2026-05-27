"use client"

import Link from "next/link"

interface BlogCategoryFilterProps {
  categories: string[]
  activeCategory: string
}

export function BlogCategoryFilter({ categories, activeCategory }: BlogCategoryFilterProps) {
  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
          {categories.map((cat) => {
            const isActive = cat === activeCategory
            const href = cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`

            return (
              <Link
                key={cat}
                href={href}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {cat}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
