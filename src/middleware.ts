import { withAuth } from "next-auth/middleware";
import {  NextResponse } from "next/server";

export default withAuth(
  function middleware(req: any) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    // If user is not logged in or token is missing
    if (!token) {
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

    // Check if session has expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (token.exp && currentTime >= token.exp) {
      // Session expired - deny access
      
      // Allow login page for expired sessions
      if (pathname.startsWith("/login")) {
        return NextResponse.next();
      }

      // API requests → 401 JSON for expired sessions
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ 
          error: "Session expired", 
          code: "SESSION_EXPIRED" 
        }, { status: 401 });
      }

      // Pages → redirect to login for expired sessions
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
