// Lightweight Contentful Content Delivery API client.
//
// All fetchers degrade gracefully: if Contentful is not configured or a request
// fails, they return empty arrays / null so that each page/component falls back
// to its built-in default content.

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || ""
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN || ""
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master"
const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`

interface ContentfulAssetFile {
  url: string
  details: { size: number; image?: { width: number; height: number } }
  fileName: string
  contentType: string
}

export interface ContentfulAsset {
  sys: { id: string }
  fields: {
    title?: string
    description?: string
    file: ContentfulAssetFile
  }
}

interface ContentfulLink {
  sys: { id: string; type: "Link"; linkType: "Asset" | "Entry" }
}

export interface ContentfulEntry<T = Record<string, unknown>> {
  sys: {
    id: string
    contentType: { sys: { id: string } }
  }
  fields: T
}

interface ContentfulResponse<T = Record<string, unknown>> {
  sys: { type: string }
  total: number
  skip: number
  limit: number
  items: ContentfulEntry<T>[]
  includes?: {
    Asset?: ContentfulAsset[]
  }
}

function isConfigured() {
  return Boolean(SPACE_ID && ACCESS_TOKEN)
}

async function fetchContentful<T = Record<string, unknown>>(
  contentType: string,
  query: Record<string, string> = {},
): Promise<{ items: ContentfulEntry<T>[]; assets: Map<string, ContentfulAsset> }> {
  const emptyResult = { items: [] as ContentfulEntry<T>[], assets: new Map<string, ContentfulAsset>() }

  if (!isConfigured()) {
    return emptyResult
  }

  try {
    const params = new URLSearchParams({
      content_type: contentType,
      include: "1",
      ...query,
    })

    const res = await fetch(`${BASE_URL}/entries?${params.toString()}`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error(`[v0] Contentful fetch failed for "${contentType}": ${res.status} ${res.statusText}`)
      return emptyResult
    }

    const data: ContentfulResponse<T> = await res.json()
    const assets = new Map<string, ContentfulAsset>()
    for (const asset of data.includes?.Asset ?? []) {
      assets.set(asset.sys.id, asset)
    }
    return { items: data.items, assets }
  } catch (error) {
    console.error(`[v0] Contentful fetch error for "${contentType}":`, error)
    return emptyResult
  }
}

/** Resolve a linked asset field into an absolute https image URL. */
function resolveAssetUrl(
  link: unknown,
  assets: Map<string, ContentfulAsset>,
): string | undefined {
  const maybeLink = link as ContentfulLink | undefined
  const id = maybeLink?.sys?.id
  if (!id) return undefined
  const asset = assets.get(id)
  const url = asset?.fields.file?.url
  if (!url) return undefined
  return url.startsWith("//") ? `https:${url}` : url
}

/**
 * Normalise an image field that may be either a plain string URL (rich text or
 * short-text field) or a linked Contentful asset.
 */
function normaliseImage(
  fields: Record<string, unknown>,
  assets: Map<string, ContentfulAsset>,
): string | undefined {
  const direct = fields.imageUrl ?? fields.image ?? fields.backgroundImage
  if (typeof direct === "string") return direct
  return resolveAssetUrl(direct, assets)
}

// --------------- Content type field interfaces ---------------

export interface PromoBannerFields {
  text: string
  linkText?: string
  linkUrl?: string
  isActive?: boolean
}

export interface PromoCardFields {
  title: string
  subtitle?: string
  imageUrl?: string
  linkUrl?: string
  order?: number
}

export interface TripListingFields {
  title: string
  destination?: string
  tripType?: string
  tripCode?: string
  duration?: string
  price?: number
  originalPrice?: number
  imageUrl?: string
  badges?: string[]
  slug?: string
  order?: number
}

export interface DestinationRegionFields {
  name: string
  slug?: string
  imageUrl?: string
  tripCount?: number
  order?: number
}

export interface BlogPostFields {
  title: string
  excerpt?: string
  imageUrl?: string
  publishDate?: string
  category?: string
  slug?: string
  order?: number
}

export interface FlexPolicyFields {
  heading: string
  description?: string
  linkUrl?: string
}

export interface ReviewItemFields {
  rating?: number
  text: string
  customerName?: string
  tripName?: string
  date?: string
  order?: number
}

export interface TrustPillarFields {
  title: string
  description?: string
  icon?: string
  order?: number
}

export interface OfferCardFields {
  title: string
  description?: string
  discountText?: string
  linkUrl?: string
  order?: number
}

export interface ExperienceTypeFields {
  name: string
  description?: string
  imageUrl?: string
  slug?: string
  order?: number
}

export interface AboutSectionFields {
  number?: string
  title: string
  content?: string
  order?: number
}

export interface PersonalizedHeroFields {
  audienceTag?: string
  headline?: string
  subheadline?: string
  ctaLabel?: string
  ctaUrl?: string
  backgroundImageUrl?: string
}

// --------------- Fetchers ---------------

export async function getPromoBanner(): Promise<PromoBannerFields | null> {
  const { items } = await fetchContentful<PromoBannerFields>("promoBanner", { limit: "1" })
  return items[0]?.fields ?? null
}

export async function getPromoCards(): Promise<PromoCardFields[]> {
  const { items, assets } = await fetchContentful<PromoCardFields>("promoCard", { order: "fields.order" })
  return items.map((item) => ({
    ...item.fields,
    imageUrl: normaliseImage(item.fields as Record<string, unknown>, assets) ?? item.fields.imageUrl,
  }))
}

export async function getTripListings(): Promise<TripListingFields[]> {
  const { items, assets } = await fetchContentful<TripListingFields>("tripListing", { order: "fields.order" })
  return items.map((item) => ({
    ...item.fields,
    imageUrl: normaliseImage(item.fields as Record<string, unknown>, assets) ?? item.fields.imageUrl,
  }))
}

export async function getDestinationRegions(): Promise<DestinationRegionFields[]> {
  const { items, assets } = await fetchContentful<DestinationRegionFields>("destinationRegion", {
    order: "fields.order",
  })
  return items.map((item) => ({
    ...item.fields,
    imageUrl: normaliseImage(item.fields as Record<string, unknown>, assets) ?? item.fields.imageUrl,
  }))
}

export async function getBlogPosts(): Promise<BlogPostFields[]> {
  const { items, assets } = await fetchContentful<BlogPostFields>("blogPost", { order: "-fields.publishDate" })
  return items.map((item) => ({
    ...item.fields,
    imageUrl: normaliseImage(item.fields as Record<string, unknown>, assets) ?? item.fields.imageUrl,
  }))
}

export async function getFlexPolicy(): Promise<FlexPolicyFields | null> {
  const { items } = await fetchContentful<FlexPolicyFields>("flexPolicy", { limit: "1" })
  return items[0]?.fields ?? null
}

export async function getReviewItems(): Promise<ReviewItemFields[]> {
  const { items } = await fetchContentful<ReviewItemFields>("reviewItem", { order: "fields.order" })
  return items.map((item) => item.fields)
}

export async function getTrustPillars(): Promise<TrustPillarFields[]> {
  const { items } = await fetchContentful<TrustPillarFields>("trustPillar", { order: "fields.order" })
  return items.map((item) => item.fields)
}

export async function getOfferCards(): Promise<OfferCardFields[]> {
  const { items } = await fetchContentful<OfferCardFields>("offerCard", { order: "fields.order" })
  return items.map((item) => item.fields)
}

export async function getExperienceTypes(): Promise<ExperienceTypeFields[]> {
  const { items, assets } = await fetchContentful<ExperienceTypeFields>("experienceType", {
    order: "fields.order",
  })
  return items.map((item) => ({
    ...item.fields,
    imageUrl: normaliseImage(item.fields as Record<string, unknown>, assets) ?? item.fields.imageUrl,
  }))
}

export async function getAboutSections(): Promise<AboutSectionFields[]> {
  const { items } = await fetchContentful<AboutSectionFields>("aboutSection", { order: "fields.order" })
  return items.map((item) => item.fields)
}

export async function getHeroVariants(): Promise<(PersonalizedHeroFields & { id: string })[]> {
  const { items, assets } = await fetchContentful<PersonalizedHeroFields>("personalizedHero", {
    order: "fields.audienceTag",
  })
  return items.map((item) => ({
    ...item.fields,
    id: item.sys.id,
    backgroundImageUrl:
      (typeof item.fields.backgroundImageUrl === "string" ? item.fields.backgroundImageUrl : undefined) ??
      normaliseImage(item.fields as Record<string, unknown>, assets),
  }))
}
