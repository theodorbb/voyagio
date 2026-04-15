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

// ──────────────────────────────────────────────────────────
// Helper
// ──────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────
// USERS
// ──────────────────────────────────────────────────────────

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
  // Additional operators for new destinations
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
  // Additional tourists
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
];

// ──────────────────────────────────────────────────────────
// DESTINATIONS
// ──────────────────────────────────────────────────────────

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
];

// ──────────────────────────────────────────────────────────
// ACTIVITIES  — 6-7 per destination = ~32 total
// ──────────────────────────────────────────────────────────

interface ActivitySeed {
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number; // minutes
  difficulty?: string;
  maxGroupSize: number;
  images: string[];
  latitude: number;
  longitude: number;
  included: string[];
  highlights: string[];
  featured: boolean;
  dest: string; // destination slug
  op: number; // operator index
}

const ACTIVITIES: ActivitySeed[] = [
  // ── Lisbon (operator: Carlos Mendes, index 1) ──────────
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

  // ── Santorini (operator: Maria Konstantinou, index 2) ──
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

  // ── Barcelona (operator: Jordi Puig, index 3) ──────────
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

  // ── Bali (operator: Carlos Mendes, index 1 — diversified) ──
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

  // ── Porto (operator: Carlos Mendes, index 1) ───────────
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

  // ── Tokyo (operator: Yuki Tanaka, index 4) ─────────────
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

  // ── Marrakech (operator: Hassan El Fassi, index 5) ─────
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

  // ── Amalfi Coast (operator: Giulia Romano, index 6) ────
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
];

// ──────────────────────────────────────────────────────────
// REVIEWS
// ──────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────
// MAIN SEED FUNCTION
// ──────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding Voyagio database...\n");

  // ── Clear existing data (order matters for FK constraints) ──
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

  // ── 1. Users ─────────────────────────────────────────────
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

  // ── 2. Destinations ──────────────────────────────────────
  console.log("  Creating destinations...");
  const createdDestinations: Record<string, string> = {};
  for (const d of DESTINATIONS) {
    const dest = await prisma.destination.create({ data: d });
    createdDestinations[d.slug] = dest.id;
  }
  console.log(`    ✓ ${DESTINATIONS.length} destinations created`);

  // ── 3. Activities ────────────────────────────────────────
  console.log("  Creating activities...");
  const createdActivities: { id: string; slug: string; price: number; dest: string }[] = [];

  for (const a of ACTIVITIES) {
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

  // ── 4. Time Slots (next 30 days, 3-5 slots per activity) ──
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
    // Each activity gets slots on 10-20 days across next 30 days
    const numDays = randomBetween(10, 20);
    const dayOffsets = new Set<number>();
    while (dayOffsets.size < numDays) {
      dayOffsets.add(randomBetween(1, 30));
    }

    for (const offset of Array.from(dayOffsets)) {
      const date = daysFromNow(offset);
      // 1-2 slots per day
      const slotsPerDay = randomBetween(1, 2);
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

  // ── 5. Bookings ──────────────────────────────────────────
  console.log("  Creating bookings...");
  let bookingCount = 0;
  const createdBookings: { id: string; userId: string; activityId: string; status: string }[] = [];

  // Create ~80 bookings spread across tourists
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

  // ── 6. Reviews (for completed bookings) ──────────────────
  console.log("  Creating reviews...");
  let reviewCount = 0;
  const completedBookings = createdBookings.filter((b) => b.status === "COMPLETED");

  // Track which activities got reviews to update ratings
  const activityRatings: Record<string, { sum: number; count: number }> = {};

  for (let r = 0; r < completedBookings.length; r++) {
    const booking = completedBookings[r];
    const rating = randomBetween(3, 5); // Realistic: mostly good ratings
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

  // Update activity ratings
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

  // ── 7. Favorites ─────────────────────────────────────────
  console.log("  Creating favorites...");
  let favCount = 0;
  const favSet = new Set<string>();

  for (const tourist of tourists) {
    // Each tourist favorites 4-6 random activities
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

  // ── 8. Trips ─────────────────────────────────────────────
  console.log("  Creating sample trips...");

  // Trip 1: Sarah's Lisbon trip
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

  // Place activities across 3 days
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

  // Trip 2: James's Santorini romantic trip
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

  // Trip 3: Emily's Barcelona family trip
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

  // ── Summary ──────────────────────────────────────────────
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
