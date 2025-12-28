// src/features/products/model/product.types.ts

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images?: string[];
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
