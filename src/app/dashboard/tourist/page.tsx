import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { TouristDashboardClient } from "./client";

export default async function TouristDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [bookings, favorites, trips] = await Promise.all([
    prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        activity: { include: { destination: true } },
        timeSlot: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.favorite.findMany({
      where: { userId: user.id },
      include: { activity: { include: { destination: true } } },
      take: 4,
    }),
    prisma.trip.findMany({
      where: { userId: user.id },
      include: { destination: true, activities: true },
      orderBy: { startDate: "asc" },
      take: 3,
    }),
  ]);

  const stats = {
    totalBookings: await prisma.booking.count({ where: { userId: user.id } }),
    upcomingBookings: await prisma.booking.count({
      where: { userId: user.id, status: "CONFIRMED" },
    }),
    totalFavorites: await prisma.favorite.count({ where: { userId: user.id } }),
    totalTrips: await prisma.trip.count({ where: { userId: user.id } }),
    totalReviews: await prisma.review.count({ where: { userId: user.id } }),
  };

  // Check if user has preferences set
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { preferences: true },
  });
  const hasPreferences = !!dbUser?.preferences;

  return (
    <TouristDashboardClient
      user={user}
      stats={stats}
      recentBookings={JSON.parse(JSON.stringify(bookings))}
      favorites={JSON.parse(JSON.stringify(favorites))}
      trips={JSON.parse(JSON.stringify(trips))}
      hasPreferences={hasPreferences}
    />
  );
}
