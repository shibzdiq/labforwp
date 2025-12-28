// src/features/cart/ui/CartList.tsx

import React from "react";
import { CartItem } from "./CartItem";
import { useCart } from "../model/cart.store";

export const CartList: React.FC = () => {
  const items = useCart((s) => s.items);

  if (!items.length)
    return <p className="text-neutral-400">Кошик порожній</p>;

  return (
    <div className="space-y-4">
      {items.map((i) => (
        <CartItem key={i.product._id} item={i} />
      ))}
    </div>
  );
};
