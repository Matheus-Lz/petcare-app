import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/auth");
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>404</h1>
      <h2>Página não encontrada</h2>
      <p>Você não tem permissão para acessar esta página ou ela não existe.</p>
      <button
        onClick={handleLogout}
        style={{
          background: "none",
          border: "none",
          color: "#1890ff",
          textDecoration: "underline",
          fontWeight: "bold",
          cursor: "pointer",
          padding: 0,
          fontSize: "inherit",
          fontFamily: "inherit",
        }}
      >
        Voltar para a página de login
      </button>
    </div>
  );
};

export default NotFound;
