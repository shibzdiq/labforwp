// src/features/products/hooks/useProducts.ts

import { create } from "zustand";
import { ProductsApi } from "../api/products.api";
import type { Product, CreateProductDto, UpdateProductDto } from "../model/product.types";

interface ProductsState {
  items: Product[];
  selected: Product | null;
  loading: boolean;
  error: string | null;

  fetchProducts: (page?: number, q?: string) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  createProduct: (dto: CreateProductDto) => Promise<Product | null>;
  updateProduct: (id: string, dto: UpdateProductDto) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
}

export const useProducts = create<ProductsState>((set, get) => ({
  items: [],
  selected: null,
  loading: false,
  error: null,

  fetchProducts: async (page = 1, q = "") => {
    set({ loading: true, error: null });
    try {
      const items = await ProductsApi.getAll({ page, q });
      set({ items, loading: false });
    } catch (err: any) {
      set({ error: "Помилка при завантаженні товарів", loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const product = await ProductsApi.getOne(id);
      set({ selected: product, loading: false });
    } catch {
      set({ error: "Товар не знайдено", loading: false });
    }
  },

  createProduct: async (dto) => {
    try {
      const product = await ProductsApi.create(dto);
      set({ items: [product, ...get().items] });
      return product;
    } catch {
      return null;
    }
  },

  updateProduct: async (id, dto) => {
    try {
      const updated = await ProductsApi.update(id, dto);
      set({
        items: get().items.map((p) => (p._id === id ? updated : p)),
        selected: updated,
      });
      return updated;
    } catch {
      return null;
    }
  },

  deleteProduct: async (id) => {
    try {
      await ProductsApi.delete(id);
      set({ items: get().items.filter((p) => p._id !== id) });
      return true;
    } catch {
      return false;
    }
  },
}));
