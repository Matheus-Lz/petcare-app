import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ResetPassword from "./ResetPassword";

const mockReset = jest.fn();
const mockNavigate = jest.fn();

jest.mock("../../../utils/notifications", () => ({
  notifySuccess: jest.fn(),
  notifyError: jest.fn(),
}));

jest.mock("react-router-dom", () => {
  const real = jest.requireActual("react-router-dom");
  return {
    ...real,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams("?token=tok123")],
  };
});

jest.mock("../../../api/user/UserService", () => ({
  resetPassword: (...a: any[]) => mockReset(...a),
}));

describe("ResetPassword", () => {
  beforeEach(() => jest.clearAllMocks());

  test("renderiza campos", () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/nova senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
  });

  test("redefine e navega", async () => {
    mockReset.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/nova senha/i), "123456");
    await userEvent.type(screen.getByLabelText(/confirmar senha/i), "123456");
    await userEvent.click(
      screen.getByRole("button", { name: /redefinir senha/i })
    );

    await waitFor(() =>
      expect(mockReset).toHaveBeenCalledWith("tok123", "123456")
    );
    expect(mockNavigate).toHaveBeenCalledWith("/auth");
  });
});