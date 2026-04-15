import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/operator/timeslots — list operator's time slots
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "OPERATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activityId = req.nextUrl.searchParams.get("activityId");
  const dateFrom = req.nextUrl.searchParams.get("dateFrom");

  const where: Record<string, unknown> = {
    activity: { operatorId: session.user.id },
  };

  if (activityId) {
    where.activityId = activityId;
  }
  if (dateFrom) {
    where.date = { gte: new Date(dateFrom) };
  }

  const timeSlots = await prisma.timeSlot.findMany({
    where,
    include: {
      activity: { select: { id: true, title: true, slug: true, maxGroupSize: true } },
      _count: { select: { bookings: true } },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json({
    timeSlots: timeSlots.map((ts) => ({
      id: ts.id,
      date: ts.date.toISOString(),
      startTime: ts.startTime,
      endTime: ts.endTime,
      capacity: ts.capacity,
      bookedCount: ts.bookedCount,
      status: ts.status,
      activity: ts.activity,
      bookingCount: ts._count.bookings,
      utilization: ts.capacity > 0 ? Math.round((ts.bookedCount / ts.capacity) * 100) : 0,
    })),
  });
}

// POST /api/operator/timeslots — create time slots (supports bulk creation)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "OPERATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { activityId, startTime, endTime, capacity, dates } = body;

  if (!activityId || typeof activityId !== "string") {
    return NextResponse.json(
      { error: "activityId required" },
      { status: 400 }
    );
  }

  // Verify activity belongs to operator
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
  });
  if (!activity || activity.operatorId !== session.user.id) {
    return NextResponse.json(
      { error: "Activity not found or not owned" },
      { status: 404 }
    );
  }

  if (!startTime || !endTime) {
    return NextResponse.json(
      { error: "startTime and endTime required" },
      { status: 400 }
    );
  }

  if (!capacity || typeof capacity !== "number" || capacity < 1) {
    return NextResponse.json(
      { error: "Valid capacity required" },
      { status: 400 }
    );
  }

  // Support single date or array of dates
  const dateList: string[] = Array.isArray(dates) ? dates : [dates];
  if (dateList.length === 0 || !dateList[0]) {
    return NextResponse.json(
      { error: "At least one date required" },
      { status: 400 }
    );
  }

  // Validate dates are not in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validDates = dateList.filter((d) => {
    const date = new Date(d);
    return !isNaN(date.getTime()) && date >= today;
  });

  if (validDates.length === 0) {
    return NextResponse.json(
      { error: "All dates are in the past or invalid" },
      { status: 400 }
    );
  }

  const created = await prisma.timeSlot.createMany({
    data: validDates.map((d) => ({
      date: new Date(d),
      startTime,
      endTime,
      capacity: Math.min(capacity, activity.maxGroupSize),
      activityId,
    })),
  });

  return NextResponse.json(
    { created: created.count, dates: validDates },
    { status: 201 }
  );
}
