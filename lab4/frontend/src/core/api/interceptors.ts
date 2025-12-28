import type { AxiosInstance, AxiosError } from "axios";
import { tokenStore } from "../auth/tokenStore";

export function applyInterceptors(api: AxiosInstance) {
  api.interceptors.request.use((config) => {
    const token = tokenStore.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        tokenStore.clear();
      }
      return Promise.reject(error);
    }
  );
}
