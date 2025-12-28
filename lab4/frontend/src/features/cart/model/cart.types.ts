// src/features/cart/model/cart.types.ts

import type { Product } from "@/features/products/model/product.types";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (id: string) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  clear: () => void;
}
