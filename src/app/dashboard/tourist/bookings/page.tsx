import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { MyBookingsClient } from "./client";

export const metadata = {
  title: "My Bookings | Voyagio",
};

export default async function MyBookingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      activity: {
        select: {
          title: true,
          slug: true,
          price: true,
          currency: true,
          duration: true,
          category: true,
          images: true,
          destination: { select: { name: true, slug: true, country: true } },
          operator: { select: { name: true } },
        },
      },
      timeSlot: {
        select: { date: true, startTime: true, endTime: true },
      },
      review: {
        select: { id: true, rating: true, comment: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = bookings.map((b: typeof bookings[number]) => {
    const images: string[] = JSON.parse(b.activity.images);
    return {
      id: b.id,
      participants: b.participants,
      totalPrice: b.totalPrice,
      status: b.status,
      notes: b.notes,
      createdAt: b.createdAt.toISOString(),
      activity: {
        title: b.activity.title,
        slug: b.activity.slug,
        price: b.activity.price,
        currency: b.activity.currency,
        duration: b.activity.duration,
        category: b.activity.category,
        coverImage: images[0] || "",
        destination: b.activity.destination,
        operatorName: b.activity.operator.name,
      },
      timeSlot: b.timeSlot
        ? {
            date: b.timeSlot.date.toISOString(),
            startTime: b.timeSlot.startTime,
            endTime: b.timeSlot.endTime,
          }
        : null,
      review: b.review || null,
    };
  });

  return <MyBookingsClient bookings={serialized} />;
}
