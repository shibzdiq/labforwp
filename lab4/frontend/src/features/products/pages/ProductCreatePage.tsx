// src/features/products/pages/ProductCreatePage.tsx

import React from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductForm } from "../ui/ProductForm";
import { useNavigate } from "react-router-dom";

export const ProductCreatePage: React.FC = () => {
  const { createProduct } = useProducts();
  const nav = useNavigate();

  const submit = async (dto: any) => {
    const res = await createProduct(dto);
    if (res) nav(`/admin/products`);
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Новий товар</h1>

      <ProductForm onSubmit={submit} />
    </div>
  );
};
