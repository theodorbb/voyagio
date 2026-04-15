import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { tripName, summary, destinationId, days, preferences, itinerary } = body;

  if (!tripName || !destinationId || !days || !itinerary) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() + 7); // Default: starts in 1 week
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days - 1);

  // Calculate estimated budget
  const estimatedCost = (itinerary as Array<{ activities: Array<{ price: number }> }>).reduce(
    (sum: number, d: { activities: Array<{ price: number }> }) =>
      sum + d.activities.reduce((s: number, a: { price: number }) => s + a.price, 0),
    0
  );

  const trip = await prisma.$transaction(async (tx) => {
    const newTrip = await tx.trip.create({
      data: {
        name: tripName,
        startDate,
        endDate,
        budget: estimatedCost,
        status: "PLANNING",
        preferences: JSON.stringify(preferences),
        summary,
        userId: session.user.id,
        destinationId,
      },
    });

    // Create trip activities
    for (const day of itinerary as Array<{
      dayNumber: number;
      activities: Array<{
        id: string;
        startTime: string;
        timeOfDay: string;
      }>;
    }>) {
      for (let i = 0; i < day.activities.length; i++) {
        const act = day.activities[i];
        await tx.tripActivity.create({
          data: {
            dayNumber: day.dayNumber,
            orderIndex: i,
            startTime: act.startTime,
            timeOfDay: act.timeOfDay,
            tripId: newTrip.id,
            activityId: act.id,
          },
        });
      }
    }

    return newTrip;
  });

  return NextResponse.json({ trip }, { status: 201 });
}
