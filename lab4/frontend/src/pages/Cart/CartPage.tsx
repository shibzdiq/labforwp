// src/pages/Cart/CartPage.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import Button from "@/shared/ui/Button";
import { MetaTags } from "@/app/seo/MetaTags";

const CartPage: React.FC = () => {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const remove = useCartStore((s) => s.remove);
  const clearCart = useCartStore((s) => s.clear);

  const navigate = useNavigate();

  return (
    <>
      <MetaTags title="Кошик" />

      <h1 className="text-2xl font-bold text-gold-300 mb-6">
        Кошик
      </h1>

      {items.length === 0 && (
        <div className="space-y-4">
          <div className="text-gray-400">Кошик порожній.</div>
          <Link to="/shop">
            <Button>Перейти до каталогу</Button>
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <>
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item._id}
                className="flex items-center justify-between border border-white/5 rounded-2xl px-4 py-3"
              >
                <div>
                  <div className="font-semibold text-gold-100">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {item.quantity} × {item.price} ₴
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="font-semibold text-gold-300">
                    {item.price * item.quantity} ₴
                  </div>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => remove(item._id)}
                  >
                    Видалити
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-6">
            <div className="text-lg">
              Разом:{" "}
              <span className="font-bold text-gold-300">
                {total} ₴
              </span>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={clearCart}>
                Очистити
              </Button>
              <Button onClick={() => navigate("/checkout")}>
                Оформити замовлення
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CartPage;
