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
        <Image
          src={blobUrl(backgroundImageUrl)}
          alt="Scenic adventure travel destination"
          fill
          unoptimized
          className="object-cover"
          priority
          sizes="100vw"
        />

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
              <h1 className="mb-3 font-serif text-5xl font-bold text-white drop-shadow-lg lg:text-7xl lg:leading-tight text-balance">
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
              <p className="mb-1 font-serif text-xl italic text-white/90 drop-shadow-lg lg:text-2xl">
                Ihr Energiepartner
              </p>
              <h1 className="mb-3 font-serif text-6xl font-bold text-white drop-shadow-lg lg:text-[100px] lg:leading-[0.9]">
                Energie neu denken
              </h1>
              <p className="text-xl font-bold text-white/90 drop-shadow-lg lg:text-3xl">
                Strom, Gas & Solarlösungen für Ihr Zuhause
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
              {/* Product */}
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold text-primary-foreground">
                  Was suchen Sie?
                </label>
                <div className="flex items-center gap-2 rounded border border-white/20 bg-white px-3 py-2.5">
                  <Compass className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <select
                    className="w-full bg-transparent text-sm text-foreground outline-none"
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                    aria-label="Produkt"
                  >
                    <option value="">Produkt wählen...</option>
                    <option value="strom">Strom</option>
                    <option value="gas">Erdgas</option>
                    <option value="solar">Solaranlage</option>
                    <option value="waermepumpe">Wärmepumpe</option>
                    <option value="wallbox">Wallbox & E-Mobilität</option>
                    <option value="smart-home">Smart Home</option>
                  </select>
                </div>
              </div>

              {/* Postleitzahl */}
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold text-primary-foreground">
                  Ihre Postleitzahl
                </label>
                <div className="flex items-center gap-2 rounded border border-white/20 bg-white px-3 py-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    placeholder="z.B. 45131"
                    aria-label="Postleitzahl"
                    maxLength={5}
                  />
                </div>
              </div>

              {/* Verbrauch */}
              <div className="flex-1">
                <label className="mb-1 block text-xs font-semibold text-primary-foreground">
                  Ihr Verbrauch (kWh/Jahr)
                </label>
                <div className="flex items-center gap-2 rounded border border-white/20 bg-white px-3 py-2.5">
                  <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <select
                    className="w-full bg-transparent text-sm text-foreground outline-none"
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                    aria-label="Verbrauch"
                  >
                    <option value="">Bitte wählen...</option>
                    <option value="1500">1.500 kWh (1 Person)</option>
                    <option value="2500">2.500 kWh (2 Personen)</option>
                    <option value="3500">3.500 kWh (3 Personen)</option>
                    <option value="4500">4.500 kWh (4 Personen)</option>
                    <option value="6000">6.000 kWh (5+ Personen)</option>
                    <option value="8000">8.000+ kWh (Großhaushalt)</option>
                  </select>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 rounded bg-explore-yellow px-8 py-3 text-sm font-bold text-explore-yellow-foreground transition-colors hover:bg-explore-yellow/90 lg:self-end"
              >
                Tarif berechnen
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
