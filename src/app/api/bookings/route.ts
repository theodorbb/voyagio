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
  const { activityId, timeSlotId, participants, notes } = body;

  if (!activityId || typeof activityId !== "string") {
    return NextResponse.json({ error: "activityId required" }, { status: 400 });
  }
  if (!timeSlotId || typeof timeSlotId !== "string") {
    return NextResponse.json({ error: "timeSlotId required" }, { status: 400 });
  }
  if (!participants || typeof participants !== "number" || participants < 1 || participants > 20) {
    return NextResponse.json({ error: "Valid participants count required (1-20)" }, { status: 400 });
  }

  // Fetch activity and time slot
  const [activity, timeSlot] = await Promise.all([
    prisma.activity.findUnique({ where: { id: activityId } }),
    prisma.timeSlot.findUnique({ where: { id: timeSlotId } }),
  ]);

  if (!activity || activity.status !== "ACTIVE") {
    return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  }
  if (!timeSlot || timeSlot.activityId !== activityId) {
    return NextResponse.json({ error: "Time slot not found" }, { status: 404 });
  }
  if (timeSlot.status !== "AVAILABLE") {
    return NextResponse.json({ error: "Time slot is no longer available" }, { status: 409 });
  }

  const remaining = timeSlot.capacity - timeSlot.bookedCount;
  if (participants > remaining) {
    return NextResponse.json(
      { error: `Only ${remaining} spots remaining` },
      { status: 409 }
    );
  }

  // Create booking and update slot in a transaction
  const booking = await prisma.$transaction(async (tx) => {
    const newBooking = await tx.booking.create({
      data: {
        participants,
        totalPrice: activity.price * participants,
        status: "CONFIRMED",
        notes: typeof notes === "string" ? notes.slice(0, 500) : null,
        userId: session.user.id,
        activityId,
        timeSlotId,
      },
      include: {
        activity: {
          select: { title: true, slug: true, price: true, currency: true, duration: true, images: true },
        },
        timeSlot: {
          select: { date: true, startTime: true, endTime: true },
        },
      },
    });

    const newBookedCount = timeSlot.bookedCount + participants;
    await tx.timeSlot.update({
      where: { id: timeSlotId },
      data: {
        bookedCount: newBookedCount,
        status: newBookedCount >= timeSlot.capacity ? "FULL" : "AVAILABLE",
      },
    });

    return newBooking;
  });

  return NextResponse.json({ booking }, { status: 201 });
}
