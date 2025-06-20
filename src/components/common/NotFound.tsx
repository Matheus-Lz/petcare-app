import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { FrownOutlined } from "@ant-design/icons";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/auth");
  };

  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f2f5" }}>
      <Result
        icon={<FrownOutlined style={{ color: "#ff4d4f" }} />}
        status="404"
        title="Página não encontrada"
        subTitle="Você não tem permissão para acessar esta página ou ela não existe."
        extra={
          <Button type="primary" onClick={handleLogout}>
            Voltar para a página de login
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
