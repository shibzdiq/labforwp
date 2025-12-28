// src/features/cart/ui/CartItem.tsx

import React from "react";
import type { CartItem as Item } from "../model/cart.types";
import  Button  from "@/shared/ui/Button";
import { useCart } from "../model/cart.store";

export const CartItem: React.FC<{ item: Item }> = ({ item }) => {
  const increase = useCart((s) => s.increase);
  const decrease = useCart((s) => s.decrease);
  const remove = useCart((s) => s.remove);

  return (
    <div className="flex items-center justify-between p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl">
      <div className="flex items-center gap-4">
        <img
          src={item.product.images?.[0] || "/placeholder-product.png"}
          className="h-20 w-20 object-cover rounded-lg"
        />
        <div>
          <h3 className="text-white font-semibold">{item.product.name}</h3>
          <p className="text-amber-400 font-bold">{item.product.price} ₴</p>

          <div className="flex items-center gap-2 mt-2">
            <Button size="sm" onClick={() => decrease(item.product._id)}>-</Button>
            <span className="text-neutral-300">{item.quantity}</span>
            <Button size="sm" onClick={() => increase(item.product._id)}>+</Button>
          </div>
        </div>
      </div>

      <Button variant="danger" size="sm" onClick={() => remove(item.product._id)}>
        Видалити
      </Button>
    </div>
  );
};
