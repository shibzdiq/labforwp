import { useAuthStore } from "@/store/auth.store";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function UserMenu() {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  if (!user)
    return (
      <Link
        to="/auth/login"
        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-md font-semibold"
      >
        Увійти
      </Link>
    );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-md"
      >
        👤 {user.name}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-black border border-gray-700 w-48 rounded-md shadow-md">
          <Link
            to="/account"
            className="block px-4 py-2 hover:bg-yellow-500/20"
          >
            Профіль
          </Link>

          <Link
            to="/orders"
            className="block px-4 py-2 hover:bg-yellow-500/20"
          >
            Мої замовлення
          </Link>

          {user.role === "admin" && (
            <Link
              to="/admin"
              className="block px-4 py-2 text-yellow-500 font-bold hover:bg-yellow-500/10"
            >
              Адмін панель
            </Link>
          )}

          <button
            className="block px-4 py-2 text-red-500 hover:bg-red-500/20 w-full text-left"
            onClick={logout}
          >
            Вийти
          </button>
        </div>
      )}
    </div>
  );
}
