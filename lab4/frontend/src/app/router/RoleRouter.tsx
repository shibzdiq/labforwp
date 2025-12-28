import { useAuthStore } from "@/store/auth.store";
import { Navigate } from "react-router-dom";

export default function RoleRouter() {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/" replace />;

  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return <Navigate to="/account" replace />;
}
