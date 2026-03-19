import type { Metadata } from "next"
import { ContentCard } from "@/components/explore/content-card"
import { BlogCategoryFilter } from "@/components/explore/blog-category-filter"

export const metadata: Metadata = {
  title: "Energieratgeber | Tipps & Wissen - E.ON",
  description:
    "Praktische Tipps rund um Energie, Nachhaltigkeit und Sparen. Von Stromverbrauch senken bis Solaranlage planen.",
}

const CATEGORIES = [
  "Alle",
  "Energieratgeber",
  "Heizen",
  "E-Mobilität",
  "Solar",
  "Nachhaltigkeit",
  "Smart Home",
]

const POSTS = [
  { title: "Stromverbrauch senken: 10 einfache Tipps", excerpt: "Mit diesen praktischen Tipps können Sie Ihren Stromverbrauch nachhaltig reduzieren und bares Geld sparen.", imageUrl: "/images/explore/blog-energy-tips.jpg", publishDate: "2026-03-10", category: "Energieratgeber", slug: "stromverbrauch-senken-tipps", order: 1 },
  { title: "So funktioniert eine Wärmepumpe", excerpt: "Wärmepumpen sind die Zukunft des Heizens. Erfahren Sie, wie die Technologie funktioniert und ob sie für Ihr Zuhause geeignet ist.", imageUrl: "/images/explore/eon-waermepumpe.jpg", publishDate: "2026-03-05", category: "Heizen", slug: "waermepumpe-erklaert", order: 2 },
  { title: "E-Auto laden: Was Sie wissen müssen", excerpt: "Alles rund um das Laden Ihres Elektroautos -- von der eigenen Wallbox bis zur öffentlichen Ladeinfrastruktur.", imageUrl: "/images/explore/eon-emobility.jpg", publishDate: "2026-02-28", category: "E-Mobilität", slug: "e-auto-laden-guide", order: 3 },
  { title: "Solaranlage planen: Der komplette Leitfaden", excerpt: "Von der Dachprüfung bis zur Inbetriebnahme -- so planen Sie Ihre eigene Photovoltaikanlage richtig.", imageUrl: "/images/explore/eon-solar.jpg", publishDate: "2026-02-20", category: "Solar", slug: "solaranlage-planen-leitfaden", order: 4 },
  { title: "Energielabel verstehen: A bis G erklärt", excerpt: "Was bedeuten die Energielabels auf Haushaltsgeräten wirklich? Wir erklären die Klassen und worauf Sie achten sollten.", imageUrl: "/images/explore/eon-smarthome.jpg", publishDate: "2026-02-14", category: "Energieratgeber", slug: "energielabel-verstehen", order: 5 },
  { title: "CO2-Fußabdruck reduzieren: So geht es", excerpt: "Praktische Maßnahmen für den Alltag, mit denen Sie Ihren CO2-Fußabdruck spürbar verringern können.", imageUrl: "/images/explore/eon-strom.jpg", publishDate: "2026-02-07", category: "Nachhaltigkeit", slug: "co2-fussabdruck-reduzieren", order: 6 },
]

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const sp = await searchParams

  const activeCategory = sp.category || "Alle"
  const filteredPosts =
    activeCategory === "Alle"
      ? POSTS
      : POSTS.filter((p) => p.category === activeCategory)
  const postsToShow = filteredPosts.length > 0 ? filteredPosts : POSTS

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="bg-secondary py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-4 font-heading text-4xl font-bold text-foreground lg:text-5xl">
            Energieratgeber
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            Praktische Tipps, Wissen und Inspiration rund um Energie, Nachhaltigkeit und Sparen.
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
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Seitennavigation">
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
          </nav>
        </div>
      </section>
    </div>
  )
}
