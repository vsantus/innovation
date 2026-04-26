import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/features/auth/components/LoginForm";

const loginMock = vi.hoisted(() => ({
  handleLogin: vi.fn(),
  setError: vi.fn(),
  state: {
    isLoading: false,
    error: null as string | null,
  },
}));

vi.mock("@/features/auth/hooks/useLogin", () => ({
  useLogin: () => ({
    handleLogin: loginMock.handleLogin,
    isLoading: loginMock.state.isLoading,
    error: loginMock.state.error,
    setError: loginMock.setError,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    loginMock.handleLogin.mockReset();
    loginMock.setError.mockReset();
    loginMock.state.isLoading = false;
    loginMock.state.error = null;
  });

  it("mostra erros quando usuario e senha nao sao preenchidos", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Informe seu usuario.")).toBeInTheDocument();
    expect(screen.getByText("Informe sua senha.")).toBeInTheDocument();
    expect(loginMock.handleLogin).not.toHaveBeenCalled();
  });

  it("envia os dados preenchidos para o hook de login", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByPlaceholderText("Usuario"), " dinamica ");
    await user.type(screen.getByPlaceholderText("Senha"), "123");
    await user.click(screen.getByLabelText("Manter logado"));
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(loginMock.handleLogin).toHaveBeenCalledWith({
      email: "dinamica",
      senha: "123",
      manterLogado: true,
    });
  });
});
