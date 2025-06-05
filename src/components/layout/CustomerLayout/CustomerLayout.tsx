import React from "react";
import { Layout } from "antd";
import styles from "./CustomerLayout.module.scss";
import CustomerHeader from "./CustomerHeader/CustomerHeader";

const { Content } = Layout;

const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const username =
    localStorage.getItem("name") || sessionStorage.getItem("name") || "Usuário";

  return (
    <Layout className={styles.customerLayout}>
      <CustomerHeader username={username} />

      <Content className={styles.content}>{children}</Content>
    </Layout>
  );
};

export default CustomerLayout;
