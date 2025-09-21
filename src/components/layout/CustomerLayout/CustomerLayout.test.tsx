import React from "react";
import { render, screen } from "@testing-library/react";
import CustomerLayout from "./CustomerLayout";

jest.mock("./CustomerHeader/CustomerHeader", () => ({
  __esModule: true,
  default: ({ username }: any) => <div data-testid="header-username">{username}</div>,
}));

describe("CustomerLayout", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  test("usa nome do localStorage quando presente", () => {
    localStorage.setItem("name", "Alice");
    render(
      <CustomerLayout>
        <div>Conteúdo</div>
      </CustomerLayout>
    );
    expect(screen.getByTestId("header-username")).toHaveTextContent("Alice");
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });

  test("usa nome do sessionStorage quando localStorage vazio", () => {
    sessionStorage.setItem("name", "Bob");
    render(
      <CustomerLayout>
        <div>Conteúdo</div>
      </CustomerLayout>
    );
    expect(screen.getByTestId("header-username")).toHaveTextContent("Bob");
  });

  test("fallback para 'Usuário' quando não há nome salvo", () => {
    render(
      <CustomerLayout>
        <div>Conteúdo</div>
      </CustomerLayout>
    );
    expect(screen.getByTestId("header-username")).toHaveTextContent("Usuário");
  });

  test("renderiza children no Content", () => {
    render(
      <CustomerLayout>
        <div data-testid="child">Child</div>
      </CustomerLayout>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  test("prioriza localStorage sobre sessionStorage", () => {
    localStorage.setItem("name", "Local");
    sessionStorage.setItem("name", "Session");
    render(
      <CustomerLayout>
        <div>Conteúdo</div>
      </CustomerLayout>
    );
    expect(screen.getByTestId("header-username")).toHaveTextContent("Local");
  });
});
