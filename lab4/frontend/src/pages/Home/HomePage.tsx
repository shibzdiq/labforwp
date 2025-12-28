// src/pages/Home/HomePage.tsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "@/features/products/hooks/useProducts";
import Button from "@/shared/ui/Button";
import { ProductCard } from "@/features/products/ui/ProductCard";
import { MetaTags } from "@/app/seo/MetaTags";
import type { Product } from "@/features/products/model/product.types";

const HomePage: React.FC = () => {
  const {
    items,
    loading,
    fetchProducts,
  } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const products = items.slice(0, 8); // 👈 ліміт ТУТ

  return (
    <>
      <MetaTags title="Головна" />

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-zinc-900 to-black border border-gold-500/40 p-8 mb-10">
        <div className="max-w-xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gold-300">
            Luxury BeautyShop
          </h1>
          <p className="text-gray-300 text-lg">
            Преміальна косметика в одному місці. Стиль Black & Gold, ексклюзивні
            бренди, швидка доставка по всій Україні.
          </p>
          <div className="flex gap-3">
            <Link to="/shop">
              <Button size="lg">Перейти в каталог</Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline" size="lg">
                Переглянути кошик
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-gold-500/20 blur-3xl rounded-full pointer-events-none" />
      </section>

      {/* PRODUCTS */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gold-200">
          Популярні товари
        </h2>

        {loading && (
          <div className="text-gray-400">Завантаження...</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product: Product) => (
            <ProductCard key={product._id} product={product} />
          ))}

          {!loading && products.length === 0 && (
            <div className="text-gray-400 col-span-full">
              Наразі немає доступних товарів.
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
