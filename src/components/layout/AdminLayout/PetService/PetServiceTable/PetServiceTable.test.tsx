import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PetServiceTable from "./PetServiceTable";

const mockGetAll = jest.fn();
const mockDelete = jest.fn();

jest.mock("../../../../../api/PetService/PetService", () => ({
  getAllPetServices: (...a: any[]) => mockGetAll(...a),
  deletePetService: (...a: any[]) => mockDelete(...a),
}));

jest.mock("../PetServiceForm/PetServiceForm", () => ({
  __esModule: true,
  default: ({ visible, readOnly, service, onClose }: any) =>
    visible ? (
      <div role="dialog" aria-label="PetServiceForm">
        <div data-testid="ps-form">
          {readOnly ? "Visualizar Serviço" : service ? "Editar Serviço" : "Novo Serviço"}
        </div>
        <button onClick={onClose}>Fechar</button>
      </div>
    ) : null,
}));

function seed() {
  mockGetAll.mockResolvedValue({
    content: [
      { id: "s1", name: "Banho", price: 50, time: 30, description: "Desc A" },
      { id: "s2", name: "Tosa", price: 80.5, time: 45, description: "Desc B" },
    ],
    totalElements: 2,
  });
}

describe("PetServiceTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("carrega e exibe serviços com formatação", async () => {
    seed();
    render(<PetServiceTable />);

    await screen.findByText("Banho");
    await screen.findByText("Tosa");
    expect(screen.getByText("R$ 50.00")).toBeInTheDocument();
    expect(screen.getByText("R$ 80.50")).toBeInTheDocument();
    expect(screen.getByText("30 min")).toBeInTheDocument();
    expect(screen.getByText("45 min")).toBeInTheDocument();
    expect(screen.getByText("Desc A")).toBeInTheDocument();
    expect(screen.getByText("Desc B")).toBeInTheDocument();
  });

  test("abre modal de novo serviço", async () => {
    seed();
    render(<PetServiceTable />);
    await screen.findByText("Banho");

    await userEvent.click(screen.getByRole("button", { name: /adicionar serviço/i }));
    expect(screen.getByRole("dialog", { name: "PetServiceForm" })).toBeInTheDocument();
    expect(screen.getByTestId("ps-form")).toHaveTextContent("Novo Serviço");
  });

  test("abre modal de visualizar serviço", async () => {
    seed();
    render(<PetServiceTable />);
    const row = (await screen.findByText("Banho")).closest("tr")!;
    const buttons = within(row).getAllByRole("button");
    await userEvent.click(buttons[0]);
    expect(screen.getByTestId("ps-form")).toHaveTextContent("Visualizar Serviço");
  });

  test("abre modal de editar serviço", async () => {
    seed();
    render(<PetServiceTable />);
    const row = (await screen.findByText("Tosa")).closest("tr")!;
    const buttons = within(row).getAllByRole("button");
    await userEvent.click(buttons[1]);
    expect(screen.getByTestId("ps-form")).toHaveTextContent("Editar Serviço");
  });

  test("exclui serviço com confirmação", async () => {
    seed();
    mockDelete.mockResolvedValue({});
    render(<PetServiceTable />);
    const row = (await screen.findByText("Banho")).closest("tr")!;
    const buttons = within(row).getAllByRole("button");
    await userEvent.click(buttons[2]);
    const confirm = await screen.findByRole("button", { name: /sim/i });
    await userEvent.click(confirm);
    expect(mockDelete).toHaveBeenCalledWith("s1");
  });
});