import api from "../api";

export const createSchedulling = async (petServiceId: string, schedullingHour: string): Promise<void> => {
    await api.post("/schedullings", {
        petServiceId,
        schedullingHour,
    });
};

export const getAvailableTimes = async (
    petServiceId: string,
    date: string
): Promise<string[]> => {
    const response = await api.get("/schedullings/available-times", {
        params: { petServiceId, date }
    });
    return response.data;
};

export const getAvailableDays = async (
  petServiceId: string,
  monthStart: string
): Promise<string[]> => {
  const response = await api.get("/schedullings/available-days", {
    params: { petServiceId, monthStart }
  });
  return response.data;
};
