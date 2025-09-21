import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Auth from "./Auth";

jest.mock("../../../api/user/UserService", () => ({
  loginUser: jest.fn().mockResolvedValue({
    token: "t",
    role: "USER",
    name: "Tester",
    userId: "1",
  }),
  registerUser: jest.fn().mockResolvedValue({ ok: true }),
}));

jest.mock("../../../utils/notifications", () => ({
  notifySuccess: jest.fn(),
  notifyError: jest.fn(),
}));

jest.mock("react-router-dom", () => {
  const real = jest.requireActual("react-router-dom");
  return { ...real, useNavigate: () => jest.fn() };
});

test("renderiza abas e campos do login", () => {
  render(
    <MemoryRouter>
      <Auth />
    </MemoryRouter>
  );

  expect(screen.getByRole("tab", { name: /Entrar/i })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /Cadastre-se/i })).toBeInTheDocument();

  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();

  expect(screen.getByRole("button", { name: /^Entrar$/i })).toBeInTheDocument();
});

test("alterna para a aba de cadastro", async () => {
  render(
    <MemoryRouter>
      <Auth />
    </MemoryRouter>
  );

  await userEvent.click(screen.getByRole("tab", { name: /Cadastre-se/i }));

  expect(screen.getByLabelText(/^Nome$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/CPF\/CNPJ/i)).toBeInTheDocument();
});
