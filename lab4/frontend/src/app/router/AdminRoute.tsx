import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AdminRoute({ children }: Props) {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/auth/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
}
