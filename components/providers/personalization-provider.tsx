"use client"

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { usePathname } from "next/navigation"
import {
  type AudienceSegment,
  type VisitorProfile,
  COOKIE_NAME,
  createProfile,
  resolveAudience,
  serializeProfile,
  deserializeProfile,
} from "@/lib/personalization"

interface PersonalizationContextValue {
  profile: VisitorProfile
  audience: AudienceSegment
  /** Track a named event */
  track: (event: string, properties?: Record<string, string>) => void
  /** Record a page view with optional category */
  page: (category?: string) => void
  /** Identify the visitor with traits */
  identify: (traits: Record<string, string>) => void
}

const PersonalizationContext = createContext<PersonalizationContextValue | null>(null)

export function usePersonalization() {
  const ctx = useContext(PersonalizationContext)
  if (!ctx) {
    throw new Error("usePersonalization must be used within PersonalizationProvider")
  }
  return ctx
}

/** Safe try to use personalization -- returns null outside of provider */
export function usePersonalizationSafe() {
  return useContext(PersonalizationContext)
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax`
}

interface Props {
  children: ReactNode
}

export function PersonalizationProvider({ children }: Props) {
  const pathname = usePathname()
  const [profile, setProfile] = useState<VisitorProfile>(() => {
    if (typeof document === "undefined") return createProfile()
    const raw = getCookie(COOKIE_NAME)
    if (raw) {
      const parsed = deserializeProfile(raw)
      if (parsed) {
        parsed.sessions += 1
        parsed.lastSeen = new Date().toISOString()
        return parsed
      }
    }
    return createProfile()
  })

  // Persist profile to cookie on change
  useEffect(() => {
    setCookie(COOKIE_NAME, serializeProfile(profile))
  }, [profile])

  // Auto-track page views on route change
  useEffect(() => {
    // Extract a category from the pathname
    // e.g. /experiences/walking -> "walking", /destinations/europe -> "europe"
    const segments = pathname.split("/").filter(Boolean)
    const category = segments.length > 1 ? segments[segments.length - 1] : undefined

    setProfile((prev) => {
      const key = category || "_general"
      return {
        ...prev,
        pageViews: {
          ...prev.pageViews,
          [key]: (prev.pageViews[key] || 0) + 1,
        },
        lastSeen: new Date().toISOString(),
      }
    })
  }, [pathname])

  const track = useCallback((event: string, properties?: Record<string, string>) => {
    setProfile((prev) => ({
      ...prev,
      events: {
        ...prev.events,
        [event]: (prev.events[event] || 0) + 1,
      },
      traits: properties ? { ...prev.traits, ...properties } : prev.traits,
      lastSeen: new Date().toISOString(),
    }))
  }, [])

  const page = useCallback((category?: string) => {
    setProfile((prev) => {
      const key = category || "_general"
      return {
        ...prev,
        pageViews: {
          ...prev.pageViews,
          [key]: (prev.pageViews[key] || 0) + 1,
        },
        lastSeen: new Date().toISOString(),
      }
    })
  }, [])

  const identify = useCallback((traits: Record<string, string>) => {
    setProfile((prev) => ({
      ...prev,
      traits: { ...prev.traits, ...traits },
      lastSeen: new Date().toISOString(),
    }))
  }, [])

  const audience = resolveAudience(profile)

  return (
    <PersonalizationContext.Provider value={{ profile, audience, track, page, identify }}>
      {children}
    </PersonalizationContext.Provider>
  )
}
