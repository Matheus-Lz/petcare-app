import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";

const mockForgot = jest.fn();
const mockNavigate = jest.fn();

jest.mock("../../../utils/notifications", () => ({
  notifySuccess: jest.fn(),
  notifyError: jest.fn(),
}));

jest.mock("react-router-dom", () => {
  const real = jest.requireActual("react-router-dom");
  return { ...real, useNavigate: () => mockNavigate };
});

jest.mock("../../../api/user/UserService", () => ({
  forgotPassword: (...a: any[]) => mockForgot(...a),
}));

describe("ForgotPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza título e campo", () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
    expect(screen.getByText(/Redefinir Senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test("envia e navega ao sucesso", async () => {
    mockForgot.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), "a@b.com");
    await userEvent.click(
      screen.getByRole("button", { name: /enviar link de redefinição/i })
    );

    await waitFor(() => expect(mockForgot).toHaveBeenCalledWith("a@b.com"));
    expect(mockNavigate).toHaveBeenCalledWith("/auth");
  });

  test("mostra erro ao falhar", async () => {
    mockForgot.mockRejectedValueOnce(new Error("x"));

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), "a@b.com");
    await userEvent.click(
      screen.getByRole("button", { name: /enviar link de redefinição/i })
    );

    await waitFor(() => expect(mockForgot).toHaveBeenCalled());
  });
});