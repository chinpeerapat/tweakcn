import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { API_AUTH_PREFIX } from "./routes";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const pathname = request.nextUrl.pathname;

  const isApiAuth = pathname.startsWith(API_AUTH_PREFIX);

  if (isApiAuth) {
    return NextResponse.next();
  }

  if (!session) {
    const protectedRoutes = ["/dashboard", "/settings", "/success"];
    if (protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (session && pathname === "/settings") {
    return NextResponse.redirect(new URL("/settings/account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/settings/:path*", "/success"],
};
