import React from "react";
import CustomerLayout from "../components/layout/CustomerLayout/CustomerLayout";
import CustomerSchedulingHistoricList from "../components/layout/CustomerLayout/CustomerPetService/CustomerSchedulingHistoric/CustomerSchedulingHistoricList";

const CustomerSchedulingHistoricPage: React.FC = () => {
  return (
    <CustomerLayout>
      <CustomerSchedulingHistoricList />
    </CustomerLayout>
  );
};

export default CustomerSchedulingHistoricPage;
