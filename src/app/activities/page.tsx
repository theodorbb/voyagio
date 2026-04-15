import { prisma } from "@/lib/prisma";
import { ActivitiesClient } from "./client";

export const metadata = {
  title: "Discover Activities | Voyagio",
  description: "Browse curated tourism experiences across all destinations.",
};

export default async function ActivitiesPage() {
  const [activities, destinations] = await Promise.all([
    prisma.activity.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ featured: "desc" }, { rating: "desc" }],
      include: {
        destination: { select: { name: true, slug: true } },
      },
    }),
    prisma.destination.findMany({
      select: { name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const mapped = activities.map((a: typeof activities[number]) => {
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
    };
  });

  const categories = Array.from(new Set(activities.map((a: typeof activities[number]) => a.category))).sort();

  return (
    <ActivitiesClient
      activities={mapped}
      destinations={destinations}
      categories={categories}
    />
  );
}
