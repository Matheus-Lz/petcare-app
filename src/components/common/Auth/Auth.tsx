import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Tabs, Card } from "antd";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import { loginUser, registerUser } from "../../../api/user/UserService";
import { notifySuccess, notifyError } from "../../../utils/notifications";
import styles from "./Auth.module.scss";

const { TabPane } = Tabs;

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [registerForm] = Form.useForm();
  const [cpfCnpjValue, setCpfCnpjValue] = useState("");
  const [cpfCnpjMask, setCpfCnpjMask] = useState("999.999.999-99");

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      navigate("/dashboard/pet-service");
    }
  }, [navigate]);

  useEffect(() => {
    const onlyDigits = cpfCnpjValue.replace(/\D/g, "");
    setCpfCnpjMask(
      onlyDigits.length > 11 ? "99.999.999/9999-99" : "999.999.999-99"
    );
  }, [cpfCnpjValue]);

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const { token, role, name, userId } = await loginUser(values);

      const storage = values.remember ? localStorage : sessionStorage;
      storage.setItem("token", token);
      storage.setItem("role", role);
      storage.setItem("name", name);
      storage.setItem("userId", userId);

      notifySuccess("Login realizado com sucesso!");

      switch (role) {
        case "SUPER_ADMIN":
          navigate("/dashboard/pet-service");
          break;
        case "EMPLOYEE":
          navigate("/dashboard/scheduling-management");
          break;
        case "USER":
          navigate("/pet-service");
          break;
        default:
          notifyError("Permissão desconhecida");
      }
    } catch (error: any) {
      notifyError(error.response?.data?.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        cpfCnpj: values.cpfCnpj.replace(/\D/g, ""),
      };

      await registerUser(payload);
      notifySuccess("Registro realizado com sucesso!");
      registerForm.resetFields();
      setCpfCnpjValue("");
      setActiveTab("login");
    } catch (error: any) {
      notifyError(error.response?.data?.message || "Erro ao registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <h1>Pet Care</h1>
        <p>Cuide com quem cuida.</p>
      </div>
      <div className={styles.rightPane}>
        <Card className={styles.card}>
          <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
            <TabPane tab="Entrar" key="login">
              <Form layout="vertical" onFinish={handleLogin}>
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
                  rules={[{ required: true }]}
                >
                  <Input.Password size="large" />
                </Form.Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    noStyle
                    initialValue={false}
                  >
                    <Checkbox>Manter conectado</Checkbox>
                  </Form.Item>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => navigate("/forgot-password")}
                    style={{ padding: 0 }}
                  >
                    Esqueceu sua senha?
                  </Button>
                </div>

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
            </TabPane>

            <TabPane tab="Cadastre-se" key="register">
              <Form
                form={registerForm}
                layout="vertical"
                onFinish={handleRegister}
              >
                <Form.Item
                  name="name"
                  label="Nome"
                  rules={[{ required: true }]}
                >
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
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("As senhas não coincidem")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password size="large" />
                </Form.Item>

                <Form.Item
                  name="cpfCnpj"
                  label="CPF/CNPJ"
                  rules={[{ required: true }]}
                >
                  <InputMask
                    mask={cpfCnpjMask}
                    value={cpfCnpjValue}
                    onChange={(e) => setCpfCnpjValue(e.target.value)}
                  >
                    {(inputProps: any) => (
                      <Input {...inputProps} size="large" />
                    )}
                  </InputMask>
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
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
