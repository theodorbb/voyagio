import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ActivitiesManagementClient } from "./client";

export const metadata = { title: "Manage Activities | Voyagio" };

export default async function OperatorActivitiesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const destinations = await prisma.destination.findMany({
    select: { id: true, name: true, country: true },
    orderBy: { name: "asc" },
  });

  return <ActivitiesManagementClient destinations={destinations} />;
}
