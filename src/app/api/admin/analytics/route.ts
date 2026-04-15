import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ─── Platform KPIs ────────────────────────
  const [
    totalUsers,
    totalTourists,
    totalOperators,
    totalAdmins,
    totalDestinations,
    totalActivities,
    activeActivities,
    totalBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalReviews,
    avgRating,
    completedRevenue,
    confirmedRevenue,
    totalTrips,
    totalFavorites,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "TOURIST" } }),
    prisma.user.count({ where: { role: "OPERATOR" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.destination.count(),
    prisma.activity.count(),
    prisma.activity.count({ where: { status: "ACTIVE" } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.booking.count({ where: { status: "CANCELLED" } }),
    prisma.review.count(),
    prisma.review.aggregate({ _avg: { rating: true } }),
    prisma.booking.aggregate({ where: { status: "COMPLETED" }, _sum: { totalPrice: true } }),
    prisma.booking.aggregate({ where: { status: "CONFIRMED" }, _sum: { totalPrice: true } }),
    prisma.trip.count(),
    prisma.favorite.count(),
  ]);

  // ─── Bookings by Destination ──────────────
  const destinations = await prisma.destination.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      coverImage: true,
      activities: {
        select: {
          id: true,
          rating: true,
          reviewCount: true,
          _count: { select: { bookings: true } },
          bookings: {
            where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
            select: { totalPrice: true, participants: true, status: true },
          },
        },
      },
    },
  });

  const destinationStats = destinations.map((d) => {
    const totalBookingsD = d.activities.reduce((s, a) => s + a._count.bookings, 0);
    const revenueD = d.activities.reduce(
      (s, a) => s + a.bookings.reduce((bs, b) => bs + b.totalPrice, 0),
      0
    );
    const participantsD = d.activities.reduce(
      (s, a) => s + a.bookings.reduce((bs, b) => bs + b.participants, 0),
      0
    );
    const ratings = d.activities.filter((a) => a.reviewCount > 0).map((a) => a.rating);
    const avgR = ratings.length ? +(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;
    return {
      id: d.id,
      name: d.name,
      slug: d.slug,
      coverImage: d.coverImage,
      activityCount: d.activities.length,
      totalBookings: totalBookingsD,
      revenue: Math.round(revenueD),
      participants: participantsD,
      avgRating: avgR,
    };
  });

  // ─── Bookings by Category ─────────────────
  const categoryData = await prisma.activity.groupBy({
    by: ["category"],
    _count: true,
    _avg: { rating: true },
  });

  const categoryBookings = await Promise.all(
    categoryData.map(async (c) => {
      const bookingCount = await prisma.booking.count({
        where: { activity: { category: c.category } },
      });
      const rev = await prisma.booking.aggregate({
        where: {
          activity: { category: c.category },
          status: { in: ["CONFIRMED", "COMPLETED"] },
        },
        _sum: { totalPrice: true },
      });
      return {
        category: c.category,
        activityCount: c._count,
        avgRating: Math.round((c._avg.rating || 0) * 10) / 10,
        bookings: bookingCount,
        revenue: Math.round(rev._sum.totalPrice || 0),
      };
    })
  );

  // ─── Top Activities ───────────────────────
  const topActivities = await prisma.activity.findMany({
    orderBy: { reviewCount: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      price: true,
      rating: true,
      reviewCount: true,
      status: true,
      destination: { select: { name: true } },
      operator: { select: { name: true } },
      _count: { select: { bookings: true } },
    },
  });

  const topByBookings = await prisma.activity.findMany({
    orderBy: { bookings: { _count: "desc" } },
    take: 10,
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      price: true,
      rating: true,
      reviewCount: true,
      destination: { select: { name: true } },
      operator: { select: { name: true } },
      _count: { select: { bookings: true } },
      bookings: {
        where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
        select: { totalPrice: true },
      },
    },
  });

  const topActivitiesByBookings = topByBookings.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    category: a.category,
    price: a.price,
    rating: a.rating,
    reviewCount: a.reviewCount,
    destination: a.destination.name,
    operator: a.operator.name,
    bookingCount: a._count.bookings,
    revenue: Math.round(a.bookings.reduce((s, b) => s + b.totalPrice, 0)),
  }));

  // ─── Operator Performance ─────────────────
  const operators = await prisma.user.findMany({
    where: { role: "OPERATOR" },
    select: {
      id: true,
      name: true,
      email: true,
      activities: {
        select: {
          id: true,
          status: true,
          rating: true,
          reviewCount: true,
          _count: { select: { bookings: true } },
          bookings: {
            where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
            select: { totalPrice: true, participants: true },
          },
        },
      },
    },
  });

  const operatorStats = operators
    .map((op) => {
      const activeActs = op.activities.filter((a) => a.status === "ACTIVE").length;
      const totalBk = op.activities.reduce((s, a) => s + a._count.bookings, 0);
      const revenue = op.activities.reduce(
        (s, a) => s + a.bookings.reduce((bs, b) => bs + b.totalPrice, 0),
        0
      );
      const guests = op.activities.reduce(
        (s, a) => s + a.bookings.reduce((bs, b) => bs + b.participants, 0),
        0
      );
      const rated = op.activities.filter((a) => a.reviewCount > 0);
      const avgR = rated.length
        ? +(rated.reduce((s, a) => s + a.rating, 0) / rated.length).toFixed(1)
        : 0;
      const totalReviewsOp = op.activities.reduce((s, a) => s + a.reviewCount, 0);
      return {
        id: op.id,
        name: op.name,
        email: op.email,
        totalActivities: op.activities.length,
        activeActivities: activeActs,
        totalBookings: totalBk,
        revenue: Math.round(revenue),
        guests,
        avgRating: avgR,
        totalReviews: totalReviewsOp,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  // ─── Top Tourists ─────────────────────────
  const tourists = await prisma.user.findMany({
    where: { role: "TOURIST" },
    select: {
      id: true,
      name: true,
      email: true,
      _count: { select: { bookings: true, favorites: true, trips: true } },
    },
    orderBy: { bookings: { _count: "desc" } },
    take: 10,
  });

  const topTourists = tourists.map((t) => ({
    id: t.id,
    name: t.name,
    email: t.email,
    bookings: t._count.bookings,
    favorites: t._count.favorites,
    trips: t._count.trips,
  }));

  // ─── Recent Activity Feed ─────────────────
  const [recentBookings, recentReviews, recentUsers] = await Promise.all([
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        status: true,
        totalPrice: true,
        participants: true,
        createdAt: true,
        activity: { select: { title: true, slug: true } },
        user: { select: { name: true } },
        timeSlot: { select: { date: true, startTime: true } },
      },
    }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { name: true } },
        activity: { select: { title: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
  ]);

  // ─── Utilization ──────────────────────────
  const slotStats = await prisma.timeSlot.aggregate({
    where: { status: { not: "CANCELLED" } },
    _sum: { capacity: true, bookedCount: true },
    _count: true,
  });

  const totalCapacity = slotStats._sum.capacity || 0;
  const totalBooked = slotStats._sum.bookedCount || 0;

  return NextResponse.json({
    kpis: {
      totalUsers,
      totalTourists,
      totalOperators,
      totalAdmins,
      totalDestinations,
      totalActivities,
      activeActivities,
      totalBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalReviews,
      avgRating: Math.round((avgRating._avg.rating || 0) * 10) / 10,
      completedRevenue: Math.round(completedRevenue._sum.totalPrice || 0),
      confirmedRevenue: Math.round(confirmedRevenue._sum.totalPrice || 0),
      totalTrips,
      totalFavorites,
      utilization: totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0,
      totalSlots: slotStats._count,
    },
    destinationStats: destinationStats.sort((a, b) => b.revenue - a.revenue),
    categoryStats: categoryBookings.sort((a, b) => b.bookings - a.bookings),
    topActivities: topActivities.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      category: a.category,
      price: a.price,
      rating: a.rating,
      reviewCount: a.reviewCount,
      status: a.status,
      destination: a.destination.name,
      operator: a.operator.name,
      bookingCount: a._count.bookings,
    })),
    topActivitiesByBookings,
    operatorStats,
    topTourists,
    recentBookings: recentBookings.map((b) => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
      timeSlot: b.timeSlot ? { ...b.timeSlot, date: b.timeSlot.date.toISOString() } : null,
    })),
    recentReviews: recentReviews.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
    recentUsers: recentUsers.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
    })),
  });
}
