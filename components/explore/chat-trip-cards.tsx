"use client"

import Image from "next/image"
import Link from "next/link"
import { blobUrl } from "@/lib/blob-image-urls"
import { useState } from "react"
import { Zap, Flame, Sun, Car, Home, Leaf, Check, ChevronRight, FileText, ExternalLink, ArrowLeft, User, Mail, MapPin, Shield, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useUnifiedPersonalization } from "@/components/providers/ninetailed-wrapper"

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface TripSummary {
  slug: string
  title: string
  destination: string
  tripType: string
  duration: string
  durationDays: number
  price: number
  originalPrice?: number
  imageUrl: string
  physicalRating: number
  groupSize: string
}

interface TripDetailData {
  slug: string
  title: string
  destination: string
  tripType: string
  duration: string
  durationDays: number
  groupSize: string
  physicalRating: number
  maxAltitude?: string
  price: number
  originalPrice?: number
  imageUrl: string
  tripCode: string
  overview: string
  highlights: string[]
  included: string[]
  notIncluded: string[]
  itinerary: { day: number; title: string; description: string }[]
  totalDays: number
  departureCount: number
}

interface Departure {
  id: string
  startDate: string
  endDate: string
  price: number
  originalPrice?: number
  status: "Available" | "Limited" | "Guaranteed" | "Sold Out"
  note?: string
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function categoryIcon(destination: string) {
  switch (destination.toLowerCase()) {
    case "strom":
      return Zap
    case "gas":
      return Flame
    case "solar":
      return Sun
    case "e-auto":
      return Car
    case "wärmepumpe":
      return Home
    case "smart home":
      return Package
    default:
      return Zap
  }
}

function SustainabilityDots({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" title={`Nachhaltigkeit: ${rating}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Leaf
          key={i}
          className={`h-3 w-3 ${
            i < rating ? "fill-emerald-500 text-emerald-500" : "text-border"
          }`}
        />
      ))}
    </div>
  )
}

function formatPrice(price: number) {
  if (price === 0) return "Kostenlos"
  if (price >= 1000) return `${price.toLocaleString("de-DE")} \u20AC`
  return `${price} \u20AC`
}

function priceLabel(price: number, destination: string) {
  if (price === 0) return ""
  if (destination.toLowerCase() === "solar" || destination.toLowerCase() === "wärmepumpe" || destination.toLowerCase() === "e-auto") {
    return "einmalig"
  }
  return "pro Monat"
}

function statusColor(status: string) {
  switch (status) {
    case "Guaranteed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "Available":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Limited":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "Sold Out":
      return "bg-muted text-muted-foreground border-border"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "Guaranteed":
      return "Empfohlen"
    case "Available":
      return "Verfügbar"
    case "Limited":
      return "Begrenztes Angebot"
    case "Sold Out":
      return "Ausverkauft"
    default:
      return status
  }
}

/* -------------------------------------------------------------------------- */
/*  ChatTripCard (compact tariff card in search results grid)                 */
/* -------------------------------------------------------------------------- */

interface ChatTripCardProps {
  trip: TripSummary
  onViewDetails?: (slug: string) => void
}

export function ChatTripCard({ trip, onViewDetails }: ChatTripCardProps) {
  const Icon = categoryIcon(trip.destination)

  return (
    <Card className="flex h-full flex-col overflow-hidden border-border bg-card transition-shadow hover:shadow-md">
      <div className="relative h-28 w-full shrink-0">
        <Image
          src={blobUrl(trip.imageUrl)}
          alt={trip.title}
          fill
          unoptimized
          className="object-cover"
          sizes="200px"
        />
        <Badge className="absolute left-2 top-2 bg-card/90 text-card-foreground text-[10px] font-medium backdrop-blur-sm border-0">
          <Icon className="mr-1 h-3 w-3" />
          {trip.destination}
        </Badge>
      </div>
      <CardContent className="flex flex-1 flex-col p-3">
        <h4 className="mb-1.5 min-h-[2.5rem] line-clamp-2 text-sm font-semibold leading-tight text-foreground">
          {trip.title}
        </h4>
        <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          <FileText className="h-3 w-3 shrink-0" />
          <span>{trip.duration}</span>
          <span className="mx-0.5">{"/"}</span>
          <span>{trip.groupSize}</span>
        </div>
        <div className="mt-auto">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-foreground">
                {formatPrice(trip.price)}
              </span>
              {trip.originalPrice && trip.originalPrice > trip.price && (
                <span className="ml-1 text-xs text-muted-foreground line-through">
                  {formatPrice(trip.originalPrice)}
                </span>
              )}
              <span className="block text-[10px] text-muted-foreground">{priceLabel(trip.price, trip.destination)}</span>
            </div>
            <SustainabilityDots rating={trip.physicalRating} />
          </div>
          <Button
            size="sm"
            variant="default"
            className="w-full bg-primary text-primary-foreground text-xs hover:bg-hover"
            onClick={() => onViewDetails?.(trip.slug)}
          >
            Details ansehen
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*  ChatTripGrid                                                              */
/* -------------------------------------------------------------------------- */

interface ChatTripGridProps {
  trips: TripSummary[]
  totalFound: number
  onViewDetails?: (slug: string) => void
}

export function ChatTripGrid({ trips, totalFound, onViewDetails }: ChatTripGridProps) {
  if (!trips || trips.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
        Keine passenden Tarife gefunden. Versuchen Sie es mit anderen Suchkriterien.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 @container">
        {trips.map((trip) => (
          <ChatTripCard key={trip.slug} trip={trip} onViewDetails={onViewDetails} />
        ))}
      </div>
      {totalFound > trips.length && (
        <p className="text-center text-xs text-muted-foreground">
          {trips.length + " von " + totalFound + " Ergebnissen angezeigt"}
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  ChatTripDetail (expanded tariff detail card)                              */
/* -------------------------------------------------------------------------- */

interface ChatTripDetailProps {
  trip: TripDetailData
  onViewDepartures?: (slug: string) => void
}

export function ChatTripDetail({ trip, onViewDepartures }: ChatTripDetailProps) {
  const Icon = categoryIcon(trip.destination)

  return (
    <Card className="overflow-hidden border-border bg-card">
      {/* Hero image */}
      <div className="relative h-40 w-full">
        <Image
          src={blobUrl(trip.imageUrl)}
          alt={trip.title}
          fill
          unoptimized
          className="object-cover"
          sizes="400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <Badge className="mb-1.5 bg-primary/90 text-primary-foreground text-[10px] border-0">
            <Icon className="mr-1 h-3 w-3" />
            {trip.destination}
          </Badge>
          <h3 className="text-base font-bold leading-tight text-background">
            {trip.title}
          </h3>
        </div>
      </div>

      <CardContent className="space-y-4 p-4">
        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon className="h-3.5 w-3.5 text-primary" />
            <span>{trip.destination}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span>{trip.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Home className="h-3.5 w-3.5 text-primary" />
            <span>{"Haushalt: " + trip.groupSize}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Leaf className="h-3.5 w-3.5 text-primary" />
            <span>{"Nachhaltigkeit: "}</span>
            <SustainabilityDots rating={trip.physicalRating} />
          </div>
        </div>

        <Separator />

        {/* Overview */}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {trip.overview.length > 250
            ? trip.overview.slice(0, 250) + "..."
            : trip.overview}
        </p>

        {/* Highlights */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
            Vorteile
          </h4>
          <ul className="space-y-1">
            {trip.highlights.slice(0, 4).map((h, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price & actions */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-foreground">
                {formatPrice(trip.price)}
              </span>
              {trip.originalPrice && trip.originalPrice > trip.price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(trip.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">{priceLabel(trip.price, trip.destination)}</span>
          </div>
          {trip.departureCount > 0 && (
            <span className="text-xs font-medium text-primary">
              {trip.departureCount + " Optionen verfügbar"}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {trip.departureCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => onViewDepartures?.(trip.slug)}
            >
              <Package className="mr-1 h-3 w-3" />
              Optionen ansehen
            </Button>
          )}
          <Button
            size="sm"
            className="flex-1 bg-primary text-xs text-primary-foreground hover:bg-hover"
            asChild
          >
            <Link href={`/tours/${trip.slug}`} target="_blank">
              Zum Tarif
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*  ChatDeparturesTable (tariff options & contract form)                      */
/* -------------------------------------------------------------------------- */

interface ChatDeparturesTableProps {
  tourTitle: string
  tourSlug: string
  departures: Departure[]
}

export function ChatDeparturesTable({
  tourTitle,
  tourSlug,
  departures,
}: ChatDeparturesTableProps) {
  const [bookingDeparture, setBookingDeparture] = useState<Departure | null>(null)
  const [bookingStep, setBookingStep] = useState<"form" | "confirmed">("form")
  const personalization = useUnifiedPersonalization()

  if (!departures || departures.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
        Derzeit keine Tarifoptionen verfügbar.
      </div>
    )
  }

  /* ---- Contract confirmation screen ---- */
  if (bookingDeparture && bookingStep === "confirmed") {
    return (
      <Card className="overflow-hidden border-border bg-card">
        <div className="border-b border-border bg-emerald-50 px-4 py-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Vertrag abgeschlossen
          </h4>
        </div>
        <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-7 w-7 text-emerald-600" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-foreground">
              Willkommen bei E.ON!
            </h3>
            <p className="text-sm text-muted-foreground">{tourTitle}</p>
          </div>
          <div className="w-full max-w-xs space-y-2 rounded-lg border border-border bg-muted/30 p-4 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tarifoption</span>
              <span className="font-medium text-foreground">
                {bookingDeparture.note || tourTitle}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Preis</span>
              <span className="font-bold text-foreground">
                {formatPrice(bookingDeparture.price)}
              </span>
            </div>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            {"Eine Bestätigungs-E-Mail wurde versendet. Sie haben ein 14-tägiges Widerrufsrecht ab Vertragsabschluss."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              setBookingDeparture(null)
              setBookingStep("form")
            }}
          >
            <ArrowLeft className="mr-1.5 h-3 w-3" />
            {"Zurück zur Übersicht"}
          </Button>
        </div>
      </Card>
    )
  }

  /* ---- Inline contract form ---- */
  if (bookingDeparture && bookingStep === "form") {
    return (
      <Card className="overflow-hidden border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setBookingDeparture(null)}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="sr-only">{"Zurück"}</span>
          </Button>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            {"Vertrag abschließen -- "}{tourTitle}
          </h4>
        </div>

        {/* Selected option summary */}
        <div className="border-b border-border bg-primary/5 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Package className="h-3 w-3 text-primary" />
                {bookingDeparture.note || tourTitle}
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] ${statusColor(bookingDeparture.status)}`}
              >
                {statusLabel(bookingDeparture.status)}
              </Badge>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-foreground">
                {formatPrice(bookingDeparture.price)}
              </span>
              {bookingDeparture.originalPrice && bookingDeparture.originalPrice > bookingDeparture.price && (
                <span className="ml-1 text-[10px] text-muted-foreground line-through">
                  {formatPrice(bookingDeparture.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contract form */}
        <form
          className="space-y-4 px-4 py-4"
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const email = formData.get("book-email") as string
            const firstName = formData.get("book-first") as string
            if (personalization) {
              personalization.track("book_trip", { trip: tourTitle })
              if (email || firstName) {
                personalization.identify({
                  ...(email ? { email } : {}),
                  ...(firstName ? { name: firstName } : {}),
                })
              }
            }
            setBookingStep("confirmed")
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="book-first" className="text-xs">Vorname</Label>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input id="book-first" name="book-first" required placeholder="Max" className="h-9 pl-8 text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="book-last" className="text-xs">Nachname</Label>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input id="book-last" required placeholder="Mustermann" className="h-9 pl-8 text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="book-email" className="text-xs">E-Mail-Adresse</Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input id="book-email" name="book-email" type="email" required placeholder="max@beispiel.de" className="h-9 pl-8 text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="book-plz" className="text-xs">Postleitzahl</Label>
            <div className="relative">
              <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input id="book-plz" required placeholder="10115" pattern="[0-9]{5}" maxLength={5} className="h-9 pl-8 text-sm" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="book-household" className="text-xs">{"Haushaltsgröße"}</Label>
              <select
                id="book-household"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue="2"
              >
                <option value="1">1 Person</option>
                <option value="2">2 Personen</option>
                <option value="3">3 Personen</option>
                <option value="4">4 Personen</option>
                <option value="5">5+ Personen</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="book-duration" className="text-xs">Vertragslaufzeit</Label>
              <select
                id="book-duration"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue="12"
              >
                <option value="flex">{"Monatlich kündbar"}</option>
                <option value="12">12 Monate</option>
                <option value="24">24 Monate</option>
              </select>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-2 rounded-md border border-border bg-muted/30 px-3 py-2.5">
            <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {"14-Tage Widerrufsrecht: Sie können Ihren Vertrag innerhalb von 14 Tagen ohne Angabe von Gründen widerrufen. Ihre Daten werden sicher und DSGVO-konform verarbeitet."}
            </p>
          </div>

          <Button
            type="submit"
            className="h-10 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-hover"
          >
            {"Vertrag bestätigen -- "}{formatPrice(bookingDeparture.price)}
          </Button>
        </form>
      </Card>
    )
  }

  /* ---- Default: tariff options table ---- */
  return (
    <Card className="overflow-hidden border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-4 py-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
          {"Tarifoptionen -- "}{tourTitle}
        </h4>
      </div>
      <div className="divide-y divide-border">
        {departures.map((dep) => (
          <div
            key={dep.id}
            className="flex items-center justify-between px-4 py-2.5"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Package className="h-3 w-3 text-primary" />
                {dep.note || dep.id}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-[10px] ${statusColor(dep.status)}`}
              >
                {statusLabel(dep.status)}
              </Badge>
              <div className="text-right">
                <span className="text-xs font-bold text-foreground">
                  {formatPrice(dep.price)}
                </span>
                {dep.originalPrice && dep.originalPrice > dep.price && (
                  <span className="ml-1 text-[10px] text-muted-foreground line-through">
                    {formatPrice(dep.originalPrice)}
                  </span>
                )}
              </div>
              {dep.status !== "Sold Out" && (
                <Button
                  size="sm"
                  className="h-7 bg-primary px-2.5 text-[10px] text-primary-foreground hover:bg-hover"
                  onClick={() => {
                    setBookingDeparture(dep)
                    setBookingStep("form")
                  }}
                >
                  Bestellen
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
