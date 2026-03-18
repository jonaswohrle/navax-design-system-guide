"use client"

import Image from "next/image"
import Link from "next/link"
import { blobUrl } from "@/lib/blob-image-urls"
import { useState } from "react"
import { MapPin, Clock, Users, Mountain, Check, ChevronRight, Calendar, ExternalLink, ArrowLeft, User, Mail, Phone, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

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

function PhysicalRatingDots({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full ${
            i < rating ? "bg-primary" : "bg-border"
          }`}
        />
      ))}
    </div>
  )
}

function formatPrice(price: number) {
  return `\u00A3${price.toLocaleString()}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
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

/* -------------------------------------------------------------------------- */
/*  ChatTripCard (compact, used in search results grid)                       */
/* -------------------------------------------------------------------------- */

interface ChatTripCardProps {
  trip: TripSummary
  onViewDetails?: (slug: string) => void
}

export function ChatTripCard({ trip, onViewDetails }: ChatTripCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-border bg-card transition-shadow hover:shadow-md">
      <div className="relative h-28 w-full shrink-0">
        <Image
          src={blobUrl(trip.imageUrl)}
          alt={trip.title}
          fill
          className="object-cover"
          sizes="200px"
        />
        <Badge className="absolute left-2 top-2 bg-card/90 text-card-foreground text-[10px] font-medium backdrop-blur-sm border-0">
          {trip.tripType}
        </Badge>
      </div>
      <CardContent className="flex flex-1 flex-col p-3">
        <h4 className="mb-1.5 min-h-[2.5rem] line-clamp-2 text-sm font-semibold leading-tight text-foreground">
          {trip.title}
        </h4>
        <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span>{trip.destination}</span>
          <span className="mx-0.5">{"/"}</span>
          <Clock className="h-3 w-3 shrink-0" />
          <span>{trip.duration}</span>
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
              <span className="block text-[10px] text-muted-foreground">per person</span>
            </div>
            <PhysicalRatingDots rating={trip.physicalRating} />
          </div>
          <Button
            size="sm"
            variant="default"
            className="w-full bg-primary text-primary-foreground text-xs hover:bg-hover"
            onClick={() => onViewDetails?.(trip.slug)}
          >
            View Details
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
        No trips found matching your criteria. Try broadening your search.
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
          {"Showing " + trips.length + " of " + totalFound + " results"}
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  ChatTripDetail (expanded detail card)                                     */
/* -------------------------------------------------------------------------- */

interface ChatTripDetailProps {
  trip: TripDetailData
  onViewDepartures?: (slug: string) => void
}

export function ChatTripDetail({ trip, onViewDepartures }: ChatTripDetailProps) {
  return (
    <Card className="overflow-hidden border-border bg-card">
      {/* Hero image */}
      <div className="relative h-40 w-full">
        <Image
          src={blobUrl(trip.imageUrl)}
          alt={trip.title}
          fill
          className="object-cover"
          sizes="400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <Badge className="mb-1.5 bg-primary/90 text-primary-foreground text-[10px] border-0">
            {trip.tripType}
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
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>{trip.destination}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>{trip.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>Group: {trip.groupSize}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mountain className="h-3.5 w-3.5 text-primary" />
            <span>Activity: </span>
            <PhysicalRatingDots rating={trip.physicalRating} />
          </div>
        </div>

        <Separator />

        {/* Overview */}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {trip.overview.length > 200
            ? trip.overview.slice(0, 200) + "..."
            : trip.overview}
        </p>

        {/* Highlights */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
            Highlights
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
            <span className="text-[10px] text-muted-foreground">per person</span>
          </div>
          {trip.departureCount > 0 && (
            <span className="text-xs font-medium text-primary">
              {trip.departureCount} departures available
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
              <Calendar className="mr-1 h-3 w-3" />
              View Dates
            </Button>
          )}
          <Button
            size="sm"
            className="flex-1 bg-primary text-xs text-primary-foreground hover:bg-hover"
            asChild
          >
            <Link href={`/tours/${trip.slug}`} target="_blank">
              Full Page
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/*  ChatDeparturesTable                                                       */
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

  if (!departures || departures.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
        No departures currently available for this trip.
      </div>
    )
  }

  /* ---- Booking confirmation screen ---- */
  if (bookingDeparture && bookingStep === "confirmed") {
    return (
      <Card className="overflow-hidden border-border bg-card">
        <div className="border-b border-border bg-emerald-50 px-4 py-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Booking Confirmed
          </h4>
        </div>
        <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-7 w-7 text-emerald-600" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-foreground">
              {"You're booked!"}
            </h3>
            <p className="text-sm text-muted-foreground">{tourTitle}</p>
          </div>
          <div className="w-full max-w-xs space-y-2 rounded-lg border border-border bg-muted/30 p-4 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Departure</span>
              <span className="font-medium text-foreground">
                {formatDate(bookingDeparture.startDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Return</span>
              <span className="font-medium text-foreground">
                {formatDate(bookingDeparture.endDate)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total price</span>
              <span className="font-bold text-foreground">
                {formatPrice(bookingDeparture.price)}
              </span>
            </div>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            {"A confirmation email has been sent. Remember, with Explore Flex you can change or cancel free up to 60 days before departure."}
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
            Back to departures
          </Button>
        </div>
      </Card>
    )
  }

  /* ---- Inline booking form ---- */
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
            <span className="sr-only">Back</span>
          </Button>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Book - {tourTitle}
          </h4>
        </div>

        {/* Selected departure summary */}
        <div className="border-b border-border bg-primary/5 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Calendar className="h-3 w-3 text-primary" />
                {formatDate(bookingDeparture.startDate)} - {formatDate(bookingDeparture.endDate)}
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] ${statusColor(bookingDeparture.status)}`}
              >
                {bookingDeparture.status}
              </Badge>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-foreground">
                {formatPrice(bookingDeparture.price)}
              </span>
              <span className="block text-[10px] text-muted-foreground">per person</span>
            </div>
          </div>
        </div>

        {/* Booking form */}
        <form
          className="space-y-4 px-4 py-4"
          onSubmit={(e) => {
            e.preventDefault()
            setBookingStep("confirmed")
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="book-first" className="text-xs">First name</Label>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input id="book-first" required placeholder="Jane" className="h-9 pl-8 text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="book-last" className="text-xs">Last name</Label>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input id="book-last" required placeholder="Smith" className="h-9 pl-8 text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="book-email" className="text-xs">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input id="book-email" type="email" required placeholder="jane@example.com" className="h-9 pl-8 text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="book-phone" className="text-xs">Phone number</Label>
            <div className="relative">
              <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input id="book-phone" type="tel" required placeholder="+44 7700 900000" className="h-9 pl-8 text-sm" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="book-travelers" className="text-xs">Number of travellers</Label>
              <Input id="book-travelers" type="number" min={1} max={20} defaultValue={1} required className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="book-insurance" className="text-xs">Travel insurance</Label>
              <select
                id="book-insurance"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue="flex"
              >
                <option value="flex">Explore Flex (included)</option>
                <option value="own">Own insurance</option>
              </select>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-2 rounded-md border border-border bg-muted/30 px-3 py-2.5">
            <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {"Explore Flex: free changes and cancellation up to 60 days before departure. Your payment details are handled securely."}
            </p>
          </div>

          <Button
            type="submit"
            className="h-10 w-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-hover"
          >
            Confirm Booking - {formatPrice(bookingDeparture.price)} per person
          </Button>
        </form>
      </Card>
    )
  }

  /* ---- Default: departures table ---- */
  return (
    <Card className="overflow-hidden border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-4 py-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Departures - {tourTitle}
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
                <Calendar className="h-3 w-3 text-primary" />
                {formatDate(dep.startDate)} - {formatDate(dep.endDate)}
              </div>
              {dep.note && (
                <span className="text-[10px] text-primary font-medium">
                  {dep.note}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-[10px] ${statusColor(dep.status)}`}
              >
                {dep.status}
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
                  Book
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
