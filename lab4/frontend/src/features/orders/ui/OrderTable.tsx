// src/features/orders/ui/OrderTable.tsx

import React from "react";
import type { Order } from "../model/order.types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import  Button   from "@/shared/ui/Button";

interface Props {
  orders: Order[];
  onChangeStatus?: (orderId: string, newStatus: string) => void;
}

export const OrderTable: React.FC<Props> = ({ orders, onChangeStatus }) => {
  return (
    <div className="overflow-x-auto border border-neutral-800 rounded-xl">
      <table className="min-w-full text-sm text-left bg-neutral-900/70">
        <thead className="bg-neutral-900 border-b border-neutral-800">
          <tr>
            <th className="px-4 py-3 text-neutral-400">ID</th>
            <th className="px-4 py-3 text-neutral-400">Користувач</th>
            <th className="px-4 py-3 text-neutral-400">Сума</th>
            <th className="px-4 py-3 text-neutral-400">Статус</th>
            <th className="px-4 py-3 text-neutral-400">Створено</th>
            <th className="px-4 py-3 text-neutral-400">Дії</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr
              key={o._id}
              className="border-b border-neutral-800 hover:bg-neutral-800/50"
            >
              <td className="px-4 py-3 text-neutral-200">
                #{o._id.slice(-6)}
              </td>
              <td className="px-4 py-3 text-neutral-300">
                {o.user || "—"}
              </td>
              <td className="px-4 py-3 text-neutral-100">{o.total} ₴</td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={o.status} />
              </td>
              <td className="px-4 py-3 text-neutral-400">
                {new Date(o.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                {onChangeStatus && (
                  <div className="flex gap-2 flex-wrap">
                    {["pending", "paid", "shipped", "delivered", "cancelled"].map(
                      (s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant={o.status === s ? "secondary" : "ghost"}
                          onClick={() => onChangeStatus(o._id, s)}
                        >
                          {s}
                        </Button>
                      )
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}

          {!orders.length && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-6 text-center text-neutral-400"
              >
                Немає замовлень.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
