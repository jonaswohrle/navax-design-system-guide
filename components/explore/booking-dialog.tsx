"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useAuth, type Booking } from "@/lib/auth-context"

interface BookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tourSlug: string
  tourTitle: string
  departureId: string
  departureDate: string
  price: number
}

export function BookingDialog({
  open,
  onOpenChange,
  tourSlug,
  tourTitle,
  departureId,
  departureDate,
  price,
}: BookingDialogProps) {
  const { user, addBooking } = useAuth()
  const router = useRouter()
  const [passengers, setPassengers] = useState(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [requests, setRequests] = useState("")
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState<Booking | null>(null)
  const [error, setError] = useState("")

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login required</DialogTitle>
            <DialogDescription>
              You need to be logged in to book a trip. Create a free account or log in to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-hover" onClick={() => { onOpenChange(false); router.push("/my-explore") }}>
              Login / Register
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (confirmed) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) { setConfirmed(null); onOpenChange(false) } }}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-accent" />
            <DialogTitle className="text-xl font-bold">Booking confirmed!</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-foreground">{tourTitle}</p>
                <p className="text-muted-foreground">{departureDate}</p>
                <p className="text-muted-foreground">{confirmed.passengers} passenger(s)</p>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Your booking reference</p>
                  <p className="font-mono text-lg font-bold text-foreground">{confirmed.reference}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  A confirmation email has been sent. You can view your booking in My Explore.
                </p>
              </div>
            </DialogDescription>
            <Button
              className="mt-2 w-full bg-primary text-primary-foreground hover:bg-hover"
              onClick={() => { setConfirmed(null); onOpenChange(false); router.push("/my-explore?tab=bookings") }}
            >
              View my bookings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const totalPrice = price * passengers

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await addBooking({
      tourSlug,
      tourTitle,
      departureId,
      departureDate,
      passengers,
      passengerName: name || user.name,
      passengerEmail: email || user.email,
      passengerPhone: phone,
      specialRequests: requests,
      totalPrice,
    })
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else if (result.booking) {
      setConfirmed(result.booking)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book your trip</DialogTitle>
          <DialogDescription>{tourTitle} &mdash; {departureDate}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="passengers">Number of passengers</Label>
            <Input
              id="passengers"
              type="number"
              min={1}
              max={12}
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value) || 1)}
            />
          </div>
          <div>
            <Label htmlFor="book-name">Lead passenger name</Label>
            <Input
              id="book-name"
              defaultValue={user.name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="book-email">Email</Label>
            <Input
              id="book-email"
              type="email"
              defaultValue={user.email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="book-phone">Phone number (optional)</Label>
            <Input
              id="book-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="book-requests">Special requests (optional)</Label>
            <Textarea
              id="book-requests"
              value={requests}
              onChange={(e) => setRequests(e.target.value)}
              rows={3}
            />
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{passengers} x {"\u00A3"}{price.toLocaleString()}</span>
              <span className="text-lg font-bold text-foreground">{"\u00A3"}{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-hover">
            {loading ? "Processing..." : `Confirm booking - \u00A3${totalPrice.toLocaleString()}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
