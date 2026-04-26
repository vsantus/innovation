"use client";

import { useEffect, useMemo, useState } from "react";

import { getProducts } from "@/features/products/services/productService";
import type { Product, ProductSort } from "@/features/products/types";
import { useDebounce } from "@/shared/hooks/useDebounce";

function sortProducts(products: Product[], sort: ProductSort) {
  return [...products].sort((first, second) => {
    if (sort === "name-asc") {
      return first.nome.localeCompare(second.nome, "pt-BR");
    }

    if (sort === "name-desc") {
      return second.nome.localeCompare(first.nome, "pt-BR");
    }

    const firstPrice = Number(first.preco);
    const secondPrice = Number(second.preco);

    return sort === "price-asc" ? firstPrice - secondPrice : secondPrice - firstPrice;
  });
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ProductSort>("name-asc");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    let isCurrent = true;

    async function loadProducts() {
      setError(null);
      setIsFetching(true);

      try {
        const nextProducts = await getProducts(debouncedSearch);

        if (isCurrent) {
          setProducts(nextProducts);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err instanceof Error ? err.message : "Nao foi possivel carregar os produtos.");
          setProducts([]);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
          setIsFetching(false);
        }
      }
    }

    loadProducts();

    return () => {
      isCurrent = false;
    };
  }, [debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort]);

  const sortedProducts = useMemo(() => sortProducts(products, sort), [products, sort]);
  return {
    products: sortedProducts,
    totalProducts: sortedProducts.length,
    search,
    setSearch,
    sort,
    setSort,
    page,
    setPage,
    isLoading,
    isFetching,
    error,
  };
}
