import React from "react";
import AdminLayout from "../../components/layout/AdminLayout/AdminLayout";
import PetServiceTable from "../../components/layout/AdminLayout/PetService/PetServiceTable";

const PetServicesPage: React.FC = () => {
  return (
    <AdminLayout>
      <PetServiceTable />
    </AdminLayout>
  );
};

export default PetServicesPage;
