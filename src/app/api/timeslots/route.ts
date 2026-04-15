import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const activityId = req.nextUrl.searchParams.get("activityId");
  if (!activityId) {
    return NextResponse.json({ error: "activityId required" }, { status: 400 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const slots = await prisma.timeSlot.findMany({
    where: {
      activityId,
      status: "AVAILABLE",
      date: { gte: today },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json({ slots });
}
