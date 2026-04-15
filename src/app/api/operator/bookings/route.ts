import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/operator/bookings — list all bookings for operator's activities
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "OPERATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get("status");
  const activityId = req.nextUrl.searchParams.get("activityId");

  const where: Record<string, unknown> = {
    activity: { operatorId: session.user.id },
  };
  if (status && ["CONFIRMED", "COMPLETED", "CANCELLED"].includes(status)) {
    where.status = status;
  }
  if (activityId) {
    (where.activity as Record<string, unknown>).id = activityId;
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      activity: { select: { id: true, title: true, slug: true, price: true, currency: true } },
      user: { select: { name: true, email: true } },
      timeSlot: { select: { date: true, startTime: true, endTime: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    bookings: bookings.map((b) => ({
      id: b.id,
      participants: b.participants,
      totalPrice: b.totalPrice,
      status: b.status,
      notes: b.notes,
      createdAt: b.createdAt.toISOString(),
      activity: b.activity,
      user: b.user,
      timeSlot: b.timeSlot
        ? {
            date: b.timeSlot.date.toISOString(),
            startTime: b.timeSlot.startTime,
            endTime: b.timeSlot.endTime,
          }
        : null,
    })),
  });
}
