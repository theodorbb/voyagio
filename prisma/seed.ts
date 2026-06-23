import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import * as bcrypt from "bcryptjs";

function buildPrisma(): PrismaClient {
  if (process.env.TURSO_DATABASE_URL) {
    const adapter = new PrismaLibSQL({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }
  return new PrismaClient();
}

const prisma = buildPrisma();

function json(obj: unknown): string {
  return JSON.stringify(obj);
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const USERS = [
  {
    email: "admin@voyagio.com",
    name: "Voyagio Admin",
    role: "ADMIN",
    bio: "Platform administrator for Voyagio.",
    preferences: null,
  },
  {
    email: "operator@voyagio.com",
    name: "Carlos Mendes",
    role: "OPERATOR",
    bio: "Running adventure and cultural tours across Lisbon and Porto since 2015.",
    preferences: null,
  },
  {
    email: "maria@tours.com",
    name: "Maria Konstantinou",
    role: "OPERATOR",
    bio: "Santorini native offering sunset cruises and wine experiences.",
    preferences: null,
  },
  {
    email: "jordi@bcntours.com",
    name: "Jordi Puig",
    role: "OPERATOR",
    bio: "Barcelona's top-rated food and cultural tour operator.",
    preferences: null,
  },
  {
    email: "tourist@voyagio.com",
    name: "Sarah Mitchell",
    role: "TOURIST",
    bio: "Solo traveler exploring Europe one city at a time.",
    preferences: json({
      interests: ["Adventure", "Cultural", "Photography"],
      budgetRange: "medium",
      travelStyle: "solo",
    }),
  },
  {
    email: "james@email.com",
    name: "James Chen",
    role: "TOURIST",
    bio: "Couple traveler. Love food, wine, and sunsets.",
    preferences: json({
      interests: ["Food & Wine", "Nature", "Wellness"],
      budgetRange: "high",
      travelStyle: "couple",
    }),
  },
  {
    email: "emily@email.com",
    name: "Emily Andersen",
    role: "TOURIST",
    bio: "Family travel enthusiast from Copenhagen.",
    preferences: json({
      interests: ["Nature", "Cultural", "Adventure"],
      budgetRange: "medium",
      travelStyle: "family",
    }),
  },
  {
    email: "alex@email.com",
    name: "Alex Rivera",
    role: "TOURIST",
    bio: "Budget backpacker, always looking for hidden gems.",
    preferences: json({
      interests: ["Adventure", "Food & Wine", "Nightlife"],
      budgetRange: "low",
      travelStyle: "solo",
    }),
  },

  {
    email: "yuki@tokyotours.com",
    name: "Yuki Tanaka",
    role: "OPERATOR",
    bio: "Tokyo native specializing in cultural immersion and street food tours since 2012.",
    preferences: null,
  },
  {
    email: "hassan@marrakech.com",
    name: "Hassan El Fassi",
    role: "OPERATOR",
    bio: "Third-generation riad owner offering authentic Marrakech experiences.",
    preferences: null,
  },
  {
    email: "giulia@amalfi.com",
    name: "Giulia Romano",
    role: "OPERATOR",
    bio: "Amalfi Coast local running boat tours and culinary experiences along the coast.",
    preferences: null,
  },

  {
    email: "sophie@email.com",
    name: "Sophie Laurent",
    role: "TOURIST",
    bio: "French expat with a passion for photography and cultural travel.",
    preferences: json({
      interests: ["Photography", "Cultural", "Food & Wine"],
      budgetRange: "high",
      travelStyle: "solo",
    }),
  },
  {
    email: "mike@email.com",
    name: "Mike Thompson",
    role: "TOURIST",
    bio: "Adventure seeker from Australia, chasing waves and mountains.",
    preferences: json({
      interests: ["Adventure", "Nature", "Water Sports"],
      budgetRange: "medium",
      travelStyle: "group",
    }),
  },

  {
    email: "lars@copenhagen.com",
    name: "Lars Nielsen",
    role: "OPERATOR",
    bio: "Copenhagen cycling and food tour expert with 10 years of experience.",
    preferences: null,
  },
  {
    email: "priya@mumbai.com",
    name: "Priya Sharma",
    role: "OPERATOR",
    bio: "Mumbai street food and cultural heritage specialist.",
    preferences: null,
  },
  {
    email: "andreas@vienna.com",
    name: "Andreas Weber",
    role: "OPERATOR",
    bio: "Classical music and imperial history tours in Vienna since 2010.",
    preferences: null,
  },
  {
    email: "chen@shanghai.com",
    name: "Chen Wei",
    role: "OPERATOR",
    bio: "Shanghai local offering modern and traditional city experiences.",
    preferences: null,
  },
  {
    email: "fatima@istanbul.com",
    name: "Fatima Yilmaz",
    role: "OPERATOR",
    bio: "Istanbul resident running Bosphorus cruises and bazaar tours.",
    preferences: null,
  },
  {
    email: "diego@buenosaires.com",
    name: "Diego Fernandez",
    role: "OPERATOR",
    bio: "Tango maestro and Buenos Aires nightlife guide.",
    preferences: null,
  },
  {
    email: "nina@dubrovnik.com",
    name: "Nina Kovac",
    role: "OPERATOR",
    bio: "Dubrovnik and Dalmatian coast adventure specialist.",
    preferences: null,
  },
  {
    email: "kwame@capetown.com",
    name: "Kwame Asante",
    role: "OPERATOR",
    bio: "Cape Town adventure and wildlife tour operator.",
    preferences: null,
  },
  {
    email: "olivia@sydney.com",
    name: "Olivia Brown",
    role: "OPERATOR",
    bio: "Sydney harbor and coastal experiences guide.",
    preferences: null,
  },
  {
    email: "marco@rome.com",
    name: "Marco Bianchi",
    role: "OPERATOR",
    bio: "Roman history expert offering exclusive access to ancient sites.",
    preferences: null,
  },
  {
    email: "anna@prague.com",
    name: "Anna Novakova",
    role: "OPERATOR",
    bio: "Prague beer and architecture tour specialist.",
    preferences: null,
  },
  {
    email: "ravi@jaipur.com",
    name: "Ravi Patel",
    role: "OPERATOR",
    bio: "Rajasthan heritage and desert safari expert.",
    preferences: null,
  },
];

const DESTINATIONS = [
  {
    name: "Lisbon",
    slug: "lisbon",
    country: "Portugal",
    description:
      "Sun-drenched capital where cobblestone streets wind through seven hills, fado music fills tiled alleyways, and golden light reflects off the Tagus River. Lisbon blends centuries of history with a booming creative scene, world-class gastronomy, and coastal adventures just minutes from the city center.",
    coverImage:
      "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&q=80",
    latitude: 38.7223,
    longitude: -9.1393,
    highlights: json(["Tram 28", "Pastéis de Belém", "Alfama", "Sunset Views", "Seafood"]),
    featured: true,
  },
  {
    name: "Santorini",
    slug: "santorini",
    country: "Greece",
    description:
      "A volcanic jewel in the Aegean Sea, famous for white-washed villages perched on dramatic cliffs, iconic blue-domed churches, and sunsets that stop the world. Santorini offers ancient ruins, unique black-sand beaches, and wine from vineyards grown in volcanic soil.",
    coverImage:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    latitude: 36.3932,
    longitude: 25.4615,
    highlights: json(["Oia Sunset", "Caldera Views", "Wine Tasting", "Black Beach", "Ancient Akrotiri"]),
    featured: true,
  },
  {
    name: "Barcelona",
    slug: "barcelona",
    country: "Spain",
    description:
      "A Mediterranean masterpiece where Gaudí's architectural fantasies meet golden beaches, world-class cuisine, and an electric nightlife. From the Gothic Quarter's medieval lanes to the buzzing La Rambla, Barcelona is a feast for every sense.",
    coverImage:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    latitude: 41.3874,
    longitude: 2.1686,
    highlights: json(["Sagrada Família", "Park Güell", "Gothic Quarter", "Tapas", "Beaches"]),
    featured: true,
  },
  {
    name: "Bali",
    slug: "bali",
    country: "Indonesia",
    description:
      "The Island of the Gods enchants with lush rice terraces, ancient temples, tropical jungles, and some of the world's best surf breaks. Bali balances spiritual traditions with modern wellness culture, vibrant nightlife, and endless natural beauty.",
    coverImage:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    latitude: -8.3405,
    longitude: 115.092,
    highlights: json(["Rice Terraces", "Temples", "Surfing", "Yoga Retreats", "Monkey Forest"]),
    featured: true,
  },
  {
    name: "Porto",
    slug: "porto",
    country: "Portugal",
    description:
      "Portugal's second city stuns with its dramatic riverside setting, centuries-old port wine cellars, ornate azulejo-tiled buildings, and a raw, authentic charm that increasingly draws discerning travelers beyond Lisbon.",
    coverImage:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
    latitude: 41.1579,
    longitude: -8.6291,
    highlights: json(["Port Wine Cellars", "Dom Luís Bridge", "Ribeira", "Livraria Lello", "Francesinha"]),
    featured: true,
  },
  {
    name: "Tokyo",
    slug: "tokyo",
    country: "Japan",
    description:
      "A dazzling metropolis where ancient temples stand beneath neon-lit skyscrapers, Michelin-starred ramen shops share streets with centuries-old shrines, and cutting-edge technology meets timeless tradition. Tokyo is a sensory overload in the best possible way.",
    coverImage:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    latitude: 35.6762,
    longitude: 139.6503,
    highlights: json(["Shibuya Crossing", "Tsukiji Market", "Senso-ji Temple", "Cherry Blossoms", "Sushi"]),
    featured: true,
  },
  {
    name: "Marrakech",
    slug: "marrakech",
    country: "Morocco",
    description:
      "A city of sensory wonders where the scent of spices fills ancient souks, the call to prayer echoes over terracotta rooftops, and intricate mosaics adorn every surface. Marrakech is a gateway to the Sahara, Atlas Mountains, and centuries of Berber culture.",
    coverImage:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80",
    latitude: 31.6295,
    longitude: -7.9811,
    highlights: json(["Jemaa el-Fnaa", "Majorelle Garden", "Medina Souks", "Atlas Mountains", "Riads"]),
    featured: true,
  },
  {
    name: "Amalfi Coast",
    slug: "amalfi-coast",
    country: "Italy",
    description:
      "A UNESCO World Heritage coastline of dramatic cliffs, pastel-colored villages cascading down to turquoise waters, fragrant lemon groves, and some of the most beautiful driving roads on Earth. The Amalfi Coast is la dolce vita at its finest.",
    coverImage:
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=80",
    latitude: 40.6333,
    longitude: 14.6029,
    highlights: json(["Positano Views", "Limoncello", "Path of the Gods", "Ravello Gardens", "Boat Tours"]),
    featured: true,
  },

  {
    name: "Copenhagen",
    slug: "copenhagen",
    country: "Denmark",
    description:
      "Scandinavian capital of design, cycling culture, and new Nordic cuisine. Copenhagen charms with colorful Nyhavn waterfront, royal palaces, world-class restaurants, and a relaxed hygge lifestyle that makes every visitor feel at home.",
    coverImage:
      "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&q=80",
    latitude: 55.6761,
    longitude: 12.5683,
    highlights: json(["Nyhavn", "Tivoli Gardens", "Cycling Culture", "New Nordic Food", "Design District"]),
    featured: true,
  },
  {
    name: "Mumbai",
    slug: "mumbai",
    country: "India",
    description:
      "India's city of dreams pulses with energy from colonial-era architecture to Bollywood studios, street food stalls to luxury hotels. Mumbai offers an intense, colorful immersion into the beating heart of the subcontinent.",
    coverImage:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
    latitude: 19.076,
    longitude: 72.8777,
    highlights: json(["Gateway of India", "Street Food", "Bollywood", "Dhobi Ghat", "Marine Drive"]),
    featured: false,
  },
  {
    name: "Vienna",
    slug: "vienna",
    country: "Austria",
    description:
      "Imperial capital of waltzes, coffee houses, and baroque splendor. Vienna seamlessly melds its Habsburg heritage with contemporary art, outstanding wine taverns, and a music scene that spans from Mozart to electronica.",
    coverImage:
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80",
    latitude: 48.2082,
    longitude: 16.3738,
    highlights: json(["Schonbrunn Palace", "Coffee Houses", "Opera", "Belvedere", "Wine Taverns"]),
    featured: true,
  },
  {
    name: "Shanghai",
    slug: "shanghai",
    country: "China",
    description:
      "Where ancient temples meet futuristic skyscrapers, Shanghai is China's most cosmopolitan city. The Bund's colonial grandeur faces Pudong's soaring towers while hidden lane houses, dumpling shops, and traditional gardens reveal layers of history.",
    coverImage:
      "https://images.unsplash.com/photo-1474181628567-a9d2071bcde2?w=800&q=80",
    latitude: 31.2304,
    longitude: 121.4737,
    highlights: json(["The Bund", "Yu Garden", "Pudong Skyline", "French Concession", "Street Dumplings"]),
    featured: false,
  },
  {
    name: "Istanbul",
    slug: "istanbul",
    country: "Turkey",
    description:
      "Straddling two continents, Istanbul is a city of minarets and bazaars, palaces and modern art galleries. The layers of Roman, Byzantine, and Ottoman civilizations create an unparalleled tapestry of culture, cuisine, and architecture.",
    coverImage:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
    latitude: 41.0082,
    longitude: 28.9784,
    highlights: json(["Hagia Sophia", "Grand Bazaar", "Bosphorus", "Blue Mosque", "Turkish Cuisine"]),
    featured: true,
  },
  {
    name: "Buenos Aires",
    slug: "buenos-aires",
    country: "Argentina",
    description:
      "The Paris of South America dances to its own rhythm. Buenos Aires seduces with tango in cobblestone barrios, world-class steak houses, passionate football culture, vibrant street art, and a bohemian nightlife that starts at midnight.",
    coverImage:
      "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80",
    latitude: -34.6037,
    longitude: -58.3816,
    highlights: json(["Tango Shows", "La Boca", "Steak Houses", "Recoleta", "San Telmo Market"]),
    featured: false,
  },
  {
    name: "Dubrovnik",
    slug: "dubrovnik",
    country: "Croatia",
    description:
      "The Pearl of the Adriatic enchants with its perfectly preserved medieval walls, terracotta rooftops, and crystalline waters. Dubrovnik combines European sophistication with Mediterranean warmth and dramatic coastal scenery.",
    coverImage:
      "https://images.unsplash.com/photo-1555990793-da11153b2473?w=800&q=80",
    latitude: 42.6507,
    longitude: 18.0944,
    highlights: json(["City Walls Walk", "Old Town", "Lokrum Island", "Cable Car", "Adriatic Beaches"]),
    featured: true,
  },
  {
    name: "Cape Town",
    slug: "cape-town",
    country: "South Africa",
    description:
      "Where Table Mountain meets the Atlantic Ocean, Cape Town dazzles with dramatic landscapes, world-class wine regions, diverse wildlife, vibrant neighborhoods, and a cultural richness born from centuries of convergent histories.",
    coverImage:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
    latitude: -33.9249,
    longitude: 18.4241,
    highlights: json(["Table Mountain", "Cape Winelands", "Penguins", "V&A Waterfront", "Robben Island"]),
    featured: true,
  },
  {
    name: "Sydney",
    slug: "sydney",
    country: "Australia",
    description:
      "Harbor city blessed with iconic landmarks, golden beaches, and a laid-back outdoor culture. Sydney wraps its Opera House and bridge in a lifestyle of surf, seafood, bushwalks, and one of the most beautiful natural harbors on Earth.",
    coverImage:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
    latitude: -33.8688,
    longitude: 151.2093,
    highlights: json(["Opera House", "Bondi Beach", "Harbour Bridge", "Blue Mountains", "Coastal Walks"]),
    featured: true,
  },
  {
    name: "Rome",
    slug: "rome",
    country: "Italy",
    description:
      "The Eternal City layers 2,800 years of history into a living, breathing metropolis. From the Colosseum to hidden trattorias, baroque fountains to vibrant piazzas, Rome offers an endless feast of art, architecture, and la dolce vita.",
    coverImage:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    latitude: 41.9028,
    longitude: 12.4964,
    highlights: json(["Colosseum", "Vatican", "Trevi Fountain", "Trastevere", "Roman Forum"]),
    featured: true,
  },
  {
    name: "Prague",
    slug: "prague",
    country: "Czech Republic",
    description:
      "City of a hundred spires where Gothic, baroque, and art nouveau architecture creates a fairytale skyline. Prague charms with its castle complex, ancient bridges, legendary beer culture, and surprisingly affordable luxury.",
    coverImage:
      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80",
    latitude: 50.0755,
    longitude: 14.4378,
    highlights: json(["Charles Bridge", "Prague Castle", "Old Town Square", "Beer Culture", "Art Nouveau"]),
    featured: false,
  },
  {
    name: "Jaipur",
    slug: "jaipur",
    country: "India",
    description:
      "The Pink City dazzles with magnificent forts, ornate palaces, colorful bazaars, and a royal heritage that infuses every street. Jaipur is the gateway to Rajasthan's desert culture, vibrant textiles, and centuries of Mughal and Rajput architecture.",
    coverImage:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
    latitude: 26.9124,
    longitude: 75.7873,
    highlights: json(["Amber Fort", "Hawa Mahal", "City Palace", "Bazaars", "Elephant Rides"]),
    featured: false,
  },
  {
    name: "New York City",
    slug: "new-york-city",
    country: "United States",
    description:
      "The city that never sleeps packs more culture, cuisine, and creativity per square mile than anywhere on Earth. From Broadway to Brooklyn, Central Park to hidden speakeasies, NYC is an endless adventure for every type of traveler.",
    coverImage:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    latitude: 40.7128,
    longitude: -74.006,
    highlights: json(["Times Square", "Central Park", "Brooklyn Bridge", "Museums", "Broadway"]),
    featured: true,
  },
  {
    name: "Kyoto",
    slug: "kyoto",
    country: "Japan",
    description:
      "Japan's cultural heart preserves over 2,000 temples, traditional geisha districts, serene bamboo groves, and a centuries-old tea ceremony tradition. Kyoto offers a contemplative counterpoint to Tokyo's neon energy.",
    coverImage:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    latitude: 35.0116,
    longitude: 135.7681,
    highlights: json(["Fushimi Inari", "Bamboo Grove", "Golden Pavilion", "Geisha District", "Tea Ceremonies"]),
    featured: true,
  },
  {
    name: "Dubai",
    slug: "dubai",
    country: "United Arab Emirates",
    description:
      "A city of superlatives rising from the desert with the world's tallest building, artificial islands, and luxury beyond imagination. Dubai also hides historic souks, desert safaris, and a multicultural food scene rivaling any global capital.",
    coverImage:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    latitude: 25.2048,
    longitude: 55.2708,
    highlights: json(["Burj Khalifa", "Desert Safari", "Gold Souk", "Palm Jumeirah", "Dubai Marina"]),
    featured: false,
  },
  {
    name: "Amsterdam",
    slug: "amsterdam",
    country: "Netherlands",
    description:
      "Canal-laced capital of creative freedom, world-class museums, and cycling culture. Amsterdam pairs its Golden Age heritage with cutting-edge design, diverse cuisine, and an openness that makes everyone feel welcome.",
    coverImage:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80",
    latitude: 52.3676,
    longitude: 4.9041,
    highlights: json(["Canal Cruises", "Van Gogh Museum", "Anne Frank House", "Vondelpark", "Cycling"]),
    featured: true,
  },
  {
    name: "Havana",
    slug: "havana",
    country: "Cuba",
    description:
      "A city frozen in time where 1950s American cars cruise past crumbling colonial facades, salsa music spills from open windows, and the spirit of revolution lives in every mojito-soaked evening on the Malecon.",
    coverImage:
      "https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=800&q=80",
    latitude: 23.1136,
    longitude: -82.3666,
    highlights: json(["Classic Cars", "Malecon", "Old Havana", "Salsa Dancing", "Cigar Factories"]),
    featured: false,
  },
  {
    name: "Reykjavik",
    slug: "reykjavik",
    country: "Iceland",
    description:
      "Gateway to fire and ice, Reykjavik is the world's northernmost capital. Beyond its colorful streets and creative arts scene lie geysers, glaciers, volcanic landscapes, northern lights, and geothermal hot springs.",
    coverImage:
      "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80",
    latitude: 64.1466,
    longitude: -21.9426,
    highlights: json(["Northern Lights", "Blue Lagoon", "Golden Circle", "Geysers", "Whale Watching"]),
    featured: true,
  },
  {
    name: "Cusco",
    slug: "cusco",
    country: "Peru",
    description:
      "Ancient Incan capital perched high in the Andes, Cusco is the gateway to Machu Picchu and the Sacred Valley. Colonial churches built atop Incan walls, vibrant textiles, and traditional markets make it a living museum of pre-Columbian civilization.",
    coverImage:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80",
    latitude: -13.532,
    longitude: -71.9675,
    highlights: json(["Machu Picchu", "Sacred Valley", "Inca Ruins", "Textile Markets", "Andean Cuisine"]),
    featured: false,
  },
  {
    name: "Bangkok",
    slug: "bangkok",
    country: "Thailand",
    description:
      "Thailand's frenetic capital assaults the senses with golden temples, floating markets, legendary street food, rooftop bars, and a nightlife that rivals any city on Earth. Bangkok is organized chaos at its most exhilarating.",
    coverImage:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
    latitude: 13.7563,
    longitude: 100.5018,
    highlights: json(["Grand Palace", "Street Food", "Floating Markets", "Temples", "Rooftop Bars"]),
    featured: true,
  },
  {
    name: "Edinburgh",
    slug: "edinburgh",
    country: "United Kingdom",
    description:
      "Scotland's dramatic capital splits between a medieval Old Town and elegant Georgian New Town. Edinburgh captivates with its castle, literary heritage, whisky bars, festivals, and wild highland landscapes just beyond the city limits.",
    coverImage:
      "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&q=80",
    latitude: 55.9533,
    longitude: -3.1883,
    highlights: json(["Edinburgh Castle", "Royal Mile", "Arthur's Seat", "Whisky Tasting", "Festivals"]),
    featured: false,
  },
  {
    name: "Medellin",
    slug: "medellin",
    country: "Colombia",
    description:
      "The City of Eternal Spring has transformed from troubled past to innovative future. Medellin enchants with perfect weather, vibrant street art, cable car rides over green hillsides, and a nightlife and coffee culture second to none.",
    coverImage:
      "https://images.unsplash.com/photo-1599843867775-c5a5bbee97c1?w=800&q=80",
    latitude: 6.2442,
    longitude: -75.5812,
    highlights: json(["Comuna 13", "Cable Cars", "Coffee Tours", "Nightlife", "Botero Plaza"]),
    featured: false,
  },
];

interface ActivitySeed {
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  difficulty?: string;
  maxGroupSize: number;
  images: string[];
  latitude: number;
  longitude: number;
  included: string[];
  highlights: string[];
  featured: boolean;
  dest: string;
  op: number;
}

const ACTIVITIES: ActivitySeed[] = [

  {
    title: "Sunset Kayak Tour on the Tagus",
    description:
      "Paddle along Lisbon's golden waterfront as the sun dips below the horizon. Glide past Belém Tower, under the 25 de Abril Bridge, and enjoy the city skyline painted in amber light. Perfect for couples and adventurers alike.",
    category: "Adventure",
    price: 45,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
      "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=600&q=80",
    ],
    latitude: 38.6916,
    longitude: -9.216,
    included: ["Kayak & equipment", "Certified guide", "Waterproof bag", "Photos"],
    highlights: ["Belém Tower views", "Sunset on the river", "Small groups"],
    featured: true,
    dest: "lisbon",
    op: 1,
  },
  {
    title: "Alfama Historic Walking Tour",
    description:
      "Wander the narrow lanes of Lisbon's oldest neighbourhood with a local historian. Discover Moorish heritage, hidden viewpoints, fado houses, and street art in the heart of Alfama — the soul of the city.",
    category: "Cultural",
    price: 25,
    duration: 150,
    difficulty: "Easy",
    maxGroupSize: 16,
    images: [
      "https://images.unsplash.com/photo-1569959220744-ff553533f492?w=600&q=80",
      "https://images.unsplash.com/photo-1513735492246-483525079686?w=600&q=80",
    ],
    latitude: 38.7139,
    longitude: -9.1305,
    included: ["Licensed guide", "Map booklet", "Local pastry sample"],
    highlights: ["Miradouro viewpoints", "Fado history", "Moorish quarter"],
    featured: true,
    dest: "lisbon",
    op: 1,
  },
  {
    title: "Lisbon Street Food & Wine Tasting",
    description:
      "Taste your way through Lisbon's buzzing food scene. From crispy pastéis de nata to fresh seafood and aged Portuguese wines, this tour covers Timeout Market, local tascas, and hidden gems only locals know.",
    category: "Food & Wine",
    price: 55,
    duration: 210,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    ],
    latitude: 38.7072,
    longitude: -9.1457,
    included: ["6 food stops", "3 wine tastings", "Local guide"],
    highlights: ["Timeout Market", "Pastéis de Nata", "Hidden tascas"],
    featured: false,
    dest: "lisbon",
    op: 1,
  },
  {
    title: "Coastal Photography Workshop",
    description:
      "Learn landscape photography along Lisbon's stunning Atlantic coastline. From Cascais cliffs to Cabo da Roca — Europe's westernmost point — capture dramatic seascapes with professional guidance.",
    category: "Photography",
    price: 65,
    duration: 240,
    difficulty: "Easy",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80",
    ],
    latitude: 38.6927,
    longitude: -9.4215,
    included: ["Pro photographer guide", "Transport", "Editing tips PDF"],
    highlights: ["Cabo da Roca", "Golden hour shots", "Cascais cliffs"],
    featured: false,
    dest: "lisbon",
    op: 1,
  },
  {
    title: "Sintra Palace & Gardens Day Trip",
    description:
      "Escape to the fairytale town of Sintra with its flamboyant palaces, misty gardens, and mystical Quinta da Regaleira. Includes transport from Lisbon and skip-the-line entry to Pena Palace.",
    category: "Cultural",
    price: 75,
    duration: 480,
    difficulty: "Moderate",
    maxGroupSize: 14,
    images: [
      "https://images.unsplash.com/photo-1557093793-e196ae071479?w=600&q=80",
      "https://images.unsplash.com/photo-1497491424832-ff303289ce68?w=600&q=80",
    ],
    latitude: 38.7876,
    longitude: -9.3907,
    included: ["Transport from Lisbon", "Skip-the-line tickets", "Guide", "Lunch"],
    highlights: ["Pena Palace", "Quinta da Regaleira", "Moorish Castle views"],
    featured: true,
    dest: "lisbon",
    op: 1,
  },
  {
    title: "Fado Night Experience",
    description:
      "Experience Lisbon's soul music in an intimate fado house in Alfama. Includes a traditional Portuguese dinner, wine, and live performances by acclaimed fadistas in a centuries-old venue.",
    category: "Cultural",
    price: 60,
    duration: 150,
    difficulty: "Easy",
    maxGroupSize: 20,
    images: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80",
    ],
    latitude: 38.711,
    longitude: -9.1296,
    included: ["3-course dinner", "Wine", "Live fado performance"],
    highlights: ["Authentic fado house", "Traditional cuisine", "Intimate setting"],
    featured: false,
    dest: "lisbon",
    op: 1,
  },

  {
    title: "Caldera Sunset Sailing Cruise",
    description:
      "Sail the volcanic caldera on a luxury catamaran as the sun sets over Oia. Swim in hot springs, snorkel crystal-clear waters, and enjoy a BBQ dinner on board with unlimited local wine.",
    category: "Adventure",
    price: 95,
    duration: 300,
    difficulty: "Easy",
    maxGroupSize: 20,
    images: [
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    ],
    latitude: 36.431,
    longitude: 25.3755,
    included: ["Catamaran cruise", "BBQ dinner", "Unlimited wine", "Snorkeling gear"],
    highlights: ["Oia sunset from the sea", "Hot springs", "Caldera views"],
    featured: true,
    dest: "santorini",
    op: 2,
  },
  {
    title: "Volcanic Wine Tasting Experience",
    description:
      "Discover Santorini's unique viticulture. Visit three award-winning wineries, taste Assyrtiko and Vinsanto wines grown in volcanic soil, and learn about the island's 3,500-year winemaking tradition.",
    category: "Food & Wine",
    price: 70,
    duration: 240,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80",
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&q=80",
    ],
    latitude: 36.3748,
    longitude: 25.4634,
    included: ["3 winery visits", "12 wine tastings", "Cheese platter", "Transport"],
    highlights: ["Volcanic terroir", "Assyrtiko wines", "Caldera-view winery"],
    featured: true,
    dest: "santorini",
    op: 2,
  },
  {
    title: "Ancient Akrotiri Guided Tour",
    description:
      "Explore the Pompeii of the Aegean — a Bronze Age city preserved under volcanic ash for 3,600 years. Walk ancient streets with an archaeologist guide and uncover the mysteries of Minoan civilization.",
    category: "Cultural",
    price: 40,
    duration: 120,
    difficulty: "Easy",
    maxGroupSize: 18,
    images: [
      "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=600&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80",
    ],
    latitude: 36.3517,
    longitude: 25.4034,
    included: ["Archaeologist guide", "Entry ticket", "Audio headset"],
    highlights: ["Bronze Age ruins", "Minoan frescoes", "Expert commentary"],
    featured: false,
    dest: "santorini",
    op: 2,
  },
  {
    title: "Volcano Hike & Hot Springs",
    description:
      "Hike across the active volcanic crater of Nea Kameni, feel the earth's heat beneath your feet, then cool off in the therapeutic hot springs of Palea Kameni. A geological adventure unlike any other.",
    category: "Nature",
    price: 50,
    duration: 240,
    difficulty: "Moderate",
    maxGroupSize: 16,
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    ],
    latitude: 36.4029,
    longitude: 25.396,
    included: ["Boat transfer", "Guide", "Entrance fee"],
    highlights: ["Active volcano", "Hot springs swim", "Panoramic views"],
    featured: false,
    dest: "santorini",
    op: 2,
  },
  {
    title: "Santorini Cooking Class",
    description:
      "Cook authentic Greek dishes using fresh local ingredients in a traditional Santorini kitchen with caldera views. Learn to make moussaka, tomato keftedes, and loukoumades, then dine on your creations.",
    category: "Food & Wine",
    price: 85,
    duration: 210,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80",
      "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=600&q=80",
    ],
    latitude: 36.4167,
    longitude: 25.4294,
    included: ["All ingredients", "Recipe booklet", "Wine pairing", "Full meal"],
    highlights: ["Caldera-view kitchen", "Traditional recipes", "Hands-on cooking"],
    featured: false,
    dest: "santorini",
    op: 2,
  },
  {
    title: "Oia Sunset Photography Walk",
    description:
      "Capture the world's most famous sunset from hidden vantage points with a professional photographer. Learn composition, lighting, and editing tips while exploring Oia's iconic blue domes and whitewashed lanes.",
    category: "Photography",
    price: 55,
    duration: 150,
    difficulty: "Easy",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80",
    ],
    latitude: 36.4613,
    longitude: 25.3753,
    included: ["Pro photographer guide", "Tripod available", "Edited highlights"],
    highlights: ["Blue dome spots", "Secret viewpoints", "Golden hour"],
    featured: false,
    dest: "santorini",
    op: 2,
  },

  {
    title: "Gaudí Masterpieces Walking Tour",
    description:
      "Explore Barcelona through the genius of Antoni Gaudí. Visit Sagrada Família (skip-the-line), Casa Batlló, and Park Güell with an expert art historian who reveals the symbolism behind every curve.",
    category: "Cultural",
    price: 65,
    duration: 240,
    difficulty: "Easy",
    maxGroupSize: 15,
    images: [
      "https://images.unsplash.com/photo-1583779457711-ab081da09e6f?w=600&q=80",
      "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=600&q=80",
    ],
    latitude: 41.4036,
    longitude: 2.1744,
    included: ["Art historian guide", "Skip-the-line tickets", "Audio headset"],
    highlights: ["Sagrada Família", "Casa Batlló", "Park Güell"],
    featured: true,
    dest: "barcelona",
    op: 3,
  },
  {
    title: "Barcelona Tapas & Wine Trail",
    description:
      "Eat and drink your way through Barcelona's most authentic tapas bars. From the Born district to hidden gems in Gràcia, taste patatas bravas, jamón ibérico, pintxos, and local Catalan wines.",
    category: "Food & Wine",
    price: 55,
    duration: 210,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=600&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    ],
    latitude: 41.3841,
    longitude: 2.1826,
    included: ["6 tapas stops", "4 wine tastings", "Local foodie guide"],
    highlights: ["Hidden tapas bars", "Jamón ibérico", "Born district"],
    featured: true,
    dest: "barcelona",
    op: 3,
  },
  {
    title: "Gothic Quarter Night Tour",
    description:
      "Discover Barcelona's dark history and hidden legends on a twilight walk through the Gothic Quarter. From Roman ruins to medieval alleys, hear tales of inquisitions, ghosts, and secret societies.",
    category: "Cultural",
    price: 30,
    duration: 120,
    difficulty: "Easy",
    maxGroupSize: 20,
    images: [
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=600&q=80",
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80",
    ],
    latitude: 41.3833,
    longitude: 2.1761,
    included: ["Licensed guide", "Headsets for group"],
    highlights: ["Roman Temple", "Medieval lanes", "Evening atmosphere"],
    featured: false,
    dest: "barcelona",
    op: 3,
  },
  {
    title: "Costa Brava Kayak & Snorkel",
    description:
      "Escape the city for a day of sea kayaking along the crystal Costa Brava. Paddle through hidden coves, snorkel over posidonia meadows, and rest on secluded beaches accessible only by water.",
    category: "Adventure",
    price: 70,
    duration: 360,
    difficulty: "Moderate",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
      "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=600&q=80",
    ],
    latitude: 41.6975,
    longitude: 2.8476,
    included: ["Kayak & gear", "Snorkel set", "Picnic lunch", "Transport"],
    highlights: ["Hidden coves", "Crystal water", "Secluded beaches"],
    featured: false,
    dest: "barcelona",
    op: 3,
  },
  {
    title: "Flamenco & Dinner Experience",
    description:
      "Experience the passion of flamenco in an intimate tablao in the heart of Barcelona. Enjoy a Catalan dinner with wine while world-class dancers and musicians perform just meters away.",
    category: "Cultural",
    price: 75,
    duration: 150,
    difficulty: "Easy",
    maxGroupSize: 30,
    images: [
      "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=600&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    ],
    latitude: 41.381,
    longitude: 2.1735,
    included: ["Dinner", "Wine", "Flamenco show", "Premium seating"],
    highlights: ["Live flamenco", "Traditional dinner", "Intimate venue"],
    featured: false,
    dest: "barcelona",
    op: 3,
  },
  {
    title: "Montserrat Mountain & Monastery",
    description:
      "Journey to the sacred mountain of Montserrat — a dramatic serrated rock formation home to a 1,000-year-old monastery and the Black Madonna. Includes scenic cogwheel train and short mountain hike.",
    category: "Nature",
    price: 60,
    duration: 360,
    difficulty: "Moderate",
    maxGroupSize: 16,
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    ],
    latitude: 41.5933,
    longitude: 1.8382,
    included: ["Transport", "Cogwheel train", "Guide", "Snack"],
    highlights: ["Montserrat Monastery", "Mountain hike", "Panoramic views"],
    featured: false,
    dest: "barcelona",
    op: 3,
  },

  {
    title: "Sacred Temple & Rice Terrace Tour",
    description:
      "Visit Bali's most important temples — Tirta Empul, Tanah Lot, and Uluwatu — interspersed with stops at the iconic Tegallalang rice terraces and traditional craft villages. A full spiritual and cultural immersion.",
    category: "Cultural",
    price: 45,
    duration: 480,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=600&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    ],
    latitude: -8.4312,
    longitude: 115.3126,
    included: ["Transport", "Guide", "Temple sarong", "Lunch"],
    highlights: ["Tegallalang terraces", "Tirta Empul", "Tanah Lot sunset"],
    featured: true,
    dest: "bali",
    op: 1,
  },
  {
    title: "Mount Batur Sunrise Trek",
    description:
      "Start before dawn and summit Mount Batur to witness a breathtaking sunrise above the clouds at 1,717m. Afterwards, soak in natural hot springs and enjoy a local breakfast with volcanic views.",
    category: "Adventure",
    price: 55,
    duration: 420,
    difficulty: "Challenging",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    ],
    latitude: -8.2417,
    longitude: 115.375,
    included: ["Guide", "Transport", "Breakfast", "Hot springs entry", "Flashlight"],
    highlights: ["Sunrise above clouds", "Active volcano", "Hot springs"],
    featured: true,
    dest: "bali",
    op: 1,
  },
  {
    title: "Balinese Cooking Class in Ubud",
    description:
      "Start at a local market selecting fresh ingredients, then learn to cook authentic Balinese dishes in a traditional open-air kitchen surrounded by rice paddies. Cook 7 dishes and feast on your creations.",
    category: "Food & Wine",
    price: 40,
    duration: 240,
    difficulty: "Easy",
    maxGroupSize: 14,
    images: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    ],
    latitude: -8.5069,
    longitude: 115.2624,
    included: ["Market tour", "All ingredients", "Recipe book", "7-dish meal"],
    highlights: ["Rice paddy views", "Market visit", "Hands-on cooking"],
    featured: false,
    dest: "bali",
    op: 1,
  },
  {
    title: "Ubud Waterfall & Jungle Trek",
    description:
      "Trek through lush tropical jungle to discover three hidden waterfalls near Ubud. Swim in natural pools, spot exotic birds, and learn about Bali's tropical ecosystem with a naturalist guide.",
    category: "Nature",
    price: 35,
    duration: 300,
    difficulty: "Moderate",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
      "https://images.unsplash.com/photo-1497491424832-ff303289ce68?w=600&q=80",
    ],
    latitude: -8.415,
    longitude: 115.3862,
    included: ["Guide", "Transport", "Water & snacks"],
    highlights: ["Hidden waterfalls", "Jungle trekking", "Natural swimming pools"],
    featured: false,
    dest: "bali",
    op: 1,
  },
  {
    title: "Bali Surf Lesson Experience",
    description:
      "Catch your first wave on Bali's beginner-friendly beaches. Professional surf instructors guide you through safety, paddling, and standing up — with board and wetsuit included. All levels welcome.",
    category: "Adventure",
    price: 30,
    duration: 150,
    difficulty: "Easy",
    maxGroupSize: 6,
    images: [
      "https://images.unsplash.com/photo-1502680390548-bdbac40ce065?w=600&q=80",
      "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=600&q=80",
    ],
    latitude: -8.7185,
    longitude: 115.169,
    included: ["Board & wetsuit", "Pro instructor", "Photos", "Insurance"],
    highlights: ["Perfect beginner waves", "Small group", "Photo package"],
    featured: false,
    dest: "bali",
    op: 1,
  },
  {
    title: "Sunrise Yoga & Wellness Retreat",
    description:
      "Begin the day with a sunrise yoga session overlooking the Ayung River valley, followed by a Balinese healing ceremony, herbal spa treatment, and organic brunch. A transformative wellness experience.",
    category: "Wellness",
    price: 60,
    duration: 240,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
      "https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80",
    ],
    latitude: -8.49,
    longitude: 115.2638,
    included: ["Yoga mat", "Spa treatment", "Organic brunch", "Healing ceremony"],
    highlights: ["River valley views", "Healing ceremony", "Spa treatment"],
    featured: false,
    dest: "bali",
    op: 1,
  },

  {
    title: "Port Wine Cellar Premium Tour",
    description:
      "Cross the iconic Dom Luís Bridge to Vila Nova de Gaia and explore historic port wine cellars. Taste aged tawny, ruby, and vintage ports with a sommelier guide in atmospheric centuries-old caves.",
    category: "Food & Wine",
    price: 50,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 14,
    images: [
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80",
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&q=80",
    ],
    latitude: 41.1377,
    longitude: -8.6125,
    included: ["Sommelier guide", "5 port tastings", "Cheese board", "Cellar access"],
    highlights: ["Historic cellars", "Premium tastings", "River views"],
    featured: true,
    dest: "porto",
    op: 1,
  },
  {
    title: "Douro Valley Wine & Cruise Day",
    description:
      "Journey into the stunning Douro Valley — a UNESCO World Heritage landscape of terraced vineyards. Visit two quintas, taste regional wines, enjoy a traditional lunch, and cruise back down the river.",
    category: "Food & Wine",
    price: 90,
    duration: 540,
    difficulty: "Easy",
    maxGroupSize: 16,
    images: [
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80",
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80",
    ],
    latitude: 41.1579,
    longitude: -8.6291,
    included: ["Transport", "2 winery visits", "Lunch", "River cruise", "Tastings"],
    highlights: ["UNESCO landscape", "River cruise", "Quinta visits"],
    featured: true,
    dest: "porto",
    op: 1,
  },
  {
    title: "Porto Street Art & Culture Walk",
    description:
      "Discover Porto's vibrant street art scene, from massive murals to tiny hidden pieces. Visit creative hubs, independent galleries, and the famous São Bento station azulejos — art is everywhere.",
    category: "Cultural",
    price: 20,
    duration: 150,
    difficulty: "Easy",
    maxGroupSize: 14,
    images: [
      "https://images.unsplash.com/photo-1569959220744-ff553533f492?w=600&q=80",
      "https://images.unsplash.com/photo-1513735492246-483525079686?w=600&q=80",
    ],
    latitude: 41.1457,
    longitude: -8.6103,
    included: ["Local guide", "Gallery access", "Map"],
    highlights: ["Street murals", "São Bento azulejos", "Creative quarter"],
    featured: false,
    dest: "porto",
    op: 1,
  },
  {
    title: "Azulejo Tile Workshop",
    description:
      "Learn the art of Portuguese azulejo tile painting in a traditional atelier. Design and paint your own tile to take home as a unique souvenir, guided by a master craftsman in Porto's oldest tile workshop.",
    category: "Cultural",
    price: 45,
    duration: 120,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80",
    ],
    latitude: 41.1496,
    longitude: -8.6078,
    included: ["All materials", "Master craftsman guide", "Your finished tile"],
    highlights: ["Hands-on creation", "Take-home tile", "Historic atelier"],
    featured: false,
    dest: "porto",
    op: 1,
  },
  {
    title: "Porto Riverside Bike Tour",
    description:
      "Cycle along the Douro riverfront from Ribeira to Foz do Douro — where the river meets the Atlantic. Pass through seaside parks, old fishing districts, and stunning viewpoints on this relaxed ride.",
    category: "Adventure",
    price: 30,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80",
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80",
    ],
    latitude: 41.1413,
    longitude: -8.6131,
    included: ["Bike & helmet", "Guide", "Water", "Insurance"],
    highlights: ["Ribeira to Foz", "River views", "Atlantic coast"],
    featured: false,
    dest: "porto",
    op: 1,
  },

  {
    title: "Tsukiji & Ginza Street Food Tour",
    description:
      "Explore Tokyo's legendary outer fish market and the glamorous Ginza district with a local foodie guide. Taste fresh sushi, tamagoyaki, wagyu skewers, matcha desserts, and hidden izakaya gems across 10+ stops.",
    category: "Food & Wine",
    price: 70,
    duration: 210,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80",
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
    ],
    latitude: 35.6654,
    longitude: 139.7707,
    included: ["Local guide", "10+ tastings", "Green tea", "Market map"],
    highlights: ["Fresh sushi", "Hidden izakayas", "Wagyu beef"],
    featured: true,
    dest: "tokyo",
    op: 4,
  },
  {
    title: "Ancient Temples & Zen Gardens Walk",
    description:
      "Journey through Tokyo's spiritual side — from the thundering Senso-ji temple in Asakusa to tranquil Zen rock gardens of Rikugien. Learn about Shinto rituals, Buddhist philosophy, and Japanese garden design.",
    category: "Cultural",
    price: 45,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 14,
    images: [
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80",
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&q=80",
    ],
    latitude: 35.7148,
    longitude: 139.7967,
    included: ["Cultural guide", "Temple entry fees", "Incense ceremony"],
    highlights: ["Senso-ji", "Zen garden meditation", "Kimono spotting"],
    featured: true,
    dest: "tokyo",
    op: 4,
  },
  {
    title: "Neon Nights Tokyo Photo Walk",
    description:
      "Capture Tokyo's electric nightlife through your lens — from Shibuya Crossing's controlled chaos to the narrow glowing alleys of Golden Gai and the cyberpunk vibes of Kabukicho. A photographer's dream after dark.",
    category: "Photography",
    price: 55,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&q=80",
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    ],
    latitude: 35.6595,
    longitude: 139.7004,
    included: ["Pro photographer guide", "Tips booklet", "Best spots map"],
    highlights: ["Shibuya Crossing", "Golden Gai", "Neon reflections"],
    featured: false,
    dest: "tokyo",
    op: 4,
  },
  {
    title: "Sushi Making Masterclass",
    description:
      "Learn the art of Edomae sushi from a former Tsukiji chef. Select fish at a local market, master rice preparation, knife techniques, and nigiri shaping — then feast on your own creations with sake pairings.",
    category: "Food & Wine",
    price: 85,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80",
    ],
    latitude: 35.6654,
    longitude: 139.7707,
    included: ["All ingredients", "Chef instruction", "Sake pairing", "Recipe booklet"],
    highlights: ["Hands-on cooking", "Market visit", "Master chef"],
    featured: true,
    dest: "tokyo",
    op: 4,
  },
  {
    title: "Mount Fuji & Hakone Day Trip",
    description:
      "Escape Tokyo for a day to witness Japan's iconic peak. Cruise Lake Ashi, ride the Hakone ropeway for aerial views of Mt. Fuji, visit an open-air art museum, and soak in natural hot springs.",
    category: "Nature",
    price: 120,
    duration: 600,
    difficulty: "Easy",
    maxGroupSize: 16,
    images: [
      "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80",
    ],
    latitude: 35.3606,
    longitude: 138.7274,
    included: ["Transport", "Lake cruise", "Ropeway", "Guide", "Lunch"],
    highlights: ["Mt. Fuji views", "Lake Ashi cruise", "Hot springs"],
    featured: true,
    dest: "tokyo",
    op: 4,
  },
  {
    title: "Akihabara Anime & Gaming Tour",
    description:
      "Dive into Tokyo's otaku culture in the electric town of Akihabara. Visit multi-floor arcades, retro game shops, manga cafés, and maid cafés with a passionate local nerd as your guide.",
    category: "Cultural",
    price: 35,
    duration: 150,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&q=80",
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&q=80",
    ],
    latitude: 35.7022,
    longitude: 139.7741,
    included: ["Local guide", "Arcade tokens", "Gachapon capsule"],
    highlights: ["Retro arcades", "Manga shops", "Otaku culture"],
    featured: false,
    dest: "tokyo",
    op: 4,
  },

  {
    title: "Medina Souks & Hidden Palaces Tour",
    description:
      "Navigate the labyrinthine souks of Marrakech's ancient medina with a local who knows every alley. Visit the secret Bahia Palace, Ben Youssef Madrasa, and discover artisan workshops hidden behind unmarked doors.",
    category: "Cultural",
    price: 30,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&q=80",
      "https://images.unsplash.com/photo-1489749798305-4f3d1c2f2a1b?w=600&q=80",
    ],
    latitude: 31.6295,
    longitude: -7.9811,
    included: ["Local guide", "Palace entry", "Mint tea", "Souk map"],
    highlights: ["Bahia Palace", "Artisan workshops", "Secret courtyards"],
    featured: true,
    dest: "marrakech",
    op: 5,
  },
  {
    title: "Moroccan Cooking Class in a Riad",
    description:
      "Shop for spices in the souk with a Moroccan chef, then cook a traditional 3-course meal in a stunning riad courtyard. Learn to make tagine, couscous, and Moroccan pastilla while sipping fresh mint tea.",
    category: "Food & Wine",
    price: 55,
    duration: 240,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    ],
    latitude: 31.6295,
    longitude: -7.9811,
    included: ["Market tour", "All ingredients", "3-course meal", "Recipe booklet", "Mint tea"],
    highlights: ["Souk shopping", "Riad courtyard cooking", "Tagine mastery"],
    featured: true,
    dest: "marrakech",
    op: 5,
  },
  {
    title: "Atlas Mountains & Berber Village Trek",
    description:
      "Escape the city heat for the dramatic Atlas Mountains. Hike through walnut groves and terraced villages, share tea with Berber families, and summit a peak for panoramic views stretching to the Sahara.",
    category: "Adventure",
    price: 65,
    duration: 480,
    difficulty: "Moderate",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1489749798305-4f3d1c2f2a1b?w=600&q=80",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
    ],
    latitude: 31.0602,
    longitude: -7.8628,
    included: ["Transport", "Mountain guide", "Berber lunch", "Tea ceremony"],
    highlights: ["Summit views", "Berber hospitality", "Mountain trails"],
    featured: true,
    dest: "marrakech",
    op: 5,
  },
  {
    title: "Sahara Desert Sunset Camel Ride",
    description:
      "Ride a camel into the golden dunes of Agafay as the sun paints the desert in shades of fire. End with a traditional Berber dinner under a canopy of stars with live Gnawa music.",
    category: "Adventure",
    price: 75,
    duration: 300,
    difficulty: "Easy",
    maxGroupSize: 14,
    images: [
      "https://images.unsplash.com/photo-1549221987-25a490f65d34?w=600&q=80",
      "https://images.unsplash.com/photo-1517821099606-cef63a9bcda6?w=600&q=80",
    ],
    latitude: 31.4912,
    longitude: -8.1525,
    included: ["Camel ride", "Berber dinner", "Live music", "Transport", "Tea"],
    highlights: ["Desert sunset", "Stargazing", "Gnawa music"],
    featured: true,
    dest: "marrakech",
    op: 5,
  },
  {
    title: "Hammam & Traditional Spa Experience",
    description:
      "Experience the ancient Moroccan bathing ritual in a beautifully restored hammam. Includes black soap scrub, ghassoul clay treatment, argan oil massage, and relaxation in the warm room with mint tea.",
    category: "Wellness",
    price: 50,
    duration: 150,
    difficulty: "Easy",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
    ],
    latitude: 31.6295,
    longitude: -7.9811,
    included: ["Hammam session", "Scrub & clay", "Argan massage", "Mint tea"],
    highlights: ["Ancient ritual", "Argan oil treatment", "Deep relaxation"],
    featured: false,
    dest: "marrakech",
    op: 5,
  },
  {
    title: "Jemaa el-Fnaa Evening Food Tour",
    description:
      "Dive into the electric chaos of Marrakech's famous square at night. Navigate the food stalls like a local — taste snail soup, lamb mechoui, fresh-squeezed orange juice, and Moroccan sweets among the storytellers and musicians.",
    category: "Food & Wine",
    price: 35,
    duration: 150,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    ],
    latitude: 31.6258,
    longitude: -7.9891,
    included: ["Local guide", "8+ tastings", "Orange juice", "History talk"],
    highlights: ["Night market buzz", "Authentic street food", "Local stories"],
    featured: false,
    dest: "marrakech",
    op: 5,
  },

  {
    title: "Private Boat Tour to Capri & Blue Grotto",
    description:
      "Board a traditional gozzo boat from Positano and cruise the Amalfi Coast to the island of Capri. Swim in secret coves, visit the magical Blue Grotto, explore Capri village, and return at golden hour.",
    category: "Adventure",
    price: 150,
    duration: 480,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&q=80",
      "https://images.unsplash.com/photo-1602087594298-706ccc894bfd?w=600&q=80",
    ],
    latitude: 40.6281,
    longitude: 14.485,
    included: ["Private boat", "Captain & guide", "Snorkeling gear", "Prosecco & snacks"],
    highlights: ["Blue Grotto", "Capri island", "Secret swimming coves"],
    featured: true,
    dest: "amalfi-coast",
    op: 6,
  },
  {
    title: "Path of the Gods Coastal Hike",
    description:
      "Trek the legendary Sentiero degli Dei — a breathtaking cliff-top trail high above the sea between Bomerano and Positano. Enjoy panoramic views of the Tyrrhenian Sea, terraced lemon groves, and dramatic rock formations.",
    category: "Nature",
    price: 45,
    duration: 300,
    difficulty: "Moderate",
    maxGroupSize: 14,
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e366?w=600&q=80",
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&q=80",
    ],
    latitude: 40.6378,
    longitude: 14.5316,
    included: ["Mountain guide", "Snack pack", "Water", "Transport to trailhead"],
    highlights: ["Cliff-top views", "Lemon groves", "Positano descent"],
    featured: true,
    dest: "amalfi-coast",
    op: 6,
  },
  {
    title: "Amalfi Limoncello & Cooking Experience",
    description:
      "Visit a family-run lemon farm in Amalfi, learn how limoncello is crafted from giant sfusato lemons, then cook a traditional Neapolitan meal — fresh pasta, seafood, and lemon dessert — with a local nonna.",
    category: "Food & Wine",
    price: 90,
    duration: 300,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    ],
    latitude: 40.6349,
    longitude: 14.6029,
    included: ["Farm tour", "Limoncello tasting", "Cooking class", "Full lunch", "Recipes"],
    highlights: ["Lemon farm visit", "Nonna's recipes", "Limoncello making"],
    featured: true,
    dest: "amalfi-coast",
    op: 6,
  },
  {
    title: "Positano Sunset Photography Tour",
    description:
      "Capture the pastel cascades of Positano at golden hour with a professional photographer. Discover hidden viewpoints, learn composition techniques, and create portfolio-worthy images of the world's most photogenic coastline.",
    category: "Photography",
    price: 65,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&q=80",
      "https://images.unsplash.com/photo-1602087594298-706ccc894bfd?w=600&q=80",
    ],
    latitude: 40.6281,
    longitude: 14.485,
    included: ["Pro photographer", "Editing tips", "Digital photo set"],
    highlights: ["Golden hour shots", "Hidden viewpoints", "Positano colors"],
    featured: false,
    dest: "amalfi-coast",
    op: 6,
  },
  {
    title: "Ravello Concert & Villa Gardens",
    description:
      "Explore Ravello's world-famous gardens — Villa Rufolo and Villa Cimbrone — then attend an intimate classical music concert on a clifftop terrace overlooking the sea, as legends like Wagner once did.",
    category: "Cultural",
    price: 80,
    duration: 240,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80",
      "https://images.unsplash.com/photo-1602087594298-706ccc894bfd?w=600&q=80",
    ],
    latitude: 40.6489,
    longitude: 14.6117,
    included: ["Garden entries", "Concert ticket", "Guide", "Prosecco"],
    highlights: ["Villa Rufolo", "Terrace of Infinity", "Live concert"],
    featured: false,
    dest: "amalfi-coast",
    op: 6,
  },
  {
    title: "Amalfi Coast Kayak & Snorkel Adventure",
    description:
      "Paddle along the dramatic Amalfi coastline in a sea kayak, explore sea caves and secret beaches only reachable by water, and snorkel over ancient ruins and vibrant Mediterranean marine life.",
    category: "Adventure",
    price: 55,
    duration: 210,
    difficulty: "Moderate",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
      "https://images.unsplash.com/photo-1602087594298-706ccc894bfd?w=600&q=80",
    ],
    latitude: 40.6349,
    longitude: 14.6029,
    included: ["Kayak & gear", "Snorkeling equipment", "Guide", "Waterproof bag"],
    highlights: ["Sea caves", "Secret beaches", "Crystal waters"],
    featured: false,
    dest: "amalfi-coast",
    op: 6,
  },

  {
    title: "Copenhagen Cycling & Street Food Tour",
    description:
      "Explore the Danish capital on two wheels, stopping at hidden street food markets, design landmarks, and waterfront spots that only locals know. Includes bike rental and tastings at five stops.",
    category: "Food & Wine",
    price: 55,
    duration: 210,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
    ],
    latitude: 55.6761,
    longitude: 12.5683,
    included: ["Bike rental", "5 food tastings", "Local guide", "Rain poncho"],
    highlights: ["Torvehallerne Market", "Nyhavn", "Hidden courtyards"],
    featured: true,
    dest: "copenhagen",
    op: 7,
  },
  {
    title: "Tivoli Gardens Evening Experience",
    description:
      "Discover one of the world's oldest amusement parks after dark when fairy lights transform the gardens into a magical wonderland. Includes priority entry and a traditional Danish dinner.",
    category: "Cultural",
    price: 70,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 16,
    images: [
      "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=600&q=80",
      "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=600&q=80",
    ],
    latitude: 55.6736,
    longitude: 12.5681,
    included: ["Priority entry", "Danish dinner", "Guide"],
    highlights: ["Fairy-light gardens", "Historic rides", "Live performances"],
    featured: false,
    dest: "copenhagen",
    op: 7,
  },
  {
    title: "Nordic Wellness & Sauna Ritual",
    description:
      "Experience the Scandinavian bathing tradition at a harborside spa. Alternate between saunas, cold plunges, and heated pools with views of the Copenhagen skyline.",
    category: "Wellness",
    price: 45,
    duration: 150,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80",
    ],
    latitude: 55.6802,
    longitude: 12.5916,
    included: ["Spa access", "Towel & robe", "Herbal tea"],
    highlights: ["Harbor views", "Cold plunge", "Finnish sauna"],
    featured: false,
    dest: "copenhagen",
    op: 7,
  },

  {
    title: "Mumbai Street Food Safari",
    description:
      "Navigate the chaotic, delicious streets of Mumbai with a food expert. From vada pav to pav bhaji, chaat to fresh sugarcane juice, taste the city's soul through its legendary street vendors.",
    category: "Food & Wine",
    price: 30,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80",
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80",
    ],
    latitude: 19.076,
    longitude: 72.8777,
    included: ["10+ tastings", "Local guide", "Bottled water", "Hand sanitizer"],
    highlights: ["Vada Pav masters", "Chowpatty Beach snacks", "Spice markets"],
    featured: true,
    dest: "mumbai",
    op: 8,
  },
  {
    title: "Bollywood Dance Workshop & Studio Visit",
    description:
      "Learn iconic Bollywood moves from a professional choreographer, then visit an active film studio to see where the magic happens. No dance experience required.",
    category: "Cultural",
    price: 40,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 20,
    images: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
    ],
    latitude: 19.1726,
    longitude: 72.8628,
    included: ["Dance class", "Studio tour", "Photos", "Refreshments"],
    highlights: ["Learn Bollywood choreography", "Film set access", "Costume try-on"],
    featured: false,
    dest: "mumbai",
    op: 8,
  },
  {
    title: "Dharavi Creative Economy Walking Tour",
    description:
      "Discover the entrepreneurial spirit of one of Asia's largest informal settlements. Visit leather workshops, pottery kilns, and recycling units while learning about the community-driven economy.",
    category: "Cultural",
    price: 25,
    duration: 150,
    difficulty: "Easy",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80",
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80",
    ],
    latitude: 19.044,
    longitude: 72.855,
    included: ["Licensed guide", "Community contribution", "Refreshments"],
    highlights: ["Pottery workshops", "Leather craftsmanship", "Rooftop views"],
    featured: true,
    dest: "mumbai",
    op: 8,
  },

  {
    title: "Classical Concert at Musikverein",
    description:
      "Experience Vienna's legendary classical music tradition in the Golden Hall of the Musikverein, with pre-concert champagne and program notes from a musicologist.",
    category: "Cultural",
    price: 120,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 20,
    images: [
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&q=80",
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&q=80",
    ],
    latitude: 48.2003,
    longitude: 16.3726,
    included: ["Concert ticket", "Pre-concert champagne", "Program notes"],
    highlights: ["Golden Hall acoustics", "World-class orchestra", "Historic venue"],
    featured: true,
    dest: "vienna",
    op: 9,
  },
  {
    title: "Viennese Coffee House & Pastry Tour",
    description:
      "Visit three legendary Viennese coffee houses, learning the art of the Melange, tasting Sachertorte, Apfelstrudel, and discovering why UNESCO recognized this coffee culture as intangible heritage.",
    category: "Food & Wine",
    price: 55,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
    ],
    latitude: 48.2082,
    longitude: 16.3738,
    included: ["3 coffee house visits", "Pastry tastings", "Cultural guide"],
    highlights: ["Cafe Central", "Sachertorte", "UNESCO heritage"],
    featured: false,
    dest: "vienna",
    op: 9,
  },
  {
    title: "Imperial Palace & Habsburg History Tour",
    description:
      "Walk through six centuries of Habsburg rule from the Hofburg to Schonbrunn. Skip-the-line access, private guide, and stories of emperors, empresses, and intrigues that shaped Europe.",
    category: "Cultural",
    price: 85,
    duration: 300,
    difficulty: "Moderate",
    maxGroupSize: 14,
    images: [
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&q=80",
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&q=80",
    ],
    latitude: 48.2066,
    longitude: 16.3648,
    included: ["Skip-the-line tickets", "Private guide", "Transport"],
    highlights: ["Schonbrunn Palace", "Crown Jewels", "Sisi Museum"],
    featured: true,
    dest: "vienna",
    op: 9,
  },

  {
    title: "Bosphorus Sunset Cruise & Dinner",
    description:
      "Sail between Europe and Asia on a private yacht as Istanbul's minarets and palaces glow in the sunset light. Includes a four-course Turkish dinner and live music on board.",
    category: "Adventure",
    price: 90,
    duration: 210,
    difficulty: "Easy",
    maxGroupSize: 16,
    images: [
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80",
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80",
    ],
    latitude: 41.0422,
    longitude: 29.0083,
    included: ["Private yacht", "4-course dinner", "Live music", "Drinks"],
    highlights: ["Two continents panorama", "Palace views", "Golden Horn sunset"],
    featured: true,
    dest: "istanbul",
    op: 11,
  },
  {
    title: "Grand Bazaar & Spice Market Immersion",
    description:
      "Navigate 4,000 shops in the world's oldest covered market with a local expert. Learn to bargain for Turkish carpets, taste exotic spices, and discover hidden artisan workshops.",
    category: "Cultural",
    price: 35,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80",
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80",
    ],
    latitude: 41.0108,
    longitude: 28.968,
    included: ["Expert guide", "Turkish tea", "Spice samples"],
    highlights: ["Bargaining masterclass", "Artisan workshops", "Turkish delight tasting"],
    featured: false,
    dest: "istanbul",
    op: 11,
  },
  {
    title: "Turkish Hammam & Wellness Ritual",
    description:
      "Experience an authentic Ottoman bathing ritual in a 16th-century hammam. Includes full scrub, foam massage, and tea ceremony in a historic marble setting.",
    category: "Wellness",
    price: 65,
    duration: 120,
    difficulty: "Easy",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80",
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80",
    ],
    latitude: 41.0063,
    longitude: 28.9774,
    included: ["Hammam ritual", "Foam massage", "Tea ceremony", "Towels"],
    highlights: ["16th-century architecture", "Traditional techniques", "Deep relaxation"],
    featured: false,
    dest: "istanbul",
    op: 11,
  },

  {
    title: "Tango Milonga Night Experience",
    description:
      "Learn the basics of tango from a professional dancer, then join a real milonga in San Telmo. Includes wine, empanadas, and the electric atmosphere of Buenos Aires after dark.",
    category: "Nightlife",
    price: 50,
    duration: 240,
    difficulty: "Easy",
    maxGroupSize: 14,
    images: [
      "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&q=80",
      "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&q=80",
    ],
    latitude: -34.6212,
    longitude: -58.3731,
    included: ["Tango class", "Milonga entry", "Wine & empanadas"],
    highlights: ["Professional dancers", "Authentic milonga", "San Telmo ambiance"],
    featured: true,
    dest: "buenos-aires",
    op: 12,
  },
  {
    title: "Parrilla & Malbec: Argentine Steak Experience",
    description:
      "Visit a traditional parrilla with a sommelier guide. Taste five cuts of grass-fed beef paired with boutique Malbecs, learn the asado ritual, and understand why Argentine steak is legendary.",
    category: "Food & Wine",
    price: 75,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&q=80",
      "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&q=80",
    ],
    latitude: -34.5889,
    longitude: -58.3974,
    included: ["5-cut tasting", "4 Malbec pairings", "Sommelier guide"],
    highlights: ["Asado ritual", "Grass-fed beef", "Boutique wines"],
    featured: false,
    dest: "buenos-aires",
    op: 12,
  },

  {
    title: "City Walls Sunrise Walk",
    description:
      "Walk the complete 2km circuit of Dubrovnik's medieval walls at sunrise before the crowds arrive. A historian guide brings 600 years of history to life with dramatic Adriatic views.",
    category: "Cultural",
    price: 40,
    duration: 120,
    difficulty: "Moderate",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1555990793-da11153b2473?w=600&q=80",
      "https://images.unsplash.com/photo-1555990793-da11153b2473?w=600&q=80",
    ],
    latitude: 42.6407,
    longitude: 18.1082,
    included: ["Walls entry ticket", "Historian guide", "Coffee"],
    highlights: ["Sunrise light", "No crowds", "Adriatic panorama"],
    featured: true,
    dest: "dubrovnik",
    op: 13,
  },
  {
    title: "Kayaking to Lokrum Island",
    description:
      "Paddle crystal-clear Adriatic waters from Old Town to the forested island of Lokrum. Snorkel in hidden coves, explore botanical gardens, and swim in the Dead Sea salt lake.",
    category: "Adventure",
    price: 55,
    duration: 240,
    difficulty: "Moderate",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1555990793-da11153b2473?w=600&q=80",
      "https://images.unsplash.com/photo-1555990793-da11153b2473?w=600&q=80",
    ],
    latitude: 42.6292,
    longitude: 18.1181,
    included: ["Kayak & gear", "Snorkeling equipment", "Guide", "Snack"],
    highlights: ["Lokrum Island", "Hidden caves", "Crystal waters"],
    featured: true,
    dest: "dubrovnik",
    op: 13,
  },
  {
    title: "Dalmatian Wine & Oyster Tasting",
    description:
      "Boat trip to Ston for fresh oyster harvesting followed by tastings of Plavac Mali and Posip wines at family-run vineyards along the Peljesac peninsula.",
    category: "Food & Wine",
    price: 85,
    duration: 300,
    difficulty: "Easy",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1555990793-da11153b2473?w=600&q=80",
      "https://images.unsplash.com/photo-1555990793-da11153b2473?w=600&q=80",
    ],
    latitude: 42.8389,
    longitude: 17.6936,
    included: ["Boat transfer", "Oyster tasting", "Wine pairings", "Lunch"],
    highlights: ["Fresh oysters from the sea", "Family vineyards", "Peljesac views"],
    featured: false,
    dest: "dubrovnik",
    op: 13,
  },

  {
    title: "Table Mountain Sunrise Hike",
    description:
      "Summit Table Mountain via Platteklip Gorge before dawn and watch the sunrise paint the city gold from 1,085 meters. Small group with certified mountain guide.",
    category: "Adventure",
    price: 60,
    duration: 300,
    difficulty: "Challenging",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80",
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80",
    ],
    latitude: -33.9628,
    longitude: 18.4098,
    included: ["Certified guide", "Breakfast on summit", "Cable car down"],
    highlights: ["Sunrise from the top", "City panorama", "Endemic fynbos"],
    featured: true,
    dest: "cape-town",
    op: 14,
  },
  {
    title: "Cape Winelands Full-Day Tour",
    description:
      "Visit three premium estates in Stellenbosch and Franschhoek. Taste award-winning Pinotage and Chenin Blanc, enjoy a vineyard lunch, and learn the Cape's 350-year winemaking story.",
    category: "Food & Wine",
    price: 95,
    duration: 480,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80",
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80",
    ],
    latitude: -33.9466,
    longitude: 18.8528,
    included: ["Transport", "3 estate visits", "Wine tastings", "Lunch"],
    highlights: ["Stellenbosch", "Franschhoek", "Award-winning wines"],
    featured: true,
    dest: "cape-town",
    op: 14,
  },
  {
    title: "Penguin Colony & Cape Point Safari",
    description:
      "Drive the scenic Chapman's Peak to Boulders Beach penguin colony, then continue to the dramatic Cape of Good Hope. Spot baboons, ostriches, and bontebok along the way.",
    category: "Nature",
    price: 80,
    duration: 420,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80",
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80",
    ],
    latitude: -34.1972,
    longitude: 18.4323,
    included: ["Transport", "Park fees", "Guide", "Lunch pack"],
    highlights: ["African penguins", "Cape of Good Hope", "Chapman's Peak drive"],
    featured: false,
    dest: "cape-town",
    op: 14,
  },

  {
    title: "Sydney Harbour Bridge Climb",
    description:
      "Scale the iconic Sydney Harbour Bridge at dawn for 360-degree views of the Opera House, harbour, and city. A bucket-list experience with safety briefing and commemorative photo.",
    category: "Adventure",
    price: 150,
    duration: 210,
    difficulty: "Moderate",
    maxGroupSize: 14,
    images: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80",
    ],
    latitude: -33.8523,
    longitude: 151.2108,
    included: ["Climb gear", "Guide", "Commemorative photo", "Certificate"],
    highlights: ["360-degree panorama", "Opera House views", "Dawn light"],
    featured: true,
    dest: "sydney",
    op: 15,
  },
  {
    title: "Bondi to Coogee Coastal Walk & Brunch",
    description:
      "Walk the famous 6km coastal trail past sculpted sandstone cliffs, tidal pools, and hidden beaches. Finish with a gourmet brunch at a oceanfront cafe in Coogee.",
    category: "Nature",
    price: 45,
    duration: 210,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80",
    ],
    latitude: -33.8915,
    longitude: 151.2767,
    included: ["Guide", "Brunch", "Coffee"],
    highlights: ["Sandstone cliffs", "Ocean pools", "Whale spotting (seasonal)"],
    featured: false,
    dest: "sydney",
    op: 15,
  },
  {
    title: "Sydney Opera House Backstage Tour",
    description:
      "Go behind the scenes of the world's most recognizable building. Access rehearsal spaces, technical areas, and the rarely-seen underground corridors, guided by a performing arts expert.",
    category: "Cultural",
    price: 70,
    duration: 120,
    difficulty: "Easy",
    maxGroupSize: 16,
    images: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80",
    ],
    latitude: -33.8568,
    longitude: 151.2153,
    included: ["Backstage access", "Expert guide", "Souvenir booklet"],
    highlights: ["Technical underground", "Concert hall acoustics", "Architecture secrets"],
    featured: true,
    dest: "sydney",
    op: 15,
  },

  {
    title: "Colosseum Underground & Arena Floor",
    description:
      "Access the restricted underground chambers where gladiators waited, then step onto the reconstructed arena floor. A historian brings ancient Rome to life in this exclusive experience.",
    category: "Cultural",
    price: 95,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80",
    ],
    latitude: 41.8902,
    longitude: 12.4922,
    included: ["Skip-the-line entry", "Underground access", "Historian guide"],
    highlights: ["Gladiator chambers", "Arena floor", "Exclusive access"],
    featured: true,
    dest: "rome",
    op: 16,
  },
  {
    title: "Trastevere Food & Wine Walk",
    description:
      "Wander Rome's most authentic neighborhood tasting supplì, cacio e pepe, artisanal gelato, and natural wines at family-run establishments hidden in medieval alleyways.",
    category: "Food & Wine",
    price: 65,
    duration: 210,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80",
    ],
    latitude: 41.8892,
    longitude: 12.4693,
    included: ["6 food stops", "3 wine tastings", "Local guide"],
    highlights: ["Authentic trattorias", "Artisanal gelato", "Medieval streets"],
    featured: false,
    dest: "rome",
    op: 16,
  },
  {
    title: "Vatican Museums After-Hours Tour",
    description:
      "Experience the Sistine Chapel in near-solitude during an exclusive after-hours opening. Walk the Gallery of Maps and Raphael Rooms without the usual crowds, with an art historian guide.",
    category: "Cultural",
    price: 130,
    duration: 150,
    difficulty: "Easy",
    maxGroupSize: 20,
    images: [
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80",
    ],
    latitude: 41.9065,
    longitude: 12.4536,
    included: ["After-hours entry", "Art historian guide", "Headsets"],
    highlights: ["Empty Sistine Chapel", "Raphael Rooms", "No crowds"],
    featured: true,
    dest: "rome",
    op: 16,
  },

  {
    title: "Prague Craft Beer & Brewery Tour",
    description:
      "Visit three microbreweries and two historic beer halls. Taste 12 different Czech beers from pilsners to dark lagers, paired with traditional bar snacks, guided by a certified beer sommelier.",
    category: "Food & Wine",
    price: 50,
    duration: 240,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80",
      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80",
    ],
    latitude: 50.0865,
    longitude: 14.4213,
    included: ["12 beer tastings", "Snack pairings", "Beer sommelier guide"],
    highlights: ["Microbreweries", "Historic beer halls", "Brewing traditions"],
    featured: true,
    dest: "prague",
    op: 17,
  },
  {
    title: "Prague Castle & Golden Lane Evening Tour",
    description:
      "Explore the world's largest ancient castle complex as evening light illuminates St. Vitus Cathedral. Walk the tiny alchemists' houses of Golden Lane and hear tales of Kafka and Rudolf II.",
    category: "Cultural",
    price: 45,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 16,
    images: [
      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80",
      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80",
    ],
    latitude: 50.0911,
    longitude: 14.4012,
    included: ["Castle entry", "Guide", "Golden Lane access"],
    highlights: ["St. Vitus Cathedral", "Golden Lane", "Evening atmosphere"],
    featured: false,
    dest: "prague",
    op: 17,
  },
  {
    title: "Vltava River Night Photography Cruise",
    description:
      "Capture Prague's illuminated bridges and spires from the water aboard a glass-top boat. A professional photographer helps you master night shooting techniques.",
    category: "Photography",
    price: 55,
    duration: 150,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80",
      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80",
    ],
    latitude: 50.0834,
    longitude: 14.4148,
    included: ["Cruise ticket", "Photography instructor", "Tripod rental"],
    highlights: ["Charles Bridge lit up", "Castle reflections", "Night techniques"],
    featured: false,
    dest: "prague",
    op: 17,
  },

  {
    title: "Amber Fort Elephant & Jeep Safari",
    description:
      "Ascend to the magnificent Amber Fort by jeep, explore its mirror palace and intricate chambers, then descend through Jaigarh Fort with views stretching across the Aravalli hills.",
    category: "Adventure",
    price: 45,
    duration: 300,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
    ],
    latitude: 26.9855,
    longitude: 75.8513,
    included: ["Jeep transfer", "Fort entry", "Guide", "Water"],
    highlights: ["Mirror Palace", "Aravalli views", "Military fortifications"],
    featured: true,
    dest: "jaipur",
    op: 18,
  },
  {
    title: "Jaipur Textile & Block Printing Workshop",
    description:
      "Learn the ancient art of Rajasthani block printing in a traditional workshop. Carve your own block, print fabric using natural dyes, and take home your creation.",
    category: "Cultural",
    price: 35,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
    ],
    latitude: 26.9226,
    longitude: 75.8104,
    included: ["Materials", "Instructor", "Take-home fabric", "Tea"],
    highlights: ["Hand-carved blocks", "Natural dyes", "Traditional techniques"],
    featured: false,
    dest: "jaipur",
    op: 18,
  },
  {
    title: "Pink City Heritage Photography Walk",
    description:
      "Photograph the iconic pink sandstone facades, bustling bazaars, and Hawa Mahal at golden hour with a professional photographer who knows every hidden angle.",
    category: "Photography",
    price: 40,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
    ],
    latitude: 26.9239,
    longitude: 75.8267,
    included: ["Pro photographer guide", "Chai stops", "Editing tips"],
    highlights: ["Hawa Mahal", "Bazaar life", "Golden hour light"],
    featured: false,
    dest: "jaipur",
    op: 18,
  },

  {
    title: "Lisbon Surf Lesson at Costa da Caparica",
    description:
      "Cross the river to some of Europe's best urban surf beaches. Professional instructors, all equipment provided, suitable for complete beginners to intermediate surfers.",
    category: "Water Sports",
    price: 50,
    duration: 240,
    difficulty: "Moderate",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1502680390548-bdbfe3e9be7a?w=600&q=80",
      "https://images.unsplash.com/photo-1502680390548-bdbfe3e9be7a?w=600&q=80",
    ],
    latitude: 38.6446,
    longitude: -9.2363,
    included: ["Surf equipment", "Instructor", "Transport", "Insurance"],
    highlights: ["Costa da Caparica", "Warm Atlantic waters", "All levels"],
    featured: false,
    dest: "lisbon",
    op: 1,
  },

  {
    title: "Santorini Volcanic Hot Springs Hike",
    description:
      "Hike across the active volcanic island of Nea Kameni, then swim in the geothermal hot springs. A geology guide explains 3,600 years of volcanic history.",
    category: "Nature",
    price: 45,
    duration: 240,
    difficulty: "Moderate",
    maxGroupSize: 15,
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    ],
    latitude: 36.4013,
    longitude: 25.3963,
    included: ["Boat transfer", "Geology guide", "Snorkel gear"],
    highlights: ["Active volcano crater", "Hot springs swim", "Caldera views"],
    featured: false,
    dest: "santorini",
    op: 2,
  },

  {
    title: "Barcelona Rooftop Photography Tour",
    description:
      "Access exclusive rooftop terraces across Barcelona for unique aerial perspectives of Gaudi's works, the Gothic Quarter, and the Mediterranean coastline at golden hour.",
    category: "Photography",
    price: 70,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80",
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80",
    ],
    latitude: 41.3874,
    longitude: 2.1686,
    included: ["Rooftop access", "Pro photographer", "Editing tips"],
    highlights: ["Sagrada Familia from above", "Gothic Quarter rooftops", "Sunset"],
    featured: false,
    dest: "barcelona",
    op: 3,
  },

  {
    title: "Bali Sunrise Trek to Mount Batur",
    description:
      "Trek an active volcano in the dark and reach the summit for a spectacular sunrise over Lake Batur and Mount Agung. Includes breakfast cooked by volcanic steam.",
    category: "Adventure",
    price: 55,
    duration: 360,
    difficulty: "Challenging",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    ],
    latitude: -8.2422,
    longitude: 115.375,
    included: ["Guide", "Flashlight", "Volcanic breakfast", "Hot drinks"],
    highlights: ["Summit sunrise", "Volcanic steam cooking", "Lake views"],
    featured: true,
    dest: "bali",
    op: 4,
  },
  {
    title: "Balinese Cooking Class & Market Visit",
    description:
      "Visit a traditional morning market to source fresh ingredients, then learn to cook five authentic Balinese dishes in an open-air kitchen surrounded by rice paddies.",
    category: "Food & Wine",
    price: 40,
    duration: 300,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    ],
    latitude: -8.4095,
    longitude: 115.1889,
    included: ["Market tour", "All ingredients", "Recipe book", "Lunch"],
    highlights: ["Morning market", "Rice paddy setting", "5 dishes"],
    featured: false,
    dest: "bali",
    op: 4,
  },

  {
    title: "Porto Sunset Wine Cruise on the Douro",
    description:
      "Sail the Douro River at sunset past rabelo boats and six bridges while tasting five premium port wines with a certified sommelier. Live fado music accompanies the journey.",
    category: "Food & Wine",
    price: 70,
    duration: 150,
    difficulty: "Easy",
    maxGroupSize: 20,
    images: [
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80",
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80",
    ],
    latitude: 41.1401,
    longitude: -8.6135,
    included: ["River cruise", "5 port tastings", "Live fado", "Cheese board"],
    highlights: ["Six bridges", "Sunset views", "Rabelo boats"],
    featured: true,
    dest: "porto",
    op: 1,
  },

  {
    title: "Tokyo Ramen & Izakaya Night Tour",
    description:
      "Explore Tokyo's best ramen shops and hidden izakaya bars with a local foodie. Slurp five different ramen styles and end with yakitori and sake in a lantern-lit alley.",
    category: "Food & Wine",
    price: 65,
    duration: 210,
    difficulty: "Easy",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    ],
    latitude: 35.6895,
    longitude: 139.6917,
    included: ["5 ramen tastings", "Sake flight", "Local guide"],
    highlights: ["Ramen alley", "Hidden izakayas", "Yakitori masters"],
    featured: true,
    dest: "tokyo",
    op: 5,
  },
  {
    title: "Shibuya & Harajuku Photography Walk",
    description:
      "Capture the neon-drenched streets of Shibuya and the colorful chaos of Harajuku with a professional photographer. From the famous crossing to hidden shrines.",
    category: "Photography",
    price: 50,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    ],
    latitude: 35.6595,
    longitude: 139.7004,
    included: ["Pro photographer", "Best angles guide", "Editing session"],
    highlights: ["Shibuya Crossing", "Harajuku fashion", "Neon reflections"],
    featured: false,
    dest: "tokyo",
    op: 5,
  },

  {
    title: "Atlas Mountains Day Hike & Berber Lunch",
    description:
      "Escape the medina heat for the cool Atlas foothills. Hike through walnut groves and Berber villages to a traditional family home for a home-cooked tagine lunch.",
    category: "Adventure",
    price: 55,
    duration: 420,
    difficulty: "Moderate",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&q=80",
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&q=80",
    ],
    latitude: 31.3625,
    longitude: -7.8811,
    included: ["Transport", "Guide", "Berber lunch", "Mint tea"],
    highlights: ["Berber villages", "Mountain views", "Home-cooked tagine"],
    featured: true,
    dest: "marrakech",
    op: 6,
  },

  {
    title: "Brooklyn Bridge Sunrise Photography",
    description:
      "Capture the Manhattan skyline bathed in golden sunrise light from the Brooklyn Bridge and DUMBO waterfront. A pro photographer guides composition and post-processing.",
    category: "Photography",
    price: 75,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80",
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80",
    ],
    latitude: 40.7061,
    longitude: -73.9969,
    included: ["Pro photographer", "Editing session", "Digital gallery"],
    highlights: ["Manhattan skyline", "Brooklyn Bridge", "Golden hour"],
    featured: true,
    dest: "new-york-city",
    op: 3,
  },
  {
    title: "Harlem Gospel & Soul Food Experience",
    description:
      "Attend a powerful gospel service at a Harlem church, then feast on fried chicken, collard greens, and cornbread at a legendary soul food restaurant.",
    category: "Cultural",
    price: 60,
    duration: 210,
    difficulty: "Easy",
    maxGroupSize: 14,
    images: [
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80",
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80",
    ],
    latitude: 40.8116,
    longitude: -73.9465,
    included: ["Church visit", "Soul food lunch", "Local guide"],
    highlights: ["Gospel music", "Soul food feast", "Harlem history"],
    featured: false,
    dest: "new-york-city",
    op: 3,
  },

  {
    title: "Fushimi Inari & Tea Ceremony at Dawn",
    description:
      "Walk through ten thousand vermilion torii gates in the magical silence of dawn. End at a private machiya for an authentic tea ceremony with a certified tea master.",
    category: "Cultural",
    price: 70,
    duration: 240,
    difficulty: "Moderate",
    maxGroupSize: 8,
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80",
    ],
    latitude: 34.9671,
    longitude: 135.7727,
    included: ["Tea ceremony", "Tea master", "Wagashi sweet", "Guide"],
    highlights: ["Empty torii gates", "Traditional machiya", "Matcha preparation"],
    featured: true,
    dest: "kyoto",
    op: 5,
  },
  {
    title: "Arashiyama Bamboo & Zen Garden Meditation",
    description:
      "Stroll through the ethereal bamboo grove before tourists arrive, then join a Zen monk for a guided meditation session in a 14th-century temple garden.",
    category: "Wellness",
    price: 55,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80",
    ],
    latitude: 35.0094,
    longitude: 135.6722,
    included: ["Temple entry", "Monk-led meditation", "Green tea"],
    highlights: ["Bamboo grove", "Zen garden", "Monk guidance"],
    featured: true,
    dest: "kyoto",
    op: 5,
  },

  {
    title: "Desert Safari & Bedouin Dinner",
    description:
      "Thrilling dune bashing in a 4x4 followed by camel rides, sandboarding, and a traditional Bedouin dinner under the stars with live entertainment.",
    category: "Adventure",
    price: 85,
    duration: 360,
    difficulty: "Moderate",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    ],
    latitude: 24.9728,
    longitude: 55.3344,
    included: ["4x4 transfer", "Camel ride", "BBQ dinner", "Entertainment"],
    highlights: ["Dune bashing", "Sandboarding", "Starlit dinner"],
    featured: true,
    dest: "dubai",
    op: 11,
  },
  {
    title: "Dubai Marina Luxury Yacht Cruise",
    description:
      "Cruise past Burj Al Arab, Palm Jumeirah, and the Marina skyline on a private luxury yacht. Includes gourmet canapes, premium drinks, and DJ set at sunset.",
    category: "Adventure",
    price: 130,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 16,
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    ],
    latitude: 25.0762,
    longitude: 55.1404,
    included: ["Yacht cruise", "Canapes", "Premium drinks", "DJ"],
    highlights: ["Burj Al Arab", "Palm Jumeirah", "Marina sunset"],
    featured: false,
    dest: "dubai",
    op: 11,
  },

  {
    title: "Canal Cruise & Hidden Courtyard Tour",
    description:
      "Explore Amsterdam's UNESCO canals by private boat, then walk secret hofjes (courtyards) hidden behind unassuming doors that most tourists never find.",
    category: "Cultural",
    price: 55,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80",
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80",
    ],
    latitude: 52.3676,
    longitude: 4.9041,
    included: ["Private boat", "Guide", "Hot drinks"],
    highlights: ["UNESCO canals", "Secret hofjes", "Golden Age history"],
    featured: true,
    dest: "amsterdam",
    op: 7,
  },
  {
    title: "Dutch Cheese & Jenever Tasting",
    description:
      "Visit a traditional kaasmaker (cheese maker) and three jenever distilleries. Taste aged Gouda, truffle cheese, and smooth Dutch gin while learning centuries-old techniques.",
    category: "Food & Wine",
    price: 60,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80",
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80",
    ],
    latitude: 52.3702,
    longitude: 4.8952,
    included: ["Cheese tastings", "3 jenever flights", "Guide"],
    highlights: ["Aged Gouda", "Traditional distilleries", "Dutch techniques"],
    featured: false,
    dest: "amsterdam",
    op: 7,
  },

  {
    title: "Bangkok Floating Market & Temple Tour",
    description:
      "Board a longtail boat through Damnoen Saduak floating market, then visit three stunning temples including Wat Arun at golden hour.",
    category: "Cultural",
    price: 40,
    duration: 420,
    difficulty: "Easy",
    maxGroupSize: 12,
    images: [
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80",
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80",
    ],
    latitude: 13.7563,
    longitude: 100.5018,
    included: ["Longtail boat", "Temple entry fees", "Guide", "Lunch"],
    highlights: ["Floating market", "Wat Arun", "Longtail boat ride"],
    featured: true,
    dest: "bangkok",
    op: 4,
  },
  {
    title: "Bangkok Muay Thai & Street Food Night",
    description:
      "Watch an authentic Muay Thai fight at a local stadium, then dive into Chinatown's bustling night food stalls for the best pad thai, mango sticky rice, and tom yum you'll ever taste.",
    category: "Nightlife",
    price: 50,
    duration: 240,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80",
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80",
    ],
    latitude: 13.7418,
    longitude: 100.5133,
    included: ["Fight ticket", "5 food tastings", "Guide", "Drinks"],
    highlights: ["Muay Thai ringside", "Chinatown food stalls", "Night atmosphere"],
    featured: false,
    dest: "bangkok",
    op: 4,
  },

  {
    title: "Edinburgh Ghost & Underground Vaults Tour",
    description:
      "Descend into the haunted underground vaults beneath the Royal Mile. Hear true tales of plague, body snatchers, and restless spirits in candlelit chambers.",
    category: "Cultural",
    price: 30,
    duration: 120,
    difficulty: "Easy",
    maxGroupSize: 20,
    images: [
      "https://images.unsplash.com/photo-1583225173760-4083d9b439c1?w=600&q=80",
      "https://images.unsplash.com/photo-1583225173760-4083d9b439c1?w=600&q=80",
    ],
    latitude: 55.9502,
    longitude: -3.1877,
    included: ["Vault access", "Storytelling guide", "Candle lantern"],
    highlights: ["Underground vaults", "Ghost stories", "Candlelit atmosphere"],
    featured: true,
    dest: "edinburgh",
    op: 1,
  },
  {
    title: "Scotch Whisky Heritage Experience",
    description:
      "Visit three historic whisky bars on the Royal Mile, tasting single malts from Highland, Speyside, and Islay regions. A whisky expert explains nosing, palate, and finish.",
    category: "Food & Wine",
    price: 65,
    duration: 180,
    difficulty: "Easy",
    maxGroupSize: 10,
    images: [
      "https://images.unsplash.com/photo-1583225173760-4083d9b439c1?w=600&q=80",
      "https://images.unsplash.com/photo-1583225173760-4083d9b439c1?w=600&q=80",
    ],
    latitude: 55.9495,
    longitude: -3.1956,
    included: ["6 whisky tastings", "Oatcakes & cheese", "Whisky guide"],
    highlights: ["Single malts", "Historic bars", "Tasting technique"],
    featured: false,
    dest: "edinburgh",
    op: 1,
  },
];

const CATEGORY_IMAGES: Record<string, string[]> = {
  Adventure: [
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=600&q=80",
    "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
  ],
  Cultural: [
    "https://images.unsplash.com/photo-1513735492246-483525079686?w=600&q=80",
    "https://images.unsplash.com/photo-1503152394-c571994fd383?w=600&q=80",
    "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=600&q=80",
    "https://images.unsplash.com/photo-1493707553966-283afac8c358?w=600&q=80",
  ],
  "Food & Wine": [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80",
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
  ],
  Nature: [
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80",
  ],
  Photography: [
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&q=80",
    "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=600&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80",
  ],
  Wellness: [
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
    "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=600&q=80",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
  ],
  "Water Sports": [
    "https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=600&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    "https://images.unsplash.com/photo-1502933691298-84fc14542831?w=600&q=80",
    "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600&q=80",
  ],
  Nightlife: [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
    "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=600&q=80",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80",
  ],
};

interface BonusSpec {
  title: string;
  category: string;
  price: number;
  duration: number;
  description: string;
  highlights: string[];
  included: string[];
  featured?: boolean;
  difficulty?: string;
  maxGroupSize?: number;
}

function buildBonus(
  dest: string,
  op: number,
  baseLat: number,
  baseLng: number,
  specs: BonusSpec[]
): ActivitySeed[] {
  return specs.map((s, i) => {
    const angle = (i / Math.max(specs.length, 1)) * Math.PI * 2;
    const ring = 0.012 + (i % 3) * 0.006;
    const pool = CATEGORY_IMAGES[s.category] ?? CATEGORY_IMAGES.Cultural;
    return {
      title: s.title,
      description: s.description,
      category: s.category,
      price: s.price,
      duration: s.duration,
      difficulty: s.difficulty ?? "Easy",
      maxGroupSize: s.maxGroupSize ?? 14,
      images: [pool[i % pool.length], pool[(i + 1) % pool.length]],
      latitude: +(baseLat + Math.cos(angle) * ring).toFixed(5),
      longitude: +(baseLng + Math.sin(angle) * ring).toFixed(5),
      included: s.included,
      highlights: s.highlights,
      featured: s.featured ?? false,
      dest,
      op,
    };
  });
}

const BONUS_ACTIVITIES: ActivitySeed[] = [

  ...buildBonus("lisbon", 1, 38.7223, -9.1393, [
    { title: "Tram 28 Vintage Ride & Hidden Viewpoints", category: "Cultural", price: 30, duration: 120, description: "Ride the iconic yellow Tram 28 with a local guide and hop off at the best miradouros for sweeping city views.", highlights: ["Classic Tram 28", "Best miradouros", "Local stories"], included: ["Tram ticket", "Local guide", "Viewpoint map"], featured: true },
    { title: "Time Out Market Tasting Crawl", category: "Food & Wine", price: 48, duration: 150, description: "Sample signature dishes from Lisbon's top chefs gathered under one roof, paired with Portuguese wine.", highlights: ["Top chef stalls", "Wine pairing", "Dessert finale"], included: ["5 tastings", "2 wines", "Host"] },
    { title: "LX Factory Creative District Tour", category: "Cultural", price: 26, duration: 120, description: "Explore Lisbon's converted industrial quarter full of street art, indie shops, and design studios.", highlights: ["Street art", "Indie shops", "Coffee stop"], included: ["Guide", "Coffee", "Gallery entry"] },
    { title: "Belem Monuments & Pastel de Nata", category: "Cultural", price: 34, duration: 180, description: "Discover the Age of Discovery landmarks of Belem and taste the original custard tart at its birthplace.", highlights: ["Jeronimos", "Belem Tower", "Original nata"], included: ["Guide", "Pastry tasting", "Map"], featured: true },
    { title: "Tagus River Sunset Sailing", category: "Water Sports", price: 52, duration: 150, description: "Set sail on a classic yacht and watch the city skyline glow gold as the sun sets over the Tagus.", highlights: ["Sailing yacht", "Skyline views", "Welcome drink"], included: ["2h cruise", "Drink", "Skipper"], featured: true },
    { title: "Fado Dinner Experience in Alfama", category: "Cultural", price: 60, duration: 150, description: "Enjoy an intimate evening of live fado music alongside a traditional Portuguese dinner in old Alfama.", highlights: ["Live fado", "3-course dinner", "Historic venue"], included: ["Dinner", "Live show", "Wine"] },
    { title: "Cascais Coastal Bike Ride", category: "Adventure", price: 38, duration: 210, description: "Cycle the scenic seaside path from Cascais toward Guincho with Atlantic views the whole way.", highlights: ["Coastal path", "Guincho beach", "Sea breeze"], included: ["Bike & helmet", "Guide", "Water"], difficulty: "Moderate" },
    { title: "Lisbon Rooftop Bar Night Tour", category: "Nightlife", price: 44, duration: 180, description: "Hop between the city's best rooftop bars for craft cocktails and illuminated views of the seven hills.", highlights: ["3 rooftops", "Craft cocktails", "City lights"], included: ["Welcome cocktail", "Guide", "Skip lines"] },
    { title: "Arrabida Natural Park Hike", category: "Nature", price: 46, duration: 300, description: "Trek the limestone ridges of Arrabida above hidden turquoise coves just south of Lisbon.", highlights: ["Limestone cliffs", "Turquoise coves", "Wild flora"], included: ["Guide", "Transport", "Snack"], difficulty: "Moderate" },

    { title: "Riverside Spa & Hammam Ritual", category: "Wellness", price: 58, duration: 120, description: "Unwind with a traditional hammam scrub and a soothing massage at a serene spa overlooking the Tagus, the perfect calm afternoon.", highlights: ["Steam hammam", "Relaxing massage", "River-view spa"], included: ["Hammam access", "Scrub", "Massage"], featured: true },
    { title: "Sunrise Yoga at the Miradouro", category: "Wellness", price: 20, duration: 75, description: "Greet the day with a gentle, all-levels yoga flow on a hilltop miradouro as soft morning light spreads over Lisbon's rooftops.", highlights: ["Hilltop viewpoint", "All levels", "Morning calm"], included: ["Mat", "Instructor", "Herbal tea"] },
    { title: "Ginjinha & Petiscos Tasting Walk", category: "Food & Wine", price: 24, duration: 120, description: "Sip Lisbon's beloved cherry liqueur and graze on classic petiscos in cosy tascas tucked through the downtown lanes.", highlights: ["Ginjinha tasting", "Classic petiscos", "Hidden tascas"], included: ["3 tastings", "Snacks", "Guide"] },
    { title: "Oceanario de Lisboa Guided Visit", category: "Cultural", price: 28, duration: 120, description: "Explore one of Europe's finest aquariums with a marine guide, a relaxed indoor experience that shines whatever the weather.", highlights: ["Giant ocean tank", "Marine guide", "All-weather indoor"], included: ["Entry", "Guide", "Map"] },
  ]),

  ...buildBonus("santorini", 2, 36.3932, 25.4615, [
    { title: "Caldera Catamaran Cruise with BBQ", category: "Water Sports", price: 95, duration: 300, description: "Sail the volcanic caldera with stops at the hot springs and red beach, finished with an onboard BBQ.", highlights: ["Hot springs swim", "Red beach", "Onboard BBQ"], included: ["5h cruise", "BBQ meal", "Drinks"], featured: true },
    { title: "Oia Blue Domes Sunset Photo Walk", category: "Photography", price: 55, duration: 150, description: "Capture the world famous Oia sunset and blue domes with a photographer who knows every secret angle.", highlights: ["Blue domes", "Famous sunset", "Editing tips"], included: ["Pro guide", "Best spots", "Photo tips"], featured: true },
    { title: "Santorini Volcano Hike & Hot Springs", category: "Adventure", price: 48, duration: 240, description: "Boat to the active volcano of Nea Kameni, hike to the crater, then swim in the warm sulphur springs.", highlights: ["Crater hike", "Sulphur springs", "Boat ride"], included: ["Boat", "Guide", "Park fee"], difficulty: "Moderate" },
    { title: "Assyrtiko Wine Estate Tasting", category: "Food & Wine", price: 65, duration: 150, description: "Taste crisp Assyrtiko whites grown in volcanic soil at a historic Santorini winery with caldera views.", highlights: ["Volcanic wines", "Estate tour", "Caldera views"], included: ["6 wines", "Snacks", "Tour"] },
    { title: "Akrotiri Archaeological Site Tour", category: "Cultural", price: 42, duration: 120, description: "Walk through the remarkably preserved Bronze Age city buried by the ancient volcanic eruption.", highlights: ["Bronze Age city", "Preserved frescoes", "Expert guide"], included: ["Entry", "Guide", "Headset"] },
    { title: "Red Beach & Black Beach Snorkeling", category: "Water Sports", price: 50, duration: 180, description: "Snorkel the dramatic volcanic shores of Santorini's red and black sand beaches with full gear.", highlights: ["Red beach", "Black sand", "Marine life"], included: ["Gear", "Guide", "Boat transfer"] },
    { title: "Traditional Greek Cooking Class", category: "Food & Wine", price: 70, duration: 180, description: "Cook authentic Santorini dishes using local cherry tomatoes, fava, and capers, then dine together.", highlights: ["Local produce", "Hands-on class", "Shared meal"], included: ["Ingredients", "Recipes", "Dinner"] },
    { title: "Fira to Oia Caldera Trail Hike", category: "Adventure", price: 40, duration: 240, description: "Hike the spectacular clifftop path linking Fira to Oia with nonstop views over the Aegean.", highlights: ["Clifftop trail", "Aegean views", "Villages"], included: ["Guide", "Water", "Map"], difficulty: "Moderate" },
    { title: "Sunrise Yoga on the Caldera", category: "Wellness", price: 36, duration: 90, description: "Greet the day with a calming yoga flow on a caldera terrace as the sun rises over the volcano.", highlights: ["Caldera terrace", "Sunrise flow", "All levels"], included: ["Mat", "Instructor", "Herbal tea"] },
  ]),

  ...buildBonus("barcelona", 3, 41.3874, 2.1686, [
    { title: "Sagrada Familia Skip-the-Line Tour", category: "Cultural", price: 58, duration: 120, description: "Step inside Gaudi's masterpiece with priority access and decode its symbolism with an art historian.", highlights: ["Skip the line", "Gaudi symbolism", "Stained glass"], included: ["Entry", "Guide", "Headset"], featured: true },
    { title: "Tapas & Vermouth Evening Crawl", category: "Food & Wine", price: 52, duration: 180, description: "Hop between authentic local bars for classic tapas and house vermouth away from the tourist crowds.", highlights: ["Local bars", "House vermouth", "Classic tapas"], included: ["5 tapas", "3 drinks", "Guide"], featured: true },
    { title: "Park Guell Guided Visit", category: "Cultural", price: 40, duration: 120, description: "Wander Gaudi's whimsical mosaic park with a guide and enjoy panoramic views over the whole city.", highlights: ["Mosaic terrace", "City panorama", "Gaudi design"], included: ["Entry", "Guide", "Map"] },
    { title: "Montserrat Mountain Day Trip", category: "Nature", price: 75, duration: 360, description: "Escape to the serrated peaks of Montserrat to visit its mountain monastery and hike scenic trails.", highlights: ["Mountain monastery", "Cable car", "Scenic trails"], included: ["Transport", "Guide", "Cable car"], difficulty: "Moderate" },
    { title: "Gothic Quarter Night Walk", category: "Nightlife", price: 30, duration: 120, description: "Explore the medieval lanes of the Gothic Quarter after dark and uncover its legends and hidden squares.", highlights: ["Medieval lanes", "Local legends", "Hidden squares"], included: ["Guide", "Tasting", "Map"] },
    { title: "Barceloneta Beach Paddleboard", category: "Water Sports", price: 45, duration: 120, description: "Paddleboard along the Barceloneta shoreline with the city skyline rising behind golden sand.", highlights: ["City skyline", "Calm waters", "Beginner friendly"], included: ["Board", "Instructor", "Locker"] },
    { title: "Boqueria Market Food Tour", category: "Food & Wine", price: 49, duration: 150, description: "Taste your way through Barcelona's legendary market with Iberian ham, cheese, and fresh juices.", highlights: ["Iberian ham", "Local cheese", "Fresh juices"], included: ["Tastings", "Guide", "Drink"] },
    { title: "Gaudi Architecture Photo Walk", category: "Photography", price: 44, duration: 180, description: "Shoot the curving facades of Casa Batllo and La Pedrera with composition coaching from a photographer.", highlights: ["Casa Batllo", "La Pedrera", "Photo coaching"], included: ["Guide", "Tips PDF", "Best spots"] },
    { title: "Flamenco Show with Dinner", category: "Cultural", price: 68, duration: 150, description: "Feel the passion of live flamenco at an intimate tablao paired with a Catalan dinner and wine.", highlights: ["Live flamenco", "Catalan dinner", "Intimate venue"], included: ["Dinner", "Show", "Wine"] },
  ]),

  ...buildBonus("bali", 1, -8.3405, 115.092, [
    { title: "Tegallalang Rice Terrace Sunrise", category: "Photography", price: 38, duration: 180, description: "Photograph the emerald tiers of the Tegallalang terraces in soft morning light before the crowds arrive.", highlights: ["Emerald terraces", "Soft light", "Jungle swing"], included: ["Guide", "Entry", "Photo tips"], featured: true },
    { title: "Mount Batur Volcano Sunrise Trek", category: "Adventure", price: 58, duration: 420, description: "Climb the active Mount Batur by torchlight and watch the sunrise break above a sea of clouds.", highlights: ["Summit sunrise", "Sea of clouds", "Volcanic crater"], included: ["Guide", "Breakfast", "Headlamp"], difficulty: "Challenging", featured: true },
    { title: "Ubud Monkey Forest & Temples", category: "Cultural", price: 32, duration: 180, description: "Wander the sacred monkey sanctuary and moss-covered temples in the spiritual heart of Ubud.", highlights: ["Sacred forest", "Ancient temples", "Cheeky macaques"], included: ["Entry", "Guide", "Water"] },
    { title: "Authentic Balinese Cooking Class", category: "Food & Wine", price: 46, duration: 240, description: "Learn to make satay, lawar, and sambal from scratch after a guided walk through a local market.", highlights: ["Market walk", "Hands-on class", "Shared lunch"], included: ["Market tour", "Ingredients", "Lunch"] },
    { title: "Uluwatu Temple & Kecak Fire Dance", category: "Cultural", price: 42, duration: 240, description: "Watch the hypnotic Kecak fire dance at sunset on the dramatic clifftop temple of Uluwatu.", highlights: ["Clifftop temple", "Kecak dance", "Ocean sunset"], included: ["Entry", "Show", "Guide"] },
    { title: "Nusa Penida Island Boat Day", category: "Water Sports", price: 85, duration: 600, description: "Speedboat to Nusa Penida for the iconic Kelingking cliff, Angel's Billabong, and crystal snorkeling.", highlights: ["Kelingking cliff", "Snorkel stops", "Hidden beaches"], included: ["Boat", "Lunch", "Snorkel gear"], difficulty: "Moderate" },
    { title: "Sacred Spring Water Purification", category: "Wellness", price: 34, duration: 150, description: "Take part in the centuries old Melukat purification ritual at the holy Tirta Empul temple springs.", highlights: ["Holy springs", "Purification ritual", "Local guide"], included: ["Sarong", "Offering", "Guide"] },
    { title: "Canggu Surf Lesson for Beginners", category: "Water Sports", price: 40, duration: 120, description: "Catch your first waves on Canggu's friendly beach breaks with patient certified instructors.", highlights: ["Beginner waves", "Certified coach", "Soft boards"], included: ["Board", "Instructor", "Rash guard"] },
  ]),

  ...buildBonus("porto", 1, 41.1579, -8.6291, [
    { title: "Port Wine Cellar Tour & Tasting", category: "Food & Wine", price: 35, duration: 120, description: "Descend into a historic Vila Nova de Gaia cellar to learn how port is aged and taste three styles.", highlights: ["Historic cellar", "3 port styles", "Aging secrets"], included: ["Cellar tour", "3 tastings", "Guide"], featured: true },
    { title: "Douro River Six Bridges Cruise", category: "Water Sports", price: 28, duration: 60, description: "Glide along the Douro on a traditional rabelo boat passing all six of Porto's famous bridges.", highlights: ["Rabelo boat", "Six bridges", "Riverfront views"], included: ["Cruise", "Audio guide", "Drink"], featured: true },
    { title: "Livraria Lello & Historic Center", category: "Cultural", price: 30, duration: 150, description: "Visit the magical Livraria Lello bookshop and the ornate train station tiles on a guided old town walk.", highlights: ["Livraria Lello", "Azulejo station", "Old town"], included: ["Bookshop entry", "Guide", "Map"] },
    { title: "Douro Valley Vineyard Day Trip", category: "Food & Wine", price: 95, duration: 480, description: "Journey into the terraced Douro Valley for two estate wine tastings, lunch, and a river cruise.", highlights: ["Terraced vineyards", "2 tastings", "Valley cruise"], included: ["Transport", "Lunch", "Tastings"] },
    { title: "Ribeira District Food Walk", category: "Food & Wine", price: 44, duration: 180, description: "Taste codfish cakes, cheese, and pastries through the colorful riverside lanes of the Ribeira quarter.", highlights: ["Codfish cakes", "Local cheese", "Riverside lanes"], included: ["6 tastings", "Drink", "Guide"] },
    { title: "Francesinha & Craft Beer Tour", category: "Food & Wine", price: 40, duration: 150, description: "Hunt for Porto's best version of the legendary francesinha sandwich paired with local craft beers.", highlights: ["Francesinha", "Craft beer", "Local spots"], included: ["Sandwich", "2 beers", "Guide"] },
    { title: "Porto Azulejo Tile Photo Walk", category: "Photography", price: 36, duration: 150, description: "Frame the blue and white azulejo facades of Porto with guidance on light, lines, and composition.", highlights: ["Azulejo facades", "Composition tips", "Hidden corners"], included: ["Guide", "Tips PDF", "Best spots"] },
    { title: "Foz do Douro Coastal Bike Ride", category: "Adventure", price: 34, duration: 180, description: "Cycle from the river mouth along the Atlantic boardwalk to the lighthouses of Foz do Douro.", highlights: ["Atlantic boardwalk", "Lighthouses", "Sea breeze"], included: ["Bike & helmet", "Guide", "Water"] },
    { title: "Sunset Rabelo Boat Sailing", category: "Water Sports", price: 38, duration: 90, description: "Sail a restored rabelo boat at golden hour as the Ribeira facades light up along the river.", highlights: ["Golden hour", "Restored boat", "Lit facades"], included: ["Cruise", "Drink", "Skipper"] },
    { title: "Porto Rooftop & Fado Night", category: "Nightlife", price: 48, duration: 180, description: "Sip port cocktails on a rooftop before an intimate live fado performance in the old town.", highlights: ["Rooftop cocktails", "Live fado", "Old town"], included: ["Cocktail", "Show", "Guide"] },
  ]),

  ...buildBonus("tokyo", 4, 35.6762, 139.6503, [
    { title: "Tsukiji Outer Market Food Tour", category: "Food & Wine", price: 62, duration: 180, description: "Graze through the legendary Tsukiji outer market sampling fresh sushi, tamago, and matcha sweets.", highlights: ["Fresh sushi", "Tamago", "Matcha sweets"], included: ["8 tastings", "Guide", "Green tea"], featured: true },
    { title: "Shibuya & Shinjuku Night Walk", category: "Nightlife", price: 45, duration: 180, description: "Dive into Tokyo's neon nightlife crossing the famous Shibuya scramble and the lantern lit Golden Gai.", highlights: ["Shibuya scramble", "Golden Gai", "Neon streets"], included: ["Guide", "1 drink", "Snack"], featured: true },
    { title: "Senso-ji Temple & Asakusa Tour", category: "Cultural", price: 38, duration: 150, description: "Explore Tokyo's oldest temple and the traditional Nakamise shopping street in historic Asakusa.", highlights: ["Senso-ji temple", "Nakamise street", "Old Tokyo"], included: ["Guide", "Fortune draw", "Map"] },
    { title: "Mount Fuji & Hakone Scenic Day Trip", category: "Nature", price: 120, duration: 600, description: "Travel to the Fuji Five Lakes and Hakone for iconic mountain views, a lake cruise, and hot spring towns.", highlights: ["Mount Fuji views", "Lake cruise", "Hot spring town"], included: ["Transport", "Cruise", "Guide"] },
    { title: "Sushi Making Class with Chef", category: "Food & Wine", price: 72, duration: 150, description: "Roll and shape your own nigiri and maki under the guidance of a professional Tokyo sushi chef.", highlights: ["Hands-on nigiri", "Pro chef", "Eat your work"], included: ["Ingredients", "Apron", "Meal"] },
    { title: "Akihabara Anime & Retro Gaming Tour", category: "Cultural", price: 40, duration: 150, description: "Geek out in Akihabara's towers of anime, retro arcades, and collectible shops with an insider guide.", highlights: ["Retro arcades", "Anime towers", "Hidden shops"], included: ["Guide", "Arcade tokens", "Map"] },
    { title: "Meiji Shrine & Harajuku Walk", category: "Cultural", price: 34, duration: 150, description: "Find calm in the forested Meiji Shrine then dive into the playful street fashion of Harajuku.", highlights: ["Forest shrine", "Harajuku fashion", "Takeshita street"], included: ["Guide", "Crepe stop", "Map"] },
    { title: "teamLab Digital Art Experience", category: "Cultural", price: 50, duration: 150, description: "Step inside an immersive world of interactive light and digital art at one of Tokyo's teamLab museums.", highlights: ["Immersive light", "Interactive rooms", "Photo magic"], included: ["Entry", "Guide intro", "Locker"], featured: true },

    { title: "Onsen & Zen Wellness Retreat", category: "Wellness", price: 68, duration: 150, description: "Soak in a traditional hot-spring onsen and join a guided Zen meditation for a deeply restorative, slow-paced afternoon away from the neon rush.", highlights: ["Hot-spring onsen", "Zen meditation", "Tea service"], included: ["Onsen access", "Towel set", "Green tea"], featured: true },
    { title: "Morning Tea Ceremony & Meditation", category: "Wellness", price: 30, duration: 90, description: "Take part in a serene Japanese tea ceremony followed by a short mindfulness session in a tatami tea house, a calm, budget-friendly cultural pause.", highlights: ["Matcha ceremony", "Mindfulness", "Tatami tea house"], included: ["Tea & sweets", "Host", "Kimono option"] },
    { title: "Yanaka Old Town Heritage Stroll", category: "Cultural", price: 25, duration: 150, description: "Wander the lantern-lit lanes of Yanaka, one of the few districts to survive old Tokyo intact, with temples, craft shops, and a sleepy cat-filled charm.", highlights: ["Old Tokyo lanes", "Craft shops", "Hidden temples"], included: ["Guide", "Sweet tasting", "Map"] },
    { title: "Odaiba Bay Kayak & Skyline Paddle", category: "Water Sports", price: 52, duration: 120, description: "Paddle the calm waters of Tokyo Bay with the Rainbow Bridge and waterfront skyline rising around you, an easy outdoor escape suitable for beginners.", highlights: ["Tokyo Bay", "Rainbow Bridge", "Skyline views"], included: ["Kayak & gear", "Instructor", "Locker"] },
  ]),

  ...buildBonus("marrakech", 5, 31.6295, -7.9811, [
    { title: "Jemaa el-Fnaa Night Food Tour", category: "Food & Wine", price: 42, duration: 180, description: "Feast through the legendary night market sampling tagine, grilled skewers, and sweet mint tea.", highlights: ["Night market", "Grilled skewers", "Mint tea"], included: ["7 tastings", "Guide", "Tea"], featured: true },
    { title: "Majorelle Garden & YSL Museum", category: "Cultural", price: 38, duration: 150, description: "Stroll the cobalt blue Majorelle Garden and the Yves Saint Laurent museum in a peaceful oasis.", highlights: ["Cobalt garden", "YSL museum", "Exotic plants"], included: ["Entry", "Guide", "Map"], featured: true },
    { title: "Atlas Mountains & Berber Villages", category: "Adventure", price: 65, duration: 480, description: "Drive into the High Atlas to hike past waterfalls and share mint tea in a traditional Berber village.", highlights: ["High Atlas", "Berber village", "Mountain waterfalls"], included: ["Transport", "Guide", "Lunch"], difficulty: "Moderate" },
    { title: "Agafay Desert Camel Sunset", category: "Adventure", price: 55, duration: 240, description: "Ride camels across the rocky Agafay desert at golden hour and watch the sun melt behind the Atlas.", highlights: ["Camel ride", "Desert sunset", "Atlas backdrop"], included: ["Camel", "Guide", "Tea"] },
    { title: "Moroccan Tagine Cooking Class", category: "Food & Wine", price: 48, duration: 210, description: "Shop the spice souk then cook a fragrant tagine and fresh bread in a traditional riad kitchen.", highlights: ["Spice souk", "Clay tagine", "Riad kitchen"], included: ["Market tour", "Ingredients", "Lunch"] },
    { title: "Medina Souks Guided Shopping", category: "Cultural", price: 30, duration: 150, description: "Navigate the maze of medina souks with a guide who knows the artisans behind the lanterns and rugs.", highlights: ["Artisan workshops", "Lanterns & rugs", "Bargaining tips"], included: ["Guide", "Tea", "Map"] },
    { title: "Traditional Hammam & Spa Ritual", category: "Wellness", price: 58, duration: 120, description: "Unwind in an authentic hammam with a black soap scrub and argan oil massage in a serene riad spa.", highlights: ["Steam hammam", "Black soap scrub", "Argan massage"], included: ["Hammam", "Scrub", "Massage"] },
    { title: "Bahia Palace & Saadian Tombs", category: "Cultural", price: 36, duration: 150, description: "Admire the carved cedar, zellige tiles, and hidden courtyards of Marrakech's royal palace and tombs.", highlights: ["Bahia Palace", "Saadian Tombs", "Zellige tiles"], included: ["Entry", "Guide", "Map"] },
    { title: "Hot Air Balloon Over the Palmeraie", category: "Adventure", price: 180, duration: 240, description: "Float silently above the palm groves and desert plains at dawn with the Atlas peaks on the horizon.", highlights: ["Dawn flight", "Palm groves", "Atlas horizon"], included: ["Flight", "Breakfast", "Transfer"], difficulty: "Easy" },
  ]),

  ...buildBonus("amalfi-coast", 6, 40.6333, 14.6029, [
    { title: "Positano & Amalfi Boat Day", category: "Water Sports", price: 110, duration: 360, description: "Cruise the postcard coastline stopping to swim in hidden coves and explore Positano and Amalfi town.", highlights: ["Hidden coves", "Positano stop", "Swim breaks"], included: ["Boat", "Drinks", "Snorkel gear"], featured: true },
    { title: "Path of the Gods Guided Hike", category: "Adventure", price: 50, duration: 300, description: "Walk the legendary clifftop trail high above the sea with sweeping views toward Capri.", highlights: ["Clifftop trail", "Capri views", "Lemon terraces"], included: ["Guide", "Transport", "Snack"], difficulty: "Moderate", featured: true },
    { title: "Limoncello & Lemon Grove Tour", category: "Food & Wine", price: 40, duration: 120, description: "Visit a terraced lemon grove to learn how the giant Amalfi lemons become silky homemade limoncello.", highlights: ["Lemon grove", "Limoncello tasting", "Family farm"], included: ["Tour", "Tasting", "Snack"] },
    { title: "Ravello Gardens & Villa Walk", category: "Cultural", price: 44, duration: 180, description: "Wander the romantic terraced gardens of Villa Rufolo and Villa Cimbrone high above the coast.", highlights: ["Villa Rufolo", "Infinity terrace", "Sea panorama"], included: ["Entry", "Guide", "Map"] },
    { title: "Capri Island Private Boat Tour", category: "Water Sports", price: 160, duration: 420, description: "Sail to glamorous Capri to circle the Faraglioni rocks and glide into glowing sea grottoes.", highlights: ["Faraglioni rocks", "Sea grottoes", "Capri town"], included: ["Boat", "Skipper", "Drinks"] },
    { title: "Amalfi Coast Cooking Class", category: "Food & Wine", price: 75, duration: 210, description: "Make fresh pasta and a classic seafood dish with a local nonna using produce from the coastal hills.", highlights: ["Fresh pasta", "Seafood dish", "Sea view kitchen"], included: ["Ingredients", "Recipes", "Lunch"] },
    { title: "Sorrento Sunset Aperitivo Cruise", category: "Water Sports", price: 70, duration: 150, description: "Toast the sunset with prosecco and local bites on a relaxed cruise along the Sorrento peninsula.", highlights: ["Sunset cruise", "Prosecco", "Coastal views"], included: ["Cruise", "Aperitivo", "Drinks"] },
    { title: "Pompeii & Vesuvius Day Trip", category: "Cultural", price: 95, duration: 480, description: "Explore the frozen Roman city of Pompeii then climb to the steaming crater rim of Mount Vesuvius.", highlights: ["Pompeii ruins", "Vesuvius crater", "Bay views"], included: ["Transport", "Guide", "Entries"], difficulty: "Moderate" },
    { title: "Scuba Diving in the Marine Park", category: "Water Sports", price: 90, duration: 180, description: "Discover the protected reefs and seagrass meadows of the Punta Campanella marine reserve.", highlights: ["Protected reef", "Marine life", "Clear water"], included: ["Gear", "Instructor", "Boat"], difficulty: "Moderate" },
    { title: "Coastal Drive Vintage Vespa Tour", category: "Adventure", price: 85, duration: 240, description: "Wind along the famous Amalfi road on a classic Vespa with photo stops at the best panoramic curves.", highlights: ["Classic Vespa", "Panoramic curves", "Photo stops"], included: ["Vespa", "Helmet", "Guide"] },
  ]),
];

const REVIEW_COMMENTS = [
  "Absolutely incredible experience! The guide was knowledgeable and the views were stunning.",
  "Best activity of our entire trip. Worth every penny.",
  "Very well organized. Great small group size, felt personal and special.",
  "Amazing sunset, wonderful host. Highly recommend to anyone visiting.",
  "We had such a fantastic time. The food was divine and the atmosphere magical.",
  "Exceeded all expectations. A must-do experience!",
  "Perfect for couples. Romantic, well-paced, and beautifully organized.",
  "Our guide was passionate and made history come alive. Loved every minute.",
  "Beautiful scenery and a truly unique experience. Would do it again!",
  "Great value for money. The team was professional and the itinerary was perfect.",
  "One of the highlights of our vacation. Can't recommend enough.",
  "Unforgettable experience. The attention to detail was impressive.",
  "Such a special way to explore the area. Felt like a VIP the whole time.",
  "The combination of adventure and culture made this perfect.",
  "We've done similar tours elsewhere, but this was the best by far.",
];

async function main() {
  console.log("🌱 Seeding Voyagio database...\n");

  console.log("  Clearing existing data...");
  await prisma.tripActivity.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  console.log("  Creating users...");
  const passwordHash = await bcrypt.hash("voyagio123", 10);

  const createdUsers = [];
  for (const u of USERS) {
    const user = await prisma.user.create({
      data: {
        email: u.email,
        passwordHash,
        name: u.name,
        role: u.role,
        bio: u.bio,
        preferences: u.preferences,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}&backgroundColor=1B4965`,
      },
    });
    createdUsers.push(user);
  }
  console.log(`    ✓ ${createdUsers.length} users created`);

  const operators = createdUsers.filter((u) => u.role === "OPERATOR");
  const tourists = createdUsers.filter((u) => u.role === "TOURIST");

  console.log("  Creating destinations...");
  const createdDestinations: Record<string, string> = {};
  for (const d of DESTINATIONS) {
    const dest = await prisma.destination.create({ data: d });
    createdDestinations[d.slug] = dest.id;
  }
  console.log(`    ✓ ${DESTINATIONS.length} destinations created`);

  console.log("  Creating activities...");
  const createdActivities: { id: string; slug: string; price: number; dest: string }[] = [];

  for (const a of [...ACTIVITIES, ...BONUS_ACTIVITIES]) {
    const actSlug = slug(a.title);
    const operatorId = operators[a.op - 1].id;

    const activity = await prisma.activity.create({
      data: {
        title: a.title,
        slug: actSlug,
        description: a.description,
        category: a.category,
        price: a.price,
        duration: a.duration,
        difficulty: a.difficulty || null,
        maxGroupSize: a.maxGroupSize,
        images: json(a.images),
        latitude: a.latitude,
        longitude: a.longitude,
        included: json(a.included),
        highlights: json(a.highlights),
        featured: a.featured,
        status: "ACTIVE",
        rating: 0,
        reviewCount: 0,
        destinationId: createdDestinations[a.dest],
        operatorId,
      },
    });
    createdActivities.push({ id: activity.id, slug: actSlug, price: a.price, dest: a.dest });
  }
  console.log(`    ✓ ${createdActivities.length} activities created`);

  console.log("  Creating time slots...");
  let slotCount = 0;
  const timeOptions = [
    { start: "08:00", end: "11:00" },
    { start: "09:00", end: "12:00" },
    { start: "09:30", end: "13:00" },
    { start: "10:00", end: "13:00" },
    { start: "14:00", end: "17:00" },
    { start: "15:00", end: "18:00" },
    { start: "16:00", end: "19:00" },
    { start: "16:30", end: "19:30" },
    { start: "18:00", end: "21:00" },
    { start: "19:00", end: "22:00" },
    { start: "20:00", end: "22:30" },
  ];

  const allSlotIds: { slotId: string; activityIdx: number }[] = [];

  for (let i = 0; i < createdActivities.length; i++) {
    const act = createdActivities[i];

    const numDays = randomBetween(20, 40);
    const dayOffsets = new Set<number>();
    while (dayOffsets.size < numDays) {
      dayOffsets.add(randomBetween(1, 85));
    }

    for (const offset of Array.from(dayOffsets)) {
      const date = daysFromNow(offset);

      const slotsPerDay = randomBetween(1, 3);
      const usedSlots = new Set<number>();

      for (let s = 0; s < slotsPerDay; s++) {
        let timeIdx: number;
        do {
          timeIdx = randomBetween(0, timeOptions.length - 1);
        } while (usedSlots.has(timeIdx));
        usedSlots.add(timeIdx);

        const time = timeOptions[timeIdx];
        const capacity = randomBetween(8, 20);
        const bookedCount = randomBetween(0, Math.floor(capacity * 0.7));

        const slot = await prisma.timeSlot.create({
          data: {
            date,
            startTime: time.start,
            endTime: time.end,
            capacity,
            bookedCount,
            status: bookedCount >= capacity ? "FULL" : "AVAILABLE",
            activityId: act.id,
          },
        });
        allSlotIds.push({ slotId: slot.id, activityIdx: i });
        slotCount++;
      }
    }
  }
  console.log(`    ✓ ${slotCount} time slots created`);

  console.log("  Creating bookings...");
  let bookingCount = 0;
  const createdBookings: { id: string; userId: string; activityId: string; status: string }[] = [];

  for (let b = 0; b < 80; b++) {
    const tourist = tourists[b % tourists.length];
    const slotInfo = allSlotIds[randomBetween(0, allSlotIds.length - 1)];
    const act = createdActivities[slotInfo.activityIdx];
    const participants = randomBetween(1, 4);
    const status = b < 50 ? "COMPLETED" : b < 70 ? "CONFIRMED" : "CANCELLED";

    const booking = await prisma.booking.create({
      data: {
        participants,
        totalPrice: act.price * participants,
        status,
        userId: tourist.id,
        activityId: act.id,
        timeSlotId: slotInfo.slotId,
        notes: status === "COMPLETED" ? null : "Looking forward to this!",
      },
    });
    createdBookings.push({ id: booking.id, userId: tourist.id, activityId: act.id, status });
    bookingCount++;
  }
  console.log(`    ✓ ${bookingCount} bookings created`);

  console.log("  Creating reviews...");
  let reviewCount = 0;
  const completedBookings = createdBookings.filter((b) => b.status === "COMPLETED");

  const activityRatings: Record<string, { sum: number; count: number }> = {};

  for (let r = 0; r < completedBookings.length; r++) {
    const booking = completedBookings[r];
    const rating = randomBetween(3, 5);
    const comment = REVIEW_COMMENTS[r % REVIEW_COMMENTS.length];

    await prisma.review.create({
      data: {
        rating,
        comment,
        userId: booking.userId,
        activityId: booking.activityId,
        bookingId: booking.id,
      },
    });

    if (!activityRatings[booking.activityId]) {
      activityRatings[booking.activityId] = { sum: 0, count: 0 };
    }
    activityRatings[booking.activityId].sum += rating;
    activityRatings[booking.activityId].count++;
    reviewCount++;
  }

  for (const [actId, data] of Object.entries(activityRatings)) {
    await prisma.activity.update({
      where: { id: actId },
      data: {
        rating: Math.round((data.sum / data.count) * 10) / 10,
        reviewCount: data.count,
      },
    });
  }
  console.log(`    ✓ ${reviewCount} reviews created & ratings updated`);

  console.log("  Creating favorites...");
  let favCount = 0;
  const favSet = new Set<string>();

  for (const tourist of tourists) {

    const numFavs = randomBetween(4, 6);
    for (let f = 0; f < numFavs; f++) {
      const act = createdActivities[randomBetween(0, createdActivities.length - 1)];
      const key = `${tourist.id}-${act.id}`;
      if (favSet.has(key)) continue;
      favSet.add(key);

      await prisma.favorite.create({
        data: { userId: tourist.id, activityId: act.id },
      });
      favCount++;
    }
  }
  console.log(`    ✓ ${favCount} favorites created`);

  console.log("  Creating sample trips...");

  const lisbonActivities = createdActivities.filter((a) => a.dest === "lisbon");
  const trip1 = await prisma.trip.create({
    data: {
      name: "3 Days in Lisbon",
      startDate: daysFromNow(5),
      endDate: daysFromNow(8),
      budget: 250,
      status: "PLANNING",
      userId: tourists[0].id,
      destinationId: createdDestinations["lisbon"],
    },
  });

  const trip1Activities = lisbonActivities.slice(0, 5);
  const trip1Plan = [
    { dayNumber: 1, activities: trip1Activities.slice(0, 2) },
    { dayNumber: 2, activities: trip1Activities.slice(2, 4) },
    { dayNumber: 3, activities: trip1Activities.slice(4, 5) },
  ];
  for (const day of trip1Plan) {
    for (let i = 0; i < day.activities.length; i++) {
      await prisma.tripActivity.create({
        data: {
          dayNumber: day.dayNumber,
          orderIndex: i,
          startTime: i === 0 ? "09:00" : "15:00",
          tripId: trip1.id,
          activityId: day.activities[i].id,
        },
      });
    }
  }

  const santoriniActivities = createdActivities.filter((a) => a.dest === "santorini");
  const trip2 = await prisma.trip.create({
    data: {
      name: "Santorini Romantic Getaway",
      startDate: daysFromNow(12),
      endDate: daysFromNow(16),
      budget: 400,
      status: "PLANNING",
      userId: tourists[1].id,
      destinationId: createdDestinations["santorini"],
    },
  });

  const trip2Activities = santoriniActivities.slice(0, 4);
  for (let i = 0; i < trip2Activities.length; i++) {
    await prisma.tripActivity.create({
      data: {
        dayNumber: Math.floor(i / 2) + 1,
        orderIndex: i % 2,
        startTime: i % 2 === 0 ? "10:00" : "16:00",
        tripId: trip2.id,
        activityId: trip2Activities[i].id,
      },
    });
  }

  const barcelonaActivities = createdActivities.filter((a) => a.dest === "barcelona");
  const trip3 = await prisma.trip.create({
    data: {
      name: "Barcelona Family Adventure",
      startDate: daysFromNow(20),
      endDate: daysFromNow(24),
      budget: 500,
      status: "PLANNING",
      userId: tourists[2].id,
      destinationId: createdDestinations["barcelona"],
    },
  });

  const trip3Activities = barcelonaActivities.slice(0, 5);
  for (let i = 0; i < trip3Activities.length; i++) {
    await prisma.tripActivity.create({
      data: {
        dayNumber: Math.floor(i / 2) + 1,
        orderIndex: i % 2,
        startTime: i % 2 === 0 ? "09:30" : "14:30",
        tripId: trip3.id,
        activityId: trip3Activities[i].id,
      },
    });
  }

  console.log("    ✓ 3 sample trips created with itineraries");

  console.log("\n🎉 Seed completed successfully!\n");
  console.log("  Demo credentials:");
  console.log("  ┌──────────────────┬──────────────────────────┬──────────────┐");
  console.log("  │ Role             │ Email                    │ Password     │");
  console.log("  ├──────────────────┼──────────────────────────┼──────────────┤");
  console.log("  │ Tourist          │ tourist@voyagio.com      │ voyagio123   │");
  console.log("  │ Operator         │ operator@voyagio.com     │ voyagio123   │");
  console.log("  │ Admin            │ admin@voyagio.com        │ voyagio123   │");
  console.log("  └──────────────────┴──────────────────────────┴──────────────┘\n");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
