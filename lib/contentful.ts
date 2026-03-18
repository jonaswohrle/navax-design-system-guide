const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || "5pg8k9ilhjl4"
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN || ""
const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master`

interface ContentfulResponse<T = Record<string, unknown>> {
  sys: { id: string; type: string }
  total: number
  skip: number
  limit: number
  items: ContentfulEntry<T>[]
  includes?: {
    Asset?: ContentfulAsset[]
  }
}

export interface ContentfulEntry<T = Record<string, unknown>> {
  sys: {
    id: string
    contentType: { sys: { id: string } }
  }
  fields: T
}

export interface ContentfulAsset {
  sys: { id: string }
  fields: {
    title: string
    description?: string
    file: {
      url: string
      details: { size: number; image?: { width: number; height: number } }
      fileName: string
      contentType: string
    }
  }
}

async function fetchContentful<T = Record<string, unknown>>(
  contentType: string,
  query: Record<string, string> = {},
): Promise<{ items: ContentfulEntry<T>[]; includes?: { Asset?: ContentfulAsset[] } }> {
  if (!ACCESS_TOKEN) {
    return { items: [] }
  }

  const params = new URLSearchParams({
    content_type: contentType,
    ...query,
  })

  try {
    const res = await fetch(`${BASE_URL}/entries?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return { items: [] }
    }

    const data: ContentfulResponse<T> = await res.json()
    return { items: data.items, includes: data.includes }
  } catch {
    return { items: [] }
  }
}

// --------------- Content type interfaces ---------------

export interface HeroFields {
  title: string
  subtitle?: string
  heroImage?: { sys: { id: string } }
}

export interface NavigationLinkFields {
  label: string
  href: string
  order?: number
}

export interface WorkshopBlockFields {
  title: string
  number?: string
  description?: string
  href?: string
  icon?: string
  isHighlighted?: boolean
  highlightLabel?: string
  order?: number
}

export interface ValuePropFields {
  title: string
  description?: string
  icon?: string
  order?: number
}

export interface AiShowcaseFields {
  title: string
  description?: string
  href?: string
  icon?: string
  concepts?: string[]
  order?: number
}

export interface CtaSectionFields {
  heading: string
  description?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export interface ReferenceLogoFields {
  name: string
  order?: number
}

export interface SectionHeadingFields {
  sectionId: string
  title: string
  subtitle?: string
  label?: string
}

export interface FooterLinkFields {
  label: string
  href: string
  order?: number
}

// --------------- Fetchers ---------------

export async function getHero() {
  const { items, includes } = await fetchContentful<HeroFields>("homepageHero", { limit: "1", include: "1" })
  const hero = items[0]
  if (!hero) return null

  let imageUrl: string | undefined
  if (hero.fields.heroImage && includes?.Asset) {
    const asset = includes.Asset.find(
      (a) => a.sys.id === hero.fields.heroImage!.sys.id,
    )
    if (asset) {
      imageUrl = `https:${asset.fields.file.url}`
    }
  }

  return { ...hero.fields, imageUrl }
}

export async function getNavigationLinks() {
  const { items } = await fetchContentful<NavigationLinkFields>("navigationLink", { order: "fields.order" })
  return items.map((i) => i.fields)
}

export async function getWorkshopBlocks() {
  const { items } = await fetchContentful<WorkshopBlockFields>("workshopBlock", { order: "fields.order" })
  return items.map((i) => i.fields)
}

export async function getValueProps() {
  const { items } = await fetchContentful<ValuePropFields>("valueProp", { order: "fields.order" })
  return items.map((i) => i.fields)
}

export async function getAiShowcases() {
  const { items } = await fetchContentful<AiShowcaseFields>("aiShowcase", { order: "fields.order" })
  return items.map((i) => i.fields)
}

export async function getCtaSection() {
  const { items } = await fetchContentful<CtaSectionFields>("ctaSection", { limit: "1" })
  return items[0]?.fields ?? null
}

export async function getReferenceLogos() {
  const { items } = await fetchContentful<ReferenceLogoFields>("referenceLogo", { order: "fields.order" })
  return items.map((i) => i.fields)
}

export async function getSectionHeading(sectionId: string) {
  const { items } = await fetchContentful<SectionHeadingFields>("sectionHeading", {
    "fields.sectionId": sectionId,
    limit: "1",
  })
  return items[0]?.fields ?? null
}

export async function getFooterLinks() {
  const { items } = await fetchContentful<FooterLinkFields>("footerLink", { order: "fields.order" })
  return items.map((i) => i.fields)
}

// --------------- Explore Travel Content Types ---------------

export interface ExploreHeroFields {
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  backgroundImageUrl?: string
}

export interface PromoBannerFields {
  text: string
  linkText?: string
  linkUrl?: string
  isActive?: boolean
}

export interface TrustPillarFields {
  title: string
  description?: string
  icon?: string
  order?: number
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
  duration?: string
  price?: number
  originalPrice?: number
  imageUrl?: string
  badges?: string[]
  tripCode?: string
  slug?: string
  order?: number
}

export interface DestinationRegionFields {
  name: string
  imageUrl?: string
  slug?: string
  description?: string
  tripCount?: number
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

export interface BlogPostFields {
  title: string
  excerpt?: string
  imageUrl?: string
  publishDate?: string
  category?: string
  slug?: string
  content?: string
  order?: number
}

export interface OfferCardFields {
  title: string
  description?: string
  imageUrl?: string
  linkUrl?: string
  discountText?: string
  order?: number
}

export interface ReviewItemFields {
  rating?: number
  text: string
  customerName: string
  tripName?: string
  date?: string
  order?: number
}

export interface FlexPolicyFields {
  heading: string
  description?: string
  linkUrl?: string
}

// --------------- Explore Fetchers ---------------

export async function getExploreHero() {
  const { items } = await fetchContentful<ExploreHeroFields>("exploreHero", { limit: "1" })
  return items[0]?.fields ?? null
}

export async function getPromoBanner() {
  const { items } = await fetchContentful<PromoBannerFields>("promoBanner", { limit: "1" })
  return items[0]?.fields ?? null
}

export async function getTrustPillars() {
  const { items } = await fetchContentful<TrustPillarFields>("trustPillar", { order: "fields.order" })
  return items.map((i) => i.fields)
}

export async function getPromoCards() {
  const { items } = await fetchContentful<PromoCardFields>("promoCard", { order: "fields.order" })
  return items.map((i) => i.fields)
}

export async function getTripListings() {
  const { items } = await fetchContentful<TripListingFields>("tripListing", { order: "fields.order" })
  return items.map((i) => i.fields)
}

export async function getDestinationRegions() {
  const { items } = await fetchContentful<DestinationRegionFields>("destinationRegion", { order: "fields.order" })
  return items.map((i) => i.fields)
}

export async function getExperienceTypes() {
  const { items } = await fetchContentful<ExperienceTypeFields>("experienceType", { order: "fields.order" })
  return items.map((i) => i.fields)
}

export async function getAboutSections() {
  const { items } = await fetchContentful<AboutSectionFields>("aboutSection", { order: "fields.order" })
  return items.map((i) => i.fields)
}

export async function getBlogPosts() {
  const { items } = await fetchContentful<BlogPostFields>("blogPost", { order: "fields.order" })
  return items.map((i) => i.fields)
}

export async function getOfferCards() {
  const { items } = await fetchContentful<OfferCardFields>("offerCard", { order: "fields.order" })
  return items.map((i) => i.fields)
}

export async function getReviewItems() {
  const { items } = await fetchContentful<ReviewItemFields>("reviewItem", { order: "fields.order" })
  return items.map((i) => i.fields)
}

export async function getFlexPolicy() {
  const { items } = await fetchContentful<FlexPolicyFields>("flexPolicy", { limit: "1" })
  return items[0]?.fields ?? null
}
