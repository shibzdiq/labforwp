// src/features/products/pages/ProductEditPage.tsx

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductForm } from "../ui/ProductForm";

export const ProductEditPage: React.FC = () => {
  const { id } = useParams();
  const { selected, fetchProduct, updateProduct } = useProducts();

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  if (!selected)
    return <p className="text-neutral-400 p-6">Завантаження...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Редагувати товар</h1>

      <ProductForm
        initial={selected}
        onSubmit={(dto) => updateProduct(selected._id, dto)}
      />
    </div>
  );
};
