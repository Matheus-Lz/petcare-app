import api from "../api";

export const createScheduling = async (petServiceId: string, schedulingHour: string): Promise<void> => {
    await api.post("/schedulings", {
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
