import React from 'react';
import WorkingPeriodScheduler from '../components/layout/AdminLayout/WorkingPeriodScheduler/WorkingPeriodScheduler';
import AdminLayout from '../components/layout/AdminLayout/AdminLayout';

const WorkingPeriodPage: React.FC = () => {
  return (
    <AdminLayout>
      <WorkingPeriodScheduler />
    </AdminLayout>
  );
};

export default WorkingPeriodPage;
