import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { OperatorDashboardClient } from "./client";

export default async function OperatorDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [
    activities,
    recentBookings,
    recentReviews,
    totalActivities,
    activeActivities,
    totalBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    revenue,
    pendingRevenue,
    avgRating,
    totalReviews,
    upcomingSlots,
    totalCapacity,
    totalBooked,
  ] = await Promise.all([
    prisma.activity.findMany({
      where: { operatorId: user.id },
      include: { destination: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.booking.findMany({
      where: { activity: { operatorId: user.id } },
      include: {
        activity: { select: { title: true, slug: true } },
        user: { select: { name: true } },
        timeSlot: { select: { date: true, startTime: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.review.findMany({
      where: { activity: { operatorId: user.id } },
      include: {
        user: { select: { name: true } },
        activity: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.activity.count({ where: { operatorId: user.id } }),
    prisma.activity.count({ where: { operatorId: user.id, status: "ACTIVE" } }),
    prisma.booking.count({ where: { activity: { operatorId: user.id } } }),
    prisma.booking.count({
      where: { activity: { operatorId: user.id }, status: "CONFIRMED" },
    }),
    prisma.booking.count({
      where: { activity: { operatorId: user.id }, status: "COMPLETED" },
    }),
    prisma.booking.count({
      where: { activity: { operatorId: user.id }, status: "CANCELLED" },
    }),
    prisma.booking.aggregate({
      where: { activity: { operatorId: user.id }, status: "COMPLETED" },
      _sum: { totalPrice: true },
    }),
    prisma.booking.aggregate({
      where: { activity: { operatorId: user.id }, status: "CONFIRMED" },
      _sum: { totalPrice: true },
    }),
    prisma.review.aggregate({
      where: { activity: { operatorId: user.id } },
      _avg: { rating: true },
    }),
    prisma.review.count({ where: { activity: { operatorId: user.id } } }),
    prisma.timeSlot.count({
      where: {
        activity: { operatorId: user.id },
        status: "AVAILABLE",
        date: { gte: new Date() },
      },
    }),
    prisma.timeSlot.aggregate({
      where: {
        activity: { operatorId: user.id },
        date: { gte: new Date() },
        status: { not: "CANCELLED" },
      },
      _sum: { capacity: true },
    }),
    prisma.timeSlot.aggregate({
      where: {
        activity: { operatorId: user.id },
        date: { gte: new Date() },
        status: { not: "CANCELLED" },
      },
      _sum: { bookedCount: true },
    }),
  ]);

  // Category breakdown
  const categoryBreakdown = await prisma.activity.groupBy({
    by: ["category"],
    where: { operatorId: user.id },
    _count: true,
    _avg: { rating: true },
  });

  const cap = totalCapacity._sum.capacity || 0;
  const bkd = totalBooked._sum.bookedCount || 0;

  return (
    <OperatorDashboardClient
      user={user}
      stats={{
        totalActivities,
        activeActivities,
        totalBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        revenue: revenue._sum.totalPrice || 0,
        pendingRevenue: pendingRevenue._sum.totalPrice || 0,
        avgRating: Math.round((avgRating._avg.rating || 0) * 10) / 10,
        totalReviews,
        upcomingSlots,
        utilization: cap > 0 ? Math.round((bkd / cap) * 100) : 0,
      }}
      activities={JSON.parse(JSON.stringify(activities))}
      recentBookings={JSON.parse(JSON.stringify(recentBookings))}
      recentReviews={JSON.parse(JSON.stringify(recentReviews))}
      categoryBreakdown={categoryBreakdown.map((c) => ({
        category: c.category,
        count: c._count,
        avgRating: Math.round((c._avg.rating || 0) * 10) / 10,
      }))}
    />
  );
}
