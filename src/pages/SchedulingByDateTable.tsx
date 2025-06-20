import React from "react";
import AdminLayout from "../components/layout/AdminLayout/AdminLayout";
import { SchedulingByDateTable } from "../components/layout/AdminLayout/SchedulingByDateTable/SchedulingByDateTable";

const SchedulingByDateTablePage: React.FC = () => {
  return (
    <AdminLayout>
      <SchedulingByDateTable />
    </AdminLayout>
  );
};

export default SchedulingByDateTablePage;
