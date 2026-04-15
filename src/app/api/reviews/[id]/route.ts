import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── Update a review ────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const review = await prisma.review.findUnique({
    where: { id: params.id },
  });

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  if (review.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { rating, comment } = body;

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }

  const trimmedComment =
    typeof comment === "string" ? comment.trim().slice(0, 2000) : null;

  const updated = await prisma.$transaction(async (tx) => {
    const updatedReview = await tx.review.update({
      where: { id: params.id },
      data: { rating, comment: trimmedComment || null },
    });

    // Recalculate activity aggregate
    const agg = await tx.review.aggregate({
      where: { activityId: review.activityId },
      _avg: { rating: true },
      _count: true,
    });

    await tx.activity.update({
      where: { id: review.activityId },
      data: {
        rating: Math.round((agg._avg.rating || 0) * 10) / 10,
        reviewCount: agg._count,
      },
    });

    return updatedReview;
  });

  return NextResponse.json(updated);
}
