import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Spin } from "antd";
import InputMask from "react-input-mask";
import {
  createEmployee,
  updateEmployee,
} from "../../../../../api/Employee/Employee";
import { EmployeeResponse } from "../../../../../api/Employee/type/EmployeeResponse";
import { getAllPetServices } from "../../../../../api/PetService/PetService";
import { CreateEmployeeRequest } from "../../../../../api/Employee/type/CreateEmployeeRequest";

const { Option } = Select;

interface EmployeeFormProps {
  visible: boolean;
  onClose: () => void;
  employee: EmployeeResponse | null;
  onRefresh: () => void;
  readOnly?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  visible,
  onClose,
  employee,
  onRefresh,
  readOnly = false,
}) => {
  const [form] = Form.useForm();
  const [servicesOptions, setServicesOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [cpfCnpjValue, setCpfCnpjValue] = useState("");
  const [cpfCnpjMask, setCpfCnpjMask] = useState("999.999.999-99");

  useEffect(() => {
    const onlyDigits = cpfCnpjValue.replace(/\D/g, "");
    setCpfCnpjMask(
      onlyDigits.length > 11 ? "99.999.999/9999-99" : "999.999.999-99"
    );
  }, [cpfCnpjValue]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const data = await getAllPetServices(0, 100);
        setServicesOptions(
          data.content.map((s: any) => ({ id: s.id, name: s.name }))
        );
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        email: employee.user?.email,
        name: employee.user?.name,
        cpfCnpj: employee.user?.cpfCnpj,
        password: "",
        serviceIds: employee.petServiceList.map((s) => s.id),
      });
      setCpfCnpjValue(employee.user?.cpfCnpj || "");
    } else {
      form.resetFields();
      setCpfCnpjValue("");
    }
  }, [employee, form]);

  const handleFinish = async (values: any) => {
    if (employee) {
      await updateEmployee(employee.id, { serviceIds: values.serviceIds });
    } else {
      const payload: CreateEmployeeRequest = {
        user: {
          email: values.email,
          name: values.name,
          cpfCnpj: values.cpfCnpj.replace(/\D/g, ""),
          password: values.password,
        },
        serviceIds: values.serviceIds,
      };
      await createEmployee(payload);
    }

    onClose();
    onRefresh();
  };

  const getModalTitle = () => {
    if (readOnly) return "Visualizar Funcionário";
    if (employee) return "Editar Funcionário";
    return "Novo Funcionário";
  };

  return (
    <Modal
      title={getModalTitle()}
      open={visible}
      onCancel={onClose}
      onOk={() => !readOnly && form.submit()}
      footer={readOnly ? null : undefined}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {!employee && (
          <>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email é obrigatório" },
                { type: "email", message: "Email inválido" },
              ]}
            >
              <Input disabled={readOnly} />
            </Form.Item>
            <Form.Item
              label="Senha"
              name="password"
              rules={[
                { required: true, message: "Senha é obrigatória" },
                { min: 6, message: "Mínimo 6 caracteres" },
              ]}
            >
              <Input.Password disabled={readOnly} />
            </Form.Item>
            <Form.Item
              label="CPF/CNPJ"
              name="cpfCnpj"
              rules={[
                { required: true, message: "CPF/CNPJ é obrigatório" },
              ]}
            >
              <InputMask
                mask={cpfCnpjMask}
                value={cpfCnpjValue}
                onChange={(e) => {
                  setCpfCnpjValue(e.target.value);
                  form.setFieldsValue({ cpfCnpj: e.target.value });
                }}
                disabled={readOnly}
              >
                {(inputProps: any) => <Input {...inputProps} />}
              </InputMask>
            </Form.Item>
            <Form.Item
              label="Nome"
              name="name"
              rules={[{ required: true, message: "Nome é obrigatório" }]}
            >
              <Input disabled={readOnly} />
            </Form.Item>
          </>
        )}

        {employee && (
          <>
            <Form.Item label="Email">
              <Input value={employee.user?.email} disabled />
            </Form.Item>
            <Form.Item label="Nome">
              <Input value={employee.user?.name} disabled />
            </Form.Item>
            <Form.Item label="CPF/CNPJ">
              <Input value={employee.user?.cpfCnpj} disabled />
            </Form.Item>
          </>
        )}

        <Form.Item
          label="Serviços"
          name="serviceIds"
          rules={[
            { required: true, message: "Selecione pelo menos um serviço" },
          ]}
        >
          {loadingServices ? (
            <Spin />
          ) : (
            <Select
              mode="multiple"
              placeholder="Selecione serviços"
              disabled={readOnly}
            >
              {servicesOptions.map((service) => (
                <Option key={service.id} value={service.id}>
                  {service.name}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeForm;
