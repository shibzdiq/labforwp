// src/features/cart/pages/CartPage.tsx

import React from "react";
import { CartList } from "../ui/CartList";
import { useCart } from "../model/cart.store";
import  Button  from "@/shared/ui/Button";

export const CartPage: React.FC = () => {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-3xl font-bold">Кошик</h1>

      <CartList />

      {items.length > 0 && (
        <div className="border-t border-neutral-800 pt-4 flex justify-between items-center">
          <p className="text-xl font-bold text-amber-400">
            Разом: {total} ₴
          </p>

          <div className="flex gap-3">
            <Button variant="danger" onClick={clear}>Очистити</Button>
            <Button>Оформити замовлення</Button>
          </div>
        </div>
      )}
    </div>
  );
};
