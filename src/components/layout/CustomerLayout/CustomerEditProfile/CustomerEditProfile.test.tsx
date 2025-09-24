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

  const item = (labelEl as HTMLElement).closest(
    ".ant-form-item"
  ) as HTMLElement;
  if (!item)
    throw new Error(`Não achei o container de Form.Item para "${labelText}"`);
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
    mockLogin.mockResolvedValue({
      token: "t",
      role: "USER",
      name: "Alice",
    });
  });

  async function renderOpen() {
    render(<CustomerEditProfileModal open onClose={() => {}} userId="u1" />);
    await waitFor(() => expect(mockGet).toHaveBeenCalled());

    await screen.findByRole("dialog", { name: /editar perfil/i });
  }

  test("carrega e mostra o formulário", async () => {
    await renderOpen();

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("CPF/CNPJ")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /editar senha/i })
    ).toBeInTheDocument();
  });

  test("salva e-mail com senha atual e reloga", async () => {
    await renderOpen();

    const emailItem = getItemContainerByLabelText(/^Email$/);

    const [editBtn] = within(emailItem).getAllByRole("button");
    await userEvent.click(editBtn);

    const emailInput = within(emailItem).getByRole(
      "textbox"
    ) as HTMLInputElement;
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "new@x.com");

    await userEvent.type(screen.getByLabelText("Senha Atual"), "pass123");

    const [saveBtn] = within(emailItem).getAllByRole("button");
    await userEvent.click(saveBtn);

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith("u1", {
        email: "new@x.com",
        currentPassword: "pass123",
      })
    );
    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith({
        email: "new@x.com",
        password: "pass123",
      })
    );
  });

  test("não salva e-mail sem senha atual", async () => {
    await renderOpen();

    const emailItem = getItemContainerByLabelText(/^Email$/);
    const [editBtn] = within(emailItem).getAllByRole("button");
    await userEvent.click(editBtn);

    const emailInput = within(emailItem).getByRole(
      "textbox"
    ) as HTMLInputElement;
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "other@x.com");

    const [saveBtn] = within(emailItem).getAllByRole("button");
    await userEvent.click(saveBtn);

    const { message } = jest.requireMock("antd");
    await waitFor(() =>
      expect(message.warning).toHaveBeenCalledWith(
        "Informe sua senha atual para alterar o e-mail."
      )
    );
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test("edita CPF/CNPJ e salva", async () => {
    await renderOpen();

    const cpfItem = getItemContainerByLabelText("CPF/CNPJ");
    const buttonsBefore = within(cpfItem).getAllByRole("button");
    const editBtn = buttonsBefore[0];
    await userEvent.click(editBtn);

    const cpfInput = within(cpfItem).getByRole("textbox") as HTMLInputElement;
    await userEvent.clear(cpfInput);
    await userEvent.type(cpfInput, "99999999999");

    const [saveBtn] = within(cpfItem).getAllByRole("button");
    await userEvent.click(saveBtn);

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith("u1", { cpfCnpj: "99999999999" })
    );
  });
});
