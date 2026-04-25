"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { login } from "@/features/auth/services/authService";
import type { LoginRequest } from "@/features/auth/types";

export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(payload: LoginRequest) {
    setIsLoading(true);
    setError(null);

    try {
      await login(payload);
      router.push("/produtos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel entrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    handleLogin,
    isLoading,
    error,
    setError,
  };
}
