import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const real = jest.requireActual("react-router-dom");
  return { ...real, useNavigate: () => mockNavigate };
});

jest.mock("../../CustomerLayout/CustomerEditProfile/CustomerEditProfile", () => ({
  __esModule: true,
  default: ({ open, onClose, userId }: any) =>
    open ? (
      <div data-testid="edit-modal">
        modal-{userId}
        <button onClick={onClose}>fechar</button>
      </div>
    ) : null,
}));

describe("Sidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  const renderWithRole = (role: string, userId = "u1") => {
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("userId", userId);
    return render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
  };

  test("SUPER_ADMIN vê todas as entradas de menu", () => {
    renderWithRole("SUPER_ADMIN");

    expect(screen.getByText("Perfil")).toBeInTheDocument();
    expect(screen.getByText("Sair")).toBeInTheDocument();
    expect(screen.getByText("Gerenciar serviços")).toBeInTheDocument();
    expect(screen.getByText("Serviços")).toBeInTheDocument();
    expect(screen.getByText("Períodos")).toBeInTheDocument();
    expect(screen.getByText("Funcionários")).toBeInTheDocument();
  });

  test("EMPLOYEE vê Gerenciar serviços mas não itens de admin", () => {
    renderWithRole("EMPLOYEE");

    expect(screen.getByText("Perfil")).toBeInTheDocument();
    expect(screen.getByText("Sair")).toBeInTheDocument();
    expect(screen.getByText("Gerenciar serviços")).toBeInTheDocument();
    expect(screen.queryByText("Serviços")).not.toBeInTheDocument();
    expect(screen.queryByText("Períodos")).not.toBeInTheDocument();
    expect(screen.queryByText("Funcionários")).not.toBeInTheDocument();
  });

  test("USER vê apenas Perfil e Sair", () => {
    renderWithRole("USER");

    expect(screen.getByText("Perfil")).toBeInTheDocument();
    expect(screen.getByText("Sair")).toBeInTheDocument();
    expect(screen.queryByText("Gerenciar serviços")).not.toBeInTheDocument();
    expect(screen.queryByText("Serviços")).not.toBeInTheDocument();
    expect(screen.queryByText("Períodos")).not.toBeInTheDocument();
    expect(screen.queryByText("Funcionários")).not.toBeInTheDocument();
  });

  test("quando não há role salva, mostra apenas Perfil e Sair", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText("Perfil")).toBeInTheDocument();
    expect(screen.getByText("Sair")).toBeInTheDocument();
    expect(screen.queryByText("Gerenciar serviços")).not.toBeInTheDocument();
    expect(screen.queryByText("Serviços")).not.toBeInTheDocument();
    expect(screen.queryByText("Períodos")).not.toBeInTheDocument();
    expect(screen.queryByText("Funcionários")).not.toBeInTheDocument();
  });

  test("abre e fecha modal de edição de perfil", async () => {
    renderWithRole("USER", "user-xyz");

    await userEvent.click(screen.getByText("Perfil"));
    expect(screen.getByTestId("edit-modal")).toHaveTextContent("modal-user-xyz");

    await userEvent.click(screen.getByText("fechar"));
    expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
  });

  test("logout limpa storages e navega para /auth", async () => {
    renderWithRole("USER", "user-xyz");

    await userEvent.click(screen.getByText("Sair"));

    expect(sessionStorage.getItem("role")).toBeNull();
    expect(sessionStorage.getItem("userId")).toBeNull();
    expect(localStorage.getItem("role")).toBeNull();
    expect(localStorage.getItem("userId")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/auth");
  });
});
