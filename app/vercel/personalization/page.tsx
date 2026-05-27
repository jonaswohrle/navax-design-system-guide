"use client"

import { useUnifiedPersonalization } from "@/components/providers/ninetailed-wrapper"
import { resolveAudience, type AudienceSegment } from "@/lib/personalization"
import {
  Users,
  Eye,
  MousePointer,
  Tag,
  Activity,
  Clock,
  RefreshCw,
  User,
  Mountain,
  Palette,
  Heart,
  RotateCcw,
} from "lucide-react"

const AUDIENCE_META: Record<
  AudienceSegment,
  { label: string; description: string; color: string; icon: React.ReactNode }
> = {
  default: {
    label: "Default / New Visitor",
    description: "No strong browsing signal yet. Seeing the baseline hero and promo content.",
    color: "bg-muted text-muted-foreground",
    icon: <Users className="h-5 w-5" />,
  },
  adventure: {
    label: "Adventure Seeker",
    description: "Interested in walking, cycling, and trekking holidays. Hero and recommendations prioritize active trips.",
    color: "bg-emerald-100 text-emerald-800",
    icon: <Mountain className="h-5 w-5" />,
  },
  culture: {
    label: "Culture Lover",
    description: "Drawn to discovery tours, food experiences, and heritage. Content emphasizes cultural immersion.",
    color: "bg-violet-100 text-violet-800",
    icon: <Palette className="h-5 w-5" />,
  },
  family: {
    label: "Family Planner",
    description: "Looking at family-friendly options. Lower activity levels and kid-friendly accommodations highlighted.",
    color: "bg-amber-100 text-amber-800",
    icon: <Heart className="h-5 w-5" />,
  },
  returning: {
    label: "Returning Booker",
    description: "Previously identified via booking or login. Personalised welcome and tailored offers shown.",
    color: "bg-blue-100 text-blue-800",
    icon: <RotateCcw className="h-5 w-5" />,
  },
}

export default function PersonalizationPage() {
  const personalization = useUnifiedPersonalization()

  if (!personalization) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Personalization provider not available.</p>
      </div>
    )
  }

  const { audience } = personalization
  // Use the custom profile if available (fallback mode), or synthesize empty for Ninetailed mode
  const profile = personalization.profile ?? {
    id: "ninetailed-managed",
    pageViews: {} as Record<string, number>,
    events: {} as Record<string, number>,
    traits: {} as Record<string, string>,
    sessions: 0,
    firstSeen: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
  }
  const meta = AUDIENCE_META[audience]

  const pageViewEntries = Object.entries(profile.pageViews).sort((a, b) => b[1] - a[1])
  const eventEntries = Object.entries(profile.events).sort((a, b) => b[1] - a[1])
  const traitEntries = Object.entries(profile.traits)

  // Compute all audience scores for the radar display
  const scores = {
    adventure: 0,
    culture: 0,
    family: 0,
  }
  const adventureKeywords = ["walking", "cycling", "trekking", "polar"]
  const cultureKeywords = ["discovery", "food-drink", "heritage", "upgraded"]
  const familyKeywords = ["family"]

  for (const [category, count] of Object.entries(profile.pageViews)) {
    const slug = category.toLowerCase()
    if (adventureKeywords.some((k) => slug.includes(k))) scores.adventure += count
    if (cultureKeywords.some((k) => slug.includes(k))) scores.culture += count
    if (familyKeywords.some((k) => slug.includes(k))) scores.family += count
  }
  scores.adventure += (profile.events.view_walking || 0) * 2 + (profile.events.view_cycling || 0) * 2
  scores.culture += (profile.events.view_discovery || 0) * 2 + (profile.events.view_food || 0) * 2
  scores.family += (profile.events.view_family || 0) * 3

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">Live Personalization Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time view of your visitor profile, audience segment, and how content personalises based on your browsing behaviour.
        </p>
      </div>

      <div className="space-y-6 p-6">
        {/* Current audience segment */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Tag className="h-4 w-4" />
              Active Audience Segment
            </h2>
          </div>
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${meta.color}`}>
                {meta.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{meta.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Audience scores */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Activity className="h-4 w-4" />
              Audience Scores (threshold: 2)
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
            {(["adventure", "culture", "family"] as const).map((seg) => {
              const segMeta = AUDIENCE_META[seg]
              const score = scores[seg]
              const isActive = audience === seg
              return (
                <div
                  key={seg}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${isActive ? "border-foreground bg-muted" : "border-border"}`}
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-md ${segMeta.color}`}>
                    {segMeta.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{segMeta.label}</p>
                    <p className="text-2xl font-bold text-foreground">{score}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Page views */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Eye className="h-4 w-4" />
                Page Views ({pageViewEntries.length} categories)
              </h2>
            </div>
            <div className="divide-y divide-border">
              {pageViewEntries.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No page views recorded yet.</p>
              ) : (
                pageViewEntries.map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-sm text-foreground">{category}</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Events */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MousePointer className="h-4 w-4" />
                Tracked Events ({eventEntries.length})
              </h2>
            </div>
            <div className="divide-y divide-border">
              {eventEntries.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No events tracked yet. Browse the site to generate signals.</p>
              ) : (
                eventEntries.map(([event, count]) => (
                  <div key={event} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-sm text-foreground">{event}</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Visitor traits */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <User className="h-4 w-4" />
              Visitor Traits
            </h2>
          </div>
          <div className="p-4">
            {traitEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No traits set. Complete a booking form to identify yourself.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {traitEntries.map(([key, value]) => (
                  <span key={key} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs">
                    <span className="font-medium text-foreground">{key}:</span>
                    <span className="text-muted-foreground">{value}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Session metadata */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock className="h-4 w-4" />
              Session Metadata
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Visitor ID</p>
              <p className="mt-0.5 truncate font-mono text-xs text-foreground">{profile.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sessions</p>
              <p className="mt-0.5 text-sm font-medium text-foreground">{profile.sessions}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">First Seen</p>
              <p className="mt-0.5 text-xs text-foreground">{new Date(profile.firstSeen).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Active</p>
              <p className="mt-0.5 text-xs text-foreground">{new Date(profile.lastSeen).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <RefreshCw className="h-4 w-4" />
            How Personalization Works
          </h3>
          <ol className="space-y-1.5 text-sm text-muted-foreground">
            <li><span className="font-medium text-foreground">1.</span> {personalization.ninetailedActive ? "The Ninetailed Experience SDK" : "The PersonalizationProvider"} tracks every page view and event{personalization.ninetailedActive ? " via the Ninetailed platform" : " in a cookie-based visitor profile"}.</li>
            <li><span className="font-medium text-foreground">2.</span> Audience scores are computed by matching page categories against segment keywords (walking/cycling = Adventure, discovery/food = Culture, etc.).</li>
            <li><span className="font-medium text-foreground">3.</span> When a score reaches the threshold (2+), the visitor is assigned to that audience segment.</li>
            <li><span className="font-medium text-foreground">4.</span> Contentful delivers audience-tagged hero variants. The PersonalizedHero component selects the right variant{personalization.ninetailedActive ? " via Ninetailed experiences" : " client-side"}.</li>
            <li><span className="font-medium text-foreground">5.</span> The AI chat assistant receives the audience segment and adjusts recommendations accordingly.</li>
            <li><span className="font-medium text-foreground">6.</span> Completing a booking form calls identify() -- setting traits that promote the visitor to &quot;Returning Booker&quot;.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
