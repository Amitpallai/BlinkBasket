import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

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
  const { products, searchQuery } = useAppContext();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (searchQuery && searchQuery.length > 0) {
      setFilteredProducts(
        (products as Product[]).filter((product) =>
          product.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products as Product[]);
    }
  }, [products, searchQuery]);

  return (
    <div className="mx-auto mt-20 max-w-7xl px-3 py-6 sm:px-5 md:px-8 lg:px-16">
      <p className="text-xl md:text-2xl font-medium">All products</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6 gap-5">
        {filteredProducts
          .filter((product) => product.inStock)
          .map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
};

export default Allproduct;