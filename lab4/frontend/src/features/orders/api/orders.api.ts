// src/features/orders/api/orders.api.ts

import { api } from "@/core/api/axios";
import type {
  Order,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
} from "../model/order.types";

export const OrdersApi = {
  async getOrders(): Promise<Order[]> {
    const { data } = await api.get("/api/orders");
    return data;
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const { data } = await api.post("/api/orders", payload);
    return data;
  },

  async updateStatus(id: string, payload: UpdateOrderStatusPayload): Promise<Order> {
    const { data } = await api.put(`/api/orders/${id}`, payload);
    return data;
  },
};
