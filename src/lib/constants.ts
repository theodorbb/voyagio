import {
  MapPin,
  Compass,
  CalendarDays,
  Users,
  Star,
  TrendingUp,
  BarChart3,
  Sparkles,
  Globe,
  Mountain,
  Utensils,
  Palette,
  Waves,
  Camera,
} from "lucide-react";

export const NAV_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "Activities", href: "/activities" },
  { label: "Trip Builder", href: "/dashboard/trip-builder" },
  { label: "About", href: "/#how-it-works" },
] as const;

export const CATEGORIES = [
  { name: "Adventure", icon: Mountain, color: "#F4845F" },
  { name: "Cultural", icon: Palette, color: "#5FA8D3" },
  { name: "Food & Wine", icon: Utensils, color: "#F7B267" },
  { name: "Nature", icon: Compass, color: "#22C55E" },
  { name: "Water Sports", icon: Waves, color: "#3B82F6" },
  { name: "Photography", icon: Camera, color: "#A78BFA" },
] as const;

export const FEATURED_DESTINATIONS = [
  {
    name: "Lisbon",
    country: "Portugal",
    description: "Charming streets, golden light, and coastal adventures.",
    image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&q=80",
    activityCount: 24,
    rating: 4.8,
  },
  {
    name: "Santorini",
    country: "Greece",
    description: "Iconic sunsets, volcanic landscapes, and Aegean cuisine.",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    activityCount: 18,
    rating: 4.9,
  },
  {
    name: "Barcelona",
    country: "Spain",
    description: "Architecture, beaches, and vibrant nightlife culture.",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    activityCount: 31,
    rating: 4.7,
  },
  {
    name: "Bali",
    country: "Indonesia",
    description: "Temples, rice terraces, and tropical wellness retreats.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    activityCount: 27,
    rating: 4.8,
  },
  {
    name: "Porto",
    country: "Portugal",
    description: "Wine cellars, river cruises, and medieval wonders.",
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
    activityCount: 15,
    rating: 4.6,
  },
] as const;

export const FEATURED_ACTIVITIES = [
  {
    title: "Sunset Kayak Tour",
    destination: "Lisbon",
    category: "Adventure",
    price: 45,
    duration: "3h",
    rating: 4.9,
    reviewCount: 127,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
  },
  {
    title: "Wine Tasting Trail",
    destination: "Porto",
    category: "Food & Wine",
    price: 65,
    duration: "4h",
    rating: 4.8,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80",
  },
  {
    title: "Volcano Hiking Experience",
    destination: "Santorini",
    category: "Adventure",
    price: 55,
    duration: "5h",
    rating: 4.7,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
  },
  {
    title: "Gaudi Architecture Walk",
    destination: "Barcelona",
    category: "Cultural",
    price: 35,
    duration: "3h",
    rating: 4.9,
    reviewCount: 312,
    image: "https://images.unsplash.com/photo-1583779457711-ab081da09e6f?w=600&q=80",
  },
  {
    title: "Sacred Temple Ceremony",
    destination: "Bali",
    category: "Cultural",
    price: 40,
    duration: "2h",
    rating: 4.8,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=600&q=80",
  },
  {
    title: "Coastal Photography Tour",
    destination: "Lisbon",
    category: "Photography",
    price: 50,
    duration: "4h",
    rating: 4.6,
    reviewCount: 74,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "Solo Traveler",
    avatar: "SM",
    quote: "Voyagio transformed how I plan trips. The smart itinerary builder saved me hours of research and I discovered hidden gems I would have never found on my own.",
    rating: 5,
    destination: "Lisbon",
  },
  {
    name: "Marco Rivera",
    role: "Tour Operator",
    avatar: "MR",
    quote: "Managing bookings and schedules used to be a nightmare. Now I have full visibility into demand, capacity, and revenue — all in one dashboard.",
    rating: 5,
    destination: "Barcelona",
  },
  {
    name: "Emily & James Chen",
    role: "Traveling Couple",
    avatar: "EC",
    quote: "We planned our entire Santorini honeymoon in 15 minutes. The trip builder suggested the perfect mix of romance, adventure, and relaxation.",
    rating: 5,
    destination: "Santorini",
  },
] as const;

export const PLATFORM_STATS = [
  { label: "Active Destinations", value: "50+", icon: Globe },
  { label: "Tourism Activities", value: "1,200+", icon: Compass },
  { label: "Happy Travelers", value: "25K+", icon: Users },
  { label: "5-Star Reviews", value: "8,500+", icon: Star },
] as const;

export const OPERATOR_FEATURES = [
  {
    title: "Activity Management",
    description: "Create and manage tourism experiences with rich details, pricing tiers, and beautiful galleries.",
    icon: Compass,
  },
  {
    title: "Schedule & Capacity",
    description: "Define time slots, set capacity limits, and manage availability with a visual calendar interface.",
    icon: CalendarDays,
  },
  {
    title: "Booking Dashboard",
    description: "Track incoming reservations, manage participants, and handle booking modifications in real-time.",
    icon: Users,
  },
  {
    title: "Demand Analytics",
    description: "Understand booking patterns, peak seasons, and revenue trends with intelligent dashboards.",
    icon: TrendingUp,
  },
  {
    title: "Performance Insights",
    description: "Monitor activity ratings, occupancy rates, and traveler satisfaction scores to optimize your offers.",
    icon: BarChart3,
  },
  {
    title: "Smart Recommendations",
    description: "Get visibility into traveler preferences and market trends to create experiences people actually want.",
    icon: Sparkles,
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Discover",
    description: "Explore destinations and browse curated tourism activities filtered by your interests, budget, and travel style.",
    icon: Compass,
  },
  {
    step: 2,
    title: "Plan",
    description: "Use our smart trip builder to generate a personalized day-by-day itinerary. Drag, drop, and customize your perfect trip.",
    icon: CalendarDays,
  },
  {
    step: 3,
    title: "Book",
    description: "Reserve your chosen activities with real-time availability. Secure your spots with instant booking confirmation.",
    icon: MapPin,
  },
  {
    step: 4,
    title: "Experience",
    description: "Enjoy your crafted journey. Rate your experiences and help fellow travelers discover the best activities.",
    icon: Star,
  },
] as const;
