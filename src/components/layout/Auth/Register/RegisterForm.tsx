import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { registerUser } from "../../../../api/user/UserService";
import { notifySuccess, notifyError } from "../../../../utils/notifications";

const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      await registerUser(values);
      notifySuccess("Registro realizado com sucesso!");
    } catch (error: any) {
      notifyError(error.response?.data?.message || "Erro ao registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleRegister}>
      <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, type: "email" }]}
      >
        <Input size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Senha"
        rules={[
          { required: true, message: "Informe a senha" },
          {
            min: 6,
            message: "A senha deve ter no mínimo 6 caracteres",
          },
        ]}
        hasFeedback
      >
        <Input.Password size="large" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirmar Senha"
        dependencies={["password"]}
        hasFeedback
        rules={[
          { required: true, message: "Confirme a senha" },
          {
            min: 6,
            message: "A senha deve ter no mínimo 6 caracteres",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("As senhas não coincidem"));
            },
          }),
        ]}
      >
        <Input.Password size="large" />
      </Form.Item>

      <Form.Item name="cpfCnpj" label="CPF/CNPJ" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
        >
          Cadastre-se
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
