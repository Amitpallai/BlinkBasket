import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

// Product type
interface Product {
  _id: string;
  name: string;
  inStock: boolean;
  price: number;
  offerPrice: number;
  [key: string]: any; // allows extra fields like image, etc.
}

const Allproduct: React.FC = () => {
  const { products, searchQuery, setSearchQuery } = useAppContext();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (searchQuery && searchQuery.length > 0) {
      setFilteredProducts(
        (products as Product[]).filter((product) =>
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    } else {
      setFilteredProducts(products as Product[]);
    }
  }, [products, searchQuery]);

  const availableProducts = filteredProducts.filter(
    (product) => product.inStock,
  );

  return (
    <div className="mx-auto mt-20 max-w-7xl px-3 py-6 sm:px-5 md:px-8 lg:px-16">
      <p className="text-xl md:text-2xl font-medium">All products</p>

      {availableProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6 gap-5">
          {availableProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <div className="text-5xl">🔍</div>

          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            No products found
          </h3>

          <p className="mt-2 text-gray-500">
            No results found for "{searchQuery}"
          </p>

          <button
            onClick={() => setSearchQuery("")}
            className="mt-5 rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default Allproduct;
