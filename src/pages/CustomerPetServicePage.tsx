import React from 'react';
import CustomerPetServiceList from '../components/layout/CustomerLayout/CustomerPetService/CustomerPerServiceList/CustomerPetServiceList';
import CustomerLayout from '../components/layout/CustomerLayout/CustomerLayout';

const CustomerPetServicePage: React.FC = () => {
  return (
    <CustomerLayout>
      <CustomerPetServiceList />
    </ CustomerLayout>
  );
};

export default CustomerPetServicePage;
