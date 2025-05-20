import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";
import { createPetService, updatePetService } from "../../../../api/PetService/PetService";
import { PetServiceResponse } from "../../../../api/PetService/types/PetServiceResponse";
import { CreatePetServiceRequest } from "../../../../api/PetService/types/CreatePetServiceRequest";

interface PetServiceFormProps {
  visible: boolean;
  onClose: () => void;
  service: PetServiceResponse | null;
  onRefresh: () => void;
}

const PetServiceForm: React.FC<PetServiceFormProps> = ({ visible, onClose, service, onRefresh }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (service) {
      form.setFieldsValue(service);
    } else {
      form.resetFields();
    }
  }, [service, form]);

  const handleFinish = async (values: CreatePetServiceRequest) => {
    if (service) {
      await updatePetService(service.id, values);
    } else {
      await createPetService(values);
    }
    onClose();
    onRefresh();
  };

  return (
    <Modal
      title={service ? "Editar Serviço" : "Novo Serviço"}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Preço" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} prefix="R$" />
        </Form.Item>
        <Form.Item name="time" label="Duração (minutos)" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="description" label="Descrição" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PetServiceForm;
