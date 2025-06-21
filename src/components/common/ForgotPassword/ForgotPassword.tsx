import React, { useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { forgotPassword } from "../../../api/user/UserService";
import { notifySuccess, notifyError } from "../../../utils/notifications";
import styles from "./ForgotPassword.module.scss";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await forgotPassword(values.email);
      notifySuccess("Email de redefinição enviado com sucesso!");
      navigate("/auth");
    } catch {
      notifyError("Erro ao enviar email de redefinição");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={3} style={{ textAlign: "center" }}>Redefinir Senha</Title>
        <Paragraph style={{ textAlign: "center", color: "#666" }}>
          Informe seu email e enviaremos um link para redefinir sua senha.
        </Paragraph>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Digite um email válido" }]}
          >
            <Input size="large" placeholder="Digite seu email" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
            >
              Enviar link de redefinição
            </Button>
          </Form.Item>

          <Button
            type="link"
            onClick={() => navigate("/auth")}
            block
          >
            Voltar para login
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
