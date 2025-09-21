import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ResetPassword from "./ResetPassword";

const mockResetPassword = jest.fn();
const mockNavigate = jest.fn();

jest.mock("../../../api/user/UserService", () => ({
  resetPassword: (...args: any[]) => mockResetPassword(...args),
}));

jest.mock("../../../utils/notifications", () => ({
  notifySuccess: jest.fn(),
  notifyError: jest.fn(),
}));

jest.mock("react-router-dom", () => {
  const real = jest.requireActual("react-router-dom");
  return {
    ...real,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams("token=tok123"), jest.fn()],
  };
});

describe("ResetPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza título, campos e botões", () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Redefinir Senha/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Nova senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar senha/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Redefinir senha/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Voltar para login/i })
    ).toBeInTheDocument();
  });

  test("fluxo de sucesso: envia nova senha e navega", async () => {
    mockResetPassword.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText(/Nova senha/i), "123456");
    await userEvent.type(
      screen.getByPlaceholderText(/Confirmar senha/i),
      "123456"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Redefinir senha/i })
    );

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith("tok123", "123456");
      expect(
        require("../../../utils/notifications").notifySuccess
      ).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/auth");
    });
  });

  test("fluxo de erro: mostra notifyError quando API falha", async () => {
    mockResetPassword.mockRejectedValueOnce(new Error("fail"));
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText(/Nova senha/i), "123456");
    await userEvent.type(
      screen.getByPlaceholderText(/Confirmar senha/i),
      "123456"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Redefinir senha/i })
    );

    await waitFor(() => {
      expect(
        require("../../../utils/notifications").notifyError
      ).toHaveBeenCalled();
    });
  });

  test("validação: senhas diferentes exibem erro e não chama API", async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText(/Nova senha/i), "123456");
    await userEvent.type(
      screen.getByPlaceholderText(/Confirmar senha/i),
      "123"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Redefinir senha/i })
    );

    expect(
      await screen.findByText(/As senhas não coincidem/i)
    ).toBeInTheDocument();
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  test("botão Voltar para login navega para /auth", async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Voltar para login/i })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/auth");
  });
});
