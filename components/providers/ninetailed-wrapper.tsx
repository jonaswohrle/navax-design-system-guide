"use client"

import {
  createContext,
  useContext,
  type ReactNode,
} from "react"
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

/* ---------- Bridge: translates PersonalizationProvider into unified shape ---------- */

function UnifiedBridge({ children }: { children: ReactNode }) {
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

/* ---------- Public wrapper ---------- */

/**
 * NinetailedWrapper provides a unified personalization context.
 *
 * Currently uses the custom cookie-based PersonalizationProvider.
 * When the Ninetailed SDK becomes compatible with Turbopack,
 * this wrapper can be extended to load it dynamically by setting
 * NEXT_PUBLIC_NINETAILED_API_KEY in the environment.
 */
export function NinetailedWrapper({ children }: { children: ReactNode }) {
  return (
    <PersonalizationProvider>
      <UnifiedBridge>{children}</UnifiedBridge>
    </PersonalizationProvider>
  )
}
