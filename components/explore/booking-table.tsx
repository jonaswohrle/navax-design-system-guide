"use client"

import { useState } from "react"
import { Check, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingDialog } from "./booking-dialog"
import type { TourDeparture } from "@/lib/tour-data"

interface BookingTableProps {
  departures: TourDeparture[]
  tripTitle: string
  tripSlug: string
  duration: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Available: { bg: "bg-accent/10 text-accent", text: "Available" },
  Guaranteed: { bg: "bg-accent/10 text-accent", text: "Guaranteed" },
  Limited: { bg: "bg-warning/10 text-warning", text: "Limited spaces" },
  "Sold Out": { bg: "bg-muted text-muted-foreground", text: "Sold out" },
}

export function BookingTable({ departures, tripTitle, tripSlug, duration }: BookingTableProps) {
  const [bookingDep, setBookingDep] = useState<TourDeparture | null>(null)

  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-bold text-foreground" id="dates">
        Dates, prices and booking
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Prices are per person. Click Book to reserve your place.
      </p>

      {/* Booking dialog */}
      {bookingDep && (
        <BookingDialog
          open={!!bookingDep}
          onOpenChange={(open) => { if (!open) setBookingDep(null) }}
          tourSlug={tripSlug}
          tourTitle={tripTitle}
          departureId={bookingDep.id}
          departureDate={`${formatDate(bookingDep.startDate)} - ${formatDate(bookingDep.endDate)} (${duration})`}
          price={bookingDep.price}
        />
      )}

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-border lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Start date</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">End date</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Price</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Note</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground" />
            </tr>
          </thead>
          <tbody>
            {departures.map((dep, i) => {
              const style = STATUS_STYLES[dep.status] || STATUS_STYLES.Available
              const isSoldOut = dep.status === "Sold Out"
              return (
                <tr
                  key={dep.id}
                  className={`border-b border-border last:border-b-0 ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}
                >
                  <td className="px-4 py-3 text-foreground">{formatDate(dep.startDate)}</td>
                  <td className="px-4 py-3 text-foreground">{formatDate(dep.endDate)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      {dep.originalPrice && dep.originalPrice > dep.price && (
                        <span className="text-xs text-muted-foreground line-through">{"\u00A3"}{dep.originalPrice.toLocaleString()}</span>
                      )}
                      <span className={`font-semibold ${dep.originalPrice && dep.originalPrice > dep.price ? "text-primary" : "text-foreground"}`}>
                        {"\u00A3"}{dep.price.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${style.bg}`}>
                      {dep.status === "Guaranteed" && <Check className="h-3 w-3" />}
                      {dep.status === "Limited" && <AlertCircle className="h-3 w-3" />}
                      {dep.status === "Sold Out" && <X className="h-3 w-3" />}
                      {style.text}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{dep.note || ""}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      disabled={isSoldOut}
                      onClick={() => setBookingDep(dep)}
                      className={`text-xs ${isSoldOut ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-hover"}`}
                    >
                      {isSoldOut ? "Sold out" : "Book"}
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 lg:hidden">
        {departures.map((dep) => {
          const style = STATUS_STYLES[dep.status] || STATUS_STYLES.Available
          const isSoldOut = dep.status === "Sold Out"
          return (
            <div key={dep.id} className="rounded-lg border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{formatDate(dep.startDate)}</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${style.bg}`}>
                  {style.text}
                </span>
              </div>
              <p className="mb-2 text-xs text-muted-foreground">to {formatDate(dep.endDate)}</p>
              {dep.note && <p className="mb-2 text-xs text-muted-foreground">{dep.note}</p>}
              <div className="flex items-end justify-between">
                <div>
                  {dep.originalPrice && dep.originalPrice > dep.price && (
                    <span className="mr-2 text-xs text-muted-foreground line-through">{"\u00A3"}{dep.originalPrice.toLocaleString()}</span>
                  )}
                  <span className="text-lg font-bold text-foreground">{"\u00A3"}{dep.price.toLocaleString()}</span>
                </div>
                <Button
                  size="sm"
                  disabled={isSoldOut}
                  onClick={() => setBookingDep(dep)}
                  className={`text-xs ${isSoldOut ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-hover"}`}
                >
                  {isSoldOut ? "Sold out" : "Book now"}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
