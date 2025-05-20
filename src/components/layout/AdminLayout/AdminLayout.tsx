import React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar/Sidebar";
import styles from "./AdminLayout.module.scss";

const { Content } = Layout;

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout className={styles.adminLayout}>
      <Sidebar />
      <Layout className={styles.contentLayout}>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;