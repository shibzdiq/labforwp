// src/features/products/ui/ProductForm.tsx

import React, { useState } from "react";
import Button from "@/shared/ui/Button";
import type { CreateProductDto, Product } from "../model/product.types";

interface Props {
  initial?: Product;
  onSubmit: (dto: CreateProductDto) => void;
}

export const ProductForm: React.FC<Props> = ({ initial, onSubmit }) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [stock, setStock] = useState(initial?.stock ?? 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name,
      price,
      description,
      category,
      stock,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-neutral-900/70 border border-neutral-800 p-6 rounded-xl"
    >
      <div>
        <label className="text-neutral-300 text-sm">Назва</label>
        <input
          className="w-full bg-neutral-950 p-2 rounded border border-neutral-800 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-neutral-300 text-sm">Ціна</label>
        <input
          type="number"
          className="w-full bg-neutral-950 p-2 rounded border border-neutral-800 text-white"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
      </div>

      <div>
        <label className="text-neutral-300 text-sm">Опис</label>
        <textarea
          className="w-full bg-neutral-950 p-2 rounded border border-neutral-800 text-white"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-neutral-300 text-sm">Категорія</label>
        <input
          className="w-full bg-neutral-950 p-2 rounded border border-neutral-800 text-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-neutral-300 text-sm">Наявність</label>
        <input
          type="number"
          className="w-full bg-neutral-950 p-2 rounded border border-neutral-800 text-white"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Зберегти
      </Button>
    </form>
  );
};
