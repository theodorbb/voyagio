import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ScheduleManagementClient } from "./client";

export const metadata = { title: "Schedule Management | Voyagio" };

export default async function OperatorSchedulePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const activities = await prisma.activity.findMany({
    where: { operatorId: user.id, status: { in: ["ACTIVE", "DRAFT"] } },
    select: { id: true, title: true, maxGroupSize: true },
    orderBy: { title: "asc" },
  });

  return <ScheduleManagementClient activities={activities} />;
}
