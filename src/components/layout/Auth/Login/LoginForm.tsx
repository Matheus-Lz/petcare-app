import React, { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { loginUser } from "../../../../api/user/UserService";
import { notifySuccess, notifyError } from "../../../../utils/notifications";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const { token, role, name } = await loginUser(values);

      if (values.remember) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("name", name);
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("name", name);
      }

      notifySuccess("Login realizado com sucesso!");

      switch (role) {
        case "ADMIN":
        case "SUPER_ADMIN":
        case "EMPLOYEE":
          navigate("/dashboard/pet-service");
          break;
        case "USER":
          navigate("/pet-service");
          break;
        default:
          notifyError("Permissão desconhecida");
          break;
      }
    } catch (error: any) {
      notifyError(error.response?.data?.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleLogin}>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, type: "email" }]}
      >
        <Input size="large" />
      </Form.Item>

      <Form.Item name="password" label="Senha" rules={[{ required: true }]}>
        <Input.Password size="large" />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" initialValue={false}>
        <Checkbox>Manter conectado</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
        >
          Entrar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
