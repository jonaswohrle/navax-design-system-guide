import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Compass, Footprints, Ship, Camera, Bike, Snowflake, Users, UtensilsCrossed, Train, Star } from "lucide-react"
import { blobUrl } from "@/lib/blob-image-urls"
import { TOURS } from "@/lib/tour-data"
import { TripCard } from "@/components/explore/trip-card"
import { TrustStrip } from "@/components/explore/trust-strip"

/* ── Region data with real videos/images and content from explore.co.uk ── */
const REGION_DATA: Record<
  string,
  {
    name: string
    headline: string
    description: string
    longDescription: string
    countries: string[]
    heroVideo?: string
    heroImage: string
    waysToExplore: { label: string; icon: string }[]
    popularSearches: { label: string; href: string }[]
    faqs: { q: string; a: string }[]
  }
> = {
  europe: {
    name: "Europe",
    headline: "Holidays to Europe & Turkey",
    description:
      "Experience untamed nature, extraordinary history and bustling cities on Explore's European holidays. Explore the pristine wilderness of Iceland or the fjords of Norway; hike the rolling hills of Tuscany or stroll among the picturesque villages of the Amalfi Coast.",
    longDescription:
      "Europe's cultural heritage is second-to-none. Legacies of Greek and Roman empires are ever-present throughout the continent -- from amphitheatres and aqueducts to temples and villas, especially along the shores of the Mediterranean. Travel deeper into the continent, and you'll discover gothic cathedrals and medieval castles that tell tales of feudalism and long-lost civilisations. Every corner of Europe offers an enchanting glimpse into history and culture. Walk amongst the fairy-tale chimneys and cave dwellings of Cappadocia in Turkey and join your local tour leader to see Sofia's colourful church murals, and Communist bronze statues and sacred relics in Bulgaria. Beyond its history, Europe's astonishing natural beauty offers plenty of active adventures to enjoy, too. Hike the many striking mountain ranges on our Europe walking holidays. Or, for a more gentle excursion, wonder the verdant hills of Andalucia in Spain, take in the dazzling Adriatic Sea in Croatia, cruise the Greek Island of Evia, or kayak over the sunken city of Kekova in Turkey.",
    countries: [
      "Albania", "Andorra", "Azores", "Bosnia and Herzegovina", "Bulgaria", "Canary Islands",
      "Croatia", "Czechia", "Denmark", "Estonia", "Faroe Islands", "Finland", "France",
      "Greece", "Greenland", "Hungary", "Iceland", "Ireland", "Italy", "Kosovo",
      "Latvia", "Lithuania", "Madeira", "Mallorca", "Malta", "Montenegro", "North Cyprus",
      "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Serbia", "Sicily",
      "Slovakia", "Slovenia", "Spain", "Sweden", "Turkey", "United Kingdom",
    ],
    heroVideo:
      "https://s3.eu-west-1.amazonaws.com/assetbank-eu-west-1-repurposed/explore_e845492678176c101f40037775672ea9%2F1ec%2Fr4tUOWALyON927ryQCRqhEBW0XyFgg28%2Emp4",
    heroImage:
      "https://explore-live.s3.eu-west-1.amazonaws.com/medialibraries/explore/explore-media/destinations/europe/europe-header.jpg?ext=.jpg&width=1920&format=webp&quality=80",
    waysToExplore: [
      { label: "Discovery", icon: "compass" },
      { label: "Walking & Trekking", icon: "footprints" },
      { label: "Boat Journeys", icon: "ship" },
      { label: "Wildlife", icon: "camera" },
      { label: "Cycling", icon: "bike" },
      { label: "Polar", icon: "snowflake" },
      { label: "Family", icon: "users" },
      { label: "Food & Drink", icon: "utensils" },
      { label: "Rail Journeys", icon: "train" },
    ],
    popularSearches: [
      { label: "Cycling in Europe", href: "/search?destination=europe&type=cycling" },
      { label: "Walking in Europe", href: "/search?destination=europe&type=walking" },
      { label: "Family trips in Europe", href: "/search?destination=europe&type=family" },
      { label: "Rail journeys in Europe", href: "/search?destination=europe&type=rail" },
    ],
    faqs: [
      {
        q: "What kind of activities can I do in Europe?",
        a: "Explore offers a wide range of exciting adventure tours in Europe. Whether you're cycling the Transylvanian Alps, sampling the food and wine of the Italian region of Tuscany or trekking in the Scottish Highlands, you're sure to find a European tour you'll love.",
      },
      {
        q: "What is included in the price of a tour?",
        a: "The price you pay includes some meals, accommodation, experienced tour leader, local staff, and activities. Prices do not include flights (if booked on a 'Land Only' basis), visa fees, vaccinations, passport costs, or items of a personal nature.",
      },
      {
        q: "Are your European tours suitable for families?",
        a: "Absolutely! We welcome a range of ages across many of our tours in Europe. Explore also offers a range of tours especially created for families, with activities that kids will love!",
      },
    ],
  },
  africa: {
    name: "Africa",
    headline: "Tours to Africa",
    description:
      "The sheer scale of Africa is the first thing that strikes you. The immensity of Africa's deserts, savannah and rainforests, its endless horizons and diverse wildlife. Africa's dizzying sights, sounds, smells and colours surround you the moment you arrive.",
    longDescription:
      "Africa is best known for its wildlife. Home to the Big Five (lion, leopard, elephant, buffalo and rhinoceros), Africa boasts some of the world's greatest wildlife reserves, including the Serengeti, Etosha, Ngorongoro, Chobe, and Kruger national parks. Join one of our Africa wildlife safari tours for a chance to spot some, or maybe all, of these iconic creatures in their natural habitat. You can also find gorilla and chimp foraging in the lush mountains of Uganda or immerse yourself in exotic wildlife on the 'The Lost Continent' of Madagascar. Africa also offers a wide variety of challenging walks and hikes. Trek into the spectacular Atlas Mountains of Morocco to summit Mount Toubkal, the highest peak in North Africa, tick the colossal Kilimanjaro off your bucket list or head beyond the beaten track with a hike into the lush green Simien Mountains of Ethiopia.",
    countries: [
      "Algeria", "Benin", "Botswana", "Eswatini", "Ghana", "Ivory Coast", "Kenya",
      "Madagascar", "Morocco", "Namibia", "Rwanda", "Senegal", "South Africa",
      "Tanzania", "The Gambia", "Togo", "Tunisia", "Uganda", "Zimbabwe",
    ],
    heroImage:
      "https://explore-live.s3.eu-west-1.amazonaws.com/medialibraries/explore/explore-media/destinations/africa/africa-header.jpg?ext=.jpg&width=1920&format=webp&quality=80",
    waysToExplore: [
      { label: "Discovery", icon: "compass" },
      { label: "Wildlife", icon: "camera" },
      { label: "Walking & Trekking", icon: "footprints" },
      { label: "Family", icon: "users" },
      { label: "Cycling", icon: "bike" },
    ],
    popularSearches: [
      { label: "Safari tours in Africa", href: "/search?destination=africa&type=wildlife" },
      { label: "Family tours in Africa", href: "/search?destination=africa&type=family" },
    ],
    faqs: [
      {
        q: "What wildlife can I see on an African safari?",
        a: "Africa is home to the Big Five -- lion, leopard, elephant, buffalo and rhinoceros. Depending on your destination, you may also see gorillas, chimpanzees, hippos, zebras, giraffes and countless bird species.",
      },
      {
        q: "Is it safe to travel to Africa?",
        a: "Our experienced tour leaders ensure safety throughout your journey. We carefully monitor conditions in all our destinations and choose routes and accommodations with your safety as top priority.",
      },
    ],
  },
  asia: {
    name: "Asia",
    headline: "Holidays in Asia",
    description:
      "From sacred temples to neon-lit cities and snow-capped mountains to great swathes of desert, Asia offers some of the most diverse travel experiences on the planet.",
    longDescription:
      "A land of extraordinary contrasts, Asia is perfect for small group travel. Journey from the wild beauty of Georgia's Caucasus mountains to the bright lights and bustle of Hong Kong. Sail through Vietnam's iconic Halong Bay, where towering karsts meet shimmering emerald waters. Watch the sun rise over the sacred temple of Angkor Wat in Cambodia. Our classic Golden Triangle Tour in India is an amazing way to experience the lively markets of Delhi with the celestial visage of the Taj Mahal at dawn. Explore The Great Wall of China and visit Xian's Terracotta Army, or dive into Tokyo's ultramodern cityscape on our small group trips to Japan.",
    countries: [
      "Armenia", "Azerbaijan", "Bhutan", "Borneo", "Cambodia", "China", "Georgia",
      "Hong Kong", "India", "Indonesia", "Japan", "Kazakhstan", "Kyrgyzstan", "Laos",
      "Maldives", "Malaysia", "Mongolia", "Nepal", "Pakistan", "Philippines",
      "Singapore", "South Korea", "Sri Lanka", "Tajikistan", "Thailand",
      "Turkmenistan", "Uzbekistan", "Vietnam",
    ],
    heroImage:
      "https://explore-live.s3.eu-west-1.amazonaws.com/medialibraries/explore/explore-media/destinations/asia/asia-header.jpg?ext=.jpg&width=1920&format=webp&quality=80",
    waysToExplore: [
      { label: "Discovery", icon: "compass" },
      { label: "Wildlife", icon: "camera" },
      { label: "Walking & Trekking", icon: "footprints" },
      { label: "Family", icon: "users" },
      { label: "Cycling", icon: "bike" },
      { label: "Rail Journeys", icon: "train" },
      { label: "Boat Journeys", icon: "ship" },
      { label: "Food & Drink", icon: "utensils" },
    ],
    popularSearches: [
      { label: "Trekking in Nepal", href: "/search?destination=asia&type=walking" },
      { label: "Cultural tours in Japan", href: "/search?destination=asia" },
    ],
    faqs: [
      {
        q: "What destinations can I visit in Asia?",
        a: "Explore offers tours across a range of destinations in Asia, including India, Japan, Vietnam, Thailand, China, Sri Lanka, Nepal, and many more. Our Central Asia adventure tours take you along the iconic Silk Road.",
      },
    ],
  },
  "south-america": {
    name: "South America",
    headline: "Tours to South America",
    description:
      "Explore the world's largest rainforest, the Amazon, or lose your breath in South America's highest capital city in Bolivia. Swim with sea lions in the Galapagos Islands, spot jaguar in Brazil, hike the Inca Trail or trek in Patagonia.",
    longDescription:
      "The natural landscape of South America is simply breathtaking. Walk through the lush Amazon rainforest in Brazil, trek snow-capped volcanoes in Chile, and go in search of turquoise lakes in Patagonia. Switch off with a visit to the palm-fringed white sand beaches of Colombia's Tayrona National Park, or escape civilisation as you venture into Bolivia's remote white desert to find the ethereal Uyuni salt flats. For the ultimate wildlife adventure, visit the Galapagos Islands to see giant tortoise, large iguana, and an abundance of exotic bird species. Follow the iconic Inca Trail to the 'lost' city of Machu Picchu in Peru, or trek into Patagonia's Torres Del Paine National Park.",
    countries: ["Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Galapagos", "Peru"],
    heroImage:
      "https://explore-live.s3.eu-west-1.amazonaws.com/medialibraries/explore/explore-media/destinations/south%20america/south-america-header.jpg?ext=.jpg&width=1920&format=webp&quality=80",
    waysToExplore: [
      { label: "Discovery", icon: "compass" },
      { label: "Wildlife", icon: "camera" },
      { label: "Walking & Trekking", icon: "footprints" },
      { label: "Boat Journeys", icon: "ship" },
      { label: "Polar", icon: "snowflake" },
    ],
    popularSearches: [
      { label: "Inca Trail treks", href: "/search?destination=south-america&type=walking" },
      { label: "Galapagos wildlife tours", href: "/search?destination=south-america&type=wildlife" },
    ],
    faqs: [
      {
        q: "What is the best time to visit South America?",
        a: "It depends on your destination! Peru and the Inca Trail are best visited May-September during the dry season. Patagonia is ideal from November-March. The Galapagos can be visited year-round.",
      },
    ],
  },
  "central-america": {
    name: "Central America",
    headline: "Tours to Central America",
    description:
      "Latin America is covered in volcanoes and lush rainforests, with music that follows you everywhere. From wildlife-filled Costa Rica to foodie paradise Mexico, our holidays cover the must-sees and must-dos.",
    longDescription:
      "A hybrid of Caribbean, Latin and American cultures, Central America is a rich melting pot of breathtaking tropical scenery, exotic wildlife, colonial history, vibrant festivals and delicious food. Head to Costa Rica to explore a labyrinth of jungle waterways in the 'mini Amazon' of Tortuguero, and discover a fertile land brimming with exotic wildlife, white-sand beaches and tropical rainforests on our Belize tours. Go back in time on a tour of discovery through the ancient heartlands of Aztec, Zapotec and Maya civilisations; explore the timeworn pyramid of Chichen Itza and celebrate Day of the Dead in Mexico.",
    countries: ["Belize", "Costa Rica", "El Salvador", "Guatemala", "Honduras", "Mexico", "Nicaragua", "Panama"],
    heroImage:
      "https://explore-live.s3.eu-west-1.amazonaws.com/medialibraries/explore/explore-media/destinations/central%20america/central-america-header.jpg?ext=.jpg&width=1920&format=webp&quality=80",
    waysToExplore: [
      { label: "Discovery", icon: "compass" },
      { label: "Wildlife", icon: "camera" },
      { label: "Cycling", icon: "bike" },
      { label: "Family", icon: "users" },
      { label: "Food & Drink", icon: "utensils" },
    ],
    popularSearches: [
      { label: "Costa Rica wildlife tours", href: "/search?destination=central-america&type=wildlife" },
      { label: "Mexico cultural tours", href: "/search?destination=central-america" },
    ],
    faqs: [],
  },
  "middle-east": {
    name: "Middle East",
    headline: "Tours to the Middle East",
    description:
      "Rich colours dominate our Middle East tours, from orange architecture and deserts to multi-coloured mosaics and fabrics. Experience the Middle East close up by camel, foot, bike or even by boat along the Nile.",
    longDescription:
      "At a crossroads of religion, history and ancient architecture, the Middle East is a must-visit region for any avid adventurer. Visit beautifully-preserved archaeological sites, such as the 'rose city' of Petra, for a glimpse of the intricate work once carried out thousands of years ago. Alternatively, get to know the locals through intimate home-cooked dinners in family-run restaurants. For a more active adventure, opt for a walking or cycling tour of the Middle East. Peer into the vast Wadi Rum desert and across the unique Dead Sea, or swap two wheels for a leisurely cruise as you meander the iconic Nile River, sailing from Aswan to Luxor.",
    countries: ["Egypt", "Jordan", "Oman", "Saudi Arabia"],
    heroImage:
      "https://explore-live.s3.eu-west-1.amazonaws.com/medialibraries/explore/explore-media-v2/destinations/5.%20middle%20east/jordan/dead-sea-coastline-jpg.jpg?ext=.jpg",
    waysToExplore: [
      { label: "Discovery", icon: "compass" },
      { label: "Family", icon: "users" },
      { label: "Boat Journeys", icon: "ship" },
      { label: "Cycling", icon: "bike" },
      { label: "Walking & Trekking", icon: "footprints" },
    ],
    popularSearches: [
      { label: "Jordan discovery tours", href: "/search?destination=middle-east" },
      { label: "Egypt Nile cruises", href: "/search?destination=middle-east&type=boat" },
    ],
    faqs: [],
  },
  polar: {
    name: "Polar Regions",
    headline: "Polar Expeditions",
    description:
      "The ultimate frontier for intrepid explorers. From the ice-sculpted fjords of the Arctic to the vast white continent of Antarctica, our polar expeditions offer once-in-a-lifetime encounters with the most remote places on Earth.",
    longDescription:
      "Our polar expeditions combine expert guidance with authentic adventure. Cruise through the frozen landscapes of the Antarctic Peninsula, spot polar bears on the ice flows of Svalbard, or witness the spectacular Northern Lights. These journeys take you to the very edge of civilisation for experiences you'll never forget.",
    countries: ["Antarctica", "Arctic", "Svalbard", "Iceland"],
    heroImage:
      "https://explore-live.s3.eu-west-1.amazonaws.com/medialibraries/explore/explore-media/destinations/polar/polar-header.jpg?ext=.jpg&width=1920&format=webp&quality=80",
    waysToExplore: [
      { label: "Discovery", icon: "compass" },
      { label: "Wildlife", icon: "camera" },
      { label: "Boat Journeys", icon: "ship" },
      { label: "Polar", icon: "snowflake" },
    ],
    popularSearches: [],
    faqs: [],
  },
  "north-america": {
    name: "North America",
    headline: "Tours to North America",
    description:
      "From the soaring peaks of the Rockies to the red deserts of the Southwest, North America offers diverse adventures. Hike through national parks, discover indigenous cultures, and experience the great outdoors.",
    longDescription:
      "North America's natural wonders range from the Grand Canyon to the Great Lakes, from Yellowstone's geysers to the glaciers of Alaska. Our small group tours showcase the best of these epic landscapes alongside unique wildlife encounters and cultural experiences.",
    countries: ["USA", "Canada"],
    heroImage:
      "https://explore-live.s3.eu-west-1.amazonaws.com/medialibraries/explore/explore-media/destinations/north-america/north-america-header.jpg?ext=.jpg&width=1920&format=webp&quality=80",
    waysToExplore: [
      { label: "Discovery", icon: "compass" },
      { label: "Walking & Trekking", icon: "footprints" },
    ],
    popularSearches: [],
    faqs: [],
  },
  caribbean: {
    name: "Caribbean",
    headline: "Caribbean Holidays",
    description:
      "Crystal clear waters, rhythmic music, and colourful colonial towns define the Caribbean islands. Our tours take you beyond the beach resorts to discover the authentic heart of these tropical paradises.",
    longDescription:
      "The Caribbean islands are a melting pot of cultures, where African, European and indigenous influences blend to create unique music, art and cuisine. Our tours take you to the heart of these vibrant communities.",
    countries: ["Cuba", "Jamaica", "Dominican Republic"],
    heroImage:
      "https://explore-live.s3.eu-west-1.amazonaws.com/medialibraries/explore/explore-media/destinations/caribbean/caribbean-header.jpg?ext=.jpg&width=1920&format=webp&quality=80",
    waysToExplore: [
      { label: "Discovery", icon: "compass" },
      { label: "Cycling", icon: "bike" },
    ],
    popularSearches: [],
    faqs: [],
  },
  australasia: {
    name: "Australasia",
    headline: "Tours to Australasia",
    description:
      "From the red centre of Australia to the fiords of New Zealand, Australasia offers extraordinary natural wonders. Our small group tours showcase the best of these epic landscapes alongside unique wildlife encounters.",
    longDescription:
      "Australia and New Zealand are lands of extreme beauty and adventure. Our tours take you from the outback to the reef, from volcanic peaks to pristine rainforests.",
    countries: ["Australia", "New Zealand", "Papua New Guinea"],
    heroImage:
      "https://explore-live.s3.eu-west-1.amazonaws.com/medialibraries/explore/explore-media/destinations/australasia/australasia-header.jpg?ext=.jpg&width=1920&format=webp&quality=80",
    waysToExplore: [
      { label: "Discovery", icon: "compass" },
      { label: "Walking & Trekking", icon: "footprints" },
      { label: "Wildlife", icon: "camera" },
    ],
    popularSearches: [],
    faqs: [],
  },
}

const ICON_MAP: Record<string, React.ElementType> = {
  compass: Compass,
  footprints: Footprints,
  ship: Ship,
  camera: Camera,
  bike: Bike,
  snowflake: Snowflake,
  users: Users,
  utensils: UtensilsCrossed,
  train: Train,
  star: Star,
}

export function generateStaticParams() {
  return Object.keys(REGION_DATA).map((region) => ({ region }))
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region } = await params
  const data = REGION_DATA[region]
  if (!data) return { title: "Destination Not Found" }
  return {
    title: `${data.name} Tours & Adventure Holidays | Explore`,
    description: data.description.slice(0, 160),
  }
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params
  const data = REGION_DATA[region]
  if (!data) notFound()

  const allTours = Object.values(TOURS)
  const regionTours = allTours.filter((tour) => {
    const dest = tour.destination.toLowerCase()
    const country = tour.country.toLowerCase()
    return (
      data.countries.some((c) => c.toLowerCase() === dest || c.toLowerCase() === country) ||
      dest.includes(data.name.toLowerCase())
    )
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero with video or image -- full-bleed like real site */}
      <section className="relative h-[340px] overflow-hidden lg:h-[440px]">
        {data.heroVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            poster={data.heroImage}
          >
            <source src={data.heroVideo} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={blobUrl(data.heroImage)}
            alt={data.name}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {/* Breadcrumb + title */}
        <div className="relative flex h-full flex-col justify-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-8 lg:pb-10">
            <div className="mb-2 flex items-center gap-2 text-sm text-white/70">
              <Link href="/destinations" className="hover:text-white">
                Destinations
              </Link>
              <span>/</span>
              <span className="text-white">{data.name}</span>
            </div>
            <h1 className="max-w-3xl font-heading text-3xl font-bold text-white lg:text-5xl text-balance">
              {data.headline}
            </h1>
          </div>
        </div>
      </section>

      {/* Intro text */}
      <section className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
        <p className="max-w-3xl text-base leading-relaxed text-foreground lg:text-lg">
          {data.description}
        </p>
      </section>

      {/* Ways to explore -- circular icons like real site */}
      {data.waysToExplore.length > 0 && (
        <section className="border-y border-border bg-secondary py-8">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-6 font-heading text-xl font-bold text-foreground">
              Ways to explore {data.name}
            </h2>
            <div className="flex flex-wrap gap-4 lg:gap-6">
              {data.waysToExplore.map((way) => {
                const IconComponent = ICON_MAP[way.icon] || Compass
                return (
                  <Link
                    key={way.label}
                    href={`/search?destination=${region}&type=${way.label.toLowerCase().replace(/ & /g, "-")}`}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/30 bg-card transition-colors group-hover:border-primary group-hover:bg-primary/5 lg:h-20 lg:w-20">
                      <IconComponent className="h-7 w-7 text-primary lg:h-8 lg:w-8" />
                    </div>
                    <span className="text-center text-xs font-medium text-foreground lg:text-sm">
                      {way.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Popular searches */}
      {data.popularSearches.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Popular {data.name} trip searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.popularSearches.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="rounded-full border border-primary/30 bg-card px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/5"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Long description */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">
            Discover our tours to {data.name}
          </h2>
          <div className="max-w-4xl">
            <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
              {data.longDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Country pills */}
      <section className="border-b border-border bg-card py-6">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            See all destinations in {data.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.countries.map((c) => (
              <span key={c} className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tours grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
          {regionTours.length > 0
            ? `Our most popular trips in ${data.name}`
            : `More ${data.name} tours coming soon`}
        </h2>
        {regionTours.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regionTours.map((tour) => (
              <TripCard
                key={tour.slug}
                trip={{
                  title: tour.title,
                  destination: tour.destination,
                  tripType: tour.tripType,
                  duration: tour.duration,
                  price: tour.price,
                  originalPrice: tour.originalPrice,
                  imageUrl: tour.imageUrl,
                  tripCode: tour.tripCode,
                  slug: tour.slug,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              {"We're adding new tours to this region. Check back soon or browse our other destinations."}
            </p>
            <Link href="/destinations" className="text-sm font-semibold text-primary hover:underline">
              View all destinations
            </Link>
          </div>
        )}
        {regionTours.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href={`/search?destination=${region}`}
              className="rounded bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#a00d24]"
            >
              View all {data.name} tours
            </Link>
            <Link
              href="/search"
              className="rounded border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              Advanced Search
            </Link>
          </div>
        )}
      </section>

      {/* FAQs */}
      {data.faqs.length > 0 && (
        <section className="border-t border-border bg-secondary">
          <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
            <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
              FAQs about our holidays to {data.name}
            </h2>
            <div className="flex max-w-3xl flex-col gap-3">
              {data.faqs.map((faq) => (
                <details key={faq.q} className="group rounded-lg border border-border bg-card">
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

      <TrustStrip />
    </div>
  )
}
