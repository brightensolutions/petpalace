import { type NextRequest, NextResponse } from "next/server";
import { decodeJwtToken } from "@/lib/query/queryFn";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path is for the admin area
  if (path.startsWith("/admin")) {
    // Get the token from cookies, headers, or localStorage (via cookies)
    const token =
      request.cookies.get("adminToken")?.value ||
      request.headers.get("Authorization")?.split(" ")[1];

    // If it's the login page and user has a valid token, redirect to dashboard
    if (path === "/admin/login") {
      if (token) {
        const decoded = decodeJwtToken(token);
        if (decoded) {
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url)
          );
        }
      }
      // Otherwise, allow access to login page
      return NextResponse.next();
    }

    // For all other admin paths, require authentication
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const decoded = decodeJwtToken(token);
    if (!decoded) {
      // Clear invalid token cookies
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("adminToken");
      return response;
    }
  }

  // Allow access to all other paths
  return NextResponse.next();
}

// Configure the middleware to run only on admin paths
export const config = {
  matcher: ["/admin/:path*"],
};
