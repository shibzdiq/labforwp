import { useEffect } from "react";
import { useOrders } from "./useOrders";
import type { Order } from "../model/order.types";
import { socket } from "@/sockets/ws-events";

export function useOrderRealtime() {
  const addOrderDirect = useOrders((s) => s.addOrderDirect);
  const updateOrderDirect = useOrders((s) => s.updateOrderDirect);

  useEffect(() => {
    if (!socket) return;

    const onCreated = (order: Order) => {
      addOrderDirect(order);
    };

    const onUpdated = (order: Order) => {
      updateOrderDirect(order);
    };

    socket.on("order:created", onCreated);
    socket.on("order:updated", onUpdated);

    return () => {
      socket.off("order:created", onCreated);
      socket.off("order:updated", onUpdated);
    };
  }, [addOrderDirect, updateOrderDirect]);

  const createOrderRealtime = (payload: {
    items: { product: string; quantity: number; price: number }[];
    total: number;
  }) => {
    socket?.emit("order:create", payload);
  };

  const updateStatusRealtime = (payload: {
    orderId: string;
    status: string;
  }) => {
    socket?.emit("order:updateStatus", payload);
  };

  return {
    createOrderRealtime,
    updateStatusRealtime,
  };
}
