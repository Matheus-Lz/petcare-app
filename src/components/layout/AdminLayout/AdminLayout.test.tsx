import React from "react";
import { render, screen } from "@testing-library/react";
import AdminLayout from "./AdminLayout";

jest.mock("./Sidebar/Sidebar", () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

describe("AdminLayout", () => {
  test("renderiza Sidebar e children", () => {
    render(
      <AdminLayout>
        <div>Conteúdo</div>
      </AdminLayout>
    );
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });

  test("suporta múltiplos children", () => {
    render(
      <AdminLayout>
        <div>Primeiro</div>
        <div>Segundo</div>
      </AdminLayout>
    );
    expect(screen.getByText("Primeiro")).toBeInTheDocument();
    expect(screen.getByText("Segundo")).toBeInTheDocument();
  });
});