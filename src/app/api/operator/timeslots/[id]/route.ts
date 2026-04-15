import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/operator/timeslots/[id] — cancel or update a time slot
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "OPERATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slot = await prisma.timeSlot.findUnique({
    where: { id: params.id },
    include: { activity: { select: { operatorId: true } } },
  });

  if (!slot || slot.activity.operatorId !== session.user.id) {
    return NextResponse.json(
      { error: "Time slot not found" },
      { status: 404 }
    );
  }

  const body = await req.json();

  if (body.status === "CANCELLED") {
    const updated = await prisma.timeSlot.update({
      where: { id: params.id },
      data: { status: "CANCELLED" },
    });
    return NextResponse.json({ timeSlot: updated });
  }

  if (typeof body.capacity === "number" && body.capacity >= slot.bookedCount) {
    const updated = await prisma.timeSlot.update({
      where: { id: params.id },
      data: {
        capacity: body.capacity,
        status: body.capacity <= slot.bookedCount ? "FULL" : "AVAILABLE",
      },
    });
    return NextResponse.json({ timeSlot: updated });
  }

  return NextResponse.json(
    { error: "No valid update provided" },
    { status: 400 }
  );
}
