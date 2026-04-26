"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faUnlockKeyhole, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";

import { useLogin } from "@/features/auth/hooks/useLogin";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";

const formStyle: CSSProperties = {
  width: "min(100%, 520px)",
  display: "grid",
  gap: "1.35rem",
};

const fieldStyle: CSSProperties = {
  height: "66px",
  borderRadius: "999px",
  background: "#ffffff",
  border: "none",
  padding: "0 1.8rem",
  color: "#505050",
  fontSize: "1.18rem",
  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.04)",
};

export function LoginForm() {
  const { handleLogin, isLoading, error, setError } = useLogin();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [manterLogado, setManterLogado] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; senha?: string }>({});

  function validate() {
    const nextErrors: { email?: string; senha?: string } = {};

    if (!email.trim()) {
      nextErrors.email = "Informe seu usuário.";
    }

    if (!senha.trim()) {
      nextErrors.senha = "Informe sua senha.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await handleLogin({
      email: email.trim(),
      senha,
      manterLogado,
    });
  }

  return (
    <form style={formStyle} onSubmit={onSubmit}>
      <Input
        id="email"
        type="text"
        inputMode="text"
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="username"
        placeholder="Usuário"
        value={email}
        error={fieldErrors.email}
        style={fieldStyle}
        leftIcon={
          <FontAwesomeIcon
            icon={faUser}
            style={{ width: "1.2rem", height: "1.2rem", color: "#676767", display: "block" }}
          />
        }
        onChange={(event) => {
          setEmail(event.target.value);
          setError(null);
          if (fieldErrors.email) {
            setFieldErrors((current) => ({ ...current, email: undefined }));
          }
        }}
      />

      <Input
        id="senha"
        type="password"
        placeholder="Senha"
        value={senha}
        error={fieldErrors.senha}
        style={fieldStyle}
        leftIcon={
          <FontAwesomeIcon
            icon={faUnlockKeyhole}
            style={{ width: "1.2rem", height: "1.2rem", color: "#676767", display: "block" }}
          />
        }
        onChange={(event) => {
          setSenha(event.target.value);
          setError(null);
          if (fieldErrors.senha) {
            setFieldErrors((current) => ({ ...current, senha: undefined }));
          }
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          padding: "0.65rem 1rem 0",
          color: "#ffffff",
          fontSize: "0.98rem",
          fontWeight: 500,
        }}
      >
        <label
          htmlFor="manter-logado"
          style={{ display: "flex", alignItems: "center", gap: "0.85rem", cursor: "pointer" }}
        >
          <input
            id="manter-logado"
            type="checkbox"
            checked={manterLogado}
            onChange={(event) => setManterLogado(event.target.checked)}
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              margin: "-1px",
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          />
          <span
            aria-hidden="true"
            style={{
              width: "1rem",
              height: "1rem",
              border: "2px solid #ffffff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              flex: "0 0 auto",
              boxShadow: manterLogado ? "0 0 0 2px rgba(255, 255, 255, 0.12)" : "none",
            }}
          >
            {manterLogado ? (
              <FontAwesomeIcon icon={faCheck} style={{ width: "0.55rem", height: "0.55rem" }} />
            ) : null}
          </span>
          <span>Manter logado</span>
        </label>

        <Link href="/login" style={{ color: "#ffffff", fontWeight: 500, textDecoration: "none" }}>
          Esqueceu a senha?
        </Link>
      </div>

      {error ? (
        <div
          role="alert"
          style={{
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.88)",
            color: "#b72a2a",
            padding: "0.9rem 1rem",
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      ) : null}

      <div style={{ display: "grid", justifyItems: "center", paddingTop: "1.35rem" }}>
        <Button
          type="submit"
          disabled={isLoading}
          style={{
            minWidth: "220px",
            minHeight: "56px",
            borderRadius: "999px",
            background: "#ffffff",
            color: "#5b5b5b",
            fontSize: "1.2rem",
            fontWeight: 600,
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.07)",
          }}
        >
          {isLoading ? "Entrando..." : "Login"}
        </Button>
      </div>
    </form>
  );
}
