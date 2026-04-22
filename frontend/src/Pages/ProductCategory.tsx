import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom"; // ✅ FIX
import ProductCard from "../components/ProductCard";
import type { Product } from "../context/AppContext";

const ProductCategory: React.FC = () => {
  const { products } = useAppContext();
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const { category } = useParams<{ category: string }>();

  useEffect(() => {
    const filtered = products.filter(
      (p) => p.category.toLowerCase() === category?.toLowerCase()
    );
    setCategoryProducts(filtered);
  }, [products, category]);

  return (
    <div className="mx-auto mt-20 max-w-7xl px-3 py-6 sm:px-5 md:px-8 lg:px-16">
      <h2 className="text-xl md:text-2xl font-medium">
        Products in {category}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-6 gap-5">
        {categoryProducts
          .filter((p) => p.inStock)
          .map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
      </div>
    </div>
  );
};

export default ProductCategory;