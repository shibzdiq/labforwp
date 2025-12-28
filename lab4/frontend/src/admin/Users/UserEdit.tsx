// src/admin/Users/UserEdit.tsx

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUsersAdmin } from "@/features/users/hooks/useUsersAdmin";
import Card from "@/shared/ui/Card";
import Loader from "@/shared/ui/Loader";
import Button from "@/shared/ui/Button";
import { MetaTags } from "@/app/seo/MetaTags";
import { UserRoleSelect } from "@/features/users/ui/UserRoleSelect";
import type { UserRole } from "@/features/users/model/user.types";

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    selected,
    loading,
    error,
    fetchUser,
    changeRole,
  } = useUsersAdmin();

  useEffect(() => {
    if (id) fetchUser(id);
  }, [id, fetchUser]);

  const handleRoleChange = async (role: UserRole) => {
    if (!id) return;
    await changeRole(id, role);
  };

  return (
    <>
      <MetaTags title="Адмін — Користувач" />

      <div className="max-w-xl mx-auto">
        {loading && (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        )}

        {error && <div className="text-red-400">{error}</div>}

        {selected && (
          <Card className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gold-300">
              Користувач
            </h1>

            {/* Інфо */}
            <div className="flex items-center gap-4">
              <img
                src={selected.avatarUrl || "/avatar-placeholder.png"}
                className="w-16 h-16 rounded-full object-cover border border-neutral-700"
              />
              <div>
                <p className="text-white font-semibold">{selected.name}</p>
                <p className="text-sm text-neutral-400">{selected.email}</p>
              </div>
            </div>

            {/* Роль */}
            <div>
              <label className="text-xs text-neutral-400 block mb-1">
                Роль
              </label>
              <UserRoleSelect
                value={selected.role}
                onChange={handleRoleChange}
              />
            </div>

            <Button
              variant="secondary"
              onClick={() => navigate("/admin/users")}
            >
              ← Назад
            </Button>
          </Card>
        )}
      </div>
    </>
  );
};

export default UserEdit;
