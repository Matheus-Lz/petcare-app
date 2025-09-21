import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmployeeTable from "./EmployeeTable";

const mockGetAllEmployees = jest.fn();
const mockDeleteEmployee = jest.fn();

jest.mock("../../../../../api/Employee/Employee", () => ({
  getAllEmployees: (...args: any[]) => mockGetAllEmployees(...args),
  deleteEmployee: (...args: any[]) => mockDeleteEmployee(...args),
}));

jest.mock("../EmployeeForm/EmployeeForm", () => ({
  __esModule: true,
  default: (props: any) => {
    const { visible, readOnly, employee, onClose } = props;
    if (!visible) return null;

    let title = "Novo Funcionário";
    if (readOnly) title = "Visualizar Funcionário";
    else if (employee) title = "Editar Funcionário";

    return (
      <div>
        <div data-testid="employee-form">{title}</div>
        <button onClick={onClose}>Fechar</button>
      </div>
    );
  },
}));

function seedEmployees() {
  mockGetAllEmployees.mockResolvedValue({
    content: [
      {
        id: "e1",
        user: { name: "Ana", email: "ana@x.com" },
        petServiceList: [{ id: "s1", name: "Banho" }],
      },
      {
        id: "e2",
        user: { name: "Beto", email: "beto@x.com" },
        petServiceList: [{ id: "s2", name: "Tosa" }],
      },
    ],
    totalElements: 2,
  });
}

describe("EmployeeTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("carrega e exibe funcionários", async () => {
    seedEmployees();

    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("Ana")).toBeInTheDocument();
      expect(screen.getByText("Beto")).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Banho|Tosa/).length).toBeGreaterThan(0);
  });

  test("abre modal de novo funcionário", async () => {
    seedEmployees();

    render(<EmployeeTable />);

    await waitFor(() => expect(mockGetAllEmployees).toHaveBeenCalled());

    await userEvent.click(
      screen.getByRole("button", { name: /Adicionar Funcionário/i })
    );

    expect(screen.getByTestId("employee-form")).toHaveTextContent(
      "Novo Funcionário"
    );
  });

  test("abre modal de visualizar funcionário", async () => {
    seedEmployees();

    render(<EmployeeTable />);

    await waitFor(() => expect(screen.getByText("Ana")).toBeInTheDocument());

    const row = screen.getByText("Ana").closest("tr") as HTMLElement;
    const buttons = within(row).getAllByRole("button");

    await userEvent.click(buttons[0]);

    expect(screen.getByTestId("employee-form")).toHaveTextContent(
      "Visualizar Funcionário"
    );
  });

  test("abre modal de editar funcionário", async () => {
    seedEmployees();

    render(<EmployeeTable />);

    await waitFor(() => expect(screen.getByText("Beto")).toBeInTheDocument());

    const row = screen.getByText("Beto").closest("tr") as HTMLElement;
    const buttons = within(row).getAllByRole("button");

    await userEvent.click(buttons[1]);

    expect(screen.getByTestId("employee-form")).toHaveTextContent(
      "Editar Funcionário"
    );
  });

  test("exclui funcionário com confirmação", async () => {
    seedEmployees();

    render(<EmployeeTable />);

    await waitFor(() => expect(screen.getByText("Ana")).toBeInTheDocument());

    const row = screen.getByText("Ana").closest("tr") as HTMLElement;
    const buttons = within(row).getAllByRole("button");

    await userEvent.click(buttons[2]);

    const confirm = await screen.findByRole("button", { name: /Sim/i });
    await userEvent.click(confirm);

    await waitFor(() => {
      expect(mockDeleteEmployee).toHaveBeenCalledWith("e1");
    });
  });
});
