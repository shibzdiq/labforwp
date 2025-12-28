// src/features/cart/model/cart.store.ts

import { create } from "zustand";
import type { CartState } from "./cart.types";

export const useCart = create<CartState>((set, get) => ({
  items: [],

  add: (product) => {
    const exists = get().items.find((i) => i.product._id === product._id);

    if (exists) {
      set({
        items: get().items.map((i) =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      });
    } else {
      set({ items: [...get().items, { product, quantity: 1 }] });
    }
  },

  remove: (id) =>
    set({
      items: get().items.filter((i) => i.product._id !== id),
    }),

  increase: (id) =>
    set({
      items: get().items.map((i) =>
        i.product._id === id ? { ...i, quantity: i.quantity + 1 } : i
      ),
    }),

  decrease: (id) =>
    set({
      items: get().items
        .map((i) =>
          i.product._id === id
            ? { ...i, quantity: Math.max(1, i.quantity - 1) }
            : i
        )
    }),

  clear: () => set({ items: [] }),
}));
