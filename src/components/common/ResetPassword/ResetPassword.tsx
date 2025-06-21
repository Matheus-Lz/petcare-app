import React, { useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./ResetPassword.module.scss";
import { notifyError, notifySuccess } from "../../../utils/notifications";
import { resetPassword } from "../../../api/user/UserService";

const { Title, Paragraph } = Typography;

const ResetPassword: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await resetPassword(token, values.newPassword);
      notifySuccess("Senha redefinida com sucesso!");
      navigate("/auth");
    } catch {
      notifyError("Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={3} style={{ textAlign: "center" }}>
          Redefinir Senha
        </Title>
        <Paragraph style={{ textAlign: "center", color: "#666" }}>
          Insira sua nova senha abaixo.
        </Paragraph>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="newPassword"
            label="Nova senha"
            rules={[
              { required: true, message: "Informe a nova senha" },
              { min: 6, message: "A senha deve ter no mínimo 6 caracteres" },
            ]}
            hasFeedback
          >
            <Input.Password size="large" placeholder="Nova senha" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmar senha"
            dependencies={["newPassword"]}
            hasFeedback
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
            <Input.Password size="large" placeholder="Confirmar senha" />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              loading={loading}
              size="large"
              block
            >
              Redefinir senha
            </Button>
          </Form.Item>
        </Form>

        <Button type="link" onClick={() => navigate("/auth")} block>
          Voltar para login
        </Button>
      </Card>
    </div>
  );
};

export default ResetPassword;
