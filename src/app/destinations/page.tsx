import { prisma } from "@/lib/prisma";
import { DestinationsClient } from "./client";

export const metadata = {
  title: "Explore Destinations | Voyagio",
  description: "Discover inspiring travel destinations curated by local experts.",
};

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    include: {
      _count: { select: { activities: { where: { status: "ACTIVE" } } } },
      activities: {
        where: { status: "ACTIVE" },
        select: { rating: true },
      },
    },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });

  const mapped = destinations.map((d: typeof destinations[number]) => {
    const ratings = d.activities.map((a: { rating: number }) => a.rating).filter((r: number) => r > 0);
    const avgRating = ratings.length
      ? +(ratings.reduce((s: number, r: number) => s + r, 0) / ratings.length).toFixed(1)
      : 0;
    const highlights: string[] = d.highlights ? JSON.parse(d.highlights) : [];

    return {
      id: d.id,
      name: d.name,
      slug: d.slug,
      country: d.country,
      description: d.description,
      coverImage: d.coverImage,
      activityCount: d._count.activities,
      rating: avgRating,
      highlights,
      featured: d.featured,
    };
  });

  const countries = Array.from(new Set(mapped.map((d: typeof mapped[number]) => d.country))).sort();

  return <DestinationsClient destinations={mapped} countries={countries} />;
}
