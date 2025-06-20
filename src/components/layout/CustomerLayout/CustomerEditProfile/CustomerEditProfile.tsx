import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  message,
  Typography,
  Button,
  Space,
} from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  getUserById,
  updateUser,
  loginUser,
} from "../../../../api/user/UserService";

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

  useEffect(() => {
    if (open) {
      getUserById(userId)
        .then((data: any) => {
          form.setFieldsValue({
            name: data.name,
            email: data.email,
            cpfCnpj: data.cpfCnpj,
          });
          setEditingField(null);
          setEditingPassword(false);
        })
        .catch(() => message.error("Erro ao carregar dados do usuário"));
    }
  }, [open, userId, form]);

  const handleFieldSave = async (field: string) => {
    try {
      const value = form.getFieldValue(field);
      const currentPassword = form.getFieldValue("currentPasswordForEmailUpdate");

      if (field === "email" && !currentPassword) {
        message.warning("Informe sua senha atual para alterar o e-mail.");
        return;
      }

      await updateUser(userId, {
        [field]: value,
        ...(field === "email" ? { currentPassword } : {}),
      });

      if (field === "name") {
        const storage = localStorage.getItem("name") ? localStorage : sessionStorage;
        storage.setItem("name", value);
      }

      if (field === "email") {
        const response = await loginUser({
          email: value,
          password: currentPassword,
        });

        const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
        storage.setItem("token", response.token);
        storage.setItem("role", response.role);
        storage.setItem("name", response.name);
        storage.setItem("userId", userId);

        message.success("Email atualizado e login renovado com sucesso.");
      } else {
        message.success("Campo atualizado com sucesso");
      }

      setEditingField(null);
      onSuccess?.();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Erro ao atualizar campo");
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
        message.warning("As novas senhas não coincidem");
        return;
      }

      setLoading(true);
      await updateUser(userId, {
        password: values.newPassword,
        currentPassword: values.currentPassword,
      });

      message.success("Senha atualizada com sucesso");
      setEditingPassword(false);
      form.resetFields([
        "currentPassword",
        "newPassword",
        "confirmNewPassword",
      ]);
    } catch {
      message.error("Erro ao atualizar senha");
    } finally {
      setLoading(false);
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
            <Input disabled={editingField !== "name"} />
            {editingField === "name" ? (
              <>
                <Button
                  icon={<CheckOutlined />}
                  onClick={() => handleFieldSave("name")}
                />
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => setEditingField(null)}
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

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Input disabled={editingField !== "email"} />
            {editingField === "email" ? (
              <>
                <Button
                  icon={<CheckOutlined />}
                  onClick={() => handleFieldSave("email")}
                />
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => setEditingField(null)}
                />
              </>
            ) : (
              <Button
                icon={<EditOutlined />}
                onClick={() => setEditingField("email")}
              />
            )}
          </Space.Compact>
        </Form.Item>

        {editingField === "email" && (
          <Form.Item
            name="currentPasswordForEmailUpdate"
            label="Senha Atual"
            rules={[{ required: true, message: "Informe sua senha atual" }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item
          name="cpfCnpj"
          label="CPF/CNPJ"
          rules={[{ required: true }]}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Input disabled={editingField !== "cpfCnpj"} />
            {editingField === "cpfCnpj" ? (
              <>
                <Button
                  icon={<CheckOutlined />}
                  onClick={() => handleFieldSave("cpfCnpj")}
                />
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => setEditingField(null)}
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
                    return Promise.reject(
                      new Error("As senhas não coincidem")
                    );
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
