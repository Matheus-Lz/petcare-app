import { Layout, Menu } from "antd";
import {
  CalendarOutlined,
  ScissorOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Sidebar.module.scss";
import CustomerEditProfileModal from "../../CustomerLayout/CustomerEditProfile/CustomerEditProfile";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const role = sessionStorage.getItem("role") || localStorage.getItem("role");
  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/auth");
  };

  return (
    <>
      <Sider theme="light" width={220}>
        <div className={styles.sidebarTitle}>PetCare</div>
        
        <Menu mode="inline" className={styles.menuContainer}>
          <Menu.Item
            key="edit-profile"
            icon={<UserOutlined />}
            onClick={() => setIsEditModalOpen(true)}
            className={styles.editProfileItem}
            style={{ marginBottom: 16, fontWeight: 500 }}
          >
            Perfil
          </Menu.Item>

          {(role === "SUPER_ADMIN" || role === "EMPLOYEE") && (
            <Menu.Item
              key="scheduling-management"
              icon={<CalendarOutlined />}
              onClick={() => navigate("/dashboard/scheduling-management")}
            >
              Gerenciar serviços
            </Menu.Item>
          )}

          {role === "SUPER_ADMIN" && (
            <>
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
                key="employee"
                icon={<UserOutlined />}
                onClick={() => navigate("/dashboard/employee")}
              >
                Funcionários
              </Menu.Item>
            </>
          )}

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

      <CustomerEditProfileModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userId={userId || ""}
      />
    </>
  );
};

export default Sidebar;
