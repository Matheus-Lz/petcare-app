import api from '../api';

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  cpfCnpj: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
};

export const registerUser = async (data: RegisterData): Promise<void> => {
  await api.post('/user/register', data);
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/user/login', data);
  return response.data;
};
