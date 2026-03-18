"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, Compass, Calendar, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

const VIDEO_URL =
  "https://s3.eu-west-1.amazonaws.com/assetbank-eu-west-1-repurposed/explore_e845492678176c101f40037775672ea9%2Fc78%2FDGUUNJpQ5gkCnLDG2JSQWjKrmUtPZ4oT.mp4"

interface HeroSearchProps {
  title?: string
  subtitle?: string
  ctaText?: string
  backgroundImageUrl?: string
}

export function HeroSearch({
  title = "Unforgettable adventures.",
  subtitle = "From bold year-long experiences, to small and unscripted moments of joy, our small group adventures create stories to tell for a lifetime.",
  ctaText = "Search",
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
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden lg:min-h-[80vh]">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        poster={backgroundImageUrl}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>
      {/* Fallback image for when video doesn't load */}
      <Image
        src={backgroundImageUrl}
        alt=""
        fill
        className="object-cover"
        priority
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-16 text-center">
        <div className="mb-8 inline-block rounded bg-explore-yellow/90 px-6 py-3 lg:px-8 lg:py-4">
          <h1 className="font-heading text-3xl font-bold text-explore-yellow-foreground lg:text-5xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-explore-yellow-foreground/80 lg:text-base">
            {subtitle}
          </p>
        </div>

        {/* Search bar - matching Explore's style */}
        <div className="mx-auto max-w-3xl rounded-lg bg-white p-2 shadow-xl lg:p-3">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-0">
            {/* Where */}
            <div className="flex flex-1 items-center gap-2 border-b border-border px-3 py-2 lg:border-b-0 lg:border-r">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <select
                className="w-full bg-transparent text-sm text-foreground outline-none"
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                aria-label="Where to?"
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

            {/* Trip type */}
            <div className="flex flex-1 items-center gap-2 border-b border-border px-3 py-2 lg:border-b-0 lg:border-r">
              <Compass className="h-4 w-4 shrink-0 text-primary" />
              <select
                className="w-full bg-transparent text-sm text-foreground outline-none"
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                aria-label="Trip type"
              >
                <option value="">What type of trip?</option>
                <option value="discovery">Discovery</option>
                <option value="walking">Walking & Trekking</option>
                <option value="cycling">Cycling</option>
                <option value="wildlife">Wildlife</option>
                <option value="family">Family</option>
                <option value="polar">Polar</option>
                <option value="boat">Boat Journeys</option>
                <option value="upgraded">Upgraded</option>
              </select>
            </div>

            {/* When */}
            <div className="flex flex-1 items-center gap-2 px-3 py-2">
              <Calendar className="h-4 w-4 shrink-0 text-primary" />
              <select
                className="w-full bg-transparent text-sm text-foreground outline-none"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                aria-label="When?"
              >
                <option value="">When?</option>
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

            <Button
              onClick={handleSearch}
              className="shrink-0 rounded-md bg-explore-yellow px-6 py-2.5 text-sm font-bold text-explore-yellow-foreground hover:bg-explore-yellow/90"
            >
              <Search className="mr-1.5 h-4 w-4" />
              {ctaText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
