import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomerScheduleForm from "./CustomerScheduleForm";

const mockGetAvailableDays = jest.fn();
const mockGetAvailableTimes = jest.fn();
const mockCreateScheduling = jest.fn();

jest.mock("../../../../../api/Scheduling/Scheduling", () => ({
  getAvailableDays: (...a: any[]) => mockGetAvailableDays(...a),
  getAvailableTimes: (...a: any[]) => mockGetAvailableTimes(...a),
  createScheduling: (...a: any[]) => mockCreateScheduling(...a),
}));

jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  const dj = jest.requireActual("dayjs");
  const DatePicker = ({ value, onChange }: any) => (
    <input
      aria-label="date"
      type="date"
      value={value ? value.format("YYYY-MM-DD") : ""}
      onChange={(e) => onChange?.(dj(e.target.value, "YYYY-MM-DD"))}
    />
  );
  const Select: any = ({ value, onChange, children, disabled, placeholder }: any) => (
    <select
      aria-label="time"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      aria-placeholder={placeholder}
    >
      <option value="" />
      {children}
    </select>
  );
  Select.Option = ({ value, children }: any) => <option value={value}>{children}</option>;
  return {
    ...antd,
    DatePicker,
    Select,
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

const service = {
  id: "svc1",
  name: "Banho",
  price: 50,
  time: 30,
  description: "Desc",
};

describe("CustomerScheduleForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAvailableDays.mockResolvedValue([]);
    mockGetAvailableTimes.mockResolvedValue([]);
    mockCreateScheduling.mockResolvedValue({});
  });

  test("renderiza informações básicas do serviço", async () => {
    render(<CustomerScheduleForm service={service as any} />);
    expect(screen.getByText("Banho")).toBeInTheDocument();
    expect(screen.getByText("Preço: R$ 50.00")).toBeInTheDocument();
    expect(screen.getByText("Duração: 30 minutos")).toBeInTheDocument();
    await waitFor(() => expect(mockGetAvailableDays).toHaveBeenCalledWith("svc1", expect.any(String)));
  });

  test("seleciona data, carrega horários e confirma agendamento", async () => {
    mockGetAvailableDays.mockResolvedValueOnce(["2025-01-10"]);
    mockGetAvailableTimes.mockResolvedValueOnce(["09:00:00", "10:00:00"]);

    render(<CustomerScheduleForm service={service as any} />);

    const date = await screen.findByLabelText("date");
    await userEvent.clear(date);
    await userEvent.type(date, "2025-01-10");

    await waitFor(() =>
      expect(mockGetAvailableTimes).toHaveBeenCalledWith("svc1", "2025-01-10")
    );

    const time = screen.getByLabelText("time");
    await userEvent.selectOptions(time, "09:00");

    const btn = screen.getByRole("button", { name: /confirmar agendamento/i });
    await userEvent.click(btn);

    await waitFor(() =>
      expect(mockCreateScheduling).toHaveBeenCalledWith("svc1", "2025-01-10T09:00:00")
    );
  });

  test("botão fica desabilitado sem data/horário", async () => {
    render(<CustomerScheduleForm service={service as any} />);
    const btn = screen.getByRole("button", { name: /confirmar agendamento/i });
    expect(btn).toBeDisabled();

    mockGetAvailableTimes.mockResolvedValueOnce(["09:00:00"]);
    const date = screen.getByLabelText("date");
    await userEvent.type(date, "2025-01-10");

    const time = await screen.findByLabelText("time");
    await userEvent.selectOptions(time, "09:00");
    expect(btn).not.toBeDisabled();
  });
});