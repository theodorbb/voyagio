import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ActivityDetailClient } from "./client";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const activity = await prisma.activity.findUnique({
    where: { slug: params.slug },
    select: { title: true, description: true },
  });
  if (!activity) return { title: "Not Found | Voyagio" };
  return {
    title: `${activity.title} | Voyagio`,
    description: activity.description.slice(0, 160),
  };
}

export default async function ActivityDetailPage({ params }: Props) {
  const activity = await prisma.activity.findUnique({
    where: { slug: params.slug },
    include: {
      destination: { select: { name: true, slug: true, country: true } },
      operator: { select: { name: true, avatar: true, bio: true } },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          user: { select: { name: true, avatar: true } },
        },
      },
    },
  });

  if (!activity || activity.status !== "ACTIVE") notFound();

  const images: string[] = JSON.parse(activity.images);
  const included: string[] = activity.included
    ? JSON.parse(activity.included)
    : [];
  const highlights: string[] = activity.highlights
    ? JSON.parse(activity.highlights)
    : [];

  // Related activities in same destination (exclude current)
  const related = await prisma.activity.findMany({
    where: {
      destinationId: activity.destinationId,
      status: "ACTIVE",
      id: { not: activity.id },
    },
    take: 3,
    orderBy: { rating: "desc" },
    include: {
      destination: { select: { name: true, slug: true } },
    },
  });

  const relatedMapped = related.map((a: typeof related[number]) => {
    const imgs: string[] = JSON.parse(a.images);
    return {
      id: a.id,
      title: a.title,
      slug: a.slug,
      category: a.category,
      price: a.price,
      currency: a.currency,
      duration: a.duration,
      rating: a.rating,
      reviewCount: a.reviewCount,
      coverImage: imgs[0] || "",
      destinationName: a.destination.name,
      destinationSlug: a.destination.slug,
      difficulty: a.difficulty,
      maxGroupSize: a.maxGroupSize,
    };
  });

  return (
    <ActivityDetailClient
      activity={{
        id: activity.id,
        title: activity.title,
        slug: activity.slug,
        description: activity.description,
        category: activity.category,
        price: activity.price,
        currency: activity.currency,
        duration: activity.duration,
        difficulty: activity.difficulty,
        maxGroupSize: activity.maxGroupSize,
        rating: activity.rating,
        reviewCount: activity.reviewCount,
        images,
        included,
        highlights,
        destination: activity.destination,
        operator: activity.operator,
        latitude: activity.latitude,
        longitude: activity.longitude,
      }}
      reviews={activity.reviews.map((r: typeof activity.reviews[number]) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
        user: { name: r.user.name, avatar: r.user.avatar },
      }))}
      relatedActivities={relatedMapped}
    />
  );
}
