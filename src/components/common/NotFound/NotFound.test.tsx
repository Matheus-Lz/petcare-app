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
  beforeEach(() => jest.clearAllMocks());

  test("renderiza 404 e botão", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText(/Página não encontrada/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /voltar para a página de login/i })
    ).toBeInTheDocument();
  });

  test("logout navega para /auth", async () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    await userEvent.click(
      screen.getByRole("button", { name: /voltar para a página de login/i })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/auth");
  });
});