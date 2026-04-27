import type { Product } from "@/features/products/types";

export class UnauthorizedError extends Error {
  constructor(message = "Sessão expirada.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export async function getProducts(search = "") {
  const hasSearch = search.trim().length > 0;
  const response = await fetch("/api/products", {
    method: hasSearch ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: hasSearch ? JSON.stringify({ search }) : undefined,
  });

  const data = await response.json();

  if (response.status === 401) {
    throw new UnauthorizedError(data.message);
  }

  if (!response.ok) {
    throw new Error(data.message || "Não foi possível carregar os produtos.");
  }

  return data as Product[];
}
