import React, { useEffect, useState } from "react";
import { DatePicker, Select, Button, Typography, message, Spin } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  createSchedulling,
  getAvailableTimes,
} from "../../../../../api/Schedulling/Schedulling";
import { PetServiceResponse } from "../../../../../api/PetService/types/PetServiceResponse";
import styles from "./CustomerScheduleForm.module.scss";

const { Title, Text } = Typography;
const { Option } = Select;

interface ScheduleFormProps {
  service: PetServiceResponse;
  onSuccess?: () => void;
}

const CustomerScheduleForm: React.FC<ScheduleFormProps> = ({
  service,
  onSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      setSelectedTime(null);
      return;
    }

    setLoadingTimes(true);
    getAvailableTimes(service.id, selectedDate.format("YYYY-MM-DD"))
      .then((times: string[]) => {
        const formattedTimes = times.map((time) => time.slice(0, 5));
        setAvailableTimes(formattedTimes);
        setSelectedTime(null);
      })
      .catch(() => {
        message.error("Erro ao carregar horários disponíveis");
        setAvailableTimes([]);
      })
      .finally(() => setLoadingTimes(false));
  }, [selectedDate, service.id]);

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      message.warning("Selecione data e horário");
      return;
    }

    setSubmitting(true);
    const schedullingHour =
      selectedDate.format("YYYY-MM-DD") + "T" + selectedTime + ":00";

    createSchedulling(service.id, schedullingHour)
      .then(() => {
        message.success("Agendamento realizado com sucesso!");
        if (onSuccess) onSuccess();
      })
      .catch(() => message.error("Erro ao realizar agendamento"))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className={styles.scheduleFormContainer}>
      <Title level={3} className={styles.scheduleFormTitle}>
        {service.name}
      </Title>
      <Text className={styles.scheduleFormText}>
        Preço: R$ {service.price.toFixed(2)}
      </Text>
      <Text className={styles.scheduleFormText}>
        Duração: {service.time} minutos
      </Text>

      <DatePicker
        style={{ width: "100%" }}
        disabledDate={(current) => current && current < dayjs().startOf("day")}
        onChange={(date) => setSelectedDate(date)}
        format="DD/MM/YYYY"
        placeholder="Selecione a data"
      />

      {loadingTimes ? (
        <Spin tip="Carregando horários disponíveis..." />
      ) : (
        <Select
          placeholder="Selecione um horário"
          style={{ width: "100%" }}
          value={selectedTime}
          onChange={(value) => setSelectedTime(value)}
          disabled={availableTimes.length === 0}
          notFoundContent={
            selectedDate
              ? "Nenhum horário disponível"
              : "Selecione uma data primeiro"
          }
        >
          {availableTimes.map((time) => (
            <Option key={time} value={time}>
              {time}
            </Option>
          ))}
        </Select>
      )}

      <Button
        type="primary"
        onClick={handleSubmit}
        block
        loading={submitting}
        disabled={!selectedDate || !selectedTime}
      >
        Confirmar Agendamento
      </Button>
    </div>
  );
};

export default CustomerScheduleForm;
