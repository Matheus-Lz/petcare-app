import React, { useEffect, useState } from "react";
import { Card, Typography, Pagination, Spin, Empty } from "antd";
import { getUserSchedullings } from "../../../../../api/Schedulling/Schedulling";
import styles from "./CustomerSchedullingHistoricList.module.scss";
import { SchedullingStatusDescription } from "../../../../../api/Schedulling/types/SchedullingStatus";
import { SchedullingDetailResponse } from "../../../../../api/Schedulling/types/SchedullingDetailResponse";

const { Text } = Typography;

const PAGE_SIZE = 10;

const CustomerSchedullingHistoricList: React.FC = () => {
  const [schedullings, setSchedullings] = useState<SchedullingDetailResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchSchedullings(page);
  }, [page]);

  const fetchSchedullings = async (page: number) => {
    try {
      setLoading(true);
      const data = await getUserSchedullings(page - 1, PAGE_SIZE);
      setSchedullings(data.content || []);
      setTotal(data.totalElements || 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Spin />
      ) : schedullings.length === 0 ? (
        <Empty description="Nenhum agendamento encontrado" />
      ) : (
        <>
          <div className={styles.gridContainer}>
            {schedullings.map((s) => (
              <Card
                key={s.id}
                hoverable
                className={styles.cardHorizontal}
                title={
                  <div className={styles.cardTitle}>
                    <span className={styles.serviceName}>{s.petService.name}</span>
                    <span className={`${styles.status} ${styles[s.status]}`}>
                      {SchedullingStatusDescription[s.status]}
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
                      <Text>{new Date(s.schedullingHour).toLocaleString()}</Text>
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

export default CustomerSchedullingHistoricList;
