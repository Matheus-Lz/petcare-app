import React from "react";
import CustomerLayout from "../components/layout/CustomerLayout/CustomerLayout";
import CustomerSchedullingHistoricList from "../components/layout/CustomerLayout/CustomerPetService/CustomerSchedullingHistoric/CustomerSchedullingHistoricList";

const CustomerSchedullingHistoricPage: React.FC = () => {
  return (
    <CustomerLayout>
      <CustomerSchedullingHistoricList />
    </CustomerLayout>
  );
};

export default CustomerSchedullingHistoricPage;
