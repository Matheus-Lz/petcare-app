import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const real = jest.requireActual("react-router-dom");
  return { ...real, useNavigate: () => mockNavigate };
});

describe("NotFound", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("x", "1");
    sessionStorage.setItem("y", "2");
    jest.spyOn(window.localStorage.__proto__, "clear");
    jest.spyOn(window.sessionStorage.__proto__, "clear");
  });

  test("renderiza 404 e botão de voltar", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText(/Página não encontrada/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Você não tem permissão para acessar esta página/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Voltar para a página de login/i })
    ).toBeInTheDocument();
  });

  test("ao clicar no botão, limpa storages e navega para /auth", async () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Voltar para a página de login/i })
    );

    expect(localStorage.clear).toHaveBeenCalled();
    expect(sessionStorage.clear).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/auth");
  });
});
