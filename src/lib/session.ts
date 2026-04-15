import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export function getDashboardPath(role: string): string {
  switch (role) {
    case "OPERATOR":
      return "/dashboard/operator";
    case "ADMIN":
      return "/dashboard/admin";
    default:
      return "/dashboard/tourist";
  }
}
