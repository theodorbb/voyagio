import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DestinationDetailClient } from "./client";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const dest = await prisma.destination.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true },
  });
  if (!dest) return { title: "Not Found | Voyagio" };
  return {
    title: `${dest.name} | Voyagio`,
    description: dest.description.slice(0, 160),
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const destination = await prisma.destination.findUnique({
    where: { slug: params.slug },
    include: {
      activities: {
        where: { status: "ACTIVE" },
        orderBy: [{ featured: "desc" }, { rating: "desc" }],
        include: {
          destination: { select: { name: true, slug: true } },
        },
      },
    },
  });

  if (!destination) notFound();

  const highlights: string[] = destination.highlights
    ? JSON.parse(destination.highlights)
    : [];

  type Act = typeof destination.activities[number];
  const ratings = destination.activities
    .map((a: Act) => a.rating)
    .filter((r: number) => r > 0);
  const avgRating = ratings.length
    ? +(ratings.reduce((s: number, r: number) => s + r, 0) / ratings.length).toFixed(1)
    : 0;
  const totalReviews = destination.activities.reduce(
    (s: number, a: Act) => s + a.reviewCount,
    0
  );

  const categories = Array.from(
    new Set(destination.activities.map((a: Act) => a.category))
  ).sort();

  const activitiesMapped = destination.activities.map((a: Act) => {
    const images: string[] = JSON.parse(a.images);
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
      coverImage: images[0] || "",
      destinationName: a.destination.name,
      destinationSlug: a.destination.slug,
      difficulty: a.difficulty,
      maxGroupSize: a.maxGroupSize,
      featured: a.featured,
      latitude: a.latitude,
      longitude: a.longitude,
    };
  });

  return (
    <DestinationDetailClient
      destination={{
        id: destination.id,
        name: destination.name,
        slug: destination.slug,
        country: destination.country,
        description: destination.description,
        coverImage: destination.coverImage,
        highlights,
        avgRating,
        totalReviews,
        activityCount: destination.activities.length,
        latitude: destination.latitude,
        longitude: destination.longitude,
      }}
      activities={activitiesMapped}
      categories={categories}
    />
  );
}
