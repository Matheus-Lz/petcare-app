import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CustomerHeader from "./CustomerHeader";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const real = jest.requireActual("react-router-dom");
  return { ...real, useNavigate: () => mockNavigate };
});

jest.mock("../CustomerEditProfile/CustomerEditProfile", () => ({
  __esModule: true,
  default: ({ open, onClose, userId }: any) =>
    open ? (
      <div data-testid="edit-modal">
        modal-{userId}
        <button onClick={onClose}>fechar</button>
      </div>
    ) : null,
}));

describe("CustomerHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  const renderHeader = (username = "Matheus", userId = "u-123") => {
    sessionStorage.setItem("userId", userId);
    return render(
      <MemoryRouter>
        <CustomerHeader username={username} />
      </MemoryRouter>
    );
  };

  test("renderiza links e username", () => {
    renderHeader("Maria");

    expect(screen.getByRole("link", { name: /pet services/i })).toHaveAttribute(
      "href",
      "/pet-service"
    );
    expect(screen.getByRole("link", { name: /agendamentos/i })).toHaveAttribute(
      "href",
      "/schedulings"
    );
    expect(screen.getByText("Maria")).toBeInTheDocument();
  });

  test("abre e fecha modal de edição de perfil", async () => {
    renderHeader("João", "user-xyz");

    await userEvent.click(screen.getByText("João"));
    expect(screen.getByTestId("edit-modal")).toHaveTextContent("modal-user-xyz");

    await userEvent.click(screen.getByText("fechar"));
    expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
  });

  test("logout limpa storages e navega para /auth", async () => {
    const spyLocal = jest.spyOn(window.localStorage.__proto__, "clear");
    const spySession = jest.spyOn(window.sessionStorage.__proto__, "clear");

    renderHeader();

    await userEvent.click(screen.getByRole("img", { name: /logout/i }));

    expect(spyLocal).toHaveBeenCalled();
    expect(spySession).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/auth");
  });
});
