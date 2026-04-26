"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ProductCard } from "@/features/products/components/ProductCard";
import { ProductModal } from "@/features/products/components/ProductModal";
import { ProductSkeleton } from "@/features/products/components/ProductSkeleton";
import { useProducts } from "@/features/products/hooks/useProducts";
import type { Product, ProductSort } from "@/features/products/types";
import { Header } from "@/shared/components/Header";

type ProductListProps = {
  userName?: string;
  userGroup?: string;
};

const FAVORITES_STORAGE_KEY = "innovation_favorite_products";
const PAGE_SIZE = 10;

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
  pagination: "mx-auto flex w-full max-w-[1160px] flex-wrap items-center justify-center gap-2 px-4 text-center font-bold text-product-muted md:px-8",
  pageButton: "grid h-10 w-10 cursor-pointer place-items-center rounded-xl border text-base font-extrabold",
  pageButtonActive: "border-product-control bg-product-panel text-[#111111] shadow-product",
  pageButtonIdle: "border-transparent bg-transparent text-product-text hover:border-product-control hover:bg-product-panel",
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
    page,
    setPage,
    isLoading,
    isFetching,
    error,
  } = useProducts();
  const [favoriteCodes, setFavoriteCodes] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const storedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (storedFavorites) {
      try {
        setFavoriteCodes(JSON.parse(storedFavorites) as string[]);
      } catch {
        setFavoriteCodes([]);
      }
    }

    setFavoritesLoaded(true);
  }, []);

  useEffect(() => {
    if (!favoritesLoaded) {
      return;
    }

    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteCodes));
  }, [favoriteCodes, favoritesLoaded]);

  const filteredProducts = useMemo(() => {
    if (!showFavoritesOnly) {
      return products;
    }

    return products.filter((product) => favoriteCodes.includes(product.codigo));
  }, [favoriteCodes, products, showFavoritesOnly]);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [setPage, showFavoritesOnly]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, setPage, totalPages]);

  function toggleFavorite(productCode: string) {
    setFavoriteCodes((current) => {
      if (current.includes(productCode)) {
        return current.filter((code) => code !== productCode);
      }

      return [...current, productCode];
    });
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/login");
    router.refresh();
  }

  return (
    <main className={styles.page}>
      <Header
        userName={userName}
        userGroup={userGroup}
        favoritesCount={favoriteCodes.length}
        onFavoritesClick={() => setShowFavoritesOnly((current) => !current)}
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
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <section className={styles.grid} aria-label="Carregando produtos">
          {Array.from({ length: 10 }).map((_, index) => (
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

          <nav className={styles.pagination} aria-label="Paginação de produtos">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={`${styles.pageButton} ${pageNumber === page ? styles.pageButtonActive : styles.pageButtonIdle}`}
                aria-label={`Ir para página ${pageNumber}`}
                aria-current={pageNumber === page ? "page" : undefined}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </nav>
        </>
      ) : null}

      {isFetching && !isLoading ? (
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
