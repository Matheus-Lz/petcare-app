import { Layout, Menu } from "antd";
import {
  CalendarOutlined,
  ScissorOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.scss";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/auth");
  };

  return (
    <Sider theme="light" width={220}>
      <div className={styles.sidebarTitle}>PetCare</div>
      <Menu
        mode="inline"
        className={styles.menuContainer}
      >
        <Menu.Item
          key="pet-service"
          icon={<ScissorOutlined />}
          onClick={() => navigate("/dashboard/pet-service")}
        >
          Serviços
        </Menu.Item>

        <Menu.Item
          key="working-period"
          icon={<CalendarOutlined />}
          onClick={() => navigate("/dashboard/working-period")}
        >
          Períodos
        </Menu.Item>

        <Menu.Item
          key="logout"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Sair
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
