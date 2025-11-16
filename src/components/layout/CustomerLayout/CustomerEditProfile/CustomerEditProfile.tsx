import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Typography, Button, Space } from "antd";
import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import InputMask from "react-input-mask";
import { getCurrentUser, updateUser } from "../../../../api/user/UserService";
import { notifyError, notifySuccess } from "../../../../utils/notifications";
import { UserResponse } from "../../../../api/user/type/UserResponse";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: () => void;
}

const CustomerEditProfileModal: React.FC<Props> = ({
  open,
  onClose,
  userId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingPassword, setEditingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);

  const [nameValue, setNameValue] = useState("");
  const [cpfCnpjValue, setCpfCnpjValue] = useState("");
  const [cpfCnpjMask, setCpfCnpjMask] = useState("999.999.999-99");

  useEffect(() => {
    const onlyDigits = cpfCnpjValue.replaceAll(/\D/g, "");
    setCpfCnpjMask(
      onlyDigits.length > 11 ? "99.999.999/9999-99" : "999.999.999-99"
    );
  }, [cpfCnpjValue]);

  useEffect(() => {
    if (open) {
      getCurrentUser().then((data: UserResponse) => {
        setCurrentUser(data);

        const anyData = data as any;
        const nameFromApi =
          anyData.name ?? anyData.fullName ?? anyData.nome ?? "";

        setNameValue(nameFromApi);
        setCpfCnpjValue(data.cpfCnpj || "");

        form.setFieldsValue({
          name: nameFromApi,
          cpfCnpj: data.cpfCnpj || "",
        });
      });
    } else {
      form.resetFields();
      setEditingField(null);
      setEditingPassword(false);
      setCurrentUser(null);
      setNameValue("");
      setCpfCnpjValue("");
    }
  }, [open, form]);

  const handleFieldSave = async (field: string) => {
    try {
      await form.validateFields([field]);
      const value = form.getFieldValue(field);

      const payload: any = {
        [field]: field === "cpfCnpj" ? value.replace(/\D/g, "") : value,
      };

      await updateUser(userId, payload);

      if (field === "name") {
        const storage = localStorage.getItem("name")
          ? localStorage
          : sessionStorage;
        storage.setItem("name", value);
        notifySuccess("Nome atualizado com sucesso");
      }

      if (field === "cpfCnpj") {
        notifySuccess("Cpf/Cnpj atualizado com sucesso");
      }

      setEditingField(null);
      onSuccess?.();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Ocorreu um erro inesperado.";
      notifyError(errorMessage);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const values = await form.validateFields([
        "currentPassword",
        "newPassword",
        "confirmNewPassword",
      ]);

      if (values.newPassword !== values.confirmNewPassword) {
        notifyError("As novas senhas não coincidem");
        return;
      }

      setLoading(true);
      await updateUser(userId, {
        password: values.newPassword,
        currentPassword: values.currentPassword,
      });

      notifySuccess("Senha atualizada com sucesso");
      setEditingPassword(false);
      form.resetFields([
        "currentPassword",
        "newPassword",
        "confirmNewPassword",
      ]);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao atualizar senha";
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = (field: string) => {
    setEditingField(null);
    if (!currentUser) return;

    const anyUser = currentUser as any;
    const nameFromApi =
      anyUser.name ?? anyUser.fullName ?? anyUser.nome ?? "";

    if (field === "name") {
      setNameValue(nameFromApi);
      form.setFieldsValue({
        name: nameFromApi,
      });
    }

    if (field === "cpfCnpj") {
      setCpfCnpjValue(currentUser.cpfCnpj || "");
      form.setFieldsValue({
        cpfCnpj: currentUser.cpfCnpj || "",
      });
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Editar Perfil"
      footer={null}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              disabled={editingField !== "name"}
              value={nameValue}
              onChange={(e) => {
                const value = e.target.value;
                setNameValue(value);
                form.setFieldsValue({ name: value });
              }}
            />
            {editingField === "name" ? (
              <>
                <Button
                  icon={<CheckOutlined />}
                  onClick={() => handleFieldSave("name")}
                />
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => handleCancelEdit("name")}
                />
              </>
            ) : (
              <Button
                icon={<EditOutlined />}
                onClick={() => setEditingField("name")}
              />
            )}
          </Space.Compact>
        </Form.Item>

        <Form.Item name="cpfCnpj" label="CPF/CNPJ" rules={[{ required: true }]}>
          <Space.Compact style={{ width: "100%" }}>
            <InputMask
              mask={cpfCnpjMask}
              value={cpfCnpjValue}
              onChange={(e) => {
                const value = e.target.value;
                setCpfCnpjValue(value);
                form.setFieldsValue({ cpfCnpj: value });
              }}
              disabled={editingField !== "cpfCnpj"}
            >
              {(inputProps: any) => (
                <Input
                  {...inputProps}
                  className={
                    editingField !== "cpfCnpj"
                      ? `${inputProps.className || ""} ant-input-disabled`
                      : inputProps.className
                  }
                />
              )}
            </InputMask>
            {editingField === "cpfCnpj" ? (
              <>
                <Button
                  icon={<CheckOutlined />}
                  onClick={() => handleFieldSave("cpfCnpj")}
                />
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => handleCancelEdit("cpfCnpj")}
                />
              </>
            ) : (
              <Button
                icon={<EditOutlined />}
                onClick={() => setEditingField("cpfCnpj")}
              />
            )}
          </Space.Compact>
        </Form.Item>

        <Typography.Title level={5} style={{ marginTop: 24 }}>
          Alterar Senha
        </Typography.Title>

        {!editingPassword ? (
          <Button
            icon={<EditOutlined />}
            onClick={() => setEditingPassword(true)}
          >
            Editar senha
          </Button>
        ) : (
          <>
            <Form.Item
              name="currentPassword"
              label="Senha Atual"
              rules={[{ required: true, message: "Informe a senha atual" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Nova Senha"
              rules={[
                { required: true, message: "Informe a nova senha" },
                { min: 6, message: "Mínimo 6 caracteres" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirmNewPassword"
              label="Confirmar Nova Senha"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Confirme a nova senha" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("As senhas não coincidem"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Space>
              <Button
                type="primary"
                loading={loading}
                onClick={handlePasswordSubmit}
              >
                Salvar nova senha
              </Button>
              <Button danger onClick={() => setEditingPassword(false)}>
                Cancelar
              </Button>
            </Space>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default CustomerEditProfileModal;
