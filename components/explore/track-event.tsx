"use client"

import { useEffect } from "react"
import { useUnifiedPersonalization } from "@/components/providers/ninetailed-wrapper"

interface TrackEventProps {
  /** The event name to track */
  event: string
  /** Optional additional properties */
  properties?: Record<string, string>
  /** Optional category for page view tracking */
  category?: string
}

/**
 * Drop-in component that fires a tracking event when mounted.
 * Use on any page to record visitor behaviour for personalization.
 *
 * Usage:
 *   <TrackEvent event="view_walking" category="walking" />
 */
export function TrackEvent({ event, properties, category }: TrackEventProps) {
  const personalization = useUnifiedPersonalization()

  useEffect(() => {
    if (!personalization) return
    personalization.track(event, properties)
    if (category) {
      personalization.page(category)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, category])

  return null
}
