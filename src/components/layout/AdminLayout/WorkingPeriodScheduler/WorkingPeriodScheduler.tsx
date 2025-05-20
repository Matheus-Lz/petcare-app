import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  TimePicker,
  Modal,
  message,
  List,
  Row,
  Col,
  Typography,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { WorkingPeriodResponse } from "../../../../api/WorkingPeriod/types/WorkingPeriodResponse";
import {
  createWorkingPeriod,
  getAllWorkingPeriods,
  deleteWorkingPeriod,
} from "../../../../api/WorkingPeriod/WorkingPeriod";
import { WorkingPeriodRequest } from "../../../../api/WorkingPeriod/types/WorkingPeriodRequest";

import styles from "./WorkingPeriodScheduler.module.scss";
import Title from "antd/es/typography/Title";

const { Text } = Typography;

const dayMap: Record<string, string> = {
  Segunda: "MONDAY",
  Terça: "TUESDAY",
  Quarta: "WEDNESDAY",
  Quinta: "THURSDAY",
  Sexta: "FRIDAY",
};

const reverseDayMap = Object.fromEntries(
  Object.entries(dayMap).map(([pt, en]) => [en, pt])
);

const daysOfWeek = Object.keys(dayMap);

const WorkingPeriodScheduler: React.FC = () => {
  const [workingPeriods, setWorkingPeriods] = useState<
    Record<string, WorkingPeriodResponse[]>
  >({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPeriods = async () => {
    setLoading(true);
    try {
      const data = await getAllWorkingPeriods();
      const grouped = data.reduce(
        (acc: Record<string, WorkingPeriodResponse[]>, item) => {
          const day = reverseDayMap[item.dayOfWeek];
          acc[day] = [...(acc[day] || []), item];
          return acc;
        },
        {}
      );
      setWorkingPeriods(grouped);
    } catch (error) {
      message.error("Erro ao buscar períodos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  const openModal = (day: string) => {
    setSelectedDay(day);
    setStartTime(null);
    setEndTime(null);
    setModalVisible(true);
  };

  const handleAddPeriod = async () => {
    if (!startTime || !endTime || !selectedDay) {
      message.warning("Por favor, preencha todos os campos");
      return;
    }
    if (endTime.isBefore(startTime)) {
      message.warning("O horário de fim deve ser depois do início");
      return;
    }

    const dto: WorkingPeriodRequest = {
      dayOfWeek: dayMap[selectedDay],
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
    };

    try {
      await createWorkingPeriod(dto);
      message.success("Período criado com sucesso");
      setModalVisible(false);
      fetchPeriods();
    } catch (error) {
      message.error("Erro ao criar período");
    }
  };

  const handleDeletePeriod = async (id: string) => {
    try {
      await deleteWorkingPeriod(id);
      message.success("Período deletado com sucesso");
      fetchPeriods();
    } catch (error) {
      message.error("Erro ao deletar período");
    }
  };

  return (
    <div className={styles.wrapper}>
      <Title level={3} className={styles.title}>
        Períodos de Trabalho
      </Title>
      <Row gutter={[16, 16]} wrap={true} justify={"center"}>
        {daysOfWeek.map((day) => (
          <Col xs={24} sm={12} md={8} lg={4} key={day}>
            <Card
              title={<Text strong>{day}</Text>}
              loading={loading}
              extra={
                <Button
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => openModal(day)}
                  aria-label={`Adicionar período para ${day}`}
                />
              }
              className={styles.card}
            >
              {(workingPeriods[day]?.length ?? 0) > 0 ? (
                <List
                  size="small"
                  dataSource={workingPeriods[day]}
                  renderItem={(period) => (
                    <List.Item
                      key={period.id}
                      actions={[
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeletePeriod(period.id)}
                          aria-label="Deletar período"
                        />,
                      ]}
                    >
                      <Text>
                        {`${dayjs(period.startTime, "HH:mm:ss").format(
                          "HH:mm"
                        )} - ${dayjs(period.endTime, "HH:mm:ss").format(
                          "HH:mm"
                        )}`}
                      </Text>
                    </List.Item>
                  )}
                />
              ) : (
                <Text type="secondary">Nenhum período cadastrado</Text>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={`Adicionar horário para ${selectedDay}`}
        open={modalVisible}
        onOk={handleAddPeriod}
        onCancel={() => setModalVisible(false)}
        okText="Salvar"
        cancelText="Cancelar"
        destroyOnClose
      >
        <Row gutter={16} justify="center">
          <Col span={10} className={styles.timepickerCol}>
            <TimePicker
              placeholder="Início"
              format="HH:mm"
              value={startTime}
              onChange={setStartTime}
              minuteStep={15}
              allowClear
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={10} className={styles.timepickerCol}>
            <TimePicker
              placeholder="Fim"
              format="HH:mm"
              value={endTime}
              onChange={setEndTime}
              minuteStep={15}
              allowClear
              style={{ width: "100%" }}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default WorkingPeriodScheduler;
