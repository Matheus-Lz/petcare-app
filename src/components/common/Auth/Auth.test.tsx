import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Auth from "./Auth";

let mockedNavigate: jest.Mock;

jest.mock("react-router-dom", () => {
  const real = jest.requireActual("react-router-dom");
  return {
    ...real,
    useNavigate: () => mockedNavigate,
  };
});

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

const setup = () =>
  render(
    <MemoryRouter>
      <Auth />
    </MemoryRouter>
  );

beforeEach(() => {
  mockedNavigate = jest.fn();
  localStorage.clear();
  sessionStorage.clear();
  jest.clearAllMocks();
});

test("renderiza abas e campos do login", () => {
  setup();
  expect(screen.getByRole("tab", { name: /entrar/i })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /cadastre-se/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /^entrar$/i })).toBeInTheDocument();
});

test("alterna para a aba de cadastro", async () => {
  setup();
  await userEvent.click(screen.getByRole("tab", { name: /cadastre-se/i }));
  expect(await screen.findByLabelText(/^nome$/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/cpf\/cnpj/i)).toBeInTheDocument();
});

test("login USER navega para /pet-service e usa sessionStorage quando lembrar não marcado", async () => {
  const { loginUser } = require("../../../api/user/UserService");
  loginUser.mockResolvedValueOnce({
    token: "t",
    role: "USER",
    name: "Tester",
    userId: "1",
  });
  setup();
  await userEvent.type(screen.getByLabelText(/email/i), "u@mail.com");
  await userEvent.type(screen.getByLabelText(/senha/i), "123456");
  await userEvent.click(screen.getByRole("button", { name: /^entrar$/i }));
  await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith("/pet-service"));
  expect(sessionStorage.getItem("token")).toBe("t");
  expect(localStorage.getItem("token")).toBeNull();
});

test("login SUPER_ADMIN navega para /dashboard/pet-service", async () => {
  const { loginUser } = require("../../../api/user/UserService");
  loginUser.mockResolvedValueOnce({
    token: "t",
    role: "SUPER_ADMIN",
    name: "A",
    userId: "1",
  });
  setup();
  await userEvent.type(screen.getByLabelText(/email/i), "a@mail.com");
  await userEvent.type(screen.getByLabelText(/senha/i), "123456");
  await userEvent.click(screen.getByRole("button", { name: /^entrar$/i }));
  await waitFor(() =>
    expect(mockedNavigate).toHaveBeenCalledWith("/dashboard/pet-service")
  );
});

test("login EMPLOYEE navega para /dashboard/scheduling-management", async () => {
  const { loginUser } = require("../../../api/user/UserService");
  loginUser.mockResolvedValueOnce({
    token: "t",
    role: "EMPLOYEE",
    name: "E",
    userId: "2",
  });
  setup();
  await userEvent.type(screen.getByLabelText(/email/i), "e@mail.com");
  await userEvent.type(screen.getByLabelText(/senha/i), "123456");
  await userEvent.click(screen.getByRole("button", { name: /^entrar$/i }));
  await waitFor(() =>
    expect(mockedNavigate).toHaveBeenCalledWith("/dashboard/scheduling-management")
  );
});

test("login com erro dispara notifyError", async () => {
  const { loginUser } = require("../../../api/user/UserService");
  const { notifyError } = require("../../../utils/notifications");
  loginUser.mockRejectedValueOnce({ response: { data: { message: "Falha" } } });
  setup();
  await userEvent.type(screen.getByLabelText(/email/i), "x@mail.com");
  await userEvent.type(screen.getByLabelText(/senha/i), "123456");
  await userEvent.click(screen.getByRole("button", { name: /^entrar$/i }));
  await waitFor(() => expect(notifyError).toHaveBeenCalledWith("Falha"));
});

test("botão 'Esqueceu sua senha?' navega para /forgot-password", async () => {
  setup();
  await userEvent.click(screen.getByRole("button", { name: /esqueceu sua senha\?/i }));
  expect(mockedNavigate).toHaveBeenCalledWith("/forgot-password");
});

test("redireciona automaticamente se já houver token no storage", () => {
  localStorage.setItem("token", "t");
  setup();
  expect(mockedNavigate).toHaveBeenCalledWith("/dashboard/pet-service");
});