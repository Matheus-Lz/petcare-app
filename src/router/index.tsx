import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../pages/Auth/AuthPage";
import PetServicesPage from "../pages/PetServicePage";
import WorkingPeriodPage from "../pages/WorkingPeriodPage";
import EmployeePage from "../pages/EmployeePage";
import CustomerPetServicePage from "../pages/CustomerPetServicePage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/dashboard/pet-service" element={<PetServicesPage />} />
        <Route path="/dashboard/working-period" element={<WorkingPeriodPage />} />
        <Route path="/dashboard/employee" element={<EmployeePage />} />

        <Route path="/pet-service" element={<CustomerPetServicePage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
