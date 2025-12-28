// frontend/src/app/providers/AuthProvider.tsx
import { useEffect, useState } from "react";
import { api } from "@/core/api/axios";
import { tokenStore } from "@/core/auth/tokenStore";
import { useAuthStore } from "@/store/auth.store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, logout } = useAuthStore();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const access = tokenStore.getAccessToken();
      if (!access) {
        setInitialLoading(false);
        return;
      }

      try {
        const res = await api.get("/api/auth/profile");
        setUser(res.data);
      } catch (e) {
        console.error("Failed to load profile", e);
        logout();
      } finally {
        setInitialLoading(false);
      }
    };

    void init();
  }, [setUser, logout]);

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-yellow-500">
        Завантаження...
      </div>
    );
  }

  return <>{children}</>;
}
