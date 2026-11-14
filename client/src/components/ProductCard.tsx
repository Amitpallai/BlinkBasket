"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";

type Product = {
  _id: string;
  name: string;
  price: number;
  offerPrice: number;
  category?: string;
  description?: string[] | string;
  image?: string[];
  rating?: number;
  reviewCount?: number;
  isOrganic?: boolean;
};

type ProductCardProps = {
  product: Product;
  loading?: boolean;
};

const ArrowIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 17L17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill={filled ? "#e05555" : "none"}
    stroke={filled ? "#e05555" : "#111"}
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const ProductCardSkeleton: React.FC = () => (
  <div className="rounded-[32px] bg-white p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] animate-pulse">
    <div className="h-52 rounded-[26px] bg-gray-100" />
    <div className="px-2.5 pt-4 pb-3 space-y-3">
      <div className="h-5 w-3/4 rounded bg-gray-200" />
      <div className="h-3 w-1/3 rounded bg-gray-200" />
      <div className="h-3 w-full rounded bg-gray-200" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 w-16 rounded bg-gray-200" />
        <div className="h-11 w-28 rounded-full bg-gray-200" />
      </div>
    </div>
  </div>
);

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  loading = false,
}) => {
  const { currency, addToCart, removeCart, navigate, cartItems } =
    useAppContext();

  const [wishlisted, setWishlisted] = React.useState(false);
  const [active, setActive] = React.useState(0);

  if (loading) return <ProductCardSkeleton />;
  if (!product) return null;

  const images =
    product.image && product.image.length > 0
      ? product.image.slice(0, 4)
      : ["/placeholder.jpg"];

  const discount = Math.round(
    ((product.price - product.offerPrice) / product.price) * 100,
  );

  const description = Array.isArray(product.description)
    ? product.description[0]
    : product.description;

  const openProduct = () => {
    navigate(`/products/${product.category?.toLowerCase()}/${product._id}`);
    window.scrollTo(0, 0);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product._id);
  };

  const qty = cartItems?.[product._id] || 0;

  return (
    <div
      onClick={openProduct}
      className="group w-full cursor-pointer rounded-xl bg-white p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_24px_70px_rgba(0,0,0,0.13)]"
    >
      {/* Image panel */}
      <div className="relative flex h-52 flex-col items-center justify-center rounded-xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.07)]">
        <img
          src={images[active]}
          alt={product.name}
          className="h-36 max-w-[80%] object-contain transition-transform duration-500 group-hover:scale-105 "
        />

        {discount > 0 && (
          <span className="absolute top-3.5 left-3.5 rounded-full bg-green-600 px-2.5 py-1 text-[10px] font-semibold text-white">
            −{discount}%
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setWishlisted((w) => !w);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-transform active:scale-90"
        >
          <HeartIcon filled={wishlisted} />
        </button>

        {images.length > 1 && (
          <div
            className="absolute bottom-3.5 flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === active ? "bg-black" : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="px-3 pt-5 pb-2.5">
        <h3 className="line-clamp-1  font-bold leading-tight tracking-tight text-[#111]">
          {product.name}
        </h3>

        {product.category && (
          <p className="mt-1 text-[12px] text-gray-500">{product.category}</p>
        )}

        {description && (
          <p className="mt-4 line-clamp-2 min-h-[40px] max-w-[92%] text-[13.5px] leading-snug text-gray-600">
            {description}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between">
          <div className="flex flex-col leading-tight">
            <span className="text-[17px] font-bold text-[#111]">
              {currency}
              {product.offerPrice.toLocaleString()}
            </span>
            {discount > 0 && (
              <span className="text-[11px] text-gray-400 line-through">
                {currency}
                {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {qty === 0 ? (
            <button
              onClick={handleBuyNow}
              className="flex h-12 items-center gap-3 rounded-full bg-green-600 pl-5 pr-1.5 text-[14px] font-semibold text-white transition-transform duration-200 hover:bg-green-700 active:scale-[0.97]"
            >
              Add  
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                <ArrowIcon />
              </span>
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex h-12 items-center gap-2 rounded-full bg-green-600 p-1.5 text-white"
            >
              <button
                onClick={() => removeCart(product._id)}
                aria-label="Decrease quantity"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl leading-none text-black transition-transform active:scale-90"
              >
                −
              </button>
              <span className="min-w-6 text-center text-[14px] font-semibold">
                {qty}
              </span>
              <button
                onClick={() => addToCart(product._id)}
                aria-label="Increase quantity"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl leading-none text-black transition-transform active:scale-90"
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