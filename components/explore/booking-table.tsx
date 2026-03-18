"use client"

import { useState } from "react"
import { Check, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TourDeparture } from "@/lib/tour-data"

interface BookingTableProps {
  departures: TourDeparture[]
  tripTitle: string
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

export function BookingTable({ departures, tripTitle, duration }: BookingTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleBook = (id: string) => {
    setSelectedId(id)
    setShowConfirm(true)
  }

  const confirmBooking = () => {
    setShowConfirm(false)
    alert(`Booking confirmed for ${tripTitle}! A confirmation email will be sent shortly. (Demo)`)
    setSelectedId(null)
  }

  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-bold text-foreground" id="dates">
        Dates, prices and booking
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Prices are per person. Click Book to reserve your place.
      </p>

      {/* Booking confirmation modal */}
      {showConfirm && selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl">
            <h3 className="mb-2 font-heading text-lg font-bold text-foreground">Confirm your booking</h3>
            <p className="mb-1 text-sm text-foreground">{tripTitle}</p>
            <p className="mb-1 text-sm text-muted-foreground">{duration}</p>
            {(() => {
              const dep = departures.find((d) => d.id === selectedId)
              if (!dep) return null
              return (
                <>
                  <p className="mb-1 text-sm text-muted-foreground">
                    {formatDate(dep.startDate)} - {formatDate(dep.endDate)}
                  </p>
                  <p className="mb-4 text-lg font-bold text-primary">
                    {"\u00A3"}{dep.price.toLocaleString()} per person
                  </p>
                </>
              )
            })()}
            <div className="flex gap-3">
              <Button
                onClick={() => { setShowConfirm(false); setSelectedId(null) }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmBooking}
                className="flex-1 bg-primary text-primary-foreground hover:bg-hover"
              >
                Confirm booking
              </Button>
            </div>
          </div>
        </div>
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
                  className={`border-b border-border last:border-b-0 ${
                    i % 2 === 0 ? "bg-card" : "bg-muted/20"
                  } ${selectedId === dep.id ? "ring-2 ring-primary ring-inset" : ""}`}
                >
                  <td className="px-4 py-3 text-foreground">{formatDate(dep.startDate)}</td>
                  <td className="px-4 py-3 text-foreground">{formatDate(dep.endDate)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      {dep.originalPrice && dep.originalPrice > dep.price && (
                        <span className="text-xs text-muted-foreground line-through">
                          {"\u00A3"}{dep.originalPrice.toLocaleString()}
                        </span>
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
                      onClick={() => handleBook(dep.id)}
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
                    <span className="mr-2 text-xs text-muted-foreground line-through">
                      {"\u00A3"}{dep.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-lg font-bold text-foreground">
                    {"\u00A3"}{dep.price.toLocaleString()}
                  </span>
                </div>
                <Button
                  size="sm"
                  disabled={isSoldOut}
                  onClick={() => handleBook(dep.id)}
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
