import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const destination = await prisma.destination.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });

  if (!destination) {
    return NextResponse.json({ error: "Destination not found" }, { status: 404 });
  }

  const activities = await prisma.activity.findMany({
    where: { destinationId: destination.id, status: "ACTIVE" },
    orderBy: { rating: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      price: true,
      currency: true,
      duration: true,
      rating: true,
      reviewCount: true,
      difficulty: true,
      images: true,
      description: true,
      latitude: true,
      longitude: true,
    },
  });

  return NextResponse.json({ activities });
}
