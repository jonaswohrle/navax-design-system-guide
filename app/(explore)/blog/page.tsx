import type { Metadata } from "next"
import { getBlogPosts } from "@/lib/contentful"
import { ContentCard } from "@/components/explore/content-card"
import { BlogCategoryFilter } from "@/components/explore/blog-category-filter"

export const metadata: Metadata = {
  title: "Blog | Travel tips, advice and inspiration - Explore",
  description:
    "Get inspired for your next adventure with our travel blog. Tips, guides, destination insights and stories from our expert writers and tour leaders.",
}

const CATEGORIES = [
  "All",
  "Adventure Travel",
  "Cycling",
  "Culture",
  "Inspiration",
  "Wildlife",
  "Walking",
  "Family",
  "Polar",
]

const FALLBACK_POSTS = [
  { title: "Walking the Great Wall of China: Everything you need to know", excerpt: "Our guide to walking the Great Wall covers the best sections to visit and how to make the most of this incredible experience.", imageUrl: "/images/explore/blog-great-wall.jpg", publishDate: "2026-03-10", category: "Adventure Travel", slug: "walking-great-wall-china", order: 1 },
  { title: "Why cycling holidays are more popular than ever", excerpt: "From the vineyards of France to the rice paddies of Vietnam, discover why cycling tours are the fastest growing holiday trend.", imageUrl: "/images/explore/blog-cycling.jpg", publishDate: "2026-03-05", category: "Cycling", slug: "cycling-holidays-popular", order: 2 },
  { title: "Your first trip to China: A complete guide", excerpt: "Planning your first trip to China? Everything you need to know about visas, culture, food and the best places to visit.", imageUrl: "/images/explore/blog-china-first.jpg", publishDate: "2026-02-28", category: "Adventure Travel", slug: "first-trip-china-guide", order: 3 },
  { title: "Discovering ancient ground through travel", excerpt: "From Petra to Angkor Wat, explore the world's most awe-inspiring ancient sites and the stories they tell.", imageUrl: "/images/explore/blog-ancient.jpg", publishDate: "2026-02-20", category: "Culture", slug: "ancient-ground-travel", order: 4 },
  { title: "Destination dupes 2026: Hidden gems to visit instead", excerpt: "Swap overcrowded hotspots for these incredible alternative destinations that offer the same magic with fewer crowds.", imageUrl: "/images/explore/blog-dupes.jpg", publishDate: "2026-02-14", category: "Inspiration", slug: "destination-dupes-2026", order: 5 },
  { title: "The best places to stargaze around the world", excerpt: "From the Atacama Desert to the Scottish Highlands, discover the darkest skies and most spectacular stargazing spots.", imageUrl: "/images/explore/blog-stargazing.jpg", publishDate: "2026-02-07", category: "Wildlife", slug: "best-stargazing-spots", order: 6 },
]

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const sp = await searchParams
  const posts = await getBlogPosts()
  const allPosts = posts?.length ? posts : FALLBACK_POSTS

  const activeCategory = sp.category || "All"
  const filteredPosts =
    activeCategory === "All"
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory)
  const postsToShow = filteredPosts.length > 0 ? filteredPosts : allPosts

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Page hero */}
      <section className="bg-secondary py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-4 font-heading text-4xl font-bold text-foreground lg:text-5xl">
            Blog
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            Travel tips, advice and inspiration from our expert writers and tour leaders.
          </p>
        </div>
      </section>

      {/* Category filters */}
      <BlogCategoryFilter categories={CATEGORIES} activeCategory={activeCategory} />

      {/* Blog post grid */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {postsToShow.map((post) => (
              <ContentCard key={post.title} post={post} />
            ))}
          </div>

          {/* Pagination */}
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === 1
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-foreground hover:bg-secondary"
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-2 text-muted-foreground">...</span>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              10
            </button>
          </nav>
        </div>
      </section>
    </div>
  )
}
