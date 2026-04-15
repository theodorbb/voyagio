import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── Create a review for a completed booking ────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { bookingId, rating, comment } = body;

  // Validate input
  if (!bookingId || typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "bookingId and rating (1-5) are required" },
      { status: 400 }
    );
  }

  // Fetch the booking with ownership check
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { review: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (booking.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "Only completed bookings can be reviewed" },
      { status: 400 }
    );
  }
  if (booking.review) {
    return NextResponse.json(
      { error: "This booking already has a review" },
      { status: 409 }
    );
  }

  // Create review and update activity aggregate
  const trimmedComment =
    typeof comment === "string" ? comment.trim().slice(0, 2000) : null;

  const review = await prisma.$transaction(async (tx) => {
    const newReview = await tx.review.create({
      data: {
        rating,
        comment: trimmedComment || null,
        userId: session.user.id,
        activityId: booking.activityId,
        bookingId: booking.id,
      },
    });

    // Recalculate activity rating aggregate
    const agg = await tx.review.aggregate({
      where: { activityId: booking.activityId },
      _avg: { rating: true },
      _count: true,
    });

    await tx.activity.update({
      where: { id: booking.activityId },
      data: {
        rating: Math.round((agg._avg.rating || 0) * 10) / 10,
        reviewCount: agg._count,
      },
    });

    return newReview;
  });

  return NextResponse.json(review, { status: 201 });
}

// ─── Get user's reviews (or reviews for an activity) ────
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activityId = req.nextUrl.searchParams.get("activityId");

  if (activityId) {
    const reviews = await prisma.review.findMany({
      where: { activityId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, avatar: true } } },
    });
    return NextResponse.json(reviews);
  }

  // Default: user's own reviews
  const reviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      activity: {
        select: { title: true, slug: true, images: true, destination: { select: { name: true } } },
      },
    },
  });

  return NextResponse.json(reviews);
}
