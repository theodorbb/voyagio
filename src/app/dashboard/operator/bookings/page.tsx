import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { BookingsManagementClient } from "./client";

export const metadata = { title: "Manage Bookings | Voyagio" };

export default async function OperatorBookingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const activities = await prisma.activity.findMany({
    where: { operatorId: user.id },
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  return <BookingsManagementClient activities={activities} />;
}
