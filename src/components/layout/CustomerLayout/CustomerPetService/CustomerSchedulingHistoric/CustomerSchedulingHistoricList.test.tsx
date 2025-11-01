import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomerSchedulingHistoricList from "./CustomerSchedulingHistoricList";

const mockGetUserSchedulings = jest.fn();
const mockGetAvailableTimes = jest.fn();
const mockUpdateScheduling = jest.fn();
const mockDeleteScheduling = jest.fn();

jest.mock("../../../../../api/Scheduling/Scheduling", () => ({
  getUserSchedulings: (...a: any[]) => mockGetUserSchedulings(...a),
  getAvailableTimes: (...a: any[]) => mockGetAvailableTimes(...a),
  updateScheduling: (...a: any[]) => mockUpdateScheduling(...a),
  deleteScheduling: (...a: any[]) => mockDeleteScheduling(...a),
}));

jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  const React = jest.requireActual("react");
  const dj = jest.requireActual("dayjs");

  const DP = ({ value, onChange, ...rest }: any) => (
    <input
      aria-label="date"
      type="date"
      value={value ? value.format("YYYY-MM-DD") : ""}
      onChange={(e) => onChange?.(dj(e.target.value, "YYYY-MM-DD"))}
      {...rest}
    />
  );

  const SelectMock: any = ({ value, onChange, children, ...rest }: any) => (
    <select
      aria-label="time"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      {...rest}
    >
      {React.Children.map(children, (child: any) => child)}
    </select>
  );
  SelectMock.Option = ({ value, children }: any) => (
    <option value={value}>{children}</option>
  );

  const PopconfirmMock = ({ children, onConfirm }: any) =>
    React.cloneElement(children, { onClick: () => onConfirm?.() });

  return {
    ...antd,
    DatePicker: DP,
    Select: SelectMock,
    Popconfirm: PopconfirmMock,
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

const page1 = {
  content: [
    {
      id: "sch1",
      status: "WAITING_FOR_ARRIVAL",
      schedulingHour: "2025-01-10T12:00:00",
      petService: { id: "svc1", name: "Banho", price: 50, time: 30 },
      employee: { user: { name: "Eva" } },
    },
  ],
  totalElements: 1,
};

describe("CustomerSchedulingHistoricList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("lista vazia exibe Empty", async () => {
    mockGetUserSchedulings.mockResolvedValueOnce({
      content: [],
      totalElements: 0,
    });

    render(<CustomerSchedulingHistoricList />);

    await waitFor(() =>
      expect(
        screen.getByText("Nenhum agendamento encontrado")
      ).toBeInTheDocument()
    );
    expect(mockGetUserSchedulings).toHaveBeenCalledWith(0, 10);
  });

  test("renderiza card e botões quando WAITING_FOR_ARRIVAL", async () => {
    mockGetUserSchedulings.mockResolvedValueOnce(page1);

    render(<CustomerSchedulingHistoricList />);

    await screen.findByText("Banho");
    const card = screen.getByText("Banho").closest(".ant-card") as HTMLElement;

    expect(
      within(card).getByRole("button", { name: /edit/i })
    ).toBeInTheDocument();
    expect(
      within(card).getByRole("button", { name: /delete/i })
    ).toBeInTheDocument();
  });

  test("excluir: confirma e recarrega", async () => {
    mockGetUserSchedulings.mockResolvedValueOnce(page1);
    mockDeleteScheduling.mockResolvedValueOnce({});
    mockGetUserSchedulings.mockResolvedValueOnce({
      content: [],
      totalElements: 0,
    });

    render(<CustomerSchedulingHistoricList />);

    await screen.findByText("Banho");
    const card = screen.getByText("Banho").closest(".ant-card") as HTMLElement;

    await userEvent.click(
      within(card).getByRole("button", { name: /delete/i })
    );

    await waitFor(() =>
      expect(mockDeleteScheduling).toHaveBeenCalledWith("sch1")
    );
    await waitFor(() =>
      expect(
        screen.getByText("Nenhum agendamento encontrado")
      ).toBeInTheDocument()
    );
  });

  test("mostra erro ao falhar atualização", async () => {
    mockGetUserSchedulings.mockResolvedValueOnce(page1);
    mockGetAvailableTimes.mockResolvedValueOnce(["10:00:00"]);
    mockUpdateScheduling.mockRejectedValueOnce(new Error("fail"));

    render(<CustomerSchedulingHistoricList />);

    await screen.findByText("Banho");
    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    await screen.findByText("Editar Agendamento");

    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() =>
      expect(require("antd").message.error).toHaveBeenCalledWith(
        "Erro ao atualizar agendamento"
      )
    );
  });
});
