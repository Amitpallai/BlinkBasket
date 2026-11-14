import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller: React.FC = () => {
  const { products } = useAppContext();

  // ✅ Runtime filter → type assertion (fastest fix)
  const bestSellers = products
    .filter((product: any) => {
      // Handle API string booleans
      const isInStock = product?.inStock === true || 
                       product?.inStock === 'true' || 
                       product?.inStock === 1 || 
                       product?.inStock === '1';
      
      return (
        product?._id && 
        isInStock &&
        typeof product?.price === 'number' &&
        Array.isArray(product?.image)
      );
    })
    .slice(0, 6) as any[];  // ✅ Tells TS: "trust me, these match ProductCard"

  return (
    <div className=" px-4 md:px-8">
      <h2 className="text-xl md:text-2xl font-medium text-gray-800 mb-6">
      Best Sellers
      </h2>

      {bestSellers.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-8">
          <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🥐</span>
          </div>
          <p className="text-gray-700 text-xl font-semibold mb-1">No Best Sellers Available</p>
          <p className="text-gray-500">Fresh stock arriving soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {bestSellers.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSeller;