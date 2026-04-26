export type Product = {
  codigo: string;
  nome: string;
  referencia: string;
  codigo_categoria: string;
  imagem: string;
  preco: string;
  descricao: string;
};

export type ProductSort = "name-asc" | "name-desc" | "price-asc" | "price-desc";
