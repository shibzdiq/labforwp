// src/features/orders/model/order.types.ts

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  product: string; // product ID
  name?: string;   // опціонально — якщо бекенд повертає
  price?: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user?: string;
  items: OrderItem[];
  address: string;
  paymentMethod: "card" | "cash" | string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderPayload {
  items: {
    product: string;
    quantity: number;
  }[];
  address: string;
  paymentMethod: "card" | "cash" | string;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}
