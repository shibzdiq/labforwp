// src/admin/Products/ProductCreate.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/features/products/hooks/useProducts";
import { ProductForm } from "@/features/products/ui/ProductForm";
import { MetaTags } from "@/app/seo/MetaTags";
import Card from "@/shared/ui/Card";
import type { CreateProductDto } from "@/features/products/model/product.types";

const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createProduct } = useProducts();

  const handleSubmit = async (values: CreateProductDto) => {
    const created = await createProduct(values);
    if (created) navigate("/admin/products");
  };

  return (
    <>
      <MetaTags title="Адмін — Додавання товару" />
      <div className="max-w-3xl mx-auto">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-gold-300 mb-4">
            Додати новий товар
          </h1>
          <ProductForm onSubmit={handleSubmit} />
        </Card>
      </div>
    </>
  );
};

export default ProductCreate;
