import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ConfirmationClient } from "./client";
import { getCurrentUser } from "@/lib/session";

interface Props {
  searchParams: { id?: string };
}

export const metadata = {
  title: "Booking Confirmed | Voyagio",
};

export default async function BookingConfirmationPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const bookingId = searchParams.id;
  if (!bookingId) redirect("/dashboard/tourist");

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      activity: {
        select: {
          title: true,
          slug: true,
          price: true,
          currency: true,
          duration: true,
          images: true,
          category: true,
          destination: { select: { name: true, slug: true, country: true } },
          operator: { select: { name: true } },
        },
      },
      timeSlot: {
        select: { date: true, startTime: true, endTime: true },
      },
    },
  });

  if (!booking || booking.userId !== user.id) redirect("/dashboard/tourist");

  const images: string[] = JSON.parse(booking.activity.images);

  return (
    <ConfirmationClient
      booking={{
        id: booking.id,
        participants: booking.participants,
        totalPrice: booking.totalPrice,
        status: booking.status,
        notes: booking.notes,
        createdAt: booking.createdAt.toISOString(),
        activity: {
          title: booking.activity.title,
          slug: booking.activity.slug,
          price: booking.activity.price,
          currency: booking.activity.currency,
          duration: booking.activity.duration,
          category: booking.activity.category,
          coverImage: images[0] || "",
          destination: booking.activity.destination,
          operatorName: booking.activity.operator.name,
        },
        timeSlot: booking.timeSlot
          ? {
              date: booking.timeSlot.date.toISOString(),
              startTime: booking.timeSlot.startTime,
              endTime: booking.timeSlot.endTime,
            }
          : null,
      }}
    />
  );
}
