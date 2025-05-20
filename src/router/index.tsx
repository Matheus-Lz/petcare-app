import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../pages/Auth/AuthPage";
import PetServicesPage from "../pages/PetService/PetServicePage";
import WorkingPeriodPage from "../pages/WorkingPeriodPage/WorkingPeriodPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/dashboard/pet-service" element={<PetServicesPage />} />
        <Route path="/dashboard/working-period" element={<WorkingPeriodPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
