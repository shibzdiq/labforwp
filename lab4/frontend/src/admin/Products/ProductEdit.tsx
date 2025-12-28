// src/admin/Products/ProductEdit.tsx

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "@/features/products/hooks/useProducts";
import { ProductForm } from "@/features/products/ui/ProductForm";
import Loader from "@/shared/ui/Loader";
import Card from "@/shared/ui/Card";
import { MetaTags } from "@/app/seo/MetaTags";
import type { UpdateProductDto } from "@/features/products/model/product.types";

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    selected,
    loading,
    error,
    fetchProduct,
    updateProduct,
  } = useProducts();

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id, fetchProduct]);

  const handleSubmit = async (values: UpdateProductDto) => {
    if (!id) return;
    const updated = await updateProduct(id, values);
    if (updated) navigate("/admin/products");
  };

  return (
    <>
      <MetaTags title="Адмін — Редагування товару" />

      <div className="max-w-3xl mx-auto">
        {loading && (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        )}

        {error && <div className="text-red-400">{error}</div>}

        {selected && (
          <Card className="p-6">
            <h1 className="text-2xl font-bold text-gold-300 mb-4">
              Редагувати товар: {selected.name}
            </h1>

            <ProductForm
              initial={selected}
              onSubmit={handleSubmit}
            />
          </Card>
        )}
      </div>
    </>
  );
};

export default ProductEdit;
