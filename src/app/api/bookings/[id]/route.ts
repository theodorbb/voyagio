import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { timeSlot: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (booking.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: "Only confirmed bookings can be cancelled" },
      { status: 409 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: params.id },
      data: { status: "CANCELLED" },
    });

    if (booking.timeSlot) {
      const newCount = Math.max(0, booking.timeSlot.bookedCount - booking.participants);
      await tx.timeSlot.update({
        where: { id: booking.timeSlot.id },
        data: {
          bookedCount: newCount,
          status: "AVAILABLE",
        },
      });
    }
  });

  return NextResponse.json({ success: true });
}
