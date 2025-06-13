import React, { useEffect, useState } from "react";
import { Card, Typography, Pagination, Spin, Empty } from "antd";
import styles from "./CustomerSchedulingHistoricList.module.scss";
import { SchedulingDetailResponse } from "../../../../../api/Scheduling/types/SchedulingDetailResponse";
import { getUserSchedulings } from "../../../../../api/Scheduling/Scheduling";
import { SchedulingStatusDescription } from "../../../../../api/Scheduling/types/SchedulingStatus";

const { Text } = Typography;

const PAGE_SIZE = 10;

const CustomerSchedulingHistoricList: React.FC = () => {
  const [schedulings, setSchedulings] = useState<SchedulingDetailResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchSchedulings(page);
  }, [page]);

  const fetchSchedulings = async (page: number) => {
    try {
      setLoading(true);
      const data = await getUserSchedulings(page - 1, PAGE_SIZE);
      setSchedulings(data.content || []);
      setTotal(data.totalElements || 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Spin />
      ) : schedulings.length === 0 ? (
        <Empty description="Nenhum agendamento encontrado" />
      ) : (
        <>
          <div className={styles.gridContainer}>
            {schedulings.map((s) => (
              <Card
                key={s.id}
                hoverable
                className={styles.cardHorizontal}
                title={
                  <div className={styles.cardTitle}>
                    <span className={styles.serviceName}>{s.petService.name}</span>
                    <span className={`${styles.status} ${styles[s.status]}`}>
                      {SchedulingStatusDescription[s.status]}
                    </span>
                  </div>
                }
              >
                <div className={styles.cardContent}>
                  <div className={styles.cardInfo}>
                    <div>
                      <Text strong>Preço: </Text>
                      <Text>R$ {s.petService.price.toFixed(2)}</Text>
                    </div>
                    <div>
                      <Text strong>Duração: </Text>
                      <Text>{s.petService.time} min</Text>
                    </div>
                    {s.employee && (
                      <div>
                        <Text strong>Funcionário: </Text>
                        <Text>{s.employee.user.name}</Text>
                      </div>
                    )}
                    <div>
                      <Text strong>Horário: </Text>
                      <Text>{new Date(s.schedulingHour).toLocaleString()}</Text>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Pagination
            current={page}
            total={total}
            pageSize={PAGE_SIZE}
            onChange={setPage}
            className={styles.paginationContainer}
          />
        </>
      )}
    </>
  );
};

export default CustomerSchedulingHistoricList;
