export type SchedulingStatus =
    | "WAITING_FOR_ARRIVAL"
    | "PENDING"
    | "IN_PROGRESS"
    | "WAITING_FOR_PICKUP"
    | "COMPLETED"
    | "NO_SHOW";

export const SchedulingStatusDescription: Record<SchedulingStatus, string> = {
    WAITING_FOR_ARRIVAL: "Aguardando chegada do pet",
    PENDING: "Pendente",
    IN_PROGRESS: "Em progresso",
    WAITING_FOR_PICKUP: "Aguardando retirada do pet",
    COMPLETED: "Finalizado",
    NO_SHOW: "Não compareceu",
};

export const SchedulingStatusColorMap: Record<SchedulingStatus, string> = {
  WAITING_FOR_ARRIVAL: "orange",
  PENDING: "cyan",
  IN_PROGRESS: "blue",
  WAITING_FOR_PICKUP: "purple",
  COMPLETED: "green",
  NO_SHOW: "red",
};