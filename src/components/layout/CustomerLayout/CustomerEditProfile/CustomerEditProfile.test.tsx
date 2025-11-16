import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CustomerEditProfileModal from "./CustomerEditProfile";

const mockGet = jest.fn();
const mockUpdate = jest.fn();
const mockLogin = jest.fn();

jest.mock("../../../../api/user/UserService", () => ({
  getCurrentUser: (...a: any[]) => mockGet(...a),
  updateUser: (...a: any[]) => mockUpdate(...a),
  loginUser: (...a: any[]) => mockLogin(...a),
}));

const mockNotifyError = jest.fn();
const mockNotifySuccess = jest.fn();

jest.mock("../../../../utils/notifications", () => ({
  notifyError: (...a: any[]) => mockNotifyError(...a),
  notifySuccess: (...a: any[]) => mockNotifySuccess(...a),
}));

jest.mock("react-input-mask", () => {
  const React = require("react");
  return (props: any) => {
    const { children, ...rest } = props;
    if (typeof children === "function") return children(rest);
    return React.createElement("input", rest);
  };
});

jest.mock("antd", () => {
  const real = jest.requireActual("antd");
  const Modal = ({ open, visible, title, onCancel, children }: any) =>
    open || visible ? (
      <div role="dialog" aria-label={title}>
        {children}
        <button onClick={onCancel}>close</button>
      </div>
    ) : null;
  return {
    ...real,
    Modal,
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

function getItemContainerByLabelText(labelText: RegExp | string) {
  const labelEl = screen.getByText(labelText);
  const item = (labelEl as HTMLElement).closest(".ant-form-item") as HTMLElement;
  if (!item) throw new Error(`Não achei container do Form.Item "${labelText}"`);
  return item;
}

describe("CustomerEditProfileModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockResolvedValue({
      name: "Alice",
      email: "alice@x.com",
      cpfCnpj: "123",
    });
    mockUpdate.mockResolvedValue({});
    mockLogin.mockResolvedValue({ token: "t", role: "USER", name: "Alice" });
  });

  async function renderOpen() {
    render(<CustomerEditProfileModal open onClose={() => {}} userId="u1" />);
    await waitFor(() => expect(mockGet).toHaveBeenCalled());
    await screen.findByRole("dialog", { name: /editar perfil/i });
  }

  test("renderiza formulário inicial", async () => {
    await renderOpen();
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("CPF/CNPJ")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /editar senha/i })).toBeInTheDocument();

    const nomeInput = within(getItemContainerByLabelText("Nome")).getByRole("textbox") as HTMLInputElement;
    const cpfInput = within(getItemContainerByLabelText("CPF/CNPJ")).getByRole("textbox") as HTMLInputElement;

    expect(nomeInput.value).toBe("Alice");
    expect(cpfInput.value).toContain("123");
  });

  test("edita nome e salva", async () => {
    await renderOpen();

    const nomeItem = getItemContainerByLabelText(/^Nome$/);
    const [editBtn] = within(nomeItem).getAllByRole("button");
    await userEvent.click(editBtn);

    const input = within(nomeItem).getByRole("textbox") as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, "Novo Nome");

    const [saveBtn] = within(nomeItem).getAllByRole("button");
    await userEvent.click(saveBtn);

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledWith("u1", { name: "Novo Nome" }));
    expect(mockNotifySuccess).toHaveBeenCalledWith("Nome atualizado com sucesso");
  });

  test("cancela edição do nome restaurando valor", async () => {
    await renderOpen();

    const nomeItem = getItemContainerByLabelText(/^Nome$/);
    const [editBtn] = within(nomeItem).getAllByRole("button");
    await userEvent.click(editBtn);

    const input = within(nomeItem).getByRole("textbox") as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, "Outro Nome");

    const buttons = within(nomeItem).getAllByRole("button");
    const cancelBtn = buttons[1];
    await userEvent.click(cancelBtn);

    expect(input.value).toBe("Alice");
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test("edita CPF/CNPJ e salva", async () => {
    await renderOpen();

    const cpfItem = getItemContainerByLabelText("CPF/CNPJ");
    const [editBtn] = within(cpfItem).getAllByRole("button");
    await userEvent.click(editBtn);

    const input = within(cpfItem).getByRole("textbox") as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, "99999999999");

    const [saveBtn] = within(cpfItem).getAllByRole("button");
    await userEvent.click(saveBtn);

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith("u1", { cpfCnpj: "99999999999" })
    );
    expect(mockNotifySuccess).toHaveBeenCalledWith("Cpf/Cnpj atualizado com sucesso");
  });

  test("cancela edição de CPF/CNPJ restaurando valor", async () => {
    await renderOpen();

    const cpfItem = getItemContainerByLabelText("CPF/CNPJ");
    const [editBtn] = within(cpfItem).getAllByRole("button");
    await userEvent.click(editBtn);

    const input = within(cpfItem).getByRole("textbox") as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, "99999999999");

    const buttons = within(cpfItem).getAllByRole("button");
    const cancelBtn = buttons[1];
    await userEvent.click(cancelBtn);

    expect(input.value).toContain("123");
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test("abre seção de alterar senha", async () => {
    await renderOpen();
    await userEvent.click(screen.getByRole("button", { name: /editar senha/i }));

    expect(screen.getByLabelText("Senha Atual")).toBeInTheDocument();
    expect(screen.getByLabelText("Nova Senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar Nova Senha")).toBeInTheDocument();
  });

  test("altera senha com sucesso", async () => {
    await renderOpen();
    await userEvent.click(screen.getByRole("button", { name: /editar senha/i }));

    await userEvent.type(screen.getByLabelText("Senha Atual"), "old");
    await userEvent.type(screen.getByLabelText("Nova Senha"), "newpass");
    await userEvent.type(screen.getByLabelText("Confirmar Nova Senha"), "newpass");

    await userEvent.click(screen.getByRole("button", { name: /salvar nova senha/i }));

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith("u1", {
        password: "newpass",
        currentPassword: "old",
      })
    );
    expect(mockNotifySuccess).toHaveBeenCalledWith("Senha atualizada com sucesso");
  });

  test("não altera senha quando senhas não coincidem", async () => {
    await renderOpen();
    await userEvent.click(screen.getByRole("button", { name: /editar senha/i }));

    await userEvent.type(screen.getByLabelText("Senha Atual"), "old");
    await userEvent.type(screen.getByLabelText("Nova Senha"), "a");
    await userEvent.type(screen.getByLabelText("Confirmar Nova Senha"), "b");

    await userEvent.click(screen.getByRole("button", { name: /salvar nova senha/i }));

    await waitFor(() => expect(mockUpdate).not.toHaveBeenCalled());
    expect(mockNotifyError).toHaveBeenCalled();
  });
});
