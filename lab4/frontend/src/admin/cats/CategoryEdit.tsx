import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategories } from "../../features/categories/hooks/useCategories";
import { CategoryForm } from "../../features/categories/ui/CategoryForm";
import Loader from "../../shared/ui/Loader";
import Card from "../../shared/ui/Card";
import { MetaTags } from "../../app/seo/MetaTags";
import type { Category } from "@/features/categories/model/category.types";

const CategoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    selected,
    loading,
    error,
    fetchCategory,
    updateCategory,
  } = useCategories();

  useEffect(() => {
    if (id) fetchCategory(id);
  }, [id, fetchCategory]);

  const handleSubmit = async (values: Partial<Category>) => {
    if (!id) return;
    await updateCategory(id, values);
    navigate("/admin/categories");
  };

  return (
    <>
      <MetaTags title="Адмін — Редагування категорії" />

      <div className="max-w-xl mx-auto">
        {loading && (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        )}

        {error && <div className="text-red-400">{error}</div>}

        {selected && (
          <Card className="p-6">
            <h1 className="text-2xl font-bold text-gold-300 mb-4">
              Редагувати: {selected.name}
            </h1>
            <CategoryForm
              initialValues={selected}
              onSubmit={handleSubmit}
            />
          </Card>
        )}
      </div>
    </>
  );
};

export default CategoryEdit;
