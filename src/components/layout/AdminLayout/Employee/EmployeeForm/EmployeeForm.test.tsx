import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmployeeForm from "./EmployeeForm";

const mockGetAllPetServices = jest.fn();
const mockCreateEmployee = jest.fn();
const mockUpdateEmployee = jest.fn();

jest.mock("../../../../../api/PetService/PetService", () => ({
  getAllPetServices: (...a: any[]) => mockGetAllPetServices(...a),
}));

jest.mock("../../../../../api/Employee/Employee", () => ({
  createEmployee: (...a: any[]) => mockCreateEmployee(...a),
  updateEmployee: (...a: any[]) => mockUpdateEmployee(...a),
}));

jest.mock("antd", () => {
  const real = jest.requireActual("antd");

  const Modal = ({
    open,
    visible,
    title,
    onCancel,
    onOk,
    footer,
    children,
  }: any) => {
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

  const Select = ({
    value,
    onChange,
    children,
    disabled,
    mode,
    id,
    placeholder,
    ...rest
  }: any) => {
    const isMultiple = mode === "multiple";
    return (
      <select
        aria-label="Serviços"
        id={id}
        multiple={isMultiple}
        value={value ?? (isMultiple ? [] : "")}
        onChange={(e) => {
          if (isMultiple) {
            const vals = Array.from(e.currentTarget.selectedOptions).map(
              (o) => o.value
            );
            onChange?.(vals);
          } else {
            onChange?.(e.currentTarget.value);
          }
        }}
        disabled={disabled}
        {...rest}
      >
        {children}
      </select>
    );
  };
  Select.Option = ({ value, children }: any) => (
    <option value={value}>{children}</option>
  );

  return { ...real, Modal, Select };
});

function seedServices() {
  mockGetAllPetServices.mockResolvedValue({
    content: [
      { id: "s1", name: "Banho" },
      { id: "s2", name: "Tosa" },
      { id: "s3", name: "Passeio" },
    ],
    totalElements: 3,
  });
}

describe("EmployeeForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    seedServices();
  });

  test("cria novo funcionário: preenche campos, seleciona serviços e envia", async () => {
    const onClose = jest.fn();
    const onRefresh = jest.fn();

    render(
      <EmployeeForm
        visible
        onClose={onClose}
        employee={null}
        onRefresh={onRefresh}
      />
    );

    const select = await screen.findByLabelText("Serviços");
    const options = within(select).getAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual([
      "Banho",
      "Tosa",
      "Passeio",
    ]);

    await userEvent.type(screen.getByLabelText("Email"), "ana@x.com");
    await userEvent.type(screen.getByLabelText("Senha"), "123456");
    await userEvent.type(screen.getByLabelText("CPF/CNPJ"), "11122233344");
    await userEvent.type(screen.getByLabelText("Nome"), "Ana");

    await userEvent.selectOptions(select, ["s1", "s3"]);

    await userEvent.click(screen.getByRole("button", { name: "ok" }));

    await waitFor(() =>
      expect(mockCreateEmployee).toHaveBeenCalledWith({
        user: {
          email: "ana@x.com",
          name: "Ana",
          cpfCnpj: "11122233344",
          password: "123456",
        },
        serviceIds: ["s1", "s3"],
      })
    );
    expect(onClose).toHaveBeenCalled();
    expect(onRefresh).toHaveBeenCalled();
  });

  test("edita funcionário: mantém campos do usuário bloqueados e salva serviços", async () => {
    const onClose = jest.fn();
    const onRefresh = jest.fn();

    const employee = {
      id: "emp1",
      user: { email: "beto@x.com", name: "Beto", cpfCnpj: "99988877766" },
      petServiceList: [{ id: "s2", name: "Tosa" }],
    } as any;

    render(
      <EmployeeForm
        visible
        onClose={onClose}
        employee={employee}
        onRefresh={onRefresh}
      />
    );

    const select = await screen.findByLabelText("Serviços");
    const selected = (select as HTMLSelectElement).selectedOptions;
    expect(Array.from(selected).map((o) => o.value)).toEqual(["s2"]);

    await userEvent.deselectOptions(select, "s2");
    await userEvent.selectOptions(select, ["s1", "s3"]);

    await userEvent.click(screen.getByRole("button", { name: "ok" }));

    await waitFor(() =>
      expect(mockUpdateEmployee).toHaveBeenCalledWith("emp1", {
        serviceIds: ["s1", "s3"],
      })
    );
    expect(onClose).toHaveBeenCalled();
    expect(onRefresh).toHaveBeenCalled();
  });

  test("somente leitura: sem footer e Select desabilitado", async () => {
    render(
      <EmployeeForm
        visible
        onClose={() => {}}
        employee={{
          id: "emp2",
          user: { email: "v@x.com", name: "Vivi", cpfCnpj: "123" },
          petServiceList: [{ id: "s1", name: "Banho" }],
        } as any}
        onRefresh={() => {}}
        readOnly
      />
    );

    const select = await screen.findByLabelText("Serviços");
    expect(select).toBeDisabled();

    expect(screen.queryByRole("button", { name: "ok" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "cancel" })).not.toBeInTheDocument();
  });
});
