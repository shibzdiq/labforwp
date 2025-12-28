import React from "react";
import { useNavigate } from "react-router-dom";
import { CategoriesApi } from "../../features/categories/api/categories.api";
import { CategoryForm } from "../../features/categories/ui/CategoryForm";
import  Card  from "../../shared/ui/Card";
import { MetaTags } from "../../app/seo/MetaTags";

const CategoryCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
   await CategoriesApi.create(values);
    navigate("/admin/categories");
  };

  return (
    <>
      <MetaTags title="Адмін — Додавання категорії" />
      <div className="max-w-xl mx-auto">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-gold-300 mb-4">
            Додати категорію
          </h1>
          <CategoryForm onSubmit={handleSubmit} />
        </Card>
      </div>
    </>
  );
};

export default CategoryCreate;
