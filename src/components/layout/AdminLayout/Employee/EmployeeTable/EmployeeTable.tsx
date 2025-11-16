import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Space, Popconfirm, Tag, Empty, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  deleteEmployee,
  getAllEmployees,
} from "../../../../../api/Employee/Employee";
import EmployeeForm from "../EmployeeForm/EmployeeForm";
import {
  EmployeeResponse,
  PetServiceEmployeeResponse,
} from "../../../../../api/Employee/type/EmployeeResponse";
import { notifyError, notifySuccess } from "../../../../../utils/notifications";

const EmployeeTable: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeResponse | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const loadData = useCallback(
    async (page: number = currentPage) => {
      setLoading(true);
      try {
        const data = await getAllEmployees(page - 1, pageSize);
        setEmployees(data.content);
        setTotal(data.totalElements);
      } finally {
        setLoading(false);
      }
    },
    [currentPage]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: string) => {
    await deleteEmployee(id);
    notifySuccess("Funcionário excluído com sucesso!");
    loadData(1);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => {
          setSelectedEmployee(null);
          setIsReadOnly(false);
          setShowModal(true);
        }}
      >
        Adicionar Funcionário
      </Button>

      <Table
        rowKey="id"
        locale={{
          emptyText: <Empty description="Nenhum funcionário cadastrado" />,
        }}
        dataSource={employees}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (page) => setCurrentPage(page),
        }}
        columns={[
          {
            title: "Nome",
            dataIndex: ["user", "name"],
            render: (_: any, record: EmployeeResponse) =>
              record.user?.name || "-",
          },
          {
            title: "Email",
            dataIndex: ["user", "email"],
            render: (_: any, record: EmployeeResponse) =>
              record.user?.email || "-",
          },
          {
            title: "Serviços",
            dataIndex: "petServiceList",
            render: (petServiceList: PetServiceEmployeeResponse[]) =>
              petServiceList.map((petService) => (
                <Tag
                  key={petService.id}
                  color="blue"
                  style={{ marginBottom: 4 }}
                >
                  {petService.name}
                </Tag>
              )),
          },
          {
            title: "Ações",
            render: (_: any, record: EmployeeResponse) => (
              <Space>
                <Tooltip title="Visualizar">
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => {
                      setSelectedEmployee(record);
                      setIsReadOnly(true);
                      setShowModal(true);
                    }}
                  />
                </Tooltip>

                <Tooltip title="Editar">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      setSelectedEmployee(record);
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

      <EmployeeForm
        visible={showModal}
        onClose={() => setShowModal(false)}
        employee={selectedEmployee}
        onRefresh={() => loadData(1)}
        readOnly={isReadOnly}
      />
    </>
  );
};

export default EmployeeTable;
