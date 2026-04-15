import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { MyReviewsClient } from "./client";

export const metadata = {
  title: "My Reviews | Voyagio",
};

export default async function MyReviewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      activity: {
        select: {
          title: true,
          slug: true,
          images: true,
          category: true,
          destination: { select: { name: true } },
        },
      },
      booking: {
        select: { id: true, createdAt: true, participants: true },
      },
    },
  });

  const serialized = reviews.map((r) => {
    const images: string[] = JSON.parse(r.activity.images);
    return {
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
      activity: {
        title: r.activity.title,
        slug: r.activity.slug,
        coverImage: images[0] || "",
        category: r.activity.category,
        destinationName: r.activity.destination.name,
      },
      bookingId: r.booking?.id || null,
    };
  });

  return <MyReviewsClient reviews={serialized} />;
}
