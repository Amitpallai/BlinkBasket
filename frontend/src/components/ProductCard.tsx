"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";

type Product = {
  _id: string;
  name: string;
  price: number;
  offerPrice: number;
  category?: string;
  image?: string[];
  rating?: number;
  reviewCount?: number;
  isOrganic?: boolean;
};

type ProductCardProps = {
  product: Product;
};

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill={filled ? "#e8a020" : "#e8dece"}
    />
  </svg>
);

const CartIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width="13"
    height="13"
    fill={filled ? "#e05555" : "none"}
    stroke={filled ? "#e05555" : "#d4907a"}
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { currency, addToCart, removeCart, navigate, cartItems } =
    useAppContext();

  const [wishlisted, setWishlisted] = React.useState(false);

  const handleAddToCart = (productId: string): void => {
    addToCart(productId);
  };

  if (!product) return null;

  const discount = Math.round(
    ((product.price - product.offerPrice) / product.price) * 100,
  );
  const rating = product.rating ?? 4;
  const reviewCount = product.reviewCount ?? 0;

  return (
    <div
      onClick={() => {
        navigate(`/products/${product.category?.toLowerCase()}/${product._id}`);
        window.scrollTo(0, 0);
      }}
      className="group relative  rounded-[20px] border border-[#ede8df] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(90,60,20,0.10)]"
    >
      {/* Image */}
      <div className="relative flex items-center justify-center h-40 overflow-hidden">
        <img
          src={product.image?.[0] || "/placeholder.jpg"}
          alt={product.name}
          className="h-[120px] object-contain transition-transform duration-500 group-hover:scale-105"
        />

        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-green-700 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full tracking-[0.3px]">
            −{discount}%
          </span>
        )}

        {product.isOrganic && (
          <span className="absolute bottom-2 left-2.5 bg-[#eaf7e0] border border-[#b0d890] text-[#3b6d11] text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-[0.5px]">
            Organic
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setWishlisted((w) => !w);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-[#ede8df] flex items-center justify-center z-10 transition-colors duration-200 hover:bg-[#fff0f0] hover:border-[#f0a0a0]"
        >
          <HeartIcon filled={wishlisted} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-2 bg-[#fffdf9]">
        <p className="text-[10px] text-[#a0966e] tracking-[1.5px] uppercase font-medium">
          {product.category}
        </p>

        <h3 className="text-[13.5px] font-medium text-[#2a2016] leading-snug line-clamp-2 min-h-[38px]">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-semibold text-[#1a2e1a]">
            {currency}
            {product.offerPrice.toLocaleString()}
          </span>
          {discount > 0 && (
            <span className="text-xs text-[#b8aa90] line-through">
              {currency}
              {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {reviewCount > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex gap-px">
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} filled={i < Math.round(rating)} />
              ))}
            </div>
            <span className="text-[10px] text-[#b8aa90] ml-0.5">
              ({reviewCount})
            </span>
          </div>
        )}

<div onClick={(e) => e.stopPropagation()} className="pt-1">
  {!cartItems?.[product._id] ? (
    <button
      onClick={() => handleAddToCart(product._id)}
      className="w-full h-9 flex items-center justify-center gap-1.5 bg-green-700 text-white text-[13px] font-medium rounded-[10px] transition-all duration-200 hover:bg-green-800 active:scale-[0.97]"
    >
      <CartIcon />
      Add to cart
    </button>
  ) : (
    <div className="flex items-center border border-emerald-600 rounded-[10px] overflow-hidden h-9">
      <button
        onClick={() => removeCart(product._id)}
        className="w-9 h-9 flex items-center justify-center text-lg bg-[#f5f0e8] text-emerald-800 hover:bg-[#ede8da] transition-colors flex-shrink-0"
      >
        −
      </button>
      <span className="flex-1 text-center text-[13px] font-semibold text-emerald-900 bg-[#fffdf9]">
        {cartItems[product._id]}
      </span>
      <button
        onClick={() => handleAddToCart(product._id)}
        className="w-9 h-9 flex items-center justify-center text-lg bg-green-700 text-white hover:bg-green-800 transition-colors flex-shrink-0"
      >
        +
      </button>
    </div>
  )}
</div>
      </div>
    </div>
  );
};

export default ProductCard;
