import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface IncomingActivity {
  id: string;
  startTime?: string | null;
  timeOfDay?: string | null;
}

interface IncomingDay {
  dayNumber: number;
  activities: IncomingActivity[];
}

async function getOwnedTrip(tripId: string, userId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { id: true, userId: true, destinationId: true },
  });
  if (!trip || trip.userId !== userId) return null;
  return trip;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    include: {
      destination: {
        select: { name: true, slug: true, country: true, coverImage: true },
      },
      activities: {
        orderBy: [{ dayNumber: "asc" }, { orderIndex: "asc" }],
        include: { activity: true },
      },
    },
  });

  if (!trip || trip.userId !== session.user.id) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  return NextResponse.json({ trip });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trip = await getOwnedTrip(params.id, session.user.id);
  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  const body = await req.json();
  const itinerary = body?.itinerary as IncomingDay[] | undefined;

  if (!Array.isArray(itinerary)) {
    return NextResponse.json(
      { error: "itinerary array is required" },
      { status: 400 }
    );
  }

  const validActivities = await prisma.activity.findMany({
    where: { destinationId: trip.destinationId, status: "ACTIVE" },
    select: { id: true, price: true },
  });
  const priceById = new Map(validActivities.map((a) => [a.id, a.price]));

  const rows: Array<{
    dayNumber: number;
    orderIndex: number;
    startTime: string | null;
    timeOfDay: string | null;
    activityId: string;
  }> = [];
  let estimatedCost = 0;
  const invalidActivityIds: string[] = [];
  const duplicateActivityIds: string[] = [];
  const seenIds = new Set<string>();

  for (const day of itinerary) {
    if (
      typeof day.dayNumber !== "number" ||
      day.dayNumber < 1 ||
      !Array.isArray(day.activities)
    ) {
      return NextResponse.json(
        { error: "Invalid day structure." },
        { status: 400 }
      );
    }
    day.activities.forEach((act, index) => {
      const id = act?.id;
      if (!id || !priceById.has(id)) {
        invalidActivityIds.push(id || "(missing id)");
        return;
      }
      if (seenIds.has(id)) {
        duplicateActivityIds.push(id);
        return;
      }
      seenIds.add(id);
      rows.push({
        dayNumber: day.dayNumber,
        orderIndex: index,
        startTime: act.startTime ?? null,
        timeOfDay: act.timeOfDay ?? null,
        activityId: id,
      });
      estimatedCost += priceById.get(id) ?? 0;
    });
  }

  if (invalidActivityIds.length > 0) {
    return NextResponse.json(
      {
        error:
          "Some activities are not available for this destination and cannot be saved.",
        invalidActivityIds,
      },
      { status: 400 }
    );
  }

  if (duplicateActivityIds.length > 0) {
    return NextResponse.json(
      {
        error: "An activity cannot appear more than once in the itinerary.",
        duplicateActivityIds,
      },
      { status: 400 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.tripActivity.deleteMany({ where: { tripId: trip.id } });
    if (rows.length > 0) {
      await tx.tripActivity.createMany({
        data: rows.map((r) => ({ ...r, tripId: trip.id })),
      });
    }
    await tx.trip.update({
      where: { id: trip.id },
      data: { budget: estimatedCost },
    });
  });

  return NextResponse.json({
    success: true,
    estimatedCost,
    totalActivities: rows.length,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trip = await getOwnedTrip(params.id, session.user.id);
  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  await prisma.trip.delete({ where: { id: trip.id } });

  return NextResponse.json({ success: true });
}
