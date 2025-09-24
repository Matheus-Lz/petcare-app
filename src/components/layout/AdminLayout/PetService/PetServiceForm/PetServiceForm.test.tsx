import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PetServiceForm from "./PetServiceForm";

const mockCreate = jest.fn();
const mockUpdate = jest.fn();

jest.mock("../../../../../api/PetService/PetService", () => ({
  createPetService: (...a: any[]) => mockCreate(...a),
  updatePetService: (...a: any[]) => mockUpdate(...a),
}));

jest.mock("antd", () => {
  const real = jest.requireActual("antd");

  const Modal = ({ open, visible, title, onCancel, onOk, footer, children }: any) => {
    const show = open ?? visible;
    if (!show) return null;
    const showFooter = footer !== null;
    return (
      <div role="dialog" aria-label={title}>
        {children}
        {showFooter && (
          <div>
            <button onClick={onOk}>ok</button>
            <button onClick={onCancel}>cancel</button>
          </div>
        )}
      </div>
    );
  };

  const InputNumber = ({ value, onChange, id, disabled, min, max, step, ...rest }: any) => (
    <input
      type="number"
      id={id}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      value={value ?? ""}
      onChange={(e) => {
        const raw = e.currentTarget.value;
        onChange?.(raw === "" ? null : Number(raw));
      }}
      {...rest}
    />
  );

  return { ...real, Modal, InputNumber };
});

describe("PetServiceForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("cria novo serviço", async () => {
    const onClose = jest.fn();
    const onRefresh = jest.fn();

    render(
      <PetServiceForm
        visible
        onClose={onClose}
        service={null}
        onRefresh={onRefresh}
      />
    );

    await userEvent.type(screen.getByLabelText("Nome"), "Banho Deluxe");
    await userEvent.clear(screen.getByLabelText("Preço"));
    await userEvent.type(screen.getByLabelText("Preço"), "79.9");
    await userEvent.clear(screen.getByLabelText("Duração (minutos)"));
    await userEvent.type(screen.getByLabelText("Duração (minutos)"), "45");
    await userEvent.type(screen.getByLabelText("Descrição"), "Inclui secagem");

    await userEvent.click(screen.getByRole("button", { name: "ok" }));

    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith({
        name: "Banho Deluxe",
        price: 79.9,
        time: 45,
        description: "Inclui secagem",
      })
    );
    expect(onClose).toHaveBeenCalled();
    expect(onRefresh).toHaveBeenCalled();
  });

  test("edita serviço existente", async () => {
    const onClose = jest.fn();
    const onRefresh = jest.fn();

    const svc = {
      id: "svc1",
      name: "Banho",
      price: 50,
      time: 30,
      description: "Desc",
    };

    render(
      <PetServiceForm
        visible
        onClose={onClose}
        service={svc as any}
        onRefresh={onRefresh}
      />
    );

    expect(screen.getByLabelText("Nome")).toHaveValue("Banho");
    expect(screen.getByLabelText("Preço")).toHaveValue(50);
    expect(screen.getByLabelText("Duração (minutos)")).toHaveValue(30);
    expect(screen.getByLabelText("Descrição")).toHaveValue("Desc");

    await userEvent.clear(screen.getByLabelText("Nome"));
    await userEvent.type(screen.getByLabelText("Nome"), "Banho Premium");
    await userEvent.clear(screen.getByLabelText("Preço"));
    await userEvent.type(screen.getByLabelText("Preço"), "100.5");
    await userEvent.clear(screen.getByLabelText("Duração (minutos)"));
    await userEvent.type(screen.getByLabelText("Duração (minutos)"), "60");
    await userEvent.clear(screen.getByLabelText("Descrição"));
    await userEvent.type(screen.getByLabelText("Descrição"), "Novo pacote");

    await userEvent.click(screen.getByRole("button", { name: "ok" }));

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith("svc1", {
        name: "Banho Premium",
        price: 100.5,
        time: 60,
        description: "Novo pacote",
      })
    );
    expect(onClose).toHaveBeenCalled();
    expect(onRefresh).toHaveBeenCalled();
  });

  test("modo somente leitura: campos desabilitados e sem footer", () => {
    const svc = {
      id: "svc2",
      name: "Tosa",
      price: 60,
      time: 40,
      description: "Corte básico",
    };

    render(
      <PetServiceForm
        visible
        onClose={() => {}}
        service={svc as any}
        onRefresh={() => {}}
        readOnly
      />
    );

    expect(screen.queryByRole("button", { name: "ok" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "cancel" })).not.toBeInTheDocument();

    expect(screen.getByLabelText("Nome")).toBeDisabled();
    expect(screen.getByLabelText("Preço")).toBeDisabled();
    expect(screen.getByLabelText("Duração (minutos)")).toBeDisabled();
    expect(screen.getByLabelText("Descrição")).toBeDisabled();
  });
});
