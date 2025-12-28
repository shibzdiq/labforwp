// src/admin/Users/UsersList.tsx

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useUsersAdmin } from "@/features/users/hooks/useUsersAdmin";
import Table from "@/shared/ui/Table";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/ui/Badge";
import Loader from "@/shared/ui/Loader";
import { MetaTags } from "@/app/seo/MetaTags";
import type { User } from "@/features/users/model/user.types";

const UsersList: React.FC = () => {
  const {
    users,
    loading,
    error,
    fetchUsers,
    deleteUser,
  } = useUsersAdmin();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити користувача?")) return;
    await deleteUser(id);
  };

  return (
    <>
      <MetaTags title="Адмін — Користувачі" />

      <h1 className="text-2xl font-bold text-gold-300 mb-6">
        Користувачі
      </h1>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      )}

      {error && <div className="text-red-400">{error}</div>}

      {!loading && users.length === 0 && (
        <div className="text-gray-400">
          Користувачів поки немає.
        </div>
      )}

      {users.length > 0 && (
        <Table
          head={["Імʼя", "Email", "Роль", "Статус", "Дії"]}
          rows={users.map((u: User) => [
            u.name,
            u.email,
            <Badge
              key={u._id}
              variant={u.role === "admin" ? "warning" : "default"}
            >
              {u.role}
            </Badge>,
            u.isActive ? "Активний" : "Деактивований",
            <div key={u._id} className="flex gap-2 justify-end">
              <Link to={`/admin/users/${u._id}`}>
                <Button size="sm" variant="outline">
                  Переглянути
                </Button>
              </Link>

              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(u._id)}
              >
                Видалити
              </Button>
            </div>,
          ])}
        />
      )}
    </>
  );
};

export default UsersList;
