# Innovation Brindes - Teste Front-end

Mini-aplicacao em Next.js para login e listagem de produtos da Innovation Brindes.

## Rodar Localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

Credenciais de teste:

```text
usuario: dinamica
senha: 123
```

## Rodar Com Docker

Pre-requisito: Docker Desktop aberto e rodando.

Na raiz do projeto, crie a imagem:

```bash
docker build -t teste-innovation .
```

Rode o container:

```bash
docker run --rm -p 3000:3000 teste-innovation
```

Acesse `http://localhost:3000`.

Credenciais:

```text
usuario: dinamica
senha: 123
```

Se a porta 3000 ja estiver ocupada, use uma porta local alternativa:

```bash
docker run --rm -p 3001:3000 teste-innovation
```

Nesse caso, acesse `http://localhost:3001`.

Para ambientes HTTPS, habilite cookies seguros:

```bash
docker run --rm -p 3000:3000 -e COOKIE_SECURE=true teste-innovation
```

## Scripts

```bash
npm run dev       # ambiente de desenvolvimento
npm run build     # build de producao
npm run start     # servidor Next.js de producao
npm run lint      # lint
npm run test:run  # testes unitarios
npm run test:e2e  # smoke E2E com Playwright
```

## Decisoes Tecnicas

- Next.js App Router com TypeScript.
- Rotas internas em `/api/auth/login`, `/api/auth/logout` e `/api/products` para proteger o token no servidor.
- Token salvo em cookie HTTP-only.
- Middleware protege `/produtos` e redireciona usuarios autenticados que tentam voltar para `/login`.
- React Query gerencia cache, revalidacao, loading, erro e retry da listagem.
- Zustand persiste favoritos em `localStorage`.
- Busca com debounce de 400 ms.
- Carregamento progressivo local em lotes de 5 itens, pois a API retorna a lista completa e nao expoe paginacao remota.
- Docker multi-stage com `output: "standalone"` para imagem menor de producao.

## Funcionalidades

- Login com mensagem amigavel de erro.
- Guarda de rota para `/produtos`.
- Grid responsivo de produtos.
- Busca por nome/codigo/referencia.
- Ordenacao por nome e preco.
- Favoritos persistidos localmente.
- Filtro para mostrar apenas favoritos.
- Modal acessivel com `aria-*`, foco preso e fechamento por `Esc`.
- Skeleton na primeira carga, loading incremental e acao de retry.
- 401 na listagem forca logout e redireciona para `/login`.

## Pendencias E Melhorias Futuras

- Melhorar a performance medida pelo Lighthouse. Durante os testes, os melhores resultados obtidos foram:
  - `/login`: 78 em Performance e 96 em Acessibilidade.
  - `/produtos`: 85 em Performance e 96 em Acessibilidade.

## Evidencias

- Docker build validado com sucesso.
- Docker run validado com sucesso em `http://localhost:3000/login`.
- Lighthouse login: [`src/assets/lighthouse/login.jpeg`](src/assets/lighthouse/login.jpeg).
- Lighthouse produtos: [`src/assets/lighthouse/produtos.png`](src/assets/lighthouse/produtos.png).
- Video do fluxo login -> produtos: [`src/assets/fluxo/fluxo.mp4`](src/assets/fluxo/fluxo.mp4).
