"use client"

import { useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const REVIEWS = [
  {
    rating: 5,
    text: "Der Wechsel zu E.ON war super einfach. Alles online erledigt, innerhalb weniger Minuten hatte ich meinen neuen Ökostrom-Tarif.",
    customerName: "Maria K.",
    tripName: "E.ON ÖkoStrom",
    date: "vor 3 Tagen",
  },
  {
    rating: 5,
    text: "Unsere Solaranlage von E.ON hat sich schneller amortisiert als erwartet. Der Service von der Beratung bis zur Installation war erstklassig.",
    customerName: "Thomas B.",
    tripName: "E.ON Solar",
    date: "vor 1 Woche",
  },
  {
    rating: 4,
    text: "Mit E.ON Plus spare ich richtig bei Strom und Gas zusammen. Der Kundenservice ist immer freundlich und hilfsbereit.",
    customerName: "Anna S.",
    tripName: "E.ON Plus",
    date: "vor 2 Wochen",
  },
  {
    rating: 5,
    text: "Die Wallbox-Installation lief reibungslos. Von der Bestellung bis zur Inbetriebnahme vergingen nur zwei Wochen. Top Service!",
    customerName: "Michael R.",
    tripName: "E.ON Wallbox",
    date: "vor 3 Wochen",
  },
  {
    rating: 5,
    text: "Endlich ein Energieversorger mit transparenten Preisen. Keine versteckten Kosten, alles wie versprochen. Sehr zufrieden.",
    customerName: "Sandra W.",
    tripName: "E.ON Erdgas",
    date: "vor 1 Monat",
  },
]

export function ReviewCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className="bg-background py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
              Das sagen unsere Kunden
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i <= 4 ? "fill-primary text-primary" : "fill-primary/30 text-primary/30"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">4.6 / 5</span>
              <span className="text-xs text-muted-foreground">
                basierend auf 12.543 Bewertungen
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="h-10 w-10 rounded-full"
              aria-label="Vorherige Bewertung"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="h-10 w-10 rounded-full"
              aria-label="Nächste Bewertung"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-4 flex">
            {REVIEWS.map((review, idx) => (
              <div
                key={idx}
                className="min-w-0 shrink-0 grow-0 basis-full pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="h-full rounded-xl border border-border bg-card p-5">
                  <div className="mb-3 flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i <= (review.rating || 5) ? "fill-primary text-primary" : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-foreground">
                    {review.text}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium">{review.customerName}</span>
                    {review.tripName && (
                      <span className="text-primary">{review.tripName}</span>
                    )}
                  </div>
                  {review.date && (
                    <p className="mt-1 text-[10px] text-muted-foreground">{review.date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
