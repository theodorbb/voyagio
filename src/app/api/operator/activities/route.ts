import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/operator/activities — list all operator's activities with stats
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "OPERATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activities = await prisma.activity.findMany({
    where: { operatorId: session.user.id },
    include: {
      destination: { select: { name: true, slug: true } },
      _count: { select: { bookings: true, reviews: true, timeSlots: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Get booking/revenue stats per activity
  const stats = await Promise.all(
    activities.map(async (a) => {
      const [confirmed, completed, totalRevenue, upcomingSlots] =
        await Promise.all([
          prisma.booking.count({
            where: { activityId: a.id, status: "CONFIRMED" },
          }),
          prisma.booking.count({
            where: { activityId: a.id, status: "COMPLETED" },
          }),
          prisma.booking.aggregate({
            where: {
              activityId: a.id,
              status: { in: ["CONFIRMED", "COMPLETED"] },
            },
            _sum: { totalPrice: true },
          }),
          prisma.timeSlot.count({
            where: {
              activityId: a.id,
              status: "AVAILABLE",
              date: { gte: new Date() },
            },
          }),
        ]);

      return {
        id: a.id,
        title: a.title,
        slug: a.slug,
        category: a.category,
        price: a.price,
        currency: a.currency,
        duration: a.duration,
        maxGroupSize: a.maxGroupSize,
        rating: a.rating,
        reviewCount: a.reviewCount,
        status: a.status,
        featured: a.featured,
        images: a.images,
        destination: a.destination,
        createdAt: a.createdAt.toISOString(),
        confirmedBookings: confirmed,
        completedBookings: completed,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        totalBookings: a._count.bookings,
        totalReviews: a._count.reviews,
        totalSlots: a._count.timeSlots,
        upcomingSlots,
      };
    })
  );

  return NextResponse.json({ activities: stats });
}

// POST /api/operator/activities — create a new activity
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "OPERATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    description,
    category,
    price,
    duration,
    maxGroupSize,
    destinationId,
    difficulty,
    included,
    highlights,
  } = body;

  // Validate required fields
  if (!title || typeof title !== "string" || title.trim().length < 3) {
    return NextResponse.json(
      { error: "Title is required (min 3 chars)" },
      { status: 400 }
    );
  }
  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length < 10
  ) {
    return NextResponse.json(
      { error: "Description is required (min 10 chars)" },
      { status: 400 }
    );
  }
  if (!category || typeof category !== "string") {
    return NextResponse.json(
      { error: "Category is required" },
      { status: 400 }
    );
  }
  if (!price || typeof price !== "number" || price <= 0) {
    return NextResponse.json(
      { error: "Valid price required" },
      { status: 400 }
    );
  }
  if (!duration || typeof duration !== "number" || duration < 15) {
    return NextResponse.json(
      { error: "Duration required (min 15 mins)" },
      { status: 400 }
    );
  }
  if (!destinationId || typeof destinationId !== "string") {
    return NextResponse.json(
      { error: "Destination is required" },
      { status: 400 }
    );
  }

  // Check destination exists
  const destination = await prisma.destination.findUnique({
    where: { id: destinationId },
  });
  if (!destination) {
    return NextResponse.json(
      { error: "Destination not found" },
      { status: 404 }
    );
  }

  // Generate slug
  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const existing = await prisma.activity.findUnique({
    where: { slug: baseSlug },
  });
  const slug = existing ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

  // Default image
  const defaultImage = `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800`;

  const activity = await prisma.activity.create({
    data: {
      title: title.trim(),
      slug,
      description: description.trim(),
      category,
      price,
      currency: "EUR",
      duration,
      maxGroupSize: maxGroupSize || 20,
      difficulty: difficulty || null,
      images: JSON.stringify([defaultImage]),
      included: included ? JSON.stringify(included) : null,
      highlights: highlights ? JSON.stringify(highlights) : null,
      latitude: destination.latitude,
      longitude: destination.longitude,
      status: "DRAFT",
      operatorId: session.user.id,
      destinationId,
    },
    include: { destination: { select: { name: true, slug: true } } },
  });

  return NextResponse.json({ activity }, { status: 201 });
}
