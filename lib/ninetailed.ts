/**
 * Ninetailed Experience SDK configuration.
 *
 * Provides the client ID and helpers for bridging the custom
 * personalization engine with the Ninetailed SDK.
 */

import type { AudienceSegment } from "./personalization"

/** The Ninetailed Client ID from the environment */
export const NINETAILED_CLIENT_ID =
  process.env.NEXT_PUBLIC_NINETAILED_API_KEY || ""

/** Whether the Ninetailed SDK should be initialised */
export function isNinetailedEnabled(): boolean {
  return NINETAILED_CLIENT_ID.length > 0
}

/**
 * Map our local audience segments to Ninetailed-compatible audience definitions.
 * Used with `useSDKEvaluation: true` so the SDK evaluates audiences client-side.
 *
 * Each entry defines:
 *   - `id`: stable identifier matching the `audienceTag` from Contentful personalizedHero
 *   - `name`: human-readable label
 *   - `description`: how the audience is resolved
 */
export const AUDIENCE_DEFINITIONS: Array<{
  id: AudienceSegment
  name: string
  description: string
}> = [
  {
    id: "adventure",
    name: "Adventure Seekers",
    description: "Visitors with strong interest in walking, cycling, trekking, or polar trips",
  },
  {
    id: "culture",
    name: "Culture Explorers",
    description: "Visitors drawn to discovery, food & drink, heritage, or upgraded experiences",
  },
  {
    id: "family",
    name: "Family Travellers",
    description: "Visitors browsing family-friendly experiences",
  },
  {
    id: "returning",
    name: "Returning Visitors",
    description: "Identified visitors or those who have booked before",
  },
]
