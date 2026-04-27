"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { ProductCard } from "@/features/products/components/ProductCard";
import { ProductSkeleton } from "@/features/products/components/ProductSkeleton";
import { useProducts } from "@/features/products/hooks/useProducts";
import { UnauthorizedError } from "@/features/products/services/productService";
import type { Product, ProductSort } from "@/features/products/types";
import { Header } from "@/shared/components/Header";
import { useFavoritesStore } from "@/store/favoritesStore";

type ProductListProps = {
  userName?: string;
  userGroup?: string;
};

const PAGE_SIZE = 5;

const ProductModal = dynamic(
  () => import("@/features/products/components/ProductModal").then((mod) => mod.ProductModal),
  { ssr: false },
);

const styles = {
  page: "min-h-screen bg-white pb-12 text-product-text",
  toolbar:
    "mx-auto flex w-full max-w-[1160px] items-end justify-between gap-5 px-4 pb-2 pt-5 max-[760px]:flex-col max-[760px]:items-stretch md:px-8",
  toolbarControls: "flex flex-wrap items-end justify-end gap-3 max-[760px]:justify-start max-[460px]:grid max-[460px]:w-full",
  title: "text-[1.35rem] font-bold leading-tight",
  summary: "mt-2 text-product-subtle",
  field: "grid gap-1",
  fieldFull: "grid gap-1 max-[460px]:w-full",
  label: "text-[0.82rem] font-bold text-product-muted",
  searchInput:
    "h-11 w-[min(72vw,320px)] rounded-lg border border-product-control bg-white px-4 text-product-text outline-none max-[460px]:w-full",
  select: "h-11 min-w-40 cursor-pointer rounded-lg border border-product-control bg-white px-3 text-product-text outline-none max-[460px]:w-full",
  favoriteNote: "mx-auto flex w-full max-w-[1160px] items-center justify-between gap-4 px-4 pb-4 text-product-muted md:px-8",
  favoriteClear: "min-h-10 cursor-pointer rounded-lg border-0 bg-brand-green px-4 font-extrabold text-white",
  state: "mx-auto my-8 w-[min(100%-2rem,720px)] rounded-lg border border-product-control bg-white p-5 text-center text-product-muted",
  errorState: "mx-auto my-8 w-[min(100%-2rem,720px)] rounded-lg border border-red-300 bg-white p-5 text-center text-red-700",
  grid: "mx-auto grid w-full max-w-[1260px] grid-cols-5 items-start gap-x-6 gap-y-8 px-4 pb-8 pt-3 max-[1180px]:grid-cols-4 max-[960px]:grid-cols-3 max-[760px]:grid-cols-2 max-[460px]:grid-cols-1 md:px-8",
  errorButton: "mt-4 min-h-10 cursor-pointer rounded-lg border-0 bg-brand-green px-5 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-70",
  loadMoreWrap: "mx-auto flex w-full max-w-[1160px] justify-center px-4 text-center md:px-8",
  loadMoreButton: "min-h-11 cursor-pointer rounded-lg border-0 bg-brand-green px-6 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-70",
};

export function ProductList({ userName, userGroup }: ProductListProps) {
  const router = useRouter();
  const {
    products,
    totalProducts,
    search,
    setSearch,
    sort,
    setSort,
    visibleCount,
    setVisibleCount,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useProducts();
  const favoriteCodes = useFavoritesStore((state) => state.favoriteCodes);
  const showFavoritesOnly = useFavoritesStore((state) => state.showFavoritesOnly);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const setShowFavoritesOnly = useFavoritesStore((state) => state.setShowFavoritesOnly);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/login");
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (!(error instanceof UnauthorizedError)) {
      return;
    }

    void handleLogout();
  }, [error, handleLogout]);

  const filteredProducts = useMemo(() => {
    if (!showFavoritesOnly) {
      return products;
    }

    return products.filter((product) => favoriteCodes.includes(product.codigo));
  }, [favoriteCodes, products, showFavoritesOnly]);
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleProducts.length < filteredProducts.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [setVisibleCount, showFavoritesOnly]);

  function handleLoadMore() {
    setIsLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((current) => current + PAGE_SIZE);
      setIsLoadingMore(false);
    }, 250);
  }

  return (
    <main className={styles.page}>
      <Header
        userName={userName}
        userGroup={userGroup}
        favoritesCount={favoriteCodes.length}
        onFavoritesClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        onUserClick={handleLogout}
      />

      <section className={styles.toolbar} aria-label="Filtros de produtos">
        <div>
          <h1 className={styles.title}>Produtos</h1>
          <p className={styles.summary}>
            {showFavoritesOnly ? "Exibindo favoritos desta página." : `${totalProducts} produtos encontrados.`}
          </p>
        </div>

        <div className={styles.toolbarControls}>
          <label className={styles.field}>
            <span className={styles.label}>Buscar produto</span>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Nome, código ou referência"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label className={styles.fieldFull}>
            <span className={styles.label}>Ordenar</span>
            <select
              className={styles.select}
              value={sort}
              onChange={(event) => setSort(event.target.value as ProductSort)}
            >
              <option value="name-asc">Nome A-Z</option>
              <option value="name-desc">Nome Z-A</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </label>
        </div>
      </section>

      {showFavoritesOnly ? (
        <div className={styles.favoriteNote}>
          <span>Filtro de favoritos ativo</span>
          <button
            className={styles.favoriteClear}
            type="button"
            onClick={() => setShowFavoritesOnly(false)}
          >
            Ver todos
          </button>
        </div>
      ) : null}

      {error ? (
        <div className={styles.errorState}>
          {error instanceof Error ? error.message : "Não foi possível carregar os produtos."}
          <br />
          <button
            className={styles.errorButton}
            type="button"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            {isFetching ? "Tentando..." : "Tentar novamente"}
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <section className={styles.grid} aria-label="Carregando produtos">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </section>
      ) : null}

      {!isLoading && !error && visibleProducts.length === 0 ? (
        <div className={styles.state}>
          Nenhum produto encontrado para os filtros selecionados.
        </div>
      ) : null}

      {!isLoading && !error && visibleProducts.length > 0 ? (
        <>
          <section className={styles.grid} aria-busy={isFetching}>
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.codigo}
                product={product}
                isFavorite={favoriteCodes.includes(product.codigo)}
                onToggleFavorite={toggleFavorite}
                onViewDetails={setSelectedProduct}
              />
            ))}
          </section>

          {hasMoreProducts ? (
            <div className={styles.loadMoreWrap}>
              <button
                className={styles.loadMoreButton}
                type="button"
                disabled={isLoadingMore}
                onClick={handleLoadMore}
              >
                {isLoadingMore ? "Carregando..." : "Carregar mais"}
              </button>
            </div>
          ) : null}
        </>
      ) : null}

      {(isFetching && !isLoading) || isLoadingMore ? (
        <div className={styles.state}>
          Atualizando produtos...
        </div>
      ) : null}

      <ProductModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
