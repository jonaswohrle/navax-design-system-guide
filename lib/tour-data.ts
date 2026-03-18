// Tour data for Explore travel site
export interface TourDeparture {
  id: string
  startDate: string
  endDate: string
  price: number
  originalPrice?: number
  status: "Available" | "Limited" | "Guaranteed" | "Sold Out"
  note?: string
}

export interface TourItineraryDay {
  day: number
  title: string
  description: string
  meals?: string
  accommodation?: string
}

export interface TourDetail {
  slug: string
  title: string
  destination: string
  country: string
  tripType: string
  duration: string
  durationDays: number
  groupSize: string
  physicalRating: number
  maxAltitude?: string
  price: number
  originalPrice?: number
  imageUrl: string
  galleryImages: string[]
  tripCode: string
  overview: string
  highlights: string[]
  included: string[]
  notIncluded: string[]
  itinerary: TourItineraryDay[]
  departures: TourDeparture[]
  relatedSlugs: string[]
}

export const TOURS: Record<string, TourDetail> = {
  "japan-in-depth": {
    slug: "japan-in-depth",
    title: "Japan In Depth - Footsteps of the Shogun",
    destination: "Japan",
    country: "Japan",
    tripType: "Discovery",
    duration: "12 Days",
    durationDays: 12,
    groupSize: "6-16",
    physicalRating: 2,
    price: 4245,
    originalPrice: 4545,
    imageUrl: "/images/explore/trip-japan.jpg",
    galleryImages: ["/images/explore/trip-japan.jpg"],
    tripCode: "JS",
    overview:
      "Discover the very best of Japan on this 12-day small group tour that takes you from the buzzing streets of Tokyo through the cultural heartland to the tranquil temples of Kyoto. Experience traditional ryokan stays, sample authentic Japanese cuisine, witness the beauty of Mount Fuji and explore ancient samurai towns. With an expert local tour leader, you'll get beneath the surface of this fascinating country.",
    highlights: [
      "Explore the vibrant Shibuya crossing and Meiji Shrine in Tokyo",
      "Stay in a traditional Japanese ryokan with onsen bathing",
      "Visit the iconic Fushimi Inari shrine with its thousands of torii gates",
      "Discover the samurai district of Kanazawa",
      "Take the bullet train through stunning Japanese countryside",
      "Experience a traditional tea ceremony in Kyoto",
    ],
    included: [
      "11 nights accommodation",
      "All breakfasts, 3 lunches, 4 dinners",
      "Bullet train tickets",
      "Expert English-speaking tour leader",
      "All entrance fees and activities as listed",
      "Airport transfers on day 1 and last day",
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Meals not listed",
      "Personal expenses and tips",
      "Visa (if required)",
    ],
    itinerary: [
      { day: 1, title: "Arrive in Tokyo", description: "Arrive at Tokyo Narita Airport and transfer to your hotel. Meet your tour leader and group for a welcome briefing and dinner.", meals: "Dinner", accommodation: "Hotel in Shinjuku" },
      { day: 2, title: "Tokyo exploration", description: "Full day exploring Tokyo including Meiji Shrine, Harajuku, Shibuya crossing and the Tsukiji Outer Market. Evening free to explore.", meals: "Breakfast", accommodation: "Hotel in Shinjuku" },
      { day: 3, title: "Tokyo to Hakone", description: "Travel to Hakone and enjoy views of Mount Fuji. Take a cruise on Lake Ashi and ride the Hakone Ropeway.", meals: "Breakfast, Lunch", accommodation: "Ryokan in Hakone" },
      { day: 4, title: "Hakone to Takayama", description: "Travel by train through stunning mountain scenery to the beautiful town of Takayama, known for its preserved Edo-era streets.", meals: "Breakfast", accommodation: "Hotel in Takayama" },
      { day: 5, title: "Takayama & Shirakawago", description: "Morning visit to Takayama's morning markets. Afternoon excursion to the UNESCO World Heritage village of Shirakawago.", meals: "Breakfast, Dinner", accommodation: "Hotel in Takayama" },
      { day: 6, title: "Takayama to Kanazawa", description: "Travel to Kanazawa and visit the stunning Kenrokuen Garden, one of Japan's three great gardens. Explore the samurai and geisha districts.", meals: "Breakfast", accommodation: "Hotel in Kanazawa" },
      { day: 7, title: "Kanazawa to Kyoto", description: "Bullet train to Kyoto. Afternoon visit to the Golden Pavilion (Kinkaku-ji) and the Nishiki Market.", meals: "Breakfast, Lunch", accommodation: "Hotel in Kyoto" },
      { day: 8, title: "Kyoto temples", description: "Full day in Kyoto visiting Fushimi Inari shrine, Kiyomizu-dera temple and the bamboo grove of Arashiyama.", meals: "Breakfast", accommodation: "Hotel in Kyoto" },
      { day: 9, title: "Nara day trip", description: "Day trip to Nara to see the Great Buddha at Todai-ji temple and the friendly deer in Nara Park.", meals: "Breakfast, Dinner", accommodation: "Hotel in Kyoto" },
      { day: 10, title: "Kyoto tea ceremony", description: "Morning tea ceremony experience. Afternoon free for personal exploration or optional activities.", meals: "Breakfast, Lunch", accommodation: "Hotel in Kyoto" },
      { day: 11, title: "Kyoto to Hiroshima", description: "Bullet train to Hiroshima. Visit the Peace Memorial Museum and Park. Ferry to Miyajima Island to see the floating torii gate.", meals: "Breakfast, Dinner", accommodation: "Hotel in Hiroshima" },
      { day: 12, title: "Departure", description: "Transfer to Hiroshima station or airport for onward travel. Trip ends after breakfast.", meals: "Breakfast", accommodation: "" },
    ],
    departures: [
      { id: "JS-2026-04-12", startDate: "2026-04-12", endDate: "2026-04-23", price: 4245, originalPrice: 4545, status: "Guaranteed" },
      { id: "JS-2026-05-03", startDate: "2026-05-03", endDate: "2026-05-14", price: 4245, originalPrice: 4545, status: "Available" },
      { id: "JS-2026-05-17", startDate: "2026-05-17", endDate: "2026-05-28", price: 4495, status: "Limited" },
      { id: "JS-2026-06-07", startDate: "2026-06-07", endDate: "2026-06-18", price: 4245, originalPrice: 4545, status: "Available" },
      { id: "JS-2026-09-06", startDate: "2026-09-06", endDate: "2026-09-17", price: 4495, status: "Available" },
      { id: "JS-2026-09-20", startDate: "2026-09-20", endDate: "2026-10-01", price: 4495, status: "Guaranteed" },
      { id: "JS-2026-10-04", startDate: "2026-10-04", endDate: "2026-10-15", price: 4695, status: "Available", note: "Autumn colours" },
      { id: "JS-2026-10-18", startDate: "2026-10-18", endDate: "2026-10-29", price: 4695, status: "Limited", note: "Autumn colours" },
      { id: "JS-2026-11-08", startDate: "2026-11-08", endDate: "2026-11-19", price: 4245, status: "Available" },
      { id: "JS-2027-03-21", startDate: "2027-03-21", endDate: "2027-04-01", price: 4795, status: "Available", note: "Cherry blossom" },
    ],
    relatedSlugs: ["amalfi-coast-walking", "cycle-cuba", "south-africa-eswatini"],
  },
  "amalfi-coast-walking": {
    slug: "amalfi-coast-walking",
    title: "Amalfi Coast Walking - Agriturismo",
    destination: "Italy",
    country: "Italy",
    tripType: "Walking",
    duration: "8 Days",
    durationDays: 8,
    groupSize: "8-16",
    physicalRating: 3,
    price: 1495,
    imageUrl: "/images/explore/trip-amalfi.jpg",
    galleryImages: ["/images/explore/trip-amalfi.jpg"],
    tripCode: "NAW",
    overview:
      "Walk through the spectacular scenery of southern Italy's Amalfi Coast on this 8-day walking holiday. Stay in a family-run agriturismo set among lemon groves and olive trees, and enjoy daily walks along stunning coastal paths with breathtaking sea views. Discover picturesque villages, taste local limoncello, and swim in crystal-clear waters.",
    highlights: [
      "Walk the famous Path of the Gods with panoramic coast views",
      "Stay in a beautiful agriturismo among lemon groves",
      "Visit the colourful cliffside village of Positano",
      "Explore the ancient ruins of Pompeii",
      "Enjoy authentic Italian home-cooking",
      "Swim in the Mediterranean at secluded beaches",
    ],
    included: [
      "7 nights accommodation in agriturismo",
      "All breakfasts, 3 lunches, 5 dinners",
      "Expert walking guide",
      "All transport between walks",
      "Entrance to Pompeii",
    ],
    notIncluded: ["International flights", "Travel insurance", "Meals not listed", "Tips"],
    itinerary: [
      { day: 1, title: "Arrive Naples", description: "Transfer from Naples airport to your agriturismo on the Amalfi Coast. Welcome dinner with the group.", meals: "Dinner", accommodation: "Agriturismo" },
      { day: 2, title: "Ravello & Amalfi Walk", description: "Walk from Ravello down through terraced gardens to the coastal town of Amalfi. Approx 12km, 5hrs.", meals: "Breakfast, Dinner", accommodation: "Agriturismo" },
      { day: 3, title: "Path of the Gods", description: "The famous Sentiero degli Dei, a stunning cliff-top path with incredible views. Approx 10km, 4hrs.", meals: "Breakfast, Lunch, Dinner", accommodation: "Agriturismo" },
      { day: 4, title: "Positano", description: "Walk down to the picturesque village of Positano. Afternoon free to explore and swim.", meals: "Breakfast", accommodation: "Agriturismo" },
      { day: 5, title: "Valle delle Ferriere", description: "Walk through the Valley of the Mills, a hidden nature reserve with waterfalls. Approx 8km, 3.5hrs.", meals: "Breakfast, Lunch, Dinner", accommodation: "Agriturismo" },
      { day: 6, title: "Pompeii excursion", description: "Full day excursion to the ancient Roman city of Pompeii with guided tour.", meals: "Breakfast, Dinner", accommodation: "Agriturismo" },
      { day: 7, title: "Coastal walk & cooking class", description: "Morning coastal walk. Afternoon Italian cooking class at the agriturismo.", meals: "Breakfast, Lunch, Dinner", accommodation: "Agriturismo" },
      { day: 8, title: "Departure", description: "Transfer to Naples airport. Trip ends after breakfast.", meals: "Breakfast", accommodation: "" },
    ],
    departures: [
      { id: "NAW-2026-04-18", startDate: "2026-04-18", endDate: "2026-04-25", price: 1495, status: "Guaranteed" },
      { id: "NAW-2026-05-02", startDate: "2026-05-02", endDate: "2026-05-09", price: 1595, status: "Available" },
      { id: "NAW-2026-05-16", startDate: "2026-05-16", endDate: "2026-05-23", price: 1595, status: "Limited" },
      { id: "NAW-2026-06-06", startDate: "2026-06-06", endDate: "2026-06-13", price: 1695, status: "Available" },
      { id: "NAW-2026-09-05", startDate: "2026-09-05", endDate: "2026-09-12", price: 1595, status: "Available" },
      { id: "NAW-2026-09-19", startDate: "2026-09-19", endDate: "2026-09-26", price: 1495, status: "Available" },
      { id: "NAW-2026-10-03", startDate: "2026-10-03", endDate: "2026-10-10", price: 1395, status: "Available" },
    ],
    relatedSlugs: ["japan-in-depth", "adventures-in-patagonia", "cycle-cuba"],
  },
  "adventures-in-patagonia": {
    slug: "adventures-in-patagonia",
    title: "Adventures in Patagonia",
    destination: "Argentina & Chile",
    country: "Argentina",
    tripType: "Discovery",
    duration: "14 Days",
    durationDays: 14,
    groupSize: "6-16",
    physicalRating: 3,
    price: 5065,
    imageUrl: "/images/explore/trip-patagonia.jpg",
    galleryImages: ["/images/explore/trip-patagonia.jpg"],
    tripCode: "PA",
    overview:
      "Explore the dramatic landscapes of Patagonia on this 14-day adventure through Argentina and Chile. From the glaciers of Perito Moreno to the granite spires of Torres del Paine, this trip showcases the very best of South America's wildest region.",
    highlights: [
      "Witness the mighty Perito Moreno glacier calving into the lake",
      "Trek in Torres del Paine National Park",
      "Cross the Andes from Argentina to Chile",
      "Spot condors, guanacos and rheas",
      "Explore colourful Buenos Aires",
    ],
    included: ["13 nights accommodation", "All breakfasts, 5 lunches, 6 dinners", "Expert tour leader", "All internal transport", "National park entrance fees"],
    notIncluded: ["International flights", "Travel insurance", "Meals not listed", "Tips"],
    itinerary: [
      { day: 1, title: "Buenos Aires", description: "Arrive in Buenos Aires. Welcome meeting and dinner.", meals: "Dinner", accommodation: "Hotel" },
      { day: 2, title: "Buenos Aires", description: "City tour of Buenos Aires including La Boca and San Telmo.", meals: "Breakfast", accommodation: "Hotel" },
      { day: 3, title: "Fly to El Calafate", description: "Fly south to El Calafate, gateway to the glaciers.", meals: "Breakfast", accommodation: "Hotel" },
      { day: 4, title: "Perito Moreno Glacier", description: "Full day at the incredible Perito Moreno glacier.", meals: "Breakfast, Lunch", accommodation: "Hotel" },
      { day: 5, title: "El Chaltén", description: "Travel to El Chaltén for trekking.", meals: "Breakfast", accommodation: "Hotel" },
      { day: 6, title: "Fitz Roy Trek", description: "Trek to Laguna de los Tres with views of Mt Fitz Roy.", meals: "Breakfast, Lunch", accommodation: "Hotel" },
      { day: 7, title: "Cross to Chile", description: "Cross the border into Chile and travel to Torres del Paine.", meals: "Breakfast, Dinner", accommodation: "Hotel" },
      { day: 8, title: "Torres del Paine", description: "Full day exploring Torres del Paine National Park.", meals: "Breakfast, Lunch, Dinner", accommodation: "Hotel" },
      { day: 9, title: "Torres del Paine", description: "Trek to the base of the Torres.", meals: "Breakfast, Lunch, Dinner", accommodation: "Hotel" },
      { day: 10, title: "Torres del Paine", description: "Visit Grey Glacier and Lago Grey.", meals: "Breakfast, Dinner", accommodation: "Hotel" },
      { day: 11, title: "Punta Arenas", description: "Travel to Punta Arenas. Visit penguin colony.", meals: "Breakfast", accommodation: "Hotel" },
      { day: 12, title: "Fly to Santiago", description: "Fly to Santiago, Chile's vibrant capital.", meals: "Breakfast", accommodation: "Hotel" },
      { day: 13, title: "Santiago", description: "City tour. Farewell dinner.", meals: "Breakfast, Dinner", accommodation: "Hotel" },
      { day: 14, title: "Departure", description: "Trip ends after breakfast.", meals: "Breakfast", accommodation: "" },
    ],
    departures: [
      { id: "PA-2026-10-10", startDate: "2026-10-10", endDate: "2026-10-23", price: 5065, status: "Available" },
      { id: "PA-2026-11-07", startDate: "2026-11-07", endDate: "2026-11-20", price: 5065, status: "Guaranteed" },
      { id: "PA-2026-12-05", startDate: "2026-12-05", endDate: "2026-12-18", price: 5295, status: "Available" },
      { id: "PA-2027-01-10", startDate: "2027-01-10", endDate: "2027-01-23", price: 5295, status: "Limited" },
      { id: "PA-2027-02-07", startDate: "2027-02-07", endDate: "2027-02-20", price: 5065, status: "Available" },
    ],
    relatedSlugs: ["japan-in-depth", "south-africa-eswatini", "cycle-cuba"],
  },
  "cycle-cuba": {
    slug: "cycle-cuba",
    title: "Cycle Cuba!",
    destination: "Cuba",
    country: "Cuba",
    tripType: "Cycling",
    duration: "15 Days",
    durationDays: 15,
    groupSize: "8-16",
    physicalRating: 3,
    price: 2895,
    imageUrl: "/images/explore/trip-cuba.jpg",
    galleryImages: ["/images/explore/trip-cuba.jpg"],
    tripCode: "CCC",
    overview:
      "Cycle through the colourful streets and lush countryside of Cuba on this 15-day adventure. Ride past tobacco fields, through colonial towns and along the stunning Vinales valley, experiencing Cuba's unique culture, music and cuisine along the way.",
    highlights: [
      "Cycle through the stunning Vinales valley",
      "Explore Old Havana's colonial architecture",
      "Ride along quiet country roads past tobacco plantations",
      "Visit the revolutionary city of Trinidad",
      "Enjoy live salsa music and Cuban cocktails",
    ],
    included: ["14 nights accommodation", "All breakfasts, 8 lunches, 7 dinners", "Quality hybrid bicycle", "Support vehicle", "Expert cycling guide"],
    notIncluded: ["International flights", "Travel insurance", "Cuban tourist card", "Tips"],
    itinerary: [
      { day: 1, title: "Arrive Havana", description: "Arrive in Havana and transfer to your hotel in the old town.", meals: "Dinner", accommodation: "Casa Particular" },
      { day: 2, title: "Havana exploration", description: "Walking tour of Old Havana. Bike fitting in the afternoon.", meals: "Breakfast", accommodation: "Casa Particular" },
      { day: 3, title: "Havana to Las Terrazas", description: "First day cycling. Ride 65km west through the countryside.", meals: "Breakfast, Lunch, Dinner", accommodation: "Hotel" },
      { day: 4, title: "Las Terrazas to Vinales", description: "Cycle 55km to the beautiful Vinales valley.", meals: "Breakfast, Lunch", accommodation: "Casa Particular" },
      { day: 5, title: "Vinales Valley", description: "Cycle through the valley visiting tobacco farms and caves.", meals: "Breakfast, Lunch, Dinner", accommodation: "Casa Particular" },
      { day: 6, title: "Vinales to Soroa", description: "Cycle 70km through lush countryside.", meals: "Breakfast, Lunch, Dinner", accommodation: "Hotel" },
      { day: 7, title: "Soroa to Bay of Pigs", description: "Long ride 95km south to the Bay of Pigs.", meals: "Breakfast, Lunch, Dinner", accommodation: "Casa Particular" },
      { day: 8, title: "Bay of Pigs", description: "Rest day with snorkelling in cenotes.", meals: "Breakfast", accommodation: "Casa Particular" },
      { day: 9, title: "Bay of Pigs to Trinidad", description: "Cycle 80km along the coast to colonial Trinidad.", meals: "Breakfast, Lunch", accommodation: "Casa Particular" },
      { day: 10, title: "Trinidad", description: "Free day to explore this UNESCO World Heritage town.", meals: "Breakfast, Dinner", accommodation: "Casa Particular" },
      { day: 11, title: "Trinidad to Sancti Spiritus", description: "Cycle 70km inland.", meals: "Breakfast, Lunch, Dinner", accommodation: "Hotel" },
      { day: 12, title: "Sancti Spiritus to Santa Clara", description: "Cycle 90km to Santa Clara, city of Che Guevara.", meals: "Breakfast, Lunch", accommodation: "Hotel" },
      { day: 13, title: "Santa Clara to Varadero", description: "Final cycling day, 80km to the coast.", meals: "Breakfast, Lunch, Dinner", accommodation: "Hotel" },
      { day: 14, title: "Varadero beach day", description: "Free day at the beach. Farewell dinner.", meals: "Breakfast, Dinner", accommodation: "Hotel" },
      { day: 15, title: "Departure", description: "Transfer to Havana airport.", meals: "Breakfast", accommodation: "" },
    ],
    departures: [
      { id: "CCC-2026-10-17", startDate: "2026-10-17", endDate: "2026-10-31", price: 2895, status: "Available" },
      { id: "CCC-2026-11-14", startDate: "2026-11-14", endDate: "2026-11-28", price: 2895, status: "Guaranteed" },
      { id: "CCC-2027-01-09", startDate: "2027-01-09", endDate: "2027-01-23", price: 2995, status: "Available" },
      { id: "CCC-2027-02-06", startDate: "2027-02-06", endDate: "2027-02-20", price: 2995, status: "Limited" },
      { id: "CCC-2027-03-06", startDate: "2027-03-06", endDate: "2027-03-20", price: 2895, status: "Available" },
    ],
    relatedSlugs: ["amalfi-coast-walking", "japan-in-depth", "south-africa-eswatini"],
  },
  "south-africa-eswatini": {
    slug: "south-africa-eswatini",
    title: "South Africa & Eswatini",
    destination: "South Africa",
    country: "South Africa",
    tripType: "Wildlife",
    duration: "10 Days",
    durationDays: 10,
    groupSize: "6-16",
    physicalRating: 1,
    price: 1395,
    originalPrice: 1695,
    imageUrl: "/images/explore/trip-south-africa.jpg",
    galleryImages: ["/images/explore/trip-south-africa.jpg"],
    tripCode: "ZK",
    overview:
      "Experience the incredible wildlife, dramatic landscapes and vibrant cultures of South Africa and the Kingdom of Eswatini on this 10-day small group tour. From the Big Five in Kruger National Park to the Panorama Route, this trip is an unforgettable African adventure.",
    highlights: [
      "Game drives in Kruger National Park searching for the Big Five",
      "Drive the spectacular Panorama Route",
      "Visit a traditional Swazi village in Eswatini",
      "Spot hippos and crocodiles on a river cruise",
      "Experience a Zulu cultural village",
    ],
    included: ["9 nights accommodation", "All breakfasts, 4 lunches, 5 dinners", "Expert tour leader", "Game drives in open vehicles", "All park entrance fees"],
    notIncluded: ["International flights", "Travel insurance", "Meals not listed", "Tips", "Visa (if required)"],
    itinerary: [
      { day: 1, title: "Arrive Johannesburg", description: "Arrive and transfer to hotel. Welcome meeting.", meals: "Dinner", accommodation: "Hotel" },
      { day: 2, title: "Panorama Route", description: "Drive the stunning Panorama Route including Blyde River Canyon.", meals: "Breakfast, Lunch", accommodation: "Lodge" },
      { day: 3, title: "Kruger National Park", description: "Full day game drive in Kruger searching for Big Five.", meals: "Breakfast, Lunch, Dinner", accommodation: "Rest Camp" },
      { day: 4, title: "Kruger National Park", description: "Sunrise and sunset game drives with midday rest.", meals: "Breakfast, Lunch, Dinner", accommodation: "Rest Camp" },
      { day: 5, title: "Kruger to Eswatini", description: "Morning game drive then cross into the Kingdom of Eswatini.", meals: "Breakfast", accommodation: "Mountain Lodge" },
      { day: 6, title: "Eswatini", description: "Visit traditional village and craft markets.", meals: "Breakfast, Dinner", accommodation: "Mountain Lodge" },
      { day: 7, title: "Eswatini to Hluhluwe", description: "Travel to Hluhluwe-iMfolozi Park.", meals: "Breakfast", accommodation: "Safari Lodge" },
      { day: 8, title: "Hluhluwe Game Reserve", description: "Game drives in the oldest proclaimed nature reserve in Africa.", meals: "Breakfast, Lunch, Dinner", accommodation: "Safari Lodge" },
      { day: 9, title: "St Lucia", description: "River cruise for hippos and crocodiles. Beach time.", meals: "Breakfast, Dinner", accommodation: "Lodge" },
      { day: 10, title: "Departure", description: "Transfer to Durban airport.", meals: "Breakfast", accommodation: "" },
    ],
    departures: [
      { id: "ZK-2026-05-09", startDate: "2026-05-09", endDate: "2026-05-18", price: 1395, originalPrice: 1695, status: "Guaranteed" },
      { id: "ZK-2026-06-06", startDate: "2026-06-06", endDate: "2026-06-15", price: 1395, originalPrice: 1695, status: "Available" },
      { id: "ZK-2026-07-04", startDate: "2026-07-04", endDate: "2026-07-13", price: 1495, status: "Available" },
      { id: "ZK-2026-08-08", startDate: "2026-08-08", endDate: "2026-08-17", price: 1595, status: "Limited" },
      { id: "ZK-2026-09-05", startDate: "2026-09-05", endDate: "2026-09-14", price: 1495, status: "Available" },
      { id: "ZK-2026-10-03", startDate: "2026-10-03", endDate: "2026-10-12", price: 1395, originalPrice: 1695, status: "Available" },
    ],
    relatedSlugs: ["japan-in-depth", "adventures-in-patagonia", "amalfi-coast-walking"],
  },
}

export function getTour(slug: string): TourDetail | undefined {
  return TOURS[slug]
}

export function getAllTourSlugs(): string[] {
  return Object.keys(TOURS)
}
