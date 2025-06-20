import api from "../api";
import { SchedulingDetailResponse } from "./types/SchedulingDetailResponse";
import { SchedulingStatus } from "./types/SchedulingStatus";

export const createScheduling = async (petServiceId: string, schedulingHour: string): Promise<void> => {
  await api.post("/schedulings", {
    petServiceId,
    schedulingHour,
  });
};

export const updateScheduling = async (
  id: string,
  petServiceId: string,
  schedulingHour: string
): Promise<void> => {
  await api.put(`/schedulings/${id}`, {
    petServiceId,
    schedulingHour,
  });
};

export const getAvailableTimes = async (
  petServiceId: string,
  date: string
): Promise<string[]> => {
  const response = await api.get("/schedulings/available-times", {
    params: { petServiceId, date }
  });
  return response.data;
};

export const getAvailableDays = async (
  petServiceId: string,
  monthStart: string
): Promise<string[]> => {
  const response = await api.get("/schedulings/available-days", {
    params: { petServiceId, monthStart }
  });
  return response.data;
};

export const getUserSchedulings = async (page: number, size: number = 10) => {
  const response = await api.get(`/schedulings/user?page=${page}&size=${size}`);
  return response.data;
};

export const getSchedulingsByDate = async (date: string): Promise<SchedulingDetailResponse[]> => {
  const response = await api.get("/schedulings/by-date", {
    params: { date },
  });
  return response.data;
};

export const delegateSchedulingToMe = async (id: string): Promise<void> => {
  await api.patch(`/schedulings/${id}/delegate`);
};

export const updateSchedulingStatus = async (id: string, status: SchedulingStatus): Promise<void> => {
  await api.patch(`/schedulings/${id}/status`, { status });
};

export const deleteScheduling = async (id: string): Promise<void> => {
  await api.delete(`/schedulings/${id}`);
};
