import { NextResponse } from "next/server";

import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME, AUTH_ENDPOINT, AUTH_USER_COOKIE_NAME } from "@/lib/auth";
import type { LoginRequest, LoginResponse } from "@/features/auth/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequest;

    const response = await fetch(AUTH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        senha: body.senha,
        manter_logado: body.manterLogado,
      }),
      cache: "no-store",
    });

    const data = (await response.json()) as LoginResponse;

    if (!response.ok || data.status === 0 || !data.token_de_acesso) {
      return NextResponse.json(
        {
          status: 0,
          message: data.message || "Email ou senha invalidos. Confira os dados e tente novamente.",
        },
        { status: response.ok ? 401 : response.status },
      );
    }

    const nextResponse = NextResponse.json({
      status: 1,
      message: data.message,
      dados_usuario: data.dados_usuario,
    });

    nextResponse.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: data.token_de_acesso,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      ...(body.manterLogado ? { maxAge: AUTH_COOKIE_MAX_AGE } : {}),
    });

    nextResponse.cookies.set({
      name: AUTH_USER_COOKIE_NAME,
      value: encodeURIComponent(JSON.stringify(data.dados_usuario)),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      ...(body.manterLogado ? { maxAge: AUTH_COOKIE_MAX_AGE } : {}),
    });

    return nextResponse;
  } catch {
    return NextResponse.json(
      {
        status: 0,
        message: "Nao foi possivel fazer login agora. Tente novamente em instantes.",
      },
      { status: 500 },
    );
  }
}
