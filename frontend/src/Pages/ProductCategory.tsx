import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import type { Product } from "../context/AppContext";

const ProductCategory: React.FC = () => {
  const { products } = useAppContext();
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { category } = useParams<{ category: string }>();

  useEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      const filtered = products.filter(
        (p) => p.category?.toLowerCase() === category?.toLowerCase()
      );
      setCategoryProducts(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [products, category]);

  const inStockProducts = categoryProducts.filter((p) => p.inStock);
  const skeletonCount = 10; // Number of skeleton cards to show

  return (
    <div className="mx-auto mt-20 max-w-7xl px-3 py-6 sm:px-5 md:px-8 lg:px-16">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h2 className="text-xl md:text-2xl font-medium capitalize">
          {category} ({!loading ? inStockProducts.length : '...'})
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {loading ? (
          // Show skeleton loaders while loading
          Array.from({ length: skeletonCount }).map((_, index) => (
            <ProductCard key={`skeleton-${index}`} product={null as any} loading={true} />
          ))
        ) : inStockProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              We couldn't find any products in the <span className="font-medium capitalize">{category}</span> category.
            </p>
          </div>
        ) : (
          inStockProducts.map((p) => (
            <ProductCard key={p._id} product={p} loading={false} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductCategory;