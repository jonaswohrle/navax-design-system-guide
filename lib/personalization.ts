/**
 * Lightweight personalization engine using cookie-based visitor profiles.
 * Tracks page views and events to score visitors into audience segments.
 *
 * Audience segments:
 *   - default    (no strong signal)
 *   - adventure  (walking/cycling/trekking interest)
 *   - culture    (discovery/food/heritage interest)
 *   - family     (family experience interest)
 *   - returning  (identified or repeat visitor)
 */

export type AudienceSegment = "default" | "adventure" | "culture" | "family" | "returning"

export interface VisitorProfile {
  id: string
  /** Page views keyed by category slug */
  pageViews: Record<string, number>
  /** Named events with counts */
  events: Record<string, number>
  /** Traits set via identify() */
  traits: Record<string, string>
  /** Total session count */
  sessions: number
  /** First seen ISO date */
  firstSeen: string
  /** Last seen ISO date */
  lastSeen: string
}

export const COOKIE_NAME = "explore_visitor"
const ADVENTURE_CATEGORIES = ["walking", "cycling", "trekking", "polar"]
const CULTURE_CATEGORIES = ["discovery", "food-drink", "heritage", "upgraded"]
const FAMILY_CATEGORIES = ["family"]

/** Create an empty visitor profile */
export function createProfile(): VisitorProfile {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    pageViews: {},
    events: {},
    traits: {},
    sessions: 1,
    firstSeen: now,
    lastSeen: now,
  }
}

/** Score audiences based on browsing behaviour */
export function resolveAudience(profile: VisitorProfile): AudienceSegment {
  // If user has been identified (e.g. via booking), they're "returning"
  if (profile.traits.email || profile.traits.name || profile.events.book_trip) {
    return "returning"
  }

  // Score each segment
  let adventureScore = 0
  let cultureScore = 0
  let familyScore = 0

  for (const [category, count] of Object.entries(profile.pageViews)) {
    const slug = category.toLowerCase()
    if (ADVENTURE_CATEGORIES.some((c) => slug.includes(c))) {
      adventureScore += count
    }
    if (CULTURE_CATEGORIES.some((c) => slug.includes(c))) {
      cultureScore += count
    }
    if (FAMILY_CATEGORIES.some((c) => slug.includes(c))) {
      familyScore += count
    }
  }

  // Add event-based scoring
  adventureScore += (profile.events.view_walking || 0) * 2
  adventureScore += (profile.events.view_cycling || 0) * 2
  cultureScore += (profile.events.view_discovery || 0) * 2
  cultureScore += (profile.events.view_food || 0) * 2
  familyScore += (profile.events.view_family || 0) * 3

  // Need at least 2 signals to override default
  const threshold = 2
  const maxScore = Math.max(adventureScore, cultureScore, familyScore)

  if (maxScore < threshold) return "default"

  if (adventureScore === maxScore) return "adventure"
  if (cultureScore === maxScore) return "culture"
  if (familyScore === maxScore) return "family"

  return "default"
}

/** Serialize profile to a cookie-safe string */
export function serializeProfile(profile: VisitorProfile): string {
  return btoa(JSON.stringify(profile))
}

/** Deserialize profile from a cookie string */
export function deserializeProfile(cookieValue: string): VisitorProfile | null {
  try {
    return JSON.parse(atob(cookieValue))
  } catch {
    return null
  }
}
