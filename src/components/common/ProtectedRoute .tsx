import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import NotFound from "./NotFound";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const role = sessionStorage.getItem("role") || localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return <NotFound />;
};

export default ProtectedRoute;
