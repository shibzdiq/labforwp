// src/admin/Reviews/ReviewsAdmin.tsx

import React, { useEffect } from "react";
import { useReviews } from "../../features/reviews/hooks/useReviews";
import Table from "../../shared/ui/Table";
import Button from "../../shared/ui/Button";
import Loader from "../../shared/ui/Loader";
import { MetaTags } from "../../app/seo/MetaTags";
import type { Review } from "@/features/reviews/model/review.types";

const ReviewsAdmin: React.FC = () => {
  const {
    reviews,   
    loading,
    error,
    fetchReviews,
    deleteReview,
  } = useReviews();

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити відгук?")) return;
    await deleteReview(id);
  };

  return (
    <>
      <MetaTags title="Адмін — Відгуки" />
      <h1 className="text-2xl font-bold text-gold-300 mb-6">
        Відгуки
      </h1>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      )}

      {error && <div className="text-red-400">{error}</div>}

      {!loading && reviews.length === 0 && (
        <div className="text-gray-400">
          Відгуків поки немає.
        </div>
      )}

      {reviews.length > 0 && (
        <Table
          head={["Товар (ID)", "Користувач (ID)", "Оцінка", "Коментар", "Дії"]}
          rows={reviews.map((r: Review) => [
            r.product || "—", // ✅ string
            r.user || "—",    // ✅ string
            r.rating,
            r.comment || "—",
            <Button
              key={r._id}
              size="sm"
              variant="danger"
              onClick={() => handleDelete(r._id)}
            >
              Видалити
            </Button>,
          ])}
        />
      )}
    </>
  );
};

export default ReviewsAdmin;
