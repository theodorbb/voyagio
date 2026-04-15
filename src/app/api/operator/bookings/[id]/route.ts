import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/operator/bookings/[id] — update booking status (complete or cancel)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "OPERATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      activity: { select: { operatorId: true } },
      timeSlot: true,
    },
  });

  if (!booking || booking.activity.operatorId !== session.user.id) {
    return NextResponse.json(
      { error: "Booking not found" },
      { status: 404 }
    );
  }

  const body = await req.json();

  if (!body.status || !["COMPLETED", "CANCELLED"].includes(body.status)) {
    return NextResponse.json(
      { error: "Status must be COMPLETED or CANCELLED" },
      { status: 400 }
    );
  }

  if (booking.status === "CANCELLED") {
    return NextResponse.json(
      { error: "Cannot update a cancelled booking" },
      { status: 409 }
    );
  }

  if (body.status === "CANCELLED" && booking.status === "CONFIRMED") {
    // Cancelling: release capacity
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: params.id },
        data: { status: "CANCELLED" },
      });
      if (booking.timeSlot) {
        const newCount = Math.max(
          0,
          booking.timeSlot.bookedCount - booking.participants
        );
        await tx.timeSlot.update({
          where: { id: booking.timeSlot.id },
          data: { bookedCount: newCount, status: "AVAILABLE" },
        });
      }
    });
  } else {
    // Completing
    await prisma.booking.update({
      where: { id: params.id },
      data: { status: body.status },
    });
  }

  return NextResponse.json({ success: true });
}
