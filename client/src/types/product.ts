// src/types/product.ts - Single source of truth
export interface Product {
  _id: string;
  name: string;
  price: number;
  offerPrice?: number;
  image?: string[];
  category?: string;
  inStock: boolean | string;
}