import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute ";

jest.mock("react-router-dom", () => {
  const real = jest.requireActual("react-router-dom");
  return { ...real, Navigate: ({ to }: { to: string }) => <div>Redirected to {to}</div> };
});

jest.mock("../NotFound/NotFound", () => ({
  __esModule: true,
  default: () => <div>NotFound</div>,
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  test("se não tiver role, redireciona para /auth", () => {
    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <div>Conteúdo protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText("Redirected to /auth")).toBeInTheDocument();
  });

  test("se role está permitida, renderiza children", () => {
    sessionStorage.setItem("role", "ADMIN");
    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <div>Conteúdo protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText("Conteúdo protegido")).toBeInTheDocument();
  });

  test("se role não está permitida, renderiza NotFound", () => {
    localStorage.setItem("role", "USER");
    render(
      <MemoryRouter>
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <div>Conteúdo protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText("NotFound")).toBeInTheDocument();
  });
});