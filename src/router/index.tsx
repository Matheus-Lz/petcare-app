import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "../pages/Auth/AuthPage";
import PetServicesPage from "../pages/PetServicePage";
import WorkingPeriodPage from "../pages/WorkingPeriodPage";
import EmployeePage from "../pages/EmployeePage";
import CustomerPetServicePage from "../pages/CustomerPetServicePage";
import CustomerSchedulingHistoricPage from "../pages/CustomerSchedulingHistoricPage";
import ProtectedRoute from "../components/common/ProtectedRoute ";
import NotFound from "../components/common/NotFound";
import SchedulingByDateTablePage from "../pages/SchedulingByDateTable";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/dashboard/scheduling-management"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE", "SUPER_ADMIN"]}>
              <SchedulingByDateTablePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/pet-service"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <PetServicesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/working-period"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <WorkingPeriodPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/employee"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <EmployeePage />
            </ProtectedRoute>
          }
        />

        <Route path="/pet-service" element={<CustomerPetServicePage />} />
        <Route
          path="/schedulings"
          element={<CustomerSchedulingHistoricPage />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
