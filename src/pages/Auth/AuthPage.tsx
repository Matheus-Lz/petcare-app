import React, { useEffect } from "react";
import { Tabs } from "antd";
import styles from "./AuthPage.module.scss";
import LoginForm from "../../components/layout/Auth/Login/LoginForm";
import RegisterForm from "../../components/layout/Auth/Register/RegisterForm";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      navigate("/dashboard/pet-service");
    }
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <h1>Pet Care</h1>
        <p>Cuide com que cuida.</p>
      </div>
      <div className={styles.rightPane}>
        <Tabs defaultActiveKey="login" centered className={styles.tabs}>
          <TabPane tab="Entrar" key="login">
            <LoginForm />
          </TabPane>
          <TabPane tab="Cadastre-se" key="register">
            <RegisterForm />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;