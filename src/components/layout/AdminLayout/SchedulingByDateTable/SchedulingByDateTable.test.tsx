import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SchedulingByDateTable } from "./SchedulingByDateTable";

const mockGetSchedulingsByDate = jest.fn();
const mockUpdateSchedulingStatus = jest.fn();
const mockDelegateScheduling = jest.fn();
const mockDeleteScheduling = jest.fn();
const mockGetAllEmployees = jest.fn();

jest.mock("../../../../api/Scheduling/Scheduling", () => ({
  getSchedulingsByDate: (...a: any[]) => mockGetSchedulingsByDate(...a),
  updateSchedulingStatus: (...a: any[]) => mockUpdateSchedulingStatus(...a),
  delegateScheduling: (...a: any[]) => mockDelegateScheduling(...a),
  deleteScheduling: (...a: any[]) => mockDeleteScheduling(...a),
}));

jest.mock("../../../../api/Employee/Employee", () => ({
  getAllEmployees: (...a: any[]) => mockGetAllEmployees(...a),
}));

jest.mock("antd", () => {
  const real = jest.requireActual("antd");
  const Modal = ({ open, visible, title, onCancel, onOk, footer, okButtonProps, children }: any) =>
    open || visible ? (
      <div role="dialog" aria-label={title}>
        {children}
        {footer === null ? null : (
          <div>
            <button onClick={onCancel}>Cancelar</button>
            <button onClick={okButtonProps?.disabled ? undefined : onOk}>OK</button>
          </div>
        )}
      </div>
    ) : null;

  const Select: any = ({ value, onChange, children, placeholder }: any) => (
    <select
      aria-label={placeholder || "select"}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value="" />
      {children}
    </select>
  );
  Select.Option = ({ value, children }: any) => <option value={value}>{children}</option>;

  const DatePicker = ({ defaultValue, onChange, ...rest }: any) => (
    <input
      aria-label="date"
      type="date"
      defaultValue={defaultValue ? defaultValue.format("YYYY-MM-DD") : ""}
      onChange={(e) => onChange?.(e.target.value)}
      {...rest}
    />
  );

  return {
    ...real,
    Modal,
    Select,
    DatePicker,
    message: {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
      loading: jest.fn(),
      open: jest.fn(),
      destroy: jest.fn(),
    },
  };
});

function seedSchedulings() {
  mockGetSchedulingsByDate.mockResolvedValue([
    {
      id: "sch1",
      schedulingHour: "2025-01-10T09:00:00",
      petService: { id: "s1", name: "Banho", description: "Desc 1", price: 50, time: 30 },
      employee: null,
      status: "WAITING_FOR_ARRIVAL",
    },
    {
      id: "sch2",
      schedulingHour: "2025-01-10T10:00:00",
      petService: { id: "s2", name: "Tosa", description: "Desc 2", price: 60, time: 40 },
      employee: { id: "e2", user: { name: "Beto" } },
      status: "IN_PROGRESS",
    },
  ]);
}

describe("SchedulingByDateTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    seedSchedulings();
    mockUpdateSchedulingStatus.mockResolvedValue({});
    mockDelegateScheduling.mockResolvedValue({});
    mockDeleteScheduling.mockResolvedValue({});
    mockGetAllEmployees.mockResolvedValue({
      content: [
        { id: "e1", user: { name: "Ana", email: "ana@x.com" }, petServiceList: [] },
        { id: "e2", user: { name: "Beto", email: "beto@x.com" }, petServiceList: [] },
      ],
    });
  });

  test("carrega lista para a data atual", async () => {
    render(<SchedulingByDateTable />);
    const [banhoCell] = await screen.findAllByText("Banho");
    expect(banhoCell).toBeInTheDocument();
    const [tosaCell] = await screen.findAllByText("Tosa");
    expect(tosaCell).toBeInTheDocument();
    expect(screen.getByText("10/01/2025 09:00")).toBeInTheDocument();
    expect(screen.getByText("10/01/2025 10:00")).toBeInTheDocument();
  });

  test("edita status do agendamento", async () => {
    render(<SchedulingByDateTable />);
    const [banhoCell] = await screen.findAllByText("Banho");
    const row = banhoCell.closest("tr") as HTMLElement;
    const buttons = within(row).getAllByRole("button");
    await userEvent.click(buttons[1]);
    expect(screen.getByRole("dialog", { name: /Editar Status do Agendamento/i })).toBeInTheDocument();
    const select = screen.getByLabelText("select");
    await userEvent.selectOptions(select, "COMPLETED");
    await userEvent.click(screen.getByText("OK"));
    await waitFor(() =>
      expect(mockUpdateSchedulingStatus).toHaveBeenCalledWith("sch1", "COMPLETED")
    );
  });

  test("atribui responsável", async () => {
    render(<SchedulingByDateTable />);
    const [banhoCell] = await screen.findAllByText("Banho");
    const row = banhoCell.closest("tr") as HTMLElement;
    const buttons = within(row).getAllByRole("button");
    await userEvent.click(buttons[2]);
    expect(screen.getByRole("dialog", { name: /Atribuir Funcionário/i })).toBeInTheDocument();
    await waitFor(() => expect(mockGetAllEmployees).toHaveBeenCalled());
    const select = screen.getByLabelText("Selecione um funcionário");
    await userEvent.selectOptions(select, "e1");
    await userEvent.click(screen.getByText("OK"));
    await waitFor(() =>
      expect(mockDelegateScheduling).toHaveBeenCalledWith("sch1", "e1")
    );
  });

  test("exclui agendamento", async () => {
    render(<SchedulingByDateTable />);
    const [banhoCell] = await screen.findAllByText("Banho");
    const row = banhoCell.closest("tr") as HTMLElement;
    const buttons = within(row).getAllByRole("button");
    await userEvent.click(buttons[3]);
    const confirm = await screen.findByRole("button", { name: /Sim/i });
    await userEvent.click(confirm);
    await waitFor(() => expect(mockDeleteScheduling).toHaveBeenCalledWith("sch1"));
  });
});