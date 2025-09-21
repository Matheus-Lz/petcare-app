import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Pagination, Empty } from "antd";

import styles from "./CustomerPetServiceList.module.scss";
import { PetServiceResponse } from "../../../../../api/PetService/types/PetServiceResponse";
import { getAllPetServices } from "../../../../../api/PetService/PetService";
import CustomerPetServiceCard from "../CustomerPetServiceCard/CustomerPerServiceCard";

const CustomerPetServiceList: React.FC = () => {
  const [services, setServices] = useState<PetServiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const pageSize = 8;

  const loadServices = async (page: number) => {
    setLoading(true);
    try {
      const response = await getAllPetServices(page - 1, pageSize);
      setServices(response.content);
      setTotalItems(response.totalElements);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices(currentPage);
  }, [currentPage]);

  const renderContent = () => {
    if (loading) {
      return <Spin size="large" className={styles.spinContainer} />;
    }
    if (services.length === 0) {
      return <Empty description="Nenhum serviço cadastrado" />;
    }
    return (
      <>
        <Row gutter={[32, 32]} className={styles.container}>
          {services.map((service) => (
            <Col key={service.id} xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
              <CustomerPetServiceCard service={service} />
            </Col>
          ))}
        </Row>

        <div className={styles.paginationContainer}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </div>
      </>
    );
  };

  return <>{renderContent()}</>;
};

export default CustomerPetServiceList;
