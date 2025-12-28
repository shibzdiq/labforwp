// src/admin/Products/ProductsList.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "@/features/products/hooks/useProducts";
import Button from "@/shared/ui/Button";
import Table from "@/shared/ui/Table";
import Pagination from "@/shared/ui/Pagination";
import Loader from "@/shared/ui/Loader";
import Badge from "@/shared/ui/Badge";
import { MetaTags } from "@/app/seo/MetaTags";
import type { Product } from "@/features/products/model/product.types";

const ProductsList: React.FC = () => {
  const [page, setPage] = useState(1);

  const {
    items,
    loading,
    error,
    fetchProducts,
    deleteProduct,
  } = useProducts();

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити товар?")) return;
    await deleteProduct(id);
  };

  return (
    <>
      <MetaTags title="Адмін — Товари" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gold-300">Товари</h1>
        <Link to="/admin/products/create">
          <Button>+ Додати товар</Button>
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      )}

      {error && <div className="text-red-400">{error}</div>}

      {!loading && items.length === 0 && (
        <div className="text-gray-400">Товарів поки немає.</div>
      )}

      {items.length > 0 && (
        <>
          <Table
            head={["Назва", "Ціна", "Категорія", "Сток", "Дії"]}
            rows={items.map((p: Product) => [
              p.name,
              `${p.price} ₴`,
              p.category,
              <Badge
                key={p._id}
                variant={p.stock > 0 ? "success" : "danger"}
              >
                {p.stock > 0
                  ? `В наявності (${p.stock})`
                  : "Немає"}
              </Badge>,
              <div key={p._id} className="flex gap-2 justify-end">
                <Link to={`/admin/products/${p._id}/edit`}>
                  <Button size="sm" variant="outline">
                    Редагувати
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(p._id)}
                >
                  Видалити
                </Button>
              </div>,
            ])}
          />

          <div className="mt-4">
            <Pagination
              page={page}
              totalPages={page + 1 /* backend later */}
              onChange={setPage}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProductsList;
