import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { activityId } = await req.json();
  if (!activityId || typeof activityId !== "string") {
    return NextResponse.json({ error: "activityId required" }, { status: 400 });
  }

  // Check if already favorited
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_activityId: {
        userId: session.user.id,
        activityId,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ favorited: true });
  }

  await prisma.favorite.create({
    data: {
      userId: session.user.id,
      activityId,
    },
  });

  return NextResponse.json({ favorited: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { activityId } = await req.json();
  if (!activityId || typeof activityId !== "string") {
    return NextResponse.json({ error: "activityId required" }, { status: 400 });
  }

  await prisma.favorite.deleteMany({
    where: {
      userId: session.user.id,
      activityId,
    },
  });

  return NextResponse.json({ favorited: false });
}
