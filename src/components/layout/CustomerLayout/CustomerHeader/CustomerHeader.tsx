import React from "react";
import { Layout, Typography } from "antd";
import {
  AppstoreOutlined,
  LogoutOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

import styles from "./CustomerHeader.module.scss";

const { Header } = Layout;
const { Text } = Typography;

interface Props {
  username: string;
}

const CustomerHeader: React.FC<Props> = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/auth");
  };

  return (
    <Header className={styles.header}>
      <div className={styles.leftContainer}>
        <AppstoreOutlined className={styles.iconBlue} />
        <Link to="/pet-service" className={styles.linkText}>
          <Text strong>Pet Services</Text>
        </Link>

        <Link to="/schedulings" className={styles.linkText} style={{ marginLeft: 20, display: "flex", alignItems: "center", gap: 6 }}>
          <ScheduleOutlined />
          <Text strong>Agendamentos</Text>
        </Link>
      </div>

      <div className={styles.rightContainer}>
        <Text>{username}</Text>
        <LogoutOutlined
          onClick={handleLogout}
          className={styles.logoutIcon}
        />
      </div>
    </Header>
  );
};

export default CustomerHeader;
