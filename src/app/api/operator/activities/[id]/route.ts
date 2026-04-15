import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/operator/activities/[id] — update activity status or details
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "OPERATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activity = await prisma.activity.findUnique({
    where: { id: params.id },
  });

  if (!activity) {
    return NextResponse.json(
      { error: "Activity not found" },
      { status: 404 }
    );
  }
  if (activity.operatorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const updates: Record<string, unknown> = {};

  // Allow updating specific fields
  if (body.status && ["DRAFT", "ACTIVE", "ARCHIVED"].includes(body.status)) {
    updates.status = body.status;
  }
  if (typeof body.price === "number" && body.price > 0) {
    updates.price = body.price;
  }
  if (typeof body.maxGroupSize === "number" && body.maxGroupSize > 0) {
    updates.maxGroupSize = body.maxGroupSize;
  }
  if (typeof body.title === "string" && body.title.trim().length >= 3) {
    updates.title = body.title.trim();
  }
  if (
    typeof body.description === "string" &&
    body.description.trim().length >= 10
  ) {
    updates.description = body.description.trim();
  }
  if (typeof body.duration === "number" && body.duration >= 15) {
    updates.duration = body.duration;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const updated = await prisma.activity.update({
    where: { id: params.id },
    data: updates,
    include: { destination: { select: { name: true, slug: true } } },
  });

  return NextResponse.json({ activity: updated });
}
