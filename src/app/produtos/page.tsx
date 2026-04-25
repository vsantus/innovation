export default function ProdutosPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <section
        style={{
          width: "min(100%, 720px)",
          padding: "2rem",
          borderRadius: "28px",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Produtos</h1>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>
          Login concluido com sucesso. Esta rota esta protegida por token e pronta para receber a listagem de produtos.
        </p>
      </section>
    </main>
  );
}
