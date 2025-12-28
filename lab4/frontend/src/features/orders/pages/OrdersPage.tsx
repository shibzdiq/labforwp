// src/features/orders/pages/OrdersPage.tsx

import { useEffect } from "react";
import { useOrders } from "../hooks/useOrders";
import { OrderList } from "../ui/OrderList";

export default function OrdersPage() {
  const { orders, fetchOrders, loading, error } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Мої замовлення</h1>

      {loading && (
        <p className="text-neutral-400 text-sm mb-2">
          Завантаження...
        </p>
      )}

      {error && (
        <p className="text-red-400 text-sm mb-4">
          {error}
        </p>
      )}

      <OrderList orders={orders} />
    </div>
  );
}
