import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Button,
  TimePicker,
  Modal,
  message,
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

const { Title, Text } = Typography;

const dayMap: Record<string, string> = {
  Domingo: "SUNDAY",
  Segunda: "MONDAY",
  Terça: "TUESDAY",
  Quarta: "WEDNESDAY",
  Quinta: "THURSDAY",
  Sexta: "FRIDAY",
  Sábado: "SATURDAY",
};

const reverseDayMap = Object.fromEntries(
  Object.entries(dayMap).map(([pt, en]) => [en, pt])
);

const diasSemana = Object.keys(dayMap);

const WorkingPeriodScheduler: React.FC = () => {
  const [workingPeriods, setWorkingPeriods] = useState<
    Record<string, WorkingPeriodResponse[]>
  >({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPeriods = useCallback(async () => {
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
      console.error("Erro ao buscar períodos:", error);
      message.error("Erro ao buscar períodos");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeriods().catch(() => {});
  }, [fetchPeriods]);

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
      await fetchPeriods().catch(() => {});
    } catch (error) {
      console.error("Erro ao criar período:", error);
      message.error("Erro ao criar período");
    }
  };

  const handleDeletePeriod = async (id: string) => {
    try {
      await deleteWorkingPeriod(id);
      message.success("Período deletado com sucesso");
      await fetchPeriods().catch(() => {});
    } catch (error) {
      console.error("Erro ao deletar período:", error);
      message.error("Erro ao deletar período");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: "2rem" }}>
        Períodos de Trabalho
      </Title>
      <Row gutter={[16, 16]} justify="center">
        {diasSemana.map((dia) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={6} key={dia}>
            <Card
              title={<strong>{dia}</strong>}
              extra={
                <Button
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined />}
                  onClick={() => openModal(dia)}
                />
              }
              style={{ minHeight: 200 }}
              loading={loading}
            >
              {workingPeriods[dia] && workingPeriods[dia].length > 0 ? (
                workingPeriods[dia].map((period) => (
                  <div
                    key={period.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Text>
                      {dayjs(period.startTime, "HH:mm").isValid() &&
                      dayjs(period.endTime, "HH:mm").isValid()
                        ? `${dayjs(period.startTime, "HH:mm").format(
                            "HH:mm"
                          )} - ${dayjs(period.endTime, "HH:mm").format(
                            "HH:mm"
                          )}`
                        : "Horário inválido"}
                    </Text>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeletePeriod(period.id)}
                      aria-label={`delete-${period.id}`}
                    />
                  </div>
                ))
              ) : (
                <Text type="secondary">Nenhum período cadastrado</Text>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={`Adicionar período - ${selectedDay}`}
        open={modalVisible}
        onOk={handleAddPeriod}
        onCancel={() => setModalVisible(false)}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div>
            <Text>Início: </Text>
            <TimePicker
              value={startTime}
              onChange={setStartTime}
              format="HH:mm"
              minuteStep={5}
            />
          </div>
          <div>
            <Text>Fim: </Text>
            <TimePicker
              value={endTime}
              onChange={setEndTime}
              format="HH:mm"
              minuteStep={5}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkingPeriodScheduler;
