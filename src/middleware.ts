import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number, lastReset: number }>();
const RATE_LIMIT = 100; // requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export default auth((req) => {
  const { nextUrl, method, headers } = req;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;
  const ip = headers.get("x-forwarded-for") || "unknown";

  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAccountRoute = nextUrl.pathname.startsWith("/account");
  const isAuthRoute = nextUrl.pathname.startsWith("/auth");

  // Rate Limiting for API routes
  if (isApiRoute) {
    const now = Date.now();
    const rateLimitInfo = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - rateLimitInfo.lastReset > RATE_LIMIT_WINDOW) {
      rateLimitInfo.count = 0;
      rateLimitInfo.lastReset = now;
    }

    rateLimitInfo.count++;
    rateLimitMap.set(ip, rateLimitInfo);

    if (rateLimitInfo.count > RATE_LIMIT) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Basic CSRF protection for non-GET API requests
    if (method !== "GET") {
      const origin = headers.get("origin");
      const host = headers.get("host");
      if (origin && !origin.includes(host || "")) {
        return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
      }
    }
  }

  // Allow auth routes (signin, signup)
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  // Protect Dashboard (Merchant/Admin only)
  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin", nextUrl));
    }
    if (userRole !== "merchant" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  // Protect Account
  if (isAccountRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin", nextUrl));
    }
    return NextResponse.next();
  }

  // Protect sensitive API routes
  if (isApiRoute) {
    const sensitiveApiRoutes = ["/api/orders"]; // inventory is public for GET
    const isSensitive = sensitiveApiRoutes.some(route => nextUrl.pathname.startsWith(route));

    if (isSensitive && !isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Further restrict inventory to merchants/admins for non-GET
    if (nextUrl.pathname.startsWith("/api/inventory") && method !== "GET") {
      if (!isLoggedIn) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (userRole !== "merchant" && userRole !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/:path*"],
}
