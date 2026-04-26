import { cookies } from "next/headers";

import { ProductList } from "@/features/products/components/ProductList";
import type { UserData } from "@/features/auth/types";
import { AUTH_USER_COOKIE_NAME } from "@/lib/auth";

function getUserData() {
  const userCookie = cookies().get(AUTH_USER_COOKIE_NAME)?.value;

  if (!userCookie) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(userCookie)) as UserData;
  } catch {
    return null;
  }
}

export default function ProdutosPage() {
  const user = getUserData();

  return <ProductList userName={user?.nome_usuario} userGroup={user?.nome_grupo} />;
}
