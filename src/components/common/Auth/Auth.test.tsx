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

  expect(screen.getByRole("tab", { name: /entrar/i })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /cadastre-se/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /^entrar$/i })).toBeInTheDocument();
});

test("alterna para a aba de cadastro", async () => {
  render(
    <MemoryRouter>
      <Auth />
    </MemoryRouter>
  );

  await userEvent.click(screen.getByRole("tab", { name: /cadastre-se/i }));

  expect(await screen.findByLabelText(/^nome$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/cpf\/cnpj/i)).toBeInTheDocument();
});