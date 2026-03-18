"use client"

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  lazy,
  Suspense,
  type ReactNode,
} from "react"
import { usePathname } from "next/navigation"
import { isNinetailedEnabled, NINETAILED_CLIENT_ID } from "@/lib/ninetailed"
import type { AudienceSegment, VisitorProfile } from "@/lib/personalization"
import {
  PersonalizationProvider,
  usePersonalizationSafe,
} from "./personalization-provider"

/* ---------- Unified context shape ---------- */

export interface UnifiedPersonalization {
  profile: VisitorProfile | null
  audience: AudienceSegment
  track: (event: string, properties?: Record<string, string>) => void
  page: (category?: string) => void
  identify: (traits: Record<string, string>) => void
  /** True when the Ninetailed SDK is active */
  ninetailedActive: boolean
}

const UnifiedCtx = createContext<UnifiedPersonalization | null>(null)

/** Safe hook -- returns null outside the provider tree */
export function useUnifiedPersonalization() {
  return useContext(UnifiedCtx)
}

/* ---------- Ninetailed branch (loaded dynamically) ---------- */

/**
 * This component lazy-loads the Ninetailed React SDK to avoid
 * Turbopack resolution issues with the @ninetailed packages.
 * The SDK is only loaded when NEXT_PUBLIC_NINETAILED_API_KEY is set.
 */
function NinetailedBranch({ children }: { children: ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sdk, setSdk] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    import("@ninetailed/experience.js-react")
      .then((mod) => setSdk(mod))
      .catch((err) => {
        console.warn("[v0] Failed to load Ninetailed SDK, falling back:", err.message)
        setError(err.message)
      })
  }, [])

  // While loading the SDK, render children with a fallback context
  if (!sdk || error) {
    return (
      <FallbackBranch>{children}</FallbackBranch>
    )
  }

  const { NinetailedProvider } = sdk

  return (
    <NinetailedProvider clientId={NINETAILED_CLIENT_ID}>
      <NinetailedBridge sdk={sdk}>{children}</NinetailedBridge>
    </NinetailedProvider>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NinetailedBridge({ children, sdk }: { children: ReactNode; sdk: any }) {
  const ninetailed = sdk.useNinetailed()
  const { profile: ntProfile } = sdk.useProfile()
  const pathname = usePathname()

  // Auto-track page views on route change
  useEffect(() => {
    ninetailed.page()
  }, [pathname, ninetailed])

  // Derive audience from Ninetailed profile traits
  const audience: AudienceSegment = (() => {
    const traits = ntProfile?.traits || {}
    if (traits.audience) return traits.audience as AudienceSegment
    return "default"
  })()

  const track = useCallback(
    (event: string, properties?: Record<string, string>) => {
      ninetailed.track(event, properties || {})
    },
    [ninetailed]
  )

  const page = useCallback(
    (category?: string) => {
      ninetailed.page(category ? { category } : {})
    },
    [ninetailed]
  )

  const identify = useCallback(
    (traits: Record<string, string>) => {
      ninetailed.identify("", traits)
    },
    [ninetailed]
  )

  return (
    <UnifiedCtx.Provider
      value={{
        profile: null,
        audience,
        track,
        page,
        identify,
        ninetailedActive: true,
      }}
    >
      {children}
    </UnifiedCtx.Provider>
  )
}

/* ---------- Fallback branch (custom provider) ---------- */

function FallbackBridge({ children }: { children: ReactNode }) {
  const p = usePersonalizationSafe()

  return (
    <UnifiedCtx.Provider
      value={{
        profile: p?.profile ?? null,
        audience: p?.audience ?? "default",
        track: p?.track ?? (() => {}),
        page: p?.page ?? (() => {}),
        identify: p?.identify ?? (() => {}),
        ninetailedActive: false,
      }}
    >
      {children}
    </UnifiedCtx.Provider>
  )
}

function FallbackBranch({ children }: { children: ReactNode }) {
  return (
    <PersonalizationProvider>
      <FallbackBridge>{children}</FallbackBridge>
    </PersonalizationProvider>
  )
}

/* ---------- Public wrapper ---------- */

export function NinetailedWrapper({ children }: { children: ReactNode }) {
  if (isNinetailedEnabled()) {
    return <NinetailedBranch>{children}</NinetailedBranch>
  }
  return <FallbackBranch>{children}</FallbackBranch>
}
