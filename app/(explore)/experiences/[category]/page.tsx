import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowRight } from "lucide-react"
import {
  IconUnforgettableExperiences,
  IconExpertTourLeaders,
  IconSmallGroupTours,
  IconResponsibleAtHeart,
} from "@/components/explore/brand-icons"
import { TrustStrip } from "@/components/explore/trust-strip"
import { WaveDivider } from "@/components/explore/wave-divider"

/* ------------------------------------------------------------------ */
/*  Experience category data                                           */
/* ------------------------------------------------------------------ */
interface ExperienceCategory {
  title: string
  slug: string
  heroImage: string
  videoUrl?: string
  description: string
  longDescription: string
  features: { icon: string; title: string; text: string }[]
  popularDestinations: { name: string; image: string; tripCount: number }[]
  faqs: { q: string; a: string }[]
}

const CATEGORIES: Record<string, ExperienceCategory> = {
  "classic-discovery": {
    title: "Classic Discovery",
    slug: "classic-discovery",
    heroImage: "https://s3.eu-west-1.amazonaws.com/medialibraries/explore/explore-media/destinations/africa/tanzania/shutterstock_167769761.jpg?ext=.jpg",
    description: "Our classic small group tours, exploring the highlights and hidden gems of incredible destinations around the world.",
    longDescription: "If you book a guided trip, like one of our small group tours, your tour leader will use their expert insider knowledge and local connections to make the most of unexpected opportunities. You might be invited to watch the sunrise from a lighthouse or to join family Diwali celebrations. They'll be on hand to make sure your trip goes smoothly, taking care of logistics. Our tour leaders are trained by our experienced team to ensure consistently high standards.",
    features: [
      { icon: "map", title: "Expert-led itineraries", text: "Carefully crafted routes that balance must-see highlights with off-the-beaten-track discoveries." },
      { icon: "users", title: "Small groups of 11", text: "Big enough to meet like-minded people but small enough to get to the heart of a destination." },
      { icon: "shield", title: "Guaranteed departures", text: "We guarantee nearly every single departure, so you can relax knowing your trip will run." },
      { icon: "heart", title: "Responsible travel", text: "Every single one of our trips has a carbon label and we work hard to have a positive impact." },
    ],
    popularDestinations: [
      { name: "Jordan", image: "/images/explore/hero-mountains.jpg", tripCount: 8 },
      { name: "Vietnam", image: "/images/explore/hero-mountains.jpg", tripCount: 12 },
      { name: "India", image: "/images/explore/hero-mountains.jpg", tripCount: 15 },
      { name: "Peru", image: "/images/explore/hero-mountains.jpg", tripCount: 9 },
      { name: "Japan", image: "/images/explore/hero-mountains.jpg", tripCount: 7 },
      { name: "Morocco", image: "/images/explore/hero-mountains.jpg", tripCount: 10 },
    ],
    faqs: [
      { q: "What is a Classic Discovery tour?", a: "Our Classic Discovery tours are our most popular trips. They're carefully crafted group holidays that balance must-see highlights with off-the-beaten-track experiences, led by expert local tour leaders." },
      { q: "How big are the groups?", a: "Our average group size is just 11. Big enough to meet like-minded people but small enough to get to the heart of a destination." },
      { q: "Can I travel solo?", a: "Absolutely! Over half our travellers come on their own. It's one of the best ways to travel, and you'll quickly make friends in the group." },
      { q: "Are meals included?", a: "Most tours include breakfast daily and selected lunches and dinners. Check individual tour pages for specific meal inclusions." },
    ],
  },
  "walking-and-trekking": {
    title: "Walking & Trekking",
    slug: "walking-and-trekking",
    heroImage: "https://s3.eu-west-1.amazonaws.com/medialibraries/explore/explore-media/destinations/africa/africa-lions.jpg?ext=.jpg",
    description: "Lace up your boots and discover stunning trails, from gentle coastal walks to challenging mountain treks across the globe.",
    longDescription: "Walking and trekking holidays are the ultimate way to experience a destination. From gentle coastal paths in the Mediterranean to challenging mountain passes in the Himalayas, our walking tours take you through some of the world's most breathtaking landscapes. With expert guides, well-planned itineraries, and small groups, every step brings you closer to nature and local culture.",
    features: [
      { icon: "map", title: "Graded difficulty", text: "Every walk is graded from easy to challenging so you can find the perfect match for your fitness level." },
      { icon: "users", title: "Expert walking guides", text: "Local guides who know every trail, every shortcut, and every hidden viewpoint." },
      { icon: "shield", title: "Support vehicles", text: "On many trips, support vehicles carry your main luggage between stops." },
      { icon: "heart", title: "Incredible scenery", text: "From mountain peaks to coastal cliffs, every walk rewards you with unforgettable views." },
    ],
    popularDestinations: [
      { name: "Nepal", image: "/images/explore/hero-mountains.jpg", tripCount: 6 },
      { name: "Peru", image: "/images/explore/hero-mountains.jpg", tripCount: 4 },
      { name: "Italy", image: "/images/explore/hero-mountains.jpg", tripCount: 8 },
      { name: "Spain", image: "/images/explore/hero-mountains.jpg", tripCount: 5 },
      { name: "Portugal", image: "/images/explore/hero-mountains.jpg", tripCount: 3 },
      { name: "Greece", image: "/images/explore/hero-mountains.jpg", tripCount: 4 },
    ],
    faqs: [
      { q: "What fitness level do I need?", a: "Our walks range from easy (3-4 hours walking on flat terrain) to challenging (8+ hours with significant altitude gain). Check the physical rating on each tour page." },
      { q: "Is my luggage carried?", a: "On many walking tours, your main luggage is transported between accommodations. You'll just carry a daypack with water, snacks and a waterproof." },
      { q: "What should I pack?", a: "Good walking boots, waterproof layers, sun protection, and a comfortable daypack are essential. We'll send you a full packing list when you book." },
    ],
  },
  "cycling-holidays": {
    title: "Cycling Holidays",
    slug: "cycling-holidays",
    heroImage: "/images/explore/hero-mountains.jpg",
    description: "Pedal through stunning landscapes on two wheels, from gentle rides through vineyards to challenging mountain routes.",
    longDescription: "Cycling holidays offer a unique way to explore the world. Feel the wind in your hair as you pedal through ancient villages, along coastal roads, and through spectacular mountain scenery. Our cycling tours are designed for all levels, with support vehicles and expert guides ensuring you have an incredible experience.",
    features: [
      { icon: "map", title: "Quality bikes provided", text: "Well-maintained bikes are provided on all tours, or bring your own if you prefer." },
      { icon: "users", title: "Support vehicle", text: "A support vehicle follows the group with spare parts, water, and a comfortable ride if you need a break." },
      { icon: "shield", title: "All levels welcome", text: "From leisurely rides to challenging mountain passes, there's a cycling tour for every ability." },
      { icon: "heart", title: "Iconic routes", text: "Ride the world's most famous cycling routes and discover hidden gems along the way." },
    ],
    popularDestinations: [
      { name: "France", image: "/images/explore/hero-mountains.jpg", tripCount: 5 },
      { name: "Italy", image: "/images/explore/hero-mountains.jpg", tripCount: 4 },
      { name: "Vietnam", image: "/images/explore/hero-mountains.jpg", tripCount: 3 },
      { name: "Cuba", image: "/images/explore/hero-mountains.jpg", tripCount: 2 },
      { name: "Sri Lanka", image: "/images/explore/hero-mountains.jpg", tripCount: 3 },
      { name: "Croatia", image: "/images/explore/hero-mountains.jpg", tripCount: 2 },
    ],
    faqs: [
      { q: "Do I need to be an experienced cyclist?", a: "No! Our cycling tours range from easy (flat terrain, 20-30km/day) to challenging (mountainous, 80-100km/day). Check the grading on each tour." },
      { q: "Are bikes provided?", a: "Yes, quality bikes are provided on all our cycling tours. You can also bring your own if you prefer." },
      { q: "Is there a support vehicle?", a: "Yes, a support vehicle accompanies the group carrying luggage, spare parts, and offering a comfortable ride if anyone needs a break." },
    ],
  },
  wildlife: {
    title: "Wildlife Holidays",
    slug: "wildlife",
    heroImage: "https://s3.eu-west-1.amazonaws.com/medialibraries/explore/explore-media/destinations/africa/africa-lions.jpg?ext=.jpg",
    description: "Get up close with the world's most incredible wildlife in their natural habitats, from African safaris to Arctic expeditions.",
    longDescription: "Our wildlife holidays put you at the heart of some of the world's greatest natural spectacles. Track gorillas through misty rainforests, witness the Great Migration on the Serengeti, spot polar bears in the Arctic, or snorkel with whale sharks. With expert naturalist guides and carefully chosen lodges, every moment is designed to maximise your wildlife encounters.",
    features: [
      { icon: "map", title: "Expert naturalist guides", text: "Experienced guides who know exactly where and when to find the wildlife you want to see." },
      { icon: "users", title: "Ethical encounters", text: "We prioritise responsible wildlife viewing that protects animals and their habitats." },
      { icon: "shield", title: "Prime locations", text: "Carefully selected camps and lodges in the best locations for wildlife sightings." },
      { icon: "heart", title: "Conservation focus", text: "Many of our trips directly support conservation projects and local communities." },
    ],
    popularDestinations: [
      { name: "Tanzania", image: "/images/explore/hero-mountains.jpg", tripCount: 8 },
      { name: "Kenya", image: "/images/explore/hero-mountains.jpg", tripCount: 6 },
      { name: "Botswana", image: "/images/explore/hero-mountains.jpg", tripCount: 4 },
      { name: "South Africa", image: "/images/explore/hero-mountains.jpg", tripCount: 5 },
      { name: "Rwanda", image: "/images/explore/hero-mountains.jpg", tripCount: 3 },
      { name: "Costa Rica", image: "/images/explore/hero-mountains.jpg", tripCount: 4 },
    ],
    faqs: [
      { q: "Will I definitely see wildlife?", a: "While we can never guarantee sightings, our expert guides and carefully chosen itineraries maximise your chances. On most trips, guests see far more than they expected." },
      { q: "Is a safari safe?", a: "Absolutely. You'll be accompanied by experienced guides at all times, and our vehicles and camps are designed with your safety in mind." },
      { q: "What should I bring?", a: "Binoculars, a good camera with a zoom lens, neutral-coloured clothing, sun protection, and insect repellent are essentials for wildlife holidays." },
    ],
  },
  "family-adventures": {
    title: "Family Adventures",
    slug: "family-adventures",
    heroImage: "/images/explore/hero-mountains.jpg",
    description: "Adventures designed for families, with activities and experiences that kids and adults will love equally.",
    longDescription: "Our family adventures are specifically designed to inspire and excite younger travellers while giving parents an unforgettable holiday too. With age-appropriate activities, family-friendly accommodation, and expert leaders who know how to engage children, these trips create memories that last a lifetime.",
    features: [
      { icon: "map", title: "Kid-friendly itineraries", text: "Carefully paced days with activities designed to engage children of all ages." },
      { icon: "users", title: "Family tour leaders", text: "Leaders experienced in making trips fun and educational for the whole family." },
      { icon: "shield", title: "Safe & comfortable", text: "Family-friendly accommodation and transport, with safety as our top priority." },
      { icon: "heart", title: "Educational adventures", text: "Trips that open young minds to new cultures, wildlife, and ways of life." },
    ],
    popularDestinations: [
      { name: "Morocco", image: "/images/explore/hero-mountains.jpg", tripCount: 3 },
      { name: "Sri Lanka", image: "/images/explore/hero-mountains.jpg", tripCount: 2 },
      { name: "Costa Rica", image: "/images/explore/hero-mountains.jpg", tripCount: 3 },
      { name: "Iceland", image: "/images/explore/hero-mountains.jpg", tripCount: 2 },
      { name: "Italy", image: "/images/explore/hero-mountains.jpg", tripCount: 4 },
    ],
    faqs: [
      { q: "What ages are family trips suitable for?", a: "Most family trips are designed for children aged 5-17, though some have specific age minimums. Check individual tour pages for details." },
      { q: "Do I need to book the whole group?", a: "No, you can book just your family. You'll travel with other families too, which is great for kids making new friends." },
    ],
  },
  "explore-upgraded": {
    title: "Explore Upgraded",
    slug: "explore-upgraded",
    heroImage: "/images/explore/hero-mountains.jpg",
    description: "Premium small group tours with enhanced accommodation, exclusive experiences and extra touches for a more luxurious adventure.",
    longDescription: "Explore Upgraded takes everything you love about our classic discovery tours and adds a touch of luxury. Stay in hand-picked boutique hotels and premium lodges, enjoy exclusive experiences, and travel with added comfort. The adventure spirit remains the same, but with upgraded accommodation and extra special touches.",
    features: [
      { icon: "map", title: "Premium accommodation", text: "Hand-picked boutique hotels, lodges, and heritage properties." },
      { icon: "users", title: "Exclusive experiences", text: "Special access and unique activities not available on standard tours." },
      { icon: "shield", title: "Extra comfort", text: "Private transfers, upgraded transport, and additional amenities." },
      { icon: "heart", title: "Same adventure spirit", text: "All the authentic discovery of a classic Explore trip, with added refinement." },
    ],
    popularDestinations: [
      { name: "Japan", image: "/images/explore/hero-mountains.jpg", tripCount: 4 },
      { name: "Italy", image: "/images/explore/hero-mountains.jpg", tripCount: 3 },
      { name: "Peru", image: "/images/explore/hero-mountains.jpg", tripCount: 2 },
      { name: "India", image: "/images/explore/hero-mountains.jpg", tripCount: 5 },
      { name: "Vietnam", image: "/images/explore/hero-mountains.jpg", tripCount: 3 },
    ],
    faqs: [
      { q: "How is Upgraded different from Classic Discovery?", a: "Upgraded tours follow similar itineraries to our classic trips but with premium accommodation, private transfers, and exclusive experiences added." },
      { q: "Are Upgraded tours still small group?", a: "Yes, Upgraded tours have the same small group sizes as our classic trips, typically averaging 11 travellers." },
    ],
  },
  solo: {
    title: "Solo Travel",
    slug: "solo",
    heroImage: "/images/explore/hero-mountains.jpg",
    description: "The perfect way to travel on your own without being alone. Join like-minded adventurers on small group tours designed for solo travellers.",
    longDescription: "Over half of Explore travellers come on their own, making our trips perfect for solo travellers. You'll join a small group of like-minded adventurers, guided by an expert tour leader. No single supplement hassle, instant travel companions, and the freedom to explore at your own pace within the group.",
    features: [
      { icon: "map", title: "No single supplement", text: "On many tours, there's no single supplement to pay when you travel alone." },
      { icon: "users", title: "Instant companions", text: "Join a group of like-minded travellers and make friends from day one." },
      { icon: "shield", title: "Expert leaders", text: "Our tour leaders look after everyone, ensuring solo travellers feel included and supported." },
      { icon: "heart", title: "Safe & supported", text: "Travel with the confidence of having a group and expert guidance." },
    ],
    popularDestinations: [],
    faqs: [
      { q: "Will I feel left out?", a: "Not at all! Our tour leaders are experienced in ensuring solo travellers feel welcome and included from the very first meeting." },
      { q: "Is there a single supplement?", a: "On many tours there is no single supplement. Where one applies, it's clearly shown on the tour page." },
    ],
  },
  "food-and-drink": {
    title: "Food & Drink Tours",
    slug: "food-and-drink",
    heroImage: "/images/explore/hero-mountains.jpg",
    description: "Taste your way around the world with food and drink focused tours that celebrate local cuisine, cooking traditions, and culinary culture.",
    longDescription: "Food is one of the best ways to understand a culture. Our food and drink tours take you beyond restaurants and into the kitchens, markets, and homes where the real culinary magic happens. Learn to cook regional dishes, taste local delicacies, visit vineyards and distilleries, and share meals with local families.",
    features: [
      { icon: "map", title: "Authentic experiences", text: "Cook with locals, visit markets, and taste dishes you won't find in tourist restaurants." },
      { icon: "users", title: "Foodie guides", text: "Local guides who are passionate about their region's food culture and traditions." },
      { icon: "shield", title: "Cooking classes", text: "Hands-on cooking experiences where you'll learn to recreate dishes at home." },
      { icon: "heart", title: "Local produce", text: "Visit farms, vineyards, and producers to understand food from field to plate." },
    ],
    popularDestinations: [],
    faqs: [
      { q: "Are dietary requirements catered for?", a: "We do our best to accommodate dietary requirements. Please let us know when booking and we'll work with our local partners to ensure you're well fed." },
    ],
  },
  "boat-journeys": {
    title: "Boat Journeys",
    slug: "boat-journeys",
    heroImage: "/images/explore/hero-mountains.jpg",
    description: "Explore coastlines, rivers and waterways aboard traditional boats and expedition vessels. From Nile feluccas to Greek island hopping.",
    longDescription: "There's no better way to explore a destination than by water. Our boat journeys take you along the world's most iconic waterways, from the Nile to the Mekong, the Adriatic to the Amazon. Travel aboard traditional boats, comfortable small ships, and expedition vessels, stopping to explore ports, villages, and hidden coves along the way.",
    features: [
      { icon: "map", title: "Unique perspectives", text: "See destinations from the water for a completely different viewpoint and experience." },
      { icon: "users", title: "Small vessels", text: "Travel on intimate boats and ships that can reach places larger vessels cannot." },
      { icon: "shield", title: "Expert crews", text: "Experienced crews and guides who know every bend in the river and every hidden cove." },
      { icon: "heart", title: "Relaxed pace", text: "Let the current carry you between destinations at a gentle, unhurried pace." },
    ],
    popularDestinations: [
      { name: "Egypt", image: "/images/explore/hero-mountains.jpg", tripCount: 4 },
      { name: "Croatia", image: "/images/explore/hero-mountains.jpg", tripCount: 3 },
      { name: "Greece", image: "/images/explore/hero-mountains.jpg", tripCount: 5 },
      { name: "Vietnam", image: "/images/explore/hero-mountains.jpg", tripCount: 3 },
    ],
    faqs: [
      { q: "What size are the boats?", a: "We use a range of vessels, from traditional feluccas and gulets carrying 10-16 passengers to small expedition ships with around 50-100 guests." },
      { q: "Will I get seasick?", a: "Most of our boat journeys are on calm rivers, sheltered coastlines, or gentle seas. If you're concerned, speak to your GP about remedies before you travel." },
    ],
  },
  "trip-types": {
    title: "All Trip Types",
    slug: "trip-types",
    heroImage: "/images/explore/hero-mountains.jpg",
    description: "Explore all the different ways to travel with us. From classic discovery tours to specialist adventures, find the style that suits you best.",
    longDescription: "At Explore, we believe there's a perfect trip for everyone. Whether you want an action-packed trekking adventure, a gentle cycling tour through vineyards, a family holiday with activities for all ages, or a premium upgraded experience, our range of trip types means you can travel your way. Browse all our trip types below and find your ideal adventure style.",
    features: [
      { icon: "map", title: "10+ trip styles", text: "From classic discovery to cycling, walking, wildlife, polar expeditions, and more." },
      { icon: "users", title: "All fitness levels", text: "Trips graded from easy to challenging so you can find your perfect match." },
      { icon: "shield", title: "Small groups", text: "Average group size of 11, big enough to make friends but small enough to feel personal." },
      { icon: "heart", title: "Expert leaders", text: "Every trip led by an experienced, knowledgeable local tour leader." },
    ],
    popularDestinations: [],
    faqs: [
      { q: "How do I choose the right trip type?", a: "Think about what excites you most -- is it cultural immersion, physical challenge, wildlife encounters, or culinary experiences? Our trip types help you narrow down the perfect adventure for your interests and fitness level." },
    ],
  },
  polar: {
    title: "Polar Expeditions",
    slug: "polar",
    heroImage: "/images/explore/hero-mountains.jpg",
    description: "Journey to the ends of the earth with expedition voyages to the Arctic and Antarctic, witnessing the planet's most dramatic landscapes.",
    longDescription: "Our polar expeditions take you to the most remote and spectacular places on Earth. Cruise through iceberg-studded waters, walk on ancient glaciers, spot polar bears and penguins, and witness the raw beauty of the Arctic and Antarctic. Led by expert expedition teams and naturalists, these are truly once-in-a-lifetime adventures.",
    features: [
      { icon: "map", title: "Expedition ships", text: "Purpose-built ice-strengthened ships designed for polar waters." },
      { icon: "users", title: "Expert expedition teams", text: "Naturalists, historians, and polar experts who bring the experience to life." },
      { icon: "shield", title: "Zodiac landings", text: "Go ashore by Zodiac to explore remote coastlines and get close to wildlife." },
      { icon: "heart", title: "Unforgettable wildlife", text: "Penguins, polar bears, whales, seals, and seabirds in their natural habitat." },
    ],
    popularDestinations: [],
    faqs: [
      { q: "When is the best time to visit?", a: "Antarctic season runs November to March, Arctic season June to September. Both offer unique wildlife and conditions." },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  Slug aliases -- redirect common alternate URLs to correct slugs    */
/* ------------------------------------------------------------------ */
const SLUG_ALIASES: Record<string, string> = {
  discovery: "classic-discovery",
  "classic": "classic-discovery",
  walking: "walking-and-trekking",
  trekking: "walking-and-trekking",
  cycling: "cycling-holidays",
  bikes: "cycling-holidays",
  family: "family-adventures",
  families: "family-adventures",
  upgraded: "explore-upgraded",
  premium: "explore-upgraded",
  "food-drink": "food-and-drink",
  food: "food-and-drink",
  boats: "boat-journeys",
  "boat": "boat-journeys",
  "trip-type": "trip-types",
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const resolved = SLUG_ALIASES[category] || category
  const cat = CATEGORIES[resolved]
  if (!cat) return { title: "Experience Not Found - Explore" }
  return {
    title: `${cat.title} Tours | Adventure Holidays - Explore`,
    description: cat.description,
  }
}

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }))
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default async function ExperienceCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params

  /* Redirect alias slugs to canonical URLs */
  const alias = SLUG_ALIASES[category]
  if (alias) redirect(`/experiences/${alias}`)

  const cat = CATEGORIES[category]
  if (!cat) notFound()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero with video or image */}
      <section className="relative flex min-h-[45vh] items-end overflow-hidden lg:min-h-[55vh]">
        {cat.videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            poster={cat.heroImage}
          >
            <source src={cat.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={cat.heroImage}
            alt={cat.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 lg:px-8">
          <nav className="mb-4 text-xs text-white/70" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/experiences" className="hover:text-white">Experiences</Link>
            <span className="mx-1.5">/</span>
            <span className="text-white">{cat.title}</span>
          </nav>
          <h1 className="font-heading text-4xl font-bold text-white lg:text-5xl">
            {cat.title}
          </h1>
          <p className="mt-2 max-w-2xl text-base text-white/85 lg:text-lg">
            {cat.description}
          </p>
        </div>
      </section>

      <WaveDivider />

      {/* Features grid */}
      <section className="bg-primary pb-8 pt-4">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {cat.features.map((f) => (
            <div key={f.title} className="rounded-lg bg-white/10 p-5">
              <div className="mb-3 text-explore-yellow">
                {f.icon === "map" && <IconUnforgettableExperiences className="h-10 w-10" />}
                {f.icon === "users" && <IconExpertTourLeaders className="h-10 w-10" />}
                {f.icon === "shield" && <IconSmallGroupTours className="h-10 w-10" />}
                {f.icon === "heart" && <IconResponsibleAtHeart className="h-10 w-10" />}
              </div>
              <h3 className="mb-1 text-sm font-bold text-white">{f.title}</h3>
              <p className="text-xs leading-relaxed text-white/75">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Long description */}
      <section className="bg-card py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
            {cat.longDescription}
          </p>
        </div>
      </section>

      {/* Popular destinations */}
      {cat.popularDestinations.length > 0 && (
        <section className="bg-secondary py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-8 font-heading text-2xl font-bold text-foreground lg:text-3xl">
              Popular {cat.title} destinations
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {cat.popularDestinations.map((d) => (
                <Link
                  key={d.name}
                  href={`/search?type=${category}`}
                  className="group relative block overflow-hidden rounded-xl"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-3">
                      <h3 className="text-sm font-bold text-white">{d.name}</h3>
                      <p className="text-xs text-white/70">{d.tripCount} trips</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {cat.faqs.length > 0 && (
        <section className="bg-card py-12 lg:py-16">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
              Frequently asked questions
            </h2>
            <div className="flex flex-col gap-3">
              {cat.faqs.map((faq) => (
                <details key={faq.q} className="group rounded-lg border border-border bg-secondary">
                  <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-foreground marker:text-primary">
                    {faq.q}
                  </summary>
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary py-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center">
          <h2 className="font-heading text-2xl font-bold text-white lg:text-3xl">
            Ready for your {cat.title.toLowerCase()} adventure?
          </h2>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded bg-explore-yellow px-8 py-3 text-sm font-bold text-explore-yellow-foreground transition-colors hover:bg-explore-yellow/90"
          >
            Search all {cat.title} trips
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <TrustStrip />
    </div>
  )
}
