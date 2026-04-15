import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { TripDetailClient } from "./client";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    select: { name: true },
  });
  return { title: trip ? `${trip.name} | Voyagio` : "Trip | Voyagio" };
}

export default async function TripDetailPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    include: {
      destination: {
        select: { name: true, slug: true, country: true, coverImage: true, latitude: true, longitude: true },
      },
      activities: {
        orderBy: [{ dayNumber: "asc" }, { orderIndex: "asc" }],
        include: {
          activity: {
            select: {
              id: true,
              title: true,
              slug: true,
              category: true,
              price: true,
              currency: true,
              duration: true,
              rating: true,
              reviewCount: true,
              difficulty: true,
              images: true,
              description: true,
              latitude: true,
              longitude: true,
            },
          },
        },
      },
    },
  });

  if (!trip || trip.userId !== user.id) notFound();

  // Parse preferences
  let preferences: Record<string, unknown> = {};
  if (trip.preferences) {
    try { preferences = JSON.parse(trip.preferences); } catch { /* ignore */ }
  }

  // Group activities by day
  const dayMap: Record<number, Array<{
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
    description: string;
    timeOfDay: string | null;
    startTime: string | null;
    latitude: number;
    longitude: number;
  }>> = {};

  for (const ta of trip.activities) {
    if (!dayMap[ta.dayNumber]) dayMap[ta.dayNumber] = [];
    dayMap[ta.dayNumber].push({
      ...ta.activity,
      timeOfDay: ta.timeOfDay,
      startTime: ta.startTime,
    });
  }

  const days = Math.round(
    (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const itinerary = [];
  for (let d = 1; d <= days; d++) {
    itinerary.push({ dayNumber: d, activities: dayMap[d] || [] });
  }

  const totalActivities = trip.activities.length;
  const estimatedCost = trip.activities.reduce(
    (sum: number, ta: typeof trip.activities[number]) => sum + ta.activity.price,
    0
  );
  const totalDuration = trip.activities.reduce(
    (sum: number, ta: typeof trip.activities[number]) => sum + ta.activity.duration,
    0
  );

  return (
    <TripDetailClient
      trip={{
        id: trip.id,
        name: trip.name,
        summary: trip.summary,
        status: trip.status,
        budget: trip.budget,
        startDate: trip.startDate.toISOString(),
        endDate: trip.endDate.toISOString(),
        destination: trip.destination,
        preferences,
        days,
        itinerary,
        estimatedCost,
        totalActivities,
        totalDuration,
      }}
    />
  );
}
