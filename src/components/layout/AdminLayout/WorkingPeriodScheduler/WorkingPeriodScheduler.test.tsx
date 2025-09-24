import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import WorkingPeriodScheduler from "./WorkingPeriodScheduler";

dayjs.extend(customParseFormat);

const mockGetAll = jest.fn();
const mockCreate = jest.fn();
const mockDelete = jest.fn();

jest.mock("../../../../api/WorkingPeriod/WorkingPeriod", () => ({
  getAllWorkingPeriods: (...a: any[]) => mockGetAll(...a),
  createWorkingPeriod: (...a: any[]) => mockCreate(...a),
  deleteWorkingPeriod: (...a: any[]) => mockDelete(...a),
}));

jest.mock("antd", () => {
  const real = jest.requireActual("antd");
  const dj = jest.requireActual("dayjs");
  const cpf = jest.requireActual("dayjs/plugin/customParseFormat");
  dj.extend(cpf);

  const Modal = ({ open, visible, title, children, onOk, onCancel, okText = "Salvar", cancelText = "Cancelar" }: any) =>
    open || visible ? (
      <div role="dialog" aria-label={title}>
        {children}
        <button onClick={onOk}>{okText}</button>
        <button onClick={onCancel}>{cancelText}</button>
      </div>
    ) : null;

  const TimePicker = ({ value, onChange, ...rest }: any) => (
    <input
      aria-label="time"
      type="time"
      value={value ? dj(value).format("HH:mm") : ""}
      onChange={(e) => onChange?.(dj(`2000-01-01T${e.target.value}:00`))}
      {...rest}
    />
  );

  return {
    ...real,
    Modal,
    TimePicker,
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

const seed = () => {
  mockGetAll.mockResolvedValue([
    { id: "p1", dayOfWeek: "SUNDAY", startTime: "08:00", endTime: "12:00" },
    { id: "p2", dayOfWeek: "MONDAY", startTime: "09:00", endTime: "11:00" },
  ]);
};

describe("WorkingPeriodScheduler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("abre modal para adicionar período (domingo), preenche horários e salva", async () => {
    mockGetAll.mockResolvedValue([]);
    mockCreate.mockResolvedValue({});
    render(<WorkingPeriodScheduler />);
    await waitFor(() => expect(mockGetAll).toHaveBeenCalled());

    const plusButtons = screen.getAllByRole("button");
    await userEvent.click(plusButtons[0]);

    const timeInputs = screen.getAllByLabelText("time");
    await userEvent.clear(timeInputs[0]);
    await userEvent.type(timeInputs[0], "08:00");
    await userEvent.clear(timeInputs[1]);
    await userEvent.type(timeInputs[1], "09:00");

    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith({
        dayOfWeek: "SUNDAY",
        startTime: "08:00",
        endTime: "09:00",
      })
    );
  });

  test("valida quando horário final é antes do inicial e não chama create", async () => {
    mockGetAll.mockResolvedValue([]);
    render(<WorkingPeriodScheduler />);
    await waitFor(() => expect(mockGetAll).toHaveBeenCalled());

    const plusButtons = screen.getAllByRole("button");
    await userEvent.click(plusButtons[0]);

    const timeInputs = screen.getAllByLabelText("time");
    await userEvent.type(timeInputs[0], "10:00");
    await userEvent.type(timeInputs[1], "09:00");

    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    const { message } = jest.requireMock("antd");
    expect(message.warning).toHaveBeenCalledWith(
      "O horário de fim deve ser depois do início"
    );
    expect(mockCreate).not.toHaveBeenCalled();
  });

});
