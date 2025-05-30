import React from 'react';
import AdminLayout from '../components/layout/AdminLayout/AdminLayout';
import EmployeeTable from '../components/layout/AdminLayout/Employee/EmployeeTable';

const WorkingPeriodPage: React.FC = () => {
  return (
    <AdminLayout>
      <EmployeeTable />
    </AdminLayout>
  );
};

export default WorkingPeriodPage;
