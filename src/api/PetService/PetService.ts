import api from "../api";
import { CreatePetServiceRequest } from "./types/CreatePetServiceRequest";
import { PetServiceResponse } from "./types/PetServiceResponse";
import { UpdatePetServiceRequest } from "./types/UpdatePetServiceRequest";

export const getAllPetServices = async (
  page: number,
  size: number
): Promise<{ content: PetServiceResponse[]; totalElements: number }> => {
  const response = await api.get("/pet-services", {
    params: { page, size }
  });
  return {
    content: response.data.content,
    totalElements: response.data.totalElements
  };
};

export const getPetServiceById = async (id: string): Promise<PetServiceResponse> => {
  const response = await api.get(`/pet-services/${id}`);
  return response.data;
};

export const createPetService = async (
  data: CreatePetServiceRequest
): Promise<PetServiceResponse> => {
  const response = await api.post("/pet-services", data);
  return response.data;
};

export const updatePetService = async (
  id: string,
  data: UpdatePetServiceRequest
): Promise<PetServiceResponse> => {
  const response = await api.put(`/pet-services/${id}`, data);
  return response.data;
};

export const deletePetService = async (id: string): Promise<void> => {
  await api.delete(`/pet-services/${id}`);
};
