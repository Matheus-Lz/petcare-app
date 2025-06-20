import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Select,
  Popconfirm,
  message,
  Tag,
  DatePicker,
  Space,
  Typography,
  Divider,
  Tooltip,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  UserAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/lib/table";
import dayjs, { Dayjs } from "dayjs";
import {
  SchedulingStatus,
  SchedulingStatusDescription,
  SchedulingStatusColorMap,
} from "../../../../api/Scheduling/types/SchedulingStatus";
import {
  delegateSchedulingToMe,
  deleteScheduling,
  getSchedulingsByDate,
  updateSchedulingStatus,
} from "../../../../api/Scheduling/Scheduling";
import { SchedulingDetailResponse } from "../../../../api/Scheduling/types/SchedulingDetailResponse";

const { Option } = Select;
const { Title, Text } = Typography;

export const SchedulingByDateTable: React.FC = () => {
  const [schedulings, setSchedulings] = useState<SchedulingDetailResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedScheduling, setSelectedScheduling] = useState<SchedulingDetailResponse | null>(null);
  const [newStatus, setNewStatus] = useState<SchedulingStatus | null>(null);

  const loadSchedulings = async (date: Dayjs) => {
    setLoading(true);
    try {
      const isoDate = date.format("YYYY-MM-DD");
      const data = await getSchedulingsByDate(isoDate);
      setSchedulings(data);
    } catch {
      message.error("Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedDate.isValid()) {
      loadSchedulings(selectedDate);
    }
  }, [selectedDate]);

  const handleDelegate = async (id: string) => {
    if (!selectedDate) return;
    try {
      await delegateSchedulingToMe(id);
      message.success("Delegado para você com sucesso");
      loadSchedulings(selectedDate);
    } catch {
      message.error("Falha ao delegar");
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedDate || !selectedScheduling || !newStatus) return;
    try {
      await updateSchedulingStatus(selectedScheduling.id, newStatus);
      message.success("Status atualizado");
      setEditModalVisible(false);
      loadSchedulings(selectedDate);
    } catch {
      message.error("Erro ao atualizar status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!selectedDate) return;
    try {
      await deleteScheduling(id);
      message.success("Agendamento excluído");
      loadSchedulings(selectedDate);
    } catch {
      message.error("Erro ao excluir agendamento");
    }
  };

  const columns: ColumnsType<SchedulingDetailResponse> = [
    {
      title: "Horário",
      dataIndex: "schedulingHour",
      key: "schedulingHour",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) =>
        new Date(a.schedulingHour).getTime() - new Date(b.schedulingHour).getTime(),
    },
    {
      title: "Serviço",
      dataIndex: ["petService", "name"],
      key: "petService",
    },
    {
      title: "Responsável",
      dataIndex: ["employee", "user", "name"],
      key: "employee",
      render: (text) =>
        text ? <Tag color="blue">{text}</Tag> : <Tag color="red">Sem responsável</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: SchedulingStatus) => (
        <Tag color={SchedulingStatusColorMap[status]}>
          {SchedulingStatusDescription[status]}
        </Tag>
      ),
      filters: Object.entries(SchedulingStatusDescription).map(([key, desc]) => ({
        text: desc,
        value: key,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Visualizar">
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedScheduling(record);
                setViewModalVisible(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Editar Status">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedScheduling(record);
                setNewStatus(record.status);
                setEditModalVisible(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Delegar para mim">
            <Button
              icon={<UserAddOutlined />}
              onClick={() => handleDelegate(record.id)}
            />
          </Tooltip>

          <Popconfirm
            title="Deseja excluir?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Tooltip title="Excluir">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title level={4}>Agendamentos por Data</Title>
      <DatePicker
        defaultValue={dayjs()}
        onChange={(date) => {
          if (date && date.isValid()) {
            setSelectedDate(date);
          }
        }}
        style={{ marginBottom: 16 }}
        allowClear={false}
        format="DD/MM/YYYY"
      />

      <Table
        rowKey="id"
        dataSource={schedulings}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Detalhes do Agendamento"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedScheduling && (
          <div>
            <Divider />
            <p>
              <Text strong>Horário:</Text>{" "}
              {dayjs(selectedScheduling.schedulingHour).format("DD/MM/YYYY HH:mm")}
            </p>
            <p>
              <Text strong>Serviço:</Text> {selectedScheduling.petService.name}
            </p>
            <p>
              <Text strong>Descrição:</Text>{" "}
              {selectedScheduling.petService.description}
            </p>
            <p>
              <Text strong>Responsável:</Text>{" "}
              {selectedScheduling.employee?.user?.name ?? "Sem responsável"}
            </p>
            <p>
              <Text strong>Status:</Text>{" "}
              {SchedulingStatusDescription[selectedScheduling.status]}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="Editar Status do Agendamento"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleUpdateStatus}
        okButtonProps={{ disabled: !newStatus }}
      >
        <Select
          style={{ width: "100%" }}
          value={newStatus ?? undefined}
          onChange={(value) => setNewStatus(value)}
        >
          {Object.entries(SchedulingStatusDescription).map(([key, desc]) => (
            <Option key={key} value={key}>
              {desc}
            </Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};
