import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/favicon.ico", "/_next"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("sb-access-token");

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // If trying to access a protected route and not logged in
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If trying to access login/signup and already logged in
  if ((pathname === "/login" || pathname === "/signup") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
