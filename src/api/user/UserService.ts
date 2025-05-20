import api from '../api';
import { AuthResponse } from './type/AuthResponse';
import { LoginRequest } from './type/LoginRequest';
import { RegisterRequest } from './type/RegisterRequest';

export const registerUser = async (data: RegisterRequest): Promise<void> => {
  await api.post('/user/register', data);
};

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/user/login', data);
  return response.data;
};
