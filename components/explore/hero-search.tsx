"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, Compass, Calendar, ChevronRight } from "lucide-react"
import { blobUrl } from "@/lib/blob-image-urls"
import { WaveDivider } from "./wave-divider"

interface HeroSearchProps {
  backgroundImageUrl?: string
  headline?: string
  subheadline?: string
  ctaLabel?: string
  ctaUrl?: string
}

export function HeroSearch({
  backgroundImageUrl = "/images/explore/hero-santorini.png",
  headline,
  subheadline,
  ctaLabel,
  ctaUrl,
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
    router.push(`/search${qs ? `?${qs}` : ""}`)
  }

  return (
    <>
      {/* Hero image + overlay text */}
      <section className="relative flex min-h-[55vh] items-center overflow-hidden lg:min-h-[70vh]">
        {/* Background image */}
        {(() => {
          const heroSrc = blobUrl(backgroundImageUrl)
          const heroIsExternal = heroSrc.startsWith("http") && !heroSrc.includes("blob.vercel-storage.com")
          return heroIsExternal ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={heroSrc}
              alt="Scenic adventure travel destination"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={heroSrc}
              alt="Scenic adventure travel destination"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )
        })()}

        {/* Subtle dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />

        {/* Decorative white circle line art (matching real site) */}
        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 opacity-20 lg:opacity-30" aria-hidden="true">
          <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="350" cy="250" r="180" stroke="white" strokeWidth="1.5" />
            <circle cx="350" cy="250" r="130" stroke="white" strokeWidth="1" />
            <path d="M200 100 Q350 50 450 200" stroke="white" strokeWidth="1" fill="none" />
            <path d="M180 350 Q300 450 480 300" stroke="white" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Hero text -- matching real explore.co.uk style */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 lg:px-8">
          {headline ? (
            <>
              <h1 className="mb-3 font-serif text-5xl font-bold text-explore-yellow drop-shadow-lg lg:text-7xl lg:leading-tight text-balance">
                {headline}
              </h1>
              {subheadline && (
                <p className="max-w-xl text-lg font-medium text-white/90 drop-shadow-lg lg:text-xl">
                  {subheadline}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="mb-1 font-serif text-xl italic text-explore-yellow drop-shadow-lg lg:text-2xl">
                {"Don't just travel,"}
              </p>
              <h1 className="mb-3 font-serif text-7xl font-bold text-explore-yellow drop-shadow-lg lg:text-[120px] lg:leading-[0.9]">
                Explore!
              </h1>
              <p className="text-xl font-bold text-white drop-shadow-lg lg:text-3xl">
                Small group adventures
              </p>
            </>
          )}
        </div>
      </section>

      {/* Wave divider + search bar on the red curve */}
      <div className="relative">
        <WaveDivider color="hsl(var(--primary))" />

        {/* Search bar sits ON the red wave */}
        <div className="bg-primary pb-10 pt-2">
          <div className="mx-auto max-w-5xl px-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
              {/* Where */}
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold text-primary-foreground">
                  Where would you like to go?
                </label>
                <div className="flex items-center gap-2 rounded border border-white/20 bg-white px-3 py-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <select
                    className="w-full bg-transparent text-sm text-foreground outline-none"
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                    aria-label="Destination"
                  >
                    <option value="">Search for a destination...</option>
                    <option value="europe">Europe</option>
                    <option value="asia">Asia</option>
                    <option value="africa">Africa</option>
                    <option value="south-america">South America</option>
                    <option value="central-america">Central America</option>
                    <option value="middle-east">Middle East</option>
                    <option value="polar">Polar</option>
                    <option value="north-america">North America</option>
                    <option value="caribbean">Caribbean</option>
                    <option value="australasia">Australasia</option>
                  </select>
                </div>
              </div>

              {/* Trip type */}
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold text-primary-foreground">
                  What type of trip?
                </label>
                <div className="flex items-center gap-2 rounded border border-white/20 bg-white px-3 py-2.5">
                  <Compass className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <select
                    className="w-full bg-transparent text-sm text-foreground outline-none"
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    aria-label="Trip type"
                  >
                    <option value="">Any type</option>
                    <option value="discovery">Classic Discovery</option>
                    <option value="walking">Walking &amp; Trekking</option>
                    <option value="cycling">Cycling</option>
                    <option value="wildlife">Wildlife</option>
                    <option value="family">Family</option>
                    <option value="polar">Polar</option>
                    <option value="boat">Boat Journeys</option>
                    <option value="upgraded">Explore Upgraded</option>
                    <option value="solo">Solo</option>
                    <option value="food-drink">Food &amp; Drink</option>
                  </select>
                </div>
              </div>

              {/* When */}
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold text-primary-foreground">
                  When would you like to go?
                </label>
                <div className="flex items-center gap-2 rounded border border-white/20 bg-white px-3 py-2.5">
                  <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <select
                    className="w-full bg-transparent text-sm text-foreground outline-none"
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                    aria-label="When?"
                  >
                    <option value="">Anytime</option>
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

              {/* CTA */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 rounded bg-explore-yellow px-8 py-3 text-sm font-bold text-foreground transition-colors hover:bg-explore-yellow/90 lg:self-end"
              >
                {"Let's go!"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
