import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";
import {
  createPetService,
  updatePetService,
} from "../../../../../api/PetService/PetService";
import { PetServiceResponse } from "../../../../../api/PetService/types/PetServiceResponse";
import { CreatePetServiceRequest } from "../../../../../api/PetService/types/CreatePetServiceRequest";
import { notifySuccess } from "../../../../../utils/notifications";

interface PetServiceFormProps {
  visible: boolean;
  onClose: () => void;
  service: PetServiceResponse | null;
  onRefresh: () => void;
  readOnly?: boolean;
}

const PetServiceForm: React.FC<PetServiceFormProps> = ({
  visible,
  onClose,
  service,
  onRefresh,
  readOnly = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (service) {
        form.setFieldsValue(service);
      } else {
        form.resetFields();
      }
    }
  }, [visible, service, form]);

  const handleFinish = async (values: CreatePetServiceRequest) => {
    if (readOnly) return;
    if (service) {
      await updatePetService(service.id, values);
      notifySuccess("Serviço atualizado com sucesso!");
    } else {
      await createPetService(values);
      notifySuccess("Serviço criado com sucesso!");
    }
    form.resetFields();
    onClose();
    onRefresh();
  };

  const getModalTitle = (readOnly: boolean, service?: any) => {
    if (readOnly) return "Visualizar Serviço";
    if (service) return "Editar Serviço";
    return "Novo Serviço";
  };

  return (
    <Modal
      title={getModalTitle(readOnly, service)}
      open={visible}
      onCancel={onClose}
      onOk={() => !readOnly && form.submit()}
      footer={readOnly ? null : undefined}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Nome"
          rules={[
            { required: true, message: "O nome é obrigatório." },
            { max: 20, message: "Máximo de 20 caracteres." },
          ]}
        >
          <Input disabled={readOnly} maxLength={20} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Preço"
          rules={[
            { required: true, message: "O preço é obrigatório." },
            {
              type: "number",
              max: 9999999999.99,
              message: "Valor máximo excedido.",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            prefix="R$"
            disabled={readOnly}
            min={0}
            max={9999999999.99}
            step={0.01}
            precision={2}
          />
        </Form.Item>

        <Form.Item
          name="time"
          label="Duração (minutos)"
          rules={[
            { required: true, message: "A duração é obrigatória." },
            {
              type: "number",
              max: 2147483647,
              message: "Valor máximo excedido.",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            disabled={readOnly}
            min={1}
            max={2147483647}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descrição"
          rules={[
            { required: true, message: "A descrição é obrigatória." },
            { max: 255, message: "Máximo de 255 caracteres." },
          ]}
        >
          <Input.TextArea rows={3} maxLength={255} disabled={readOnly} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PetServiceForm;
