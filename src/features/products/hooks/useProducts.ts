"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { getProducts, UnauthorizedError } from "@/features/products/services/productService";
import type { Product, ProductSort } from "@/features/products/types";
import { useDebounce } from "@/shared/hooks/useDebounce";

const INITIAL_VISIBLE_PRODUCTS = 5;

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
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ProductSort>("name-asc");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_PRODUCTS);
  const debouncedSearch = useDebounce(search, 400);

  const productsQuery = useQuery({
    queryKey: ["products", debouncedSearch],
    queryFn: () => getProducts(debouncedSearch),
    retry: (failureCount, error) => !(error instanceof UnauthorizedError) && failureCount < 1,
  });

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_PRODUCTS);
  }, [debouncedSearch, sort]);

  const sortedProducts = useMemo(
    () => sortProducts(productsQuery.data ?? [], sort),
    [productsQuery.data, sort],
  );

  return {
    products: sortedProducts,
    totalProducts: sortedProducts.length,
    search,
    setSearch,
    sort,
    setSort,
    visibleCount,
    setVisibleCount,
    isLoading: productsQuery.isLoading,
    isFetching: productsQuery.isFetching,
    error: productsQuery.error,
    refetch: productsQuery.refetch,
  };
}
