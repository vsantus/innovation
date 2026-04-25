import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { AUTH_COOKIE_NAME } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/produtos") && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/login") && token) {
    const produtosUrl = new URL("/produtos", request.url);
    return NextResponse.redirect(produtosUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/produtos/:path*"],
};
