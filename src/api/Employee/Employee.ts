import api from "../api";
import { CreateEmployeeRequest } from "./type/CreateEmployeeRequest";
import { EmployeeResponse } from "./type/EmployeeResponse";

export const getAllEmployees = async (
  page: number,
  size: number
): Promise<{ content: EmployeeResponse[]; totalElements: number }> => {
  const response = await api.get("/employees", {
    params: { page, size },
  });
  return {
    content: response.data.content,
    totalElements: response.data.totalElements,
  };
};

export const createEmployee = async (
  data: CreateEmployeeRequest
): Promise<EmployeeResponse> => {
  const response = await api.post("/employees", data);
  return response.data;
};

export const updateEmployee = async (
  id: string,
  data: { serviceIds: string[] }
): Promise<EmployeeResponse> => {
  const response = await api.put(`/employees/${id}`, data);
  return response.data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await api.delete(`/employees/${id}`);
};
