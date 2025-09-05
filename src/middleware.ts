import { withAuth } from "next-auth/middleware";
import {  NextResponse } from "next/server";

export default withAuth(
  function middleware(req: any) {
    const { pathname } = req.nextUrl;

    // If user is not logged in
    if (!req.nextauth?.token) {
      // Allow login page
      if (pathname.startsWith("/login")) {
        return NextResponse.next();
      }

      // API requests → 401 JSON
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Pages → redirect to login
       return NextResponse.rewrite(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // only allow if logged in
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",      // protect all admin pages
    "/api/admin/:path*",  // protect all admin APIs
  ],
};
