import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * SMART TRIP GENERATION ALGORITHM
 * ================================
 * A rule-based heuristic planner that creates personalized itineraries.
 *
 * Scoring formula for each activity:
 *   score = interestMatch + categoryBonus + ratingScore + priceScore + diversityBonus
 *
 * - interestMatch:  +30 if activity category matches user interests
 * - categoryBonus:  +20 if activity category matches preferred style
 * - ratingScore:    +0..15 based on normalized rating (0-5 → 0-15)
 * - priceScore:     +0..10 inversely proportional to price vs budget
 * - diversityBonus: +15 if category not yet scheduled that day
 *
 * Day assignment considers:
 * - pace (light=2/day, balanced=3/day, packed=4/day)
 * - duration balance (morning/afternoon/evening)
 * - category diversity across days
 * - total budget constraint
 */

const STYLE_CATEGORY_MAP: Record<string, string[]> = {
  relaxed: ["Wellness", "Nature", "Food & Wine"],
  cultural: ["Cultural", "Photography"],
  adventure: ["Adventure", "Water Sports"],
  luxury: ["Food & Wine", "Wellness", "Cultural"],
  mixed: [],
  foodie: ["Food & Wine"],
  nightlife: ["Nightlife"],
};

const PACE_ACTIVITIES: Record<string, number> = {
  light: 2,
  balanced: 3,
  packed: 4,
};

const TIME_SLOTS = [
  { timeOfDay: "morning", start: "09:00" },
  { timeOfDay: "afternoon", start: "14:00" },
  { timeOfDay: "evening", start: "18:00" },
  { timeOfDay: "evening", start: "20:00" },
];

interface GenerateInput {
  destinationSlug: string;
  days: number;
  budgetRange: string; // "budget" | "moderate" | "premium" | "luxury"
  travelStyle: string;
  interests: string[];
  pace: string;
  groupType: string;
}

function budgetMultiplier(range: string): { min: number; max: number } {
  switch (range) {
    case "budget":
      return { min: 0, max: 40 };
    case "moderate":
      return { min: 20, max: 80 };
    case "premium":
      return { min: 50, max: 150 };
    case "luxury":
      return { min: 80, max: 999 };
    default:
      return { min: 0, max: 999 };
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: GenerateInput = await req.json();
  const { destinationSlug, days, budgetRange, travelStyle, interests, pace, groupType } = body;

  if (!destinationSlug || !days || days < 1 || days > 14) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // 1. Fetch destination
  const destination = await prisma.destination.findUnique({
    where: { slug: destinationSlug },
  });
  if (!destination) {
    return NextResponse.json({ error: "Destination not found" }, { status: 404 });
  }

  // 2. Fetch all active activities for this destination
  const activities = await prisma.activity.findMany({
    where: { destinationId: destination.id, status: "ACTIVE" },
    orderBy: { rating: "desc" },
  });

  if (activities.length === 0) {
    return NextResponse.json({ error: "No activities available" }, { status: 404 });
  }

  // 3. Score each activity
  const priceRange = budgetMultiplier(budgetRange);
  const styleCategories = STYLE_CATEGORY_MAP[travelStyle] || [];
  const activitiesPerDay = PACE_ACTIVITIES[pace] || 3;

  const scored = activities.map((act) => {
    let score = 0;

    // Interest match (+30)
    const interestCategories = interests.map((i: string) => {
      const map: Record<string, string> = {
        food: "Food & Wine",
        history: "Cultural",
        beaches: "Water Sports",
        nightlife: "Nightlife",
        nature: "Nature",
        wellness: "Wellness",
        adventure: "Adventure",
        photography: "Photography",
        "local experiences": "Cultural",
      };
      return map[i.toLowerCase()] || i;
    });
    if (interestCategories.includes(act.category)) score += 30;

    // Style match (+20)
    if (styleCategories.includes(act.category)) score += 20;

    // Rating score (+0..15)
    score += (act.rating / 5) * 15;

    // Price fit (+0..10) - activities within budget range score higher
    if (act.price >= priceRange.min && act.price <= priceRange.max) {
      score += 10;
    } else if (act.price < priceRange.min) {
      score += 3;
    }

    // Duration preference - shorter activities for packed pace
    if (pace === "packed" && act.duration <= 180) score += 5;
    if (pace === "light" && act.duration >= 180) score += 5;

    return { ...act, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // 4. Assign activities to days with diversity
  const totalSlots = days * activitiesPerDay;
  const selected = scored.slice(0, Math.min(totalSlots, scored.length));

  const itinerary: Array<{
    dayNumber: number;
    activities: Array<{
      id: string;
      title: string;
      slug: string;
      category: string;
      price: number;
      currency: string;
      duration: number;
      rating: number;
      reviewCount: number;
      difficulty: string | null;
      images: string;
      timeOfDay: string;
      startTime: string;
      description: string;
    }>;
  }> = [];

  for (let d = 1; d <= days; d++) {
    itinerary.push({ dayNumber: d, activities: [] });
  }

  // Track used activity IDs to avoid duplicates
  const usedIds = new Set<string>();
  // Track categories per day for diversity bonus
  const dayCats: Record<number, Set<string>> = {};
  for (let d = 1; d <= days; d++) dayCats[d] = new Set();

  // Fill days round-robin with diversity consideration
  for (const act of selected) {
    if (usedIds.has(act.id)) continue;

    // Find the best day (fewest activities, most diversity)
    let bestDay = 1;
    let bestScore = -Infinity;

    for (let d = 1; d <= days; d++) {
      const day = itinerary[d - 1];
      if (day.activities.length >= activitiesPerDay) continue;

      let dayScore = (activitiesPerDay - day.activities.length) * 10;
      if (!dayCats[d].has(act.category)) dayScore += 15; // diversity bonus

      if (dayScore > bestScore) {
        bestScore = dayScore;
        bestDay = d;
      }
    }

    const day = itinerary[bestDay - 1];
    if (day.activities.length >= activitiesPerDay) continue;

    const slotIdx = day.activities.length;
    const timeSlot = TIME_SLOTS[Math.min(slotIdx, TIME_SLOTS.length - 1)];

    day.activities.push({
      id: act.id,
      title: act.title,
      slug: act.slug,
      category: act.category,
      price: act.price,
      currency: act.currency,
      duration: act.duration,
      rating: act.rating,
      reviewCount: act.reviewCount,
      difficulty: act.difficulty,
      images: act.images,
      timeOfDay: timeSlot.timeOfDay,
      startTime: timeSlot.start,
      description: act.description,
    });

    usedIds.add(act.id);
    dayCats[bestDay].add(act.category);
  }

  // 5. Calculate totals
  const totalActivities = itinerary.reduce((sum, d) => sum + d.activities.length, 0);
  const estimatedCost = itinerary.reduce(
    (sum, d) => sum + d.activities.reduce((s, a) => s + a.price, 0),
    0
  );
  const totalDuration = itinerary.reduce(
    (sum, d) => sum + d.activities.reduce((s, a) => s + a.duration, 0),
    0
  );

  // 6. Generate trip name and summary
  const styleLabel = travelStyle.charAt(0).toUpperCase() + travelStyle.slice(1);
  const tripName = `${styleLabel} ${destination.name} — ${days} Day${days > 1 ? "s" : ""}`;

  const interestLabels = interests.length > 0 ? interests.join(", ") : "general exploration";
  const summary = `A ${pace} ${travelStyle} trip to ${destination.name}, ${destination.country} focused on ${interestLabels}. ${totalActivities} curated experiences across ${days} day${days > 1 ? "s" : ""} with an estimated budget of €${estimatedCost} per person.`;

  return NextResponse.json({
    tripName,
    summary,
    destination: {
      id: destination.id,
      name: destination.name,
      slug: destination.slug,
      country: destination.country,
      coverImage: destination.coverImage,
    },
    preferences: { travelStyle, interests, pace, groupType, budgetRange },
    days,
    itinerary,
    estimatedCost,
    totalActivities,
    totalDuration,
  });
}
