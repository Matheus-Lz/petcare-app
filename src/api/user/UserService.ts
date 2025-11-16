import api from "../api";
import { AuthResponse } from "./type/AuthResponse";
import { LoginRequest } from "./type/LoginRequest";
import { RegisterRequest } from "./type/RegisterRequest";
import { UserResponse } from "./type/UserResponse";
import { UpdateUserRequest } from "./type/UpdateUserRequest";

export const registerUser = async (data: RegisterRequest): Promise<void> => {
  await api.post("/user/register", data);
};

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/user/login", data, {
    _skipInterceptor: true,
  } as any);
  return response.data;
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await api.get(`/user/current-user`);
  return response.data;
};

export const updateUser = async (
  id: string,
  data: Partial<UpdateUserRequest>
): Promise<void> => {
  await api.put(`/user/${id}`, data);
};

export const forgotPassword = (email: string) =>
  api.post("/user/forgot-password", { email });

export const resetPassword = (token: string, newPassword: string) =>
  api.post("/user/reset-password", { token, newPassword });
