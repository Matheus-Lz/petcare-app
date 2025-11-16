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

jest.mock("react-input-mask", () => {
  const React = require("react");
  return (props: any) => {
    const { children, ...rest } = props;
    if (typeof children === "function") {
      return children(rest);
    }
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

  test("carrega e mostra o formulário básico", async () => {
    await renderOpen();

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("CPF/CNPJ")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /editar senha/i })
    ).toBeInTheDocument();
  });

  test("edita Nome e salva", async () => {
    await renderOpen();

    const nomeItem = getItemContainerByLabelText(/^Nome$/);
    const [editBtn] = within(nomeItem).getAllByRole("button");
    await userEvent.click(editBtn);

    const nomeInput = within(nomeItem).getByRole("textbox") as HTMLInputElement;
    await userEvent.clear(nomeInput);
    await userEvent.type(nomeInput, "Novo Nome");

    const [saveBtn] = within(nomeItem).getAllByRole("button");
    await userEvent.click(saveBtn);

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith("u1", { name: "Novo Nome" })
    );
  });

  test("edita CPF/CNPJ e salva", async () => {
    await renderOpen();

    const cpfItem = getItemContainerByLabelText("CPF/CNPJ");
    const [editBtn] = within(cpfItem).getAllByRole("button");
    await userEvent.click(editBtn);

    const cpfInput = within(cpfItem).getByRole("textbox") as HTMLInputElement;
    await userEvent.clear(cpfInput);
    await userEvent.type(cpfInput, "99999999999");

    const [saveBtn] = within(cpfItem).getAllByRole("button");
    await userEvent.click(saveBtn);

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith("u1", {
        cpfCnpj: "99999999999",
      })
    );
  });
});
