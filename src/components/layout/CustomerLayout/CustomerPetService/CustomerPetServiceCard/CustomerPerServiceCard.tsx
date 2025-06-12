import React, { useState } from "react";
import { Card, Typography, Button, Modal, Tooltip } from "antd";
import { PetServiceResponse } from "../../../../../api/PetService/types/PetServiceResponse";
import CustomerScheduleForm from "../CustomerScheduleForm/CustomerScheduleForm";
import styles from "./CustomerPetServiceCard.module.scss";

const { Title, Text, Paragraph } = Typography;

interface Props {
  service: PetServiceResponse;
}

const CustomerPetServiceCard: React.FC<Props> = ({ service }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSchedule = () => {
    setModalVisible(true);
  };

  const handleSuccess = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Card
        hoverable
        className={styles.card}
        bodyStyle={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <div className={styles.contentWrapper}>
          <Title level={4} className={styles.title}>
            <Tooltip title={service.name}>
              <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {service.name}
              </div>
            </Tooltip>
          </Title>

          <Text strong className={styles.labelText}>Preço:</Text>
          <Text>R$ {service.price.toFixed(2)}</Text>
          <br />

          <Text strong className={styles.labelText}>Duração:</Text>
          <Text>{service.time} minutos</Text>
          <br />

          <Paragraph ellipsis={{ rows: 2, tooltip: service.description }}>
            {service.description}
          </Paragraph>
        </div>

        <div className={styles.buttonWrapper}>
          <Button type="primary" onClick={handleSchedule} block>
            Agendar
          </Button>
        </div>
      </Card>

      <Modal
        title="Agendar Serviço"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <CustomerScheduleForm service={service} onSuccess={handleSuccess} />
      </Modal>
    </>
  );
};

export default CustomerPetServiceCard;
