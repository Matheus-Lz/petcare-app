import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomerPetServiceCard from "./CustomerPerServiceCard";

jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  const Modal = ({ visible, open, children, title, onCancel }: any) =>
    visible || open ? (
      <div role="dialog" aria-label={title}>
        {children}
        <button onClick={onCancel}>fechar</button>
      </div>
    ) : null;
  return { ...antd, Modal };
});

jest.mock("../CustomerScheduleForm/CustomerScheduleForm", () => ({
  __esModule: true,
  default: ({ onSuccess }: any) => (
    <div data-testid="schedule-form">
      form
      <button onClick={onSuccess}>ok</button>
    </div>
  ),
}));

const service = {
  id: "svc1",
  name: "Banho Completo",
  price: 79.9,
  time: 45,
  description: "Inclui secagem",
};

describe("CustomerPetServiceCard", () => {
  test("renderiza infos do serviço", () => {
    render(<CustomerPetServiceCard service={service as any} />);
    expect(screen.getByText("Banho Completo")).toBeInTheDocument();
    expect(screen.getByText("R$ 79.90")).toBeInTheDocument();
    expect(screen.getByText("45 minutos")).toBeInTheDocument();
    expect(screen.getByText(/Inclui secagem/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /agendar/i })).toBeInTheDocument();
  });

  test("abre modal ao clicar em Agendar e fecha ao sucesso", async () => {
    render(<CustomerPetServiceCard service={service as any} />);

    await userEvent.click(screen.getByRole("button", { name: /agendar/i }));
    expect(screen.getByRole("dialog", { name: /agendar serviço/i })).toBeInTheDocument();
    expect(screen.getByTestId("schedule-form")).toBeInTheDocument();

    await userEvent.click(screen.getByText("ok"));
    expect(screen.queryByRole("dialog", { name: /agendar serviço/i })).not.toBeInTheDocument();
  });
});
