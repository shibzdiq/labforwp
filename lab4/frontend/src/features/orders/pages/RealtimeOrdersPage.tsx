// src/features/orders/pages/RealtimeOrdersPage.tsx

import React, { useEffect } from "react";
import { useOrders } from "../hooks/useOrders";
import { useOrderRealtime } from "../hooks/useOrderRealtime";
import { OrderTable } from "../ui/OrderTable";

export const RealtimeOrdersPage: React.FC = () => {
  const { orders, fetchOrders, updateOrderStatus } = useOrders();
  const { updateStatusRealtime } = useOrderRealtime();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // realtime update через socket
    updateStatusRealtime({ orderId, status: newStatus });

    // резервний REST (щоб точно все збереглося)
    await updateOrderStatus(orderId, { status: newStatus as any });
  };

  return (
    <div className="p-6 text-white space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Замовлення (Real-time)
        </h1>
        <p className="text-xs text-neutral-400">
          Нові замовлення та зміни статусів зʼявляються миттєво через WebSocket.
        </p>
      </div>

      <OrderTable
        orders={orders}
        onChangeStatus={handleStatusChange}
      />
    </div>
  );
};
