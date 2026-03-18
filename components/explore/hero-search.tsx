"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, Compass, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSearchProps {
  title?: string
  subtitle?: string
  ctaText?: string
  backgroundImageUrl?: string
}

export function HeroSearch({
  title = "Explore!",
  subtitle = "Small group adventures to inspire the soul",
  ctaText = "Let's go!",
  backgroundImageUrl = "/images/explore/hero-mountains.jpg",
}: HeroSearchProps) {
  const router = useRouter()
  const [where, setWhere] = useState("")
  const [tripType, setTripType] = useState("")
  const [when, setWhen] = useState("")

  function handleSearch() {
    const params = new URLSearchParams()
    if (where) params.set("region", where)
    if (tripType) params.set("type", tripType)
    if (when) params.set("date", when)

    const qs = params.toString()
    router.push(`/destinations${qs ? `?${qs}` : ""}`)
  }

  return (
    <section className="relative flex min-h-[85vh] items-end pb-16 lg:pb-24">
      <Image
        src={backgroundImageUrl}
        alt="Adventure travel landscape"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-lg text-white/90 lg:text-xl">{"Don't just travel,"}</p>
          <h1 className="mb-3 font-heading text-5xl font-bold text-white lg:text-7xl">
            {title}
          </h1>
          <p className="text-lg text-white/80 lg:text-xl">{subtitle}</p>
        </div>

        <div className="rounded-xl bg-card p-3 shadow-2xl lg:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Where to?
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <select
                  className="w-full bg-transparent text-sm text-foreground outline-none"
                  value={where}
                  onChange={(e) => setWhere(e.target.value)}
                >
                  <option value="">Where would you like to go?</option>
                  <option value="europe">Europe</option>
                  <option value="asia">Asia</option>
                  <option value="africa">Africa</option>
                  <option value="south-america">South America</option>
                  <option value="central-america">Central America</option>
                  <option value="middle-east">Middle East</option>
                  <option value="polar">Polar Regions</option>
                  <option value="north-america">North America</option>
                  <option value="caribbean">Caribbean</option>
                  <option value="australasia">Australasia</option>
                </select>
              </div>
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Trip type
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
                <Compass className="h-4 w-4 shrink-0 text-primary" />
                <select
                  className="w-full bg-transparent text-sm text-foreground outline-none"
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value)}
                >
                  <option value="">What type of trip?</option>
                  <option value="discovery">Discovery</option>
                  <option value="walking">Walking & Trekking</option>
                  <option value="cycling">Cycling</option>
                  <option value="wildlife">Wildlife</option>
                  <option value="family">Family</option>
                  <option value="polar">Polar</option>
                  <option value="boat">Boat Journeys</option>
                  <option value="upgraded">Explore Upgraded</option>
                </select>
              </div>
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                When?
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
                <Calendar className="h-4 w-4 shrink-0 text-primary" />
                <select
                  className="w-full bg-transparent text-sm text-foreground outline-none"
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                >
                  <option value="">When would you like to go?</option>
                  <option value="apr-2026">April 2026</option>
                  <option value="may-2026">May 2026</option>
                  <option value="jun-2026">June 2026</option>
                  <option value="jul-2026">July 2026</option>
                  <option value="aug-2026">August 2026</option>
                  <option value="sep-2026">September 2026</option>
                  <option value="oct-2026">October 2026</option>
                  <option value="nov-2026">November 2026</option>
                  <option value="dec-2026">December 2026</option>
                  <option value="jan-2027">January 2027</option>
                </select>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleSearch}
              className="shrink-0 bg-primary px-8 font-heading text-base font-semibold text-primary-foreground hover:bg-hover lg:px-10"
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
