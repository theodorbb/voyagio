import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { TripBuilderClient } from "./client";

export const metadata = {
  title: "Smart Trip Builder | Voyagio",
  description: "Create your personalized travel itinerary with our AI-powered trip planner",
};

export default async function TripBuilderPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Fetch destinations with activity counts
  const destinations = await prisma.destination.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      country: true,
      coverImage: true,
      _count: { select: { activities: { where: { status: "ACTIVE" } } } },
    },
  });

  const mapped = destinations
    .filter((d) => d._count.activities > 0)
    .map((d: typeof destinations[number]) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      country: d.country,
      coverImage: d.coverImage,
      activityCount: d._count.activities,
    }));

  return <TripBuilderClient destinations={mapped} />;
}
