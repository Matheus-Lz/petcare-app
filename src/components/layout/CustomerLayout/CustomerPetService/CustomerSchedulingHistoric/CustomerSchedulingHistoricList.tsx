import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Pagination,
  Spin,
  Empty,
  Modal,
  Form,
  Select,
  DatePicker,
  Button,
  message,
  Tooltip,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styles from "./CustomerSchedulingHistoricList.module.scss";
import { SchedulingDetailResponse } from "../../../../../api/Scheduling/types/SchedulingDetailResponse";
import {
  getUserSchedulings,
  getAvailableTimes,
  updateScheduling,
  deleteScheduling,
} from "../../../../../api/Scheduling/Scheduling";
import { SchedulingStatusDescription } from "../../../../../api/Scheduling/types/SchedulingStatus";

const { Text } = Typography;
const { Option } = Select;
const PAGE_SIZE = 10;

const CustomerSchedulingHistoricList: React.FC = () => {
  const [schedulings, setSchedulings] = useState<SchedulingDetailResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedScheduling, setSelectedScheduling] =
    useState<SchedulingDetailResponse | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchSchedulings(page);
  }, [page]);

  const fetchSchedulings = async (pageNum: number) => {
    try {
      setLoading(true);
      const data = await getUserSchedulings(pageNum - 1, PAGE_SIZE);
      setSchedulings(data.content || []);
      setTotal(data.totalElements || 0);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = async (scheduling: SchedulingDetailResponse) => {
    setSelectedScheduling(scheduling);
    const date = dayjs(scheduling.schedulingHour);
    form.setFieldsValue({
      date,
      time: date.format("HH:mm:ss"),
    });

    const times = await getAvailableTimes(
      scheduling.petService.id,
      date.format("YYYY-MM-DD")
    );
    setAvailableTimes(times || []);
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const datetime = dayjs(values.date)
        .hour(dayjs(values.time, "HH:mm:ss").hour())
        .minute(dayjs(values.time, "HH:mm:ss").minute())
        .second(0)
        .format("YYYY-MM-DDTHH:mm:ss");

      await updateScheduling(
        selectedScheduling!.id,
        selectedScheduling!.petService.id,
        datetime
      );
      message.success("Agendamento atualizado!");
      setEditModalVisible(false);
      fetchSchedulings(page);
    } catch {
      message.error("Erro ao atualizar agendamento");
    }
  };

  const handleDeleteFromCard = async (id: string) => {
    try {
      await deleteScheduling(id);
      message.success("Agendamento excluído com sucesso");
      fetchSchedulings(page);
    } catch {
      message.error("Erro ao excluir agendamento");
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
                    <span className={styles.serviceName}>
                      {s.petService.name}
                    </span>
                    <span className={`${styles.status} ${styles[s.status]}`}>
                      {SchedulingStatusDescription[s.status]}
                    </span>
                  </div>
                }
                extra={
                  s.status === "WAITING_FOR_ARRIVAL" ? (
                    <div className={styles.actionButtons}>
                      <Tooltip title="Editar">
                        <Button
                          aria-label="edit"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => openEditModal(s)}
                        />
                      </Tooltip>

                      <Popconfirm
                        title="Deseja excluir este agendamento?"
                        onConfirm={() => handleDeleteFromCard(s.id)}
                        okText="Sim"
                        cancelText="Não"
                      >
                        <Tooltip title="Excluir">
                          <Button
                            aria-label="delete"
                            size="small"
                            icon={<DeleteOutlined />}
                            danger
                          />
                        </Tooltip>
                      </Popconfirm>
                    </div>
                  ) : null
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

      <Modal
        title="Editar Agendamento"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdate}>
            Salvar
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item>
            <Text>{selectedScheduling?.petService.name}</Text>
          </Form.Item>

          <Form.Item
            label="Data"
            name="date"
            rules={[{ required: true, message: "Selecione a data" }]}
          >
            <DatePicker
              onChange={async (date) => {
                const serviceId = selectedScheduling?.petService.id;
                if (serviceId && date) {
                  const times = await getAvailableTimes(
                    serviceId,
                    date.format("YYYY-MM-DD")
                  );
                  setAvailableTimes(times || []);
                }
              }}
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            label="Horário"
            name="time"
            rules={[{ required: true, message: "Selecione o horário" }]}
          >
            <Select aria-label="time">
              {(availableTimes || []).map((t) => (
                <Option key={t} value={t}>
                  {dayjs(t, "HH:mm:ss").format("HH:mm")}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CustomerSchedulingHistoricList;
