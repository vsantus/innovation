import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ProductCard } from "@/features/products/components/ProductCard";
import type { Product } from "@/features/products/types";

const product: Product = {
  codigo: "2651",
  nome: "CHAVEIRO METAL COM NYLON",
  referencia: "10180942651",
  codigo_categoria: "1018109",
  imagem: "https://imgprodutos.s3.us-east-2.amazonaws.com/2651/chaveiro-metal-com-nylon-1-1.jpg",
  preco: "0.0",
  descricao: "Chaveiro de metal com detalhe colorido em nylon. Metal liso e espelhado de ambos lados.",
};

describe("ProductCard", () => {
  it("renderiza as principais informacoes do produto", () => {
    render(
      <ProductCard
        product={product}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        onViewDetails={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: product.nome })).toBeInTheDocument();
    expect(screen.getByText(product.codigo)).toBeInTheDocument();
    expect(screen.getByText("R$ 0,00")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: product.nome })).toHaveAttribute("src", product.imagem);
  });

  it("dispara favoritos e abertura de detalhes", async () => {
    const user = userEvent.setup();
    const onToggleFavorite = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <ProductCard
        product={product}
        isFavorite={false}
        onToggleFavorite={onToggleFavorite}
        onViewDetails={onViewDetails}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Adicionar aos favoritos" }));
    await user.click(screen.getByRole("button", { name: "CONFIRA" }));

    expect(onToggleFavorite).toHaveBeenCalledWith(product.codigo);
    expect(onViewDetails).toHaveBeenCalledWith(product);
  });
});
