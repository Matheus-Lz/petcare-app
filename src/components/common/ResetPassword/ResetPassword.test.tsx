import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPassword from "./ResetPassword";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

const mockReset = jest.fn();

jest.mock("../../../utils/notifications", () => ({
  notifySuccess: jest.fn(),
  notifyError: jest.fn(),
}));

jest.mock("../../../api/user/UserService", () => ({
  resetPassword: (...a: any[]) => mockReset(...a),
}));

function renderWithRouter(entry = "/?token=tok123") {
  const router = createMemoryRouter(
    [
      { path: "/", element: <ResetPassword /> },
      { path: "/auth", element: <div>AuthPage</div> },
    ],
    { initialEntries: [entry] }
  );
  render(<RouterProvider router={router} future={{ v7_startTransition: true }} />);
  return router;
}

describe("ResetPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza campos", () => {
    renderWithRouter();
    expect(screen.getByLabelText(/nova senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
  });

  test("redefine e navega", async () => {
    mockReset.mockResolvedValueOnce({});
    renderWithRouter();

    await userEvent.type(screen.getByLabelText(/nova senha/i), "123456");
    await userEvent.type(screen.getByLabelText(/confirmar senha/i), "123456");
    await userEvent.click(screen.getByRole("button", { name: /redefinir senha/i }));

    await waitFor(() => expect(mockReset).toHaveBeenCalledWith("tok123", "123456"));
    await waitFor(() => expect(screen.getByText("AuthPage")).toBeInTheDocument());
  });
});
