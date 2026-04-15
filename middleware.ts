import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Role-based route protection
    if (pathname.startsWith("/dashboard/operator") && token?.role !== "OPERATOR") {
      return NextResponse.redirect(new URL("/dashboard/tourist", req.url));
    }

    if (pathname.startsWith("/dashboard/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/tourist", req.url));
    }

    if (pathname.startsWith("/dashboard/tourist") && token?.role === "OPERATOR") {
      return NextResponse.redirect(new URL("/dashboard/operator", req.url));
    }

    if (pathname.startsWith("/dashboard/tourist") && token?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
