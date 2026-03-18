"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export interface AuthUser {
  id: number
  name: string
  email: string
}

export interface Booking {
  id: number
  reference: string
  tour_slug: string
  tour_title: string
  departure_date: string
  passengers: number
  passenger_name: string
  passenger_email?: string
  total_price: number
  status: string
  created_at: string
}

interface AuthState {
  user: AuthUser | null
  wishlist: string[]
  bookings: Booking[]
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>
  logout: () => void
  toggleWishlist: (tourSlug: string) => Promise<void>
  isInWishlist: (tourSlug: string) => boolean
  addBooking: (data: BookingInput) => Promise<{ booking?: Booking; error?: string }>
  refreshBookings: () => Promise<void>
}

export interface BookingInput {
  tourSlug: string
  tourTitle: string
  departureId: string
  departureDate: string
  passengers: number
  passengerName: string
  passengerEmail: string
  passengerPhone?: string
  specialRequests?: string
  totalPrice: number
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    wishlist: [],
    bookings: [],
    isLoading: true,
  })

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("explore_user")
    if (stored) {
      try {
        const user = JSON.parse(stored) as AuthUser
        setState((s) => ({ ...s, user, isLoading: false }))
      } catch {
        setState((s) => ({ ...s, isLoading: false }))
      }
    } else {
      setState((s) => ({ ...s, isLoading: false }))
    }
  }, [])

  // Fetch wishlist + bookings when user changes
  useEffect(() => {
    if (!state.user) {
      setState((s) => ({ ...s, wishlist: [], bookings: [] }))
      return
    }
    const fetchData = async () => {
      try {
        const [wRes, bRes] = await Promise.all([
          fetch(`/api/wishlist?userId=${state.user!.id}`),
          fetch(`/api/bookings?userId=${state.user!.id}`),
        ])
        const wData = await wRes.json()
        const bData = await bRes.json()
        setState((s) => ({
          ...s,
          wishlist: wData.items || [],
          bookings: bData.bookings || [],
        }))
      } catch {
        // silently fail
      }
    }
    fetchData()
  }, [state.user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) return { error: data.error || "Login failed" }
    localStorage.setItem("explore_user", JSON.stringify(data.user))
    setState((s) => ({ ...s, user: data.user }))
    return {}
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) return { error: data.error || "Registration failed" }
    localStorage.setItem("explore_user", JSON.stringify(data.user))
    setState((s) => ({ ...s, user: data.user }))
    return {}
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("explore_user")
    setState({ user: null, wishlist: [], bookings: [], isLoading: false })
  }, [])

  const toggleWishlist = useCallback(async (tourSlug: string) => {
    if (!state.user) return
    // Optimistic update
    setState((s) => ({
      ...s,
      wishlist: s.wishlist.includes(tourSlug)
        ? s.wishlist.filter((s2) => s2 !== tourSlug)
        : [...s.wishlist, tourSlug],
    }))
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: state.user.id, tourSlug }),
    })
  }, [state.user])

  const isInWishlist = useCallback(
    (tourSlug: string) => state.wishlist.includes(tourSlug),
    [state.wishlist]
  )

  const addBooking = useCallback(async (data: BookingInput) => {
    if (!state.user) return { error: "Please log in to book" }
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: state.user.id, ...data }),
    })
    const result = await res.json()
    if (!res.ok) return { error: result.error || "Booking failed" }
    setState((s) => ({ ...s, bookings: [result.booking, ...s.bookings] }))
    return { booking: result.booking }
  }, [state.user])

  const refreshBookings = useCallback(async () => {
    if (!state.user) return
    const res = await fetch(`/api/bookings?userId=${state.user.id}`)
    const data = await res.json()
    setState((s) => ({ ...s, bookings: data.bookings || [] }))
  }, [state.user])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        toggleWishlist,
        isInWishlist,
        addBooking,
        refreshBookings,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
