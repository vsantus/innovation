import { expect, test } from "@playwright/test";

const productMock = {
  codigo: "2651",
  nome: "CHAVEIRO METAL COM NYLON",
  referencia: "10180942651",
  codigo_categoria: "1018109",
  imagem: "https://imgprodutos.s3.us-east-2.amazonaws.com/2651/chaveiro-metal-com-nylon-1-1.jpg",
  preco: "0.0",
  descricao: "Chaveiro de metal com detalhe colorido em nylon. Metal liso e espelhado de ambos lados.",
};

test("login com usuario valido exibe o grid de produtos", async ({ page }) => {
  await page.route("**/api/auth/login", async (route) => {
    const request = route.request();
    const payload = (await request.postDataJSON()) as { email?: string; senha?: string };

    if (payload.email !== "dinamica" || payload.senha !== "123") {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          status: 0,
          message: "Email ou senha invalidos.",
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Set-Cookie": "innovation_access_token=e2e-token; Path=/; HttpOnly; SameSite=Lax",
      },
      body: JSON.stringify({
        status: 1,
        message: "Login realizado com sucesso.",
        dados_usuario: {
          nome_usuario: "Dinamica",
          nome_grupo: "Innovation",
        },
      }),
    });
  });

  await page.route("**/api/products", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([productMock]),
    });
  });

  await page.goto("/login");
  await page.getByPlaceholder("Usuario").fill("dinamica");
  await page.getByPlaceholder("Senha").fill("123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/produtos$/);
  await expect(page.getByRole("heading", { name: "Produtos" })).toBeVisible();
  await expect(page.getByRole("heading", { name: productMock.nome })).toBeVisible();
  await expect(page.getByText(productMock.codigo)).toBeVisible();
});
