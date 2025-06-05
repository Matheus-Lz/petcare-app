import React from "react";
import { Card, Typography, Button } from "antd";
import { PetServiceResponse } from "../../../../../api/PetService/types/PetServiceResponse";

import styles from "./CustomerPetServiceCard.module.scss";

const { Title, Text, Paragraph } = Typography;

interface Props {
  service: PetServiceResponse;
}

const CustomerPetServiceCard: React.FC<Props> = ({ service }) => {
  const handleSchedule = () => {
    alert(`Agendando serviço: ${service.name}`);
  };

  return (
    <Card hoverable className={styles.card}>
      <Title level={4} className={styles.title}>
        {service.name}
      </Title>

      <Text strong className={styles.labelText}>
        Preço:
      </Text>
      <Text>R$ {service.price.toFixed(2)}</Text>
      <br />

      <Text strong className={styles.labelText}>
        Duração:
      </Text>
      <Text>{service.time} minutos</Text>
      <br />

      <Paragraph ellipsis={{ rows: 3 }}>{service.description}</Paragraph>

      <div className={styles.buttonWrapper}>
        <Button type="primary" onClick={handleSchedule} block>
          Agendar
        </Button>
      </div>
    </Card>
  );
};

export default CustomerPetServiceCard;
