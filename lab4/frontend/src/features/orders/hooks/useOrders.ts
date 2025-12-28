import { create } from "zustand";
import { OrdersApi } from "../api/orders.api";
import type { Order, OrderStatus } from "../model/order.types";

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;

  fetchOrders: () => Promise<void>;

  // realtime
  addOrderDirect: (order: Order) => void;
  updateOrderDirect: (order: Order) => void;

  // ✅ REST update
  updateOrderStatus: (
    orderId: string,
    payload: { status: OrderStatus }
  ) => Promise<void>;
}

export const useOrders = create<OrdersState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const orders = await OrdersApi.getOrders();
      set({ orders, loading: false });
    } catch {
      set({
        error: "Помилка завантаження замовлень",
        loading: false,
      });
    }
  },

  addOrderDirect: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),

  updateOrderDirect: (order) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o._id === order._id ? order : o
      ),
    })),

  // ✅ ОНОВЛЕННЯ СТАТУСУ ЧЕРЕЗ REST
  updateOrderStatus: async (orderId, payload) => {
    try {
      const updated = await OrdersApi.updateStatus(orderId, payload);

      set((state) => ({
        orders: state.orders.map((o) =>
          o._id === orderId ? updated : o
        ),
      }));
    } catch {
      set({
        error: "Не вдалося оновити статус замовлення",
      });
    }
  },
}));
