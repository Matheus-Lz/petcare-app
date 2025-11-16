import axios from 'axios';
import { notifyError } from '../utils/notifications';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/auth") {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/auth";
    } else {
      const errorMessage =
        error.response?.data?.message || "Ocorreu um erro inesperado.";

      notifyError(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;
