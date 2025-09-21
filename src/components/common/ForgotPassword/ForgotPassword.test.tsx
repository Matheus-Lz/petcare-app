import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";

const mockForgotPassword = jest.fn();
const mockNavigate = jest.fn();

jest.mock("../../../api/user/UserService", () => ({
  forgotPassword: (email: string) => mockForgotPassword(email),
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
  };
});

describe("ForgotPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza o formulário com título e botão", () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByText(/Redefinir Senha/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Enviar link de redefinição/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Voltar para login/i })
    ).toBeInTheDocument();
  });

  test("envia email com sucesso", async () => {
    mockForgotPassword.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Digite seu email/i);
    await userEvent.type(input, "teste@email.com");
    await userEvent.click(
      screen.getByRole("button", { name: /Enviar link de redefinição/i })
    );

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith("teste@email.com");
      expect(require("../../../utils/notifications").notifySuccess).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/auth");
    });
  });

  test("mostra erro se API falhar", async () => {
    mockForgotPassword.mockRejectedValueOnce(new Error("fail"));
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Digite seu email/i);
    await userEvent.type(input, "teste@email.com");
    await userEvent.click(
      screen.getByRole("button", { name: /Enviar link de redefinição/i })
    );

    await waitFor(() => {
      expect(require("../../../utils/notifications").notifyError).toHaveBeenCalled();
    });
  });

  test("navega para login ao clicar em voltar", async () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /Voltar para login/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/auth");
  });
});
