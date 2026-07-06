import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Ticket, Percent, Gift } from "lucide-react"
import { HeroCarousel } from "@/components/shop/home/hero-carousel"
import { ProductCarousel } from "@/components/shop/home/product-carousel"
import {
  CATEGORIES,
  PRODUCTS,
  TOP_PICKS,
  getOffers,
  getProductsByCategory,
} from "@/lib/shop/data"

const offerCards = [
  {
    icon: Ticket,
    title: "10% Coupon",
    text: "Unser App-Angebot: Spare mit deinem persönlichen Coupon in der ROSSMANN App.",
    color: "bg-accent",
  },
  {
    icon: Percent,
    title: "Wochen-Angebote",
    text: "Jede Woche neue Spitzenangebote für dich – nur für kurze Zeit.",
    color: "bg-secondary",
  },
  {
    icon: Gift,
    title: "Gewinnspiel",
    text: "Jetzt mitmachen und tolle Preise für deinen Alltag gewinnen.",
    color: "bg-accent",
  },
]

export default function HomePage() {
  const ideenwelt = PRODUCTS.filter((p) => p.ideenwelt)
  const offers = getOffers()
  const pflege = getProductsByCategory("pflege-duft")
  const lebensmittel = getProductsByCategory("lebensmittel")
  const baby = getProductsByCategory("baby-spielzeug")

  return (
    <>
      <HeroCarousel />

      {/* Top Picks */}
      <section className="mx-auto max-w-[1280px] px-4 py-8">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Beziehst du in Trends
        </div>
        <h2 className="mb-5 text-xl font-extrabold text-foreground sm:text-2xl">
          Unsere Top Picks für deinen Alltag
        </h2>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {TOP_PICKS.map((tile) => (
            <Link key={tile.name} href={`/c/${tile.category}`} className="group flex flex-col items-center gap-2">
              <div className="relative aspect-square w-full overflow-hidden rounded-full border border-border">
                <Image
                  src={tile.image || "/placeholder.svg"}
                  alt={tile.name}
                  fill
                  sizes="140px"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <span className="text-center text-xs font-semibold text-foreground group-hover:text-primary sm:text-sm">
                {tile.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Aktuelle Angebote */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-[1280px] px-4 py-8">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">Aktuelle Angebote</h2>
            <Link href="/angebote" className="flex items-center text-sm font-semibold text-primary hover:text-hover">
              Alle Angebote entdecken <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {offerCards.map((card) => (
              <div key={card.title} className={`flex items-start gap-4 rounded-lg ${card.color} p-5`}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <card.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{card.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{card.text}</p>
                  <Link href="/angebote" className="mt-2 inline-block text-sm font-semibold text-primary hover:text-hover">
                    Jetzt sichern
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IDEENWELT carousel */}
      <ProductCarousel title="Sommerküche, Garten & Picknick" products={[...ideenwelt, ...getProductsByCategory("haushalt")]} moreHref="/c/haushalt" />

      {/* Category grid banner */}
      <section className="mx-auto max-w-[1280px] px-4 py-8">
        <h2 className="mb-5 text-xl font-extrabold text-foreground sm:text-2xl">Entdecke unsere Sortimente</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/c/${cat.slug}`}
              className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-5 text-center transition-colors hover:border-primary"
            >
              <span className="text-sm font-bold text-foreground">{cat.name}</span>
              <span className="text-xs text-primary">Entdecken</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Offers carousel */}
      <div className="bg-secondary">
        <ProductCarousel title="Unsere Spitzen-Angebote" products={offers} moreHref="/angebote" />
      </div>

      {/* Pflege carousel */}
      <ProductCarousel title="Deine Pflege-Lieblinge" products={pflege} moreHref="/c/pflege-duft" />

      {/* Family / babywelt banner */}
      <section className="mx-auto max-w-[1280px] px-4 py-8">
        <div className="grid overflow-hidden rounded-xl border border-border md:grid-cols-2">
          <div className="relative min-h-[240px]">
            <Image
              src="/shop/hero/hero-baby.png"
              alt="Familie mit Baby"
              fill
              sizes="640px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-3 bg-accent p-8">
            <span className="text-sm font-bold uppercase tracking-wide text-primary">babywelt</span>
            <h2 className="text-2xl font-extrabold text-foreground">Hier dreht sich alles um die Familie</h2>
            <p className="text-sm text-muted-foreground">
              Von der ersten Windel bis zum Lieblingsspielzeug: In unserer babywelt findest du alles, was dein
              Baby braucht – zu dauerhaft günstigen Preisen.
            </p>
            <Link
              href="/c/baby-spielzeug"
              className="mt-2 inline-flex w-fit rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-hover"
            >
              Zum babywelt Bereich
            </Link>
          </div>
        </div>
      </section>

      {/* Lebensmittel + Baby carousels */}
      <ProductCarousel title="Lecker & günstig – Lebensmittel" products={lebensmittel} moreHref="/c/lebensmittel" />
      <div className="bg-secondary">
        <ProductCarousel title="Alles für dein Baby" products={baby} moreHref="/c/baby-spielzeug" />
      </div>

      {/* SEO copy */}
      <section className="mx-auto max-w-[1280px] px-4 py-10">
        <h2 className="mb-3 text-lg font-extrabold text-foreground">
          rossmann.de – Deine Online-Drogerie für alles, was dir wichtig ist
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Willkommen bei ROSSMANN online! In unserem Online-Shop findest du ein riesiges Sortiment aus den
            Bereichen Kosmetik, Pflege, Baby, Haushalt, Gesundheit und Lebensmittel – bequem von zu Hause aus
            bestellt und schnell geliefert. Ob Make-up, Sonnenpflege oder Waschmittel: Bei ROSSMANN kaufst du
            Markenqualität und beliebte Eigenmarken wie ISANA, babydream, IDEENWELT und enerBiO zu dauerhaft
            günstigen Preisen.
          </p>
          <p>
            Profitiere von wöchentlich wechselnden Angeboten, exklusiven App-Coupons und unserem
            Newsletter-Rabatt. Entdecke jetzt unsere Top Picks für deinen Alltag und lass dich von neuen
            Produkten und Trends inspirieren.
          </p>
        </div>
      </section>
    </>
  )
}
