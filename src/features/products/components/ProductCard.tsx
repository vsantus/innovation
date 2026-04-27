"use client";

import { faBoxOpen, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { memo } from "react";

import type { Product } from "@/features/products/types";
import { formatCurrency } from "@/shared/utils/formatCurrency";

type ProductCardProps = {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (productCode: string) => void;
  onViewDetails: (product: Product) => void;
};

const colorOptions = [
  "#8f2f26",
  "#2e5d83",
  "#30333a",
  "#38a8c5",
  "#37a848",
  "#8cc80f",
  "#373737",
  "#55a9c5",
  "#ff4a1d",
  "#ffbc00",
  "#2a2449",
];

const styles = {
  shell: "grid min-h-[606px] w-full max-w-[234px] grid-rows-[58px_1fr] gap-2 justify-self-center",
  heading: "grid h-[58px] content-start justify-items-center bg-white text-center",
  title: "line-clamp-3 min-h-8 max-w-full break-words text-base font-black uppercase leading-tight",
  code: "text-sm font-bold text-product-titleCode",
  card: "grid min-h-[520px] min-w-0 grid-rows-[232px_66px_1fr_40px] border border-product-border bg-white",
  media: "relative h-[232px] overflow-hidden bg-white",
  badge: "absolute right-0 top-0 z-10 bg-slate-50 px-1 py-1 text-xs font-black text-product-badge",
  favoriteButton:
    "absolute left-2 top-2 z-10 grid h-7 w-7 cursor-pointer place-items-center rounded-full border-0 bg-white/90 shadow-[0_6px_16px_rgba(0,0,0,0.08)]",
  image: "block h-full w-full object-contain px-2 pb-3 pt-6",
  packageArea: "relative h-[66px] bg-white",
  package:
    "absolute -top-px left-0 flex h-[66px] w-[78%] items-center gap-2 border border-product-divider bg-white px-2 py-2 text-[0.68rem] font-semibold text-product-note",
  packageIcon: "h-9 w-9 flex-none text-brand-green",
  body: "grid min-h-[181px] grid-rows-[64px_44px_1fr] content-stretch gap-2 px-3 py-3",
  description: "line-clamp-3 min-h-16 text-xs leading-relaxed text-product-body",
  colorGroup: "grid content-start gap-1",
  colorLabel: "text-xs font-extrabold text-product-label",
  colorSwatches: "flex max-w-28 flex-wrap gap-1",
  colorSwatch: "h-[13px] w-[13px] rounded-full border border-product-divider",
  priceBlock: "grid self-end justify-items-end gap-px text-right",
  priceLabel: "text-[0.7rem] text-product-titleCode",
  price: "text-xl leading-none text-product-price",
  priceNote: "text-[0.58rem] font-extrabold text-product-note",
  cta: "h-10 cursor-pointer border-0 bg-brand-green text-sm font-black text-white",
};

function ProductCardComponent({ product, isFavorite, onToggleFavorite, onViewDetails }: ProductCardProps) {
  return (
    <article className={styles.shell}>
      <div className={styles.heading}>
        <h2 className={styles.title}>{product.nome}</h2>
        <span className={styles.code}>{product.codigo}</span>
      </div>

      <div className={styles.card}>
        <div className={styles.media}>
          <span className={styles.badge}>EXCLUSIVO!</span>
          <button
            className={`${styles.favoriteButton} ${isFavorite ? "text-product-favorite" : "text-product-favoriteMuted"}`}
            type="button"
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            onClick={() => onToggleFavorite(product.codigo)}
          >
            <FontAwesomeIcon icon={faStar} />
          </button>
          <Image
            className={styles.image}
            src={product.imagem}
            alt={product.nome}
            width={234}
            height={232}
            sizes="(max-width: 460px) 100vw, 234px"
          />
        </div>

        <div className={styles.packageArea}>
          <div className={styles.package}>
            <FontAwesomeIcon className={styles.packageIcon} icon={faBoxOpen} />
            <span>com embalagem especial</span>
          </div>
        </div>

        <div className={styles.body}>
          <p className={styles.description}>{product.descricao || product.nome}</p>

          <div className={styles.colorGroup} aria-label="Cores disponíveis">
            <span className={styles.colorLabel}>Cores:</span>
            <div className={styles.colorSwatches}>
              {colorOptions.map((color) => (
                <span
                  key={color}
                  className={styles.colorSwatch}
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          <div className={styles.priceBlock}>
            <span className={styles.priceLabel}>a partir de</span>
            <strong className={styles.price}>{formatCurrency(product.preco)}</strong>
            <small className={styles.priceNote}>gerado pela melhor oferta</small>
          </div>
        </div>

        <button className={styles.cta} type="button" onClick={() => onViewDetails(product)}>
          CONFIRA
        </button>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardComponent);
