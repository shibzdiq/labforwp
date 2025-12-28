// frontend/src/store/auth.store.ts
import { create } from "zustand";
import { api } from "@/core/api/axios";
import { tokenStore } from "@/core/auth/tokenStore";
import { useNotificationsStore } from "./notifications.store";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthState {
  user: User | null;

  setUser: (user: User | null) => void;

  login: (payload: { email: string; password: string; twoFactorCode?: string }) => Promise<boolean>;

  register: (payload: { name: string; email: string; password: string }) => Promise<boolean>;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  login: async (payload) => {
    try {
      const { data } = await api.post("/api/auth/login", payload);

      tokenStore.setTokens({accessToken: data.accessToken,refreshToken: data.refreshToken,
});

      set({ user: data.user });

      useNotificationsStore.getState().success("Успішний вхід");
      return true;
    } catch (e: any) {
      useNotificationsStore.getState().error(e?.response?.data?.message || "Помилка авторизації");
      return false;
    }
  },

  register: async (payload) => {
    try {
      await api.post("/api/auth/register", payload);

      useNotificationsStore.getState().success("Реєстрація успішна. Перевірте email.");
      return true;
    } catch (e: any) {
      useNotificationsStore.getState().error("Не вдалося створити акаунт");
      return false;
    }
  },

  logout: () => {
    tokenStore.clear();
    set({ user: null });
    useNotificationsStore.getState().info("Ви вийшли із системи");
  },
}));
