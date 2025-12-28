// src/features/products/ui/ProductCard.tsx

import React from "react";
import type { Product } from "../model/product.types";
import  Button  from "@/shared/ui/Button";
import { useCart } from "@/features/cart/model/cart.store";

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const addToCart = useCart((s) => s.add);

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 hover:border-amber-500/50">
      <img
        src={product.images?.[0] || "/placeholder-product.png"}
        className="h-48 w-full object-cover rounded-lg mb-3"
      />

      <h3 className="text-white font-semibold text-lg truncate">
        {product.name}
      </h3>

      <p className="text-neutral-400 text-sm line-clamp-2">
        {product.description}
      </p>

      <p className="text-amber-400 text-xl font-bold mt-2">
        {product.price} ₴
      </p>

      <Button
        className="w-full mt-3"
        onClick={() => addToCart(product)}
      >
        Додати в кошик
      </Button>
    </div>
  );
};
