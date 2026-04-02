import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const role = (req.auth?.user as any)?.role

  // Protected routes
  const isAuthRoute = nextUrl.pathname.startsWith("/auth")
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")

  if (isApiAuthRoute) return null

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
    return null
  }

  if (isAdminRoute) {
    if (!isLoggedIn || role !== "admin") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
    return null
  }

  return null
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
