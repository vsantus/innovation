import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/lib/auth";

export function getAuthToken() {
  return cookies().get(AUTH_COOKIE_NAME)?.value;
}
