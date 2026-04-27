import { NextResponse } from "next/server";

import { getAuthToken } from "@/lib/api";
import { PRODUCTS_ENDPOINT } from "@/lib/products";
import type { Product } from "@/features/products/types";

type ProductsApiPayload = Product[] | { produtos?: Product[]; data?: Product[]; dados?: Product[] };

function normalizeProducts(payload: ProductsApiPayload): Product[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.produtos ?? payload.data ?? payload.dados ?? [];
}

function filterProducts(products: Product[], search: string) {
  const term = search.trim().toLowerCase();

  if (!term) {
    return products;
  }

  return products.filter((product) => {
    const name = product.nome?.toLowerCase() ?? "";
    const code = product.codigo?.toLowerCase() ?? "";
    const reference = product.referencia?.toLowerCase() ?? "";

    return name.includes(term) || code.includes(term) || reference.includes(term);
  });
}

function buildSearchPayload(search: string) {
  const term = search.trim();
  const isCodeSearch = /^\d+$/.test(term);

  return {
    nome_produto: isCodeSearch ? "" : term,
    codigo_produto: isCodeSearch ? term : "",
  };
}

async function requestProducts(token: string, search = "") {
  const hasSearch = search.trim().length > 0;
  const response = await fetch(PRODUCTS_ENDPOINT, {
    method: hasSearch ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: hasSearch ? JSON.stringify(buildSearchPayload(search)) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar os produtos.");
  }

  return normalizeProducts((await response.json()) as ProductsApiPayload);
}

export async function GET() {
  try {
    const token = getAuthToken();

    if (!token) {
      return NextResponse.json({ message: "Sessão expirada." }, { status: 401 });
    }

    const products = await requestProducts(token);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erro ao carregar produtos." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = getAuthToken();

    if (!token) {
      return NextResponse.json({ message: "Sessão expirada." }, { status: 401 });
    }

    const body = (await request.json()) as { search?: string };
    const search = body.search ?? "";

    try {
      const products = await requestProducts(token, search);
      const filteredProducts = filterProducts(products, search);

      if (search.trim() && filteredProducts.length === 0) {
        const allProducts = await requestProducts(token);
        return NextResponse.json(filterProducts(allProducts, search));
      }

      return NextResponse.json(filteredProducts);
    } catch {
      const products = await requestProducts(token);
      return NextResponse.json(filterProducts(products, search));
    }
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erro ao filtrar produtos." },
      { status: 500 },
    );
  }
}
