import api from "../api";
import { WorkingPeriodRequest } from "./types/WorkingPeriodRequest";
import { WorkingPeriodResponse } from "./types/WorkingPeriodResponse";

export const getAllWorkingPeriods = async (): Promise<WorkingPeriodResponse[]> => {
  const response = await api.get("/working-periods");
  return response.data;
};

export const getWorkingPeriodById = async (id: string): Promise<WorkingPeriodResponse> => {
  const response = await api.get(`/working-periods/${id}`);
  return response.data;
};

export const createWorkingPeriod = async (
  data: WorkingPeriodRequest
): Promise<WorkingPeriodResponse> => {
  const response = await api.post("/working-periods", data);
  return response.data;
};

export const deleteWorkingPeriod = async (id: string): Promise<void> => {
  await api.delete(`/working-periods/${id}`);
};
