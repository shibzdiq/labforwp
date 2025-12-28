// src/pages/Product/ProductPage.tsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useReviews } from "@/features/reviews/hooks/useReviews";
import { ReviewForm } from "@/features/reviews/ui/ReviewForm";
import { ReviewList } from "@/features/reviews/ui/ReviewList";
import { useCartStore } from "@/store/cart.store";
import Button from "@/shared/ui/Button";
import Loader from "@/shared/ui/Loader";
import { MetaTags } from "@/app/seo/MetaTags";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    selected,
    loading,
    error,
    fetchProduct,
  } = useProducts();

  const {
    reviews,
    fetchReviews,
    loading: reviewsLoading,
  } = useReviews();

  const addToCart = useCartStore((s) => s.add);

  useEffect(() => {
    if (!id) return;
    fetchProduct(id);
    fetchReviews(id);
  }, [id, fetchProduct, fetchReviews]);

  const product = selected;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
  };

  return (
    <>
      <MetaTags title={product?.name || "Товар"} />

      {(loading || reviewsLoading) && (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      )}

      {error && (
        <div className="text-red-400">
          Помилка завантаження товару
        </div>
      )}

      {product && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
          {/* IMAGE */}
          <div className="aspect-square bg-zinc-900 rounded-3xl overflow-hidden border border-gold-500/30 flex items-center justify-center">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-500">
                Без зображення
              </span>
            )}
          </div>

          {/* INFO */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gold-200">
              {product.name}
            </h1>

            <div className="text-2xl font-semibold text-gold-300">
              {product.price} ₴
            </div>

            <div className="text-gray-300">
              {product.description}
            </div>

            <div className="text-sm text-gray-400">
              Категорія: {product.category || "—"}
            </div>

            <Button
              size="lg"
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
            >
              {product.stock > 0
                ? "Додати в кошик"
                : "Немає в наявності"}
            </Button>
          </div>

          {/* REVIEWS */}
          <div className="md:col-span-2 mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-gold-200">
              Відгуки
            </h2>

            <ReviewList reviews={reviews} />

            <ReviewForm productId={product._id} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
