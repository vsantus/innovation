"use client";

import { useEffect, useId, useRef } from "react";

import type { Product } from "@/features/products/types";
import { formatCurrency } from "@/shared/utils/formatCurrency";

type ProductModalProps = {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
};

const styles = {
  backdrop: "fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 py-6",
  dialog:
    "grid max-h-[90vh] w-full max-w-[760px] overflow-hidden rounded-2xl bg-white text-product-text shadow-[0_24px_70px_rgba(0,0,0,0.28)]",
  header: "flex items-start justify-between gap-4 border-b border-product-divider px-5 py-4",
  eyebrow: "text-xs font-extrabold uppercase text-brand-green",
  title: "mt-1 text-2xl font-black uppercase leading-tight",
  close: "h-10 rounded-lg border border-product-control bg-white px-4 font-bold text-product-muted hover:bg-product-panel",
  body: "grid gap-5 overflow-y-auto p-5 md:grid-cols-[240px_1fr]",
  imageWrap: "grid min-h-[240px] place-items-center border border-product-divider bg-white",
  image: "max-h-[220px] w-full object-contain p-4",
  info: "grid content-start gap-4",
  description: "text-sm leading-relaxed text-product-body",
  metaGrid: "grid grid-cols-2 gap-3 text-sm",
  metaItem: "rounded-lg border border-product-divider bg-product-panel p-3",
  metaLabel: "block text-xs font-bold uppercase text-product-muted",
  metaValue: "mt-1 block font-black text-product-text",
  price: "text-2xl font-black text-product-price",
  action: "min-h-10 rounded-lg border-0 bg-brand-green px-5 font-black text-white",
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const focusableElements = Array.from(dialog?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    firstFocusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || focusableElements.length === 0) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }

      if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) {
    return null;
  }

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Detalhe rápido</span>
            <h2 id={titleId} className={styles.title}>
              {product.nome}
            </h2>
          </div>
          <button className={styles.close} type="button" onClick={onClose}>
            Fechar
          </button>
        </header>

        <div className={styles.body}>
          <div className={styles.imageWrap}>
            <img className={styles.image} src={product.imagem} alt={product.nome} />
          </div>

          <section className={styles.info}>
            <p id={descriptionId} className={styles.description}>
              {product.descricao || product.nome}
            </p>

            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Código</span>
                <strong className={styles.metaValue}>{product.codigo}</strong>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Referência</span>
                <strong className={styles.metaValue}>{product.referencia}</strong>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Categoria</span>
                <strong className={styles.metaValue}>{product.codigo_categoria}</strong>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Preço</span>
                <strong className={styles.price}>{formatCurrency(product.preco)}</strong>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
