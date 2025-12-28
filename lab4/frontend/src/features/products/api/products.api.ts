// src/features/products/api/products.api.ts

import { api } from "@/core/api/axios";
import type { Product, CreateProductDto, UpdateProductDto } from "../model/product.types";

export const ProductsApi = {
  async getAll(params?: { page?: number; q?: string }): Promise<Product[]> {
    const { data } = await api.get("/api/products", { params });
    return data;
  },

  async getOne(id: string): Promise<Product> {
    const { data } = await api.get(`/api/products/${id}`);
    return data;
  },

  async create(dto: CreateProductDto): Promise<Product> {
    const { data } = await api.post("/api/products", dto);
    return data;
  },

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const { data } = await api.put(`/api/products/${id}`, dto);
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/api/products/${id}`);
    return data;
  },
};
