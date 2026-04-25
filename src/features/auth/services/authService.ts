import type { LoginApiResponse, LoginRequest } from "@/features/auth/types";

export async function login(payload: LoginRequest) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as LoginApiResponse;

  if (!response.ok || data.status === 0) {
    throw new Error(data.message || "Email ou senha invalidos.");
  }

  return data;
}
