// src/pages/Checkout/CheckoutPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { OrdersApi } from "@/features/orders/api/orders.api";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import Button from "@/shared/ui/Button";
import { MetaTags } from "@/app/seo/MetaTags";

const CheckoutPage: React.FC = () => {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const total = useCartStore((s) => s.total);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return;

    setLoading(true);
    try {
      await OrdersApi.createOrder({
        items: items.map((i) => ({
          product: i._id,
          quantity: i.quantity,
        })),
        address,
        paymentMethod,
      });

      clearCart();
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <>
        <MetaTags title="Оформлення — Кошик порожній" />
        <div className="text-gray-400">
          Немає товарів для оформлення.
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags title="Оформлення замовлення" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 space-y-4 border border-white/10 rounded-3xl p-6 bg-black/40"
        >
          <h1 className="text-2xl font-bold text-gold-300">
            Оформлення замовлення
          </h1>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Адреса доставки
            </label>
            <Input
              placeholder="Місто, вулиця, будинок, відділення..."
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Спосіб оплати
            </label>
            <Select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as "card" | "cash")
              }
            >
              <option value="card">Банківська карта</option>
              <option value="cash">Оплата при отриманні</option>
            </Select>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Оформлення..." : "Підтвердити замовлення"}
          </Button>
        </form>

        {/* SUMMARY */}
        <div className="space-y-3 border border-white/10 rounded-3xl p-6 bg-black/40">
          <h2 className="text-xl font-semibold text-gold-200">
            Ваше замовлення
          </h2>

          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li
                key={item._id}
                className="flex justify-between border-b border-white/5 pb-1"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{item.price * item.quantity} ₴</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between border-t border-white/10 pt-3">
            <span>Разом:</span>
            <span className="font-bold text-gold-300">
              {total} ₴
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
