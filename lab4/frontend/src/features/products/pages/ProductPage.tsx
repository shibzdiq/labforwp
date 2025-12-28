// src/features/products/pages/ProductPage.tsx

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import  Button  from "@/shared/ui/Button";
import { useCart } from "@/features/cart/model/cart.store";

export const ProductPage: React.FC = () => {
  const { id } = useParams();
  const { selected, fetchProduct } = useProducts();
  const add = useCart((s) => s.add);

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  if (!selected) return <p className="text-neutral-400 p-6">Завантаження...</p>;

  return (
    <div className="p-6 text-white space-y-4">
      <img
        src={selected.images?.[0] || "/placeholder-product.png"}
        className="rounded-xl w-full max-h-[400px] object-cover"
      />

      <h1 className="text-3xl font-bold">{selected.name}</h1>

      <p className="text-neutral-400">{selected.description}</p>

      <p className="text-amber-400 text-3xl font-bold">
        {selected.price} ₴
      </p>

      <Button onClick={() => add(selected)} className="w-full">
        Додати в кошик
      </Button>
    </div>
  );
};
