import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME, AUTH_COOKIE_SECURE, AUTH_USER_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ status: 1 });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: AUTH_COOKIE_SECURE,
    path: "/",
    maxAge: 0,
  });

  response.cookies.set({
    name: AUTH_USER_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: AUTH_COOKIE_SECURE,
    path: "/",
    maxAge: 0,
  });

  return response;
}
