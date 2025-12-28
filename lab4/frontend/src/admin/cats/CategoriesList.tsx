import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../../features/categories/hooks/useCategories";
import Button from "../../shared/ui/Button";
import Table from "../../shared/ui/Table";
import Loader from "../../shared/ui/Loader";
import { MetaTags } from "../../app/seo/MetaTags";
import type { Category } from "@/features/categories/model/category.types";

const CategoriesList: React.FC = () => {
  const {
    items,
    loading,
    error,
    fetchCategories,
    deleteCategory,
  } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити категорію?")) return;
    await deleteCategory(id);
  };

  return (
    <>
      <MetaTags title="Адмін — Категорії" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gold-300">Категорії</h1>
        <Link to="/admin/categories/create">
          <Button>+ Додати категорію</Button>
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      )}

      {error && <div className="text-red-400">{error}</div>}

      {!loading && items.length === 0 && (
        <div className="text-gray-400">Категорій поки немає.</div>
      )}

      {items.length > 0 && (
        <Table
          head={["Назва", "Опис", "Дії"]}
          rows={items.map((c: Category) => [
            c.name,
            c.description || "—",
            <div key={c._id} className="flex gap-2 justify-end">
              <Link to={`/admin/categories/${c._id}/edit`}>
                <Button size="sm" variant="outline">
                  Редагувати
                </Button>
              </Link>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(c._id)}
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

export default CategoriesList;
