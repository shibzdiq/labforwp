// src/pages/Shop/ShopPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { ProductCard } from "@/features/products/ui/ProductCard";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import Pagination from "@/shared/ui/Pagination";
import { MetaTags } from "@/app/seo/MetaTags";
import type { Product } from "@/features/products/model/product.types";
import type { Category } from "@/features/categories/model/category.types";

const PAGE_SIZE = 12;

const ShopPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  const {
    items: products,
    loading,
    fetchProducts,
  } = useProducts();

  const {
    items: categories,
    fetchCategories,
  } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 🔍 фільтрація
  const filtered = useMemo(() => {
    return products.filter((p: Product) => {
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description?.toLowerCase().includes(q.toLowerCase());

      const matchCategory =
        !category || p.category === category;

      return matchQ && matchCategory;
    });
  }, [products, q, category]);

  // 📄 пагінація
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const pagedProducts = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <>
      <MetaTags title="Каталог товарів" />

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* FILTERS */}
        <div className="w-full md:w-64 space-y-4">
          <h2 className="text-xl font-semibold text-gold-200">
            Фільтри
          </h2>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Пошук
            </label>
            <Input
              placeholder="Назва, опис..."
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Категорія
            </label>
            <Select
              value={category}
              onChange={(e) => {
                setPage(1);
                setCategory(e.target.value);
              }}
            >
              <option value="">Всі категорії</option>
              {categories.map((c: Category) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold text-gold-300">
            Каталог
          </h1>

          {loading && (
            <div className="text-gray-400">Завантаження...</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {pagedProducts.map((product: Product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

            {!loading && pagedProducts.length === 0 && (
              <div className="text-gray-400 col-span-full">
                Нічого не знайдено.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ShopPage;
