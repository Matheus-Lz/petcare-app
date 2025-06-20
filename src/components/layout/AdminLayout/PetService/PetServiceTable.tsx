import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, Empty, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  deletePetService,
  getAllPetServices,
} from "../../../../api/PetService/PetService";
import PetServiceForm from "./PetServiceForm";
import { PetServiceResponse } from "../../../../api/PetService/types/PetServiceResponse";

const PetServiceTable: React.FC = () => {
  const [services, setServices] = useState<PetServiceResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedService, setSelectedService] =
    useState<PetServiceResponse | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const loadData = async (page: number = currentPage) => {
    setLoading(true);
    try {
      const data = await getAllPetServices(page - 1, pageSize);
      setServices(data.content);
      setTotal(data.totalElements);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    await deletePetService(id);
    loadData();
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => {
          setSelectedService(null);
          setIsReadOnly(false);
          setShowModal(true);
        }}
      >
        Adicionar Serviço
      </Button>

      <Table
        rowKey="id"
        locale={{
          emptyText: <Empty description="Nenhum serviço cadastrado" />,
        }}
        dataSource={services}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: (page) => setCurrentPage(page),
        }}
        columns={[
          {
            title: "Nome",
            dataIndex: "name",
          },
          {
            title: "Preço",
            dataIndex: "price",
            render: (text: number) => `R$ ${text.toFixed(2)}`,
          },
          {
            title: "Duração",
            dataIndex: "time",
            render: (text: number) => `${text} min`,
          },
          {
            title: "Descrição",
            dataIndex: "description",
          },
          {
            title: "Ações",
            render: (_: any, record: PetServiceResponse) => (
              <Space>
                <Tooltip title="Visualizar">
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => {
                      setSelectedService(record);
                      setIsReadOnly(true);
                      setShowModal(true);
                    }}
                  />
                </Tooltip>

                <Tooltip title="Editar">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      setSelectedService(record);
                      setIsReadOnly(false);
                      setShowModal(true);
                    }}
                  />
                </Tooltip>

                <Tooltip title="Excluir">
                  <Popconfirm
                    title="Deseja excluir?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Sim"
                    cancelText="Não"
                  >
                    <Button icon={<DeleteOutlined />} danger />
                  </Popconfirm>
                </Tooltip>
              </Space>
            ),
          },
        ]}
      />

      <PetServiceForm
        visible={showModal}
        onClose={() => setShowModal(false)}
        service={selectedService}
        onRefresh={() => loadData(1)}
        readOnly={isReadOnly}
      />
    </>
  );
};

export default PetServiceTable;
