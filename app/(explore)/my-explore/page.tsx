"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { User, Heart, CalendarDays, LogOut, Phone, Mail, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { TOURS } from "@/lib/tour-data"
import { TripCard } from "@/components/explore/trip-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function LoginForm() {
  const { login, register } = useAuth()
  const [tab, setTab] = useState<"login" | "register" | "contact">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.error) setError(result.error)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await register(name, email, password)
    setLoading(false)
    if (result.error) setError(result.error)
  }

  return (
    <div className="mx-auto max-w-md py-12 lg:py-20">
      <h1 className="mb-2 text-center font-heading text-3xl font-bold text-foreground">My Explore</h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        Log in to manage your bookings, wishlist and profile
      </p>

      {/* Tabs */}
      <div className="mb-6 flex rounded-lg border border-border bg-muted p-1">
        {(["login", "register", "contact"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError("") }}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "contact" ? "Help" : t}
          </button>
        ))}
      </div>

      {tab === "login" && (
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="login-email">Email address</Label>
            <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="login-pass">Password</Label>
            <Input id="login-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-hover">
            {loading ? "Logging in..." : "Log in"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {"Don't have an account? "}
            <button type="button" onClick={() => setTab("register")} className="font-semibold text-primary hover:underline">
              Register
            </button>
          </p>
        </form>
      )}

      {tab === "register" && (
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="reg-name">Full name</Label>
            <Input id="reg-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="reg-email">Email address</Label>
            <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="reg-pass">Password (min 6 characters)</Label>
            <Input id="reg-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-hover">
            {loading ? "Creating account..." : "Create account"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <button type="button" onClick={() => setTab("login")} className="font-semibold text-primary hover:underline">
              Log in
            </button>
          </p>
        </form>
      )}

      {tab === "contact" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="mb-3 font-heading text-lg font-semibold text-foreground">Contact our team</h3>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:01252218716" className="font-semibold text-foreground hover:text-primary">01252 218 716</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:info@explore.co.uk" className="font-semibold text-foreground hover:text-primary">info@explore.co.uk</a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Mon-Fri 9:00am - 7:00pm, Sat 9:00am - 5:00pm</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Dashboard() {
  const { user, wishlist, bookings, logout } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabParam = searchParams.get("tab") || "bookings"
  const [tab, setTab] = useState(tabParam)

  useEffect(() => {
    setTab(searchParams.get("tab") || "bookings")
  }, [searchParams])

  const switchTab = (t: string) => {
    setTab(t)
    router.replace(`/my-explore?tab=${t}`, { scroll: false })
  }

  const wishedTours = wishlist
    .map((slug) => TOURS[slug])
    .filter(Boolean)

  if (!user) return null

  return (
    <div className="mx-auto max-w-5xl py-8 lg:py-12">
      {/* User greeting */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="gap-1.5 text-xs">
          <LogOut className="h-3.5 w-3.5" />
          Log out
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 rounded-lg border border-border bg-muted p-1">
        {[
          { key: "bookings", label: "My Bookings", icon: CalendarDays },
          { key: "wishlist", label: "My Wishlist", icon: Heart },
          { key: "profile", label: "My Profile", icon: User },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => switchTab(key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Bookings */}
      {tab === "bookings" && (
        <div>
          {bookings.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <CalendarDays className="mx-auto mb-4 h-10 w-10 text-muted-foreground/40" />
              <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">No bookings yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">{"Ready for your next adventure? Browse our trips and book your dream holiday."}</p>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-hover">
                <Link href="/destinations">Browse trips</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {bookings.map((b) => (
                <div key={b.id} className="rounded-lg border border-border bg-card p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                          b.status === "Confirmed" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                        }`}>
                          {b.status}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">{b.reference}</span>
                      </div>
                      <h3 className="font-heading text-base font-semibold text-foreground">
                        <Link href={`/tours/${b.tour_slug}`} className="hover:text-primary">
                          {b.tour_title}
                        </Link>
                      </h3>
                      <p className="text-xs text-muted-foreground">{b.departure_date}</p>
                      <p className="text-xs text-muted-foreground">{b.passengers} passenger(s) &mdash; {b.passenger_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-xl font-bold text-foreground">{"\u00A3"}{b.total_price?.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Total price</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wishlist */}
      {tab === "wishlist" && (
        <div>
          {wishedTours.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <Heart className="mx-auto mb-4 h-10 w-10 text-muted-foreground/40" />
              <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">Your wishlist is empty</h3>
              <p className="mb-4 text-sm text-muted-foreground">Tap the heart icon on any trip to save it here for later.</p>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-hover">
                <Link href="/destinations">Explore trips</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishedTours.map((tour) => (
                <TripCard
                  key={tour.slug}
                  trip={{
                    title: tour.title,
                    destination: tour.destination,
                    tripType: tour.tripType,
                    duration: tour.duration,
                    price: tour.price,
                    originalPrice: tour.originalPrice,
                    imageUrl: tour.imageUrl,
                    tripCode: tour.tripCode,
                    slug: tour.slug,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile */}
      {tab === "profile" && (
        <div className="mx-auto max-w-md">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted-foreground">Total bookings</dt>
                <dd className="font-semibold text-foreground">{bookings.length}</dd>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted-foreground">Wishlist items</dt>
                <dd className="font-semibold text-foreground">{wishlist.length}</dd>
              </div>
              <div className="flex justify-between pb-2">
                <dt className="text-muted-foreground">Account type</dt>
                <dd className="font-semibold text-foreground">Explorer</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MyExplorePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background px-4">
      {user ? <Dashboard /> : <LoginForm />}
    </div>
  )
}
