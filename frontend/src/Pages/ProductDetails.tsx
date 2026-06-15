import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import type { Product } from "../context/AppContext";

/* ─── Qty stepper ─── */
const QtyControl: React.FC<{ qty: number; onChange: (n: number) => void }> = ({
  qty,
  onChange,
}) => (
  <div className="flex w-full max-w-[140px] items-center overflow-hidden rounded-xl border border-gray-200 sm:w-auto">
    <button
      onClick={() => onChange(Math.max(1, qty - 1))}
      className="h-11 w-10 bg-gray-50 text-lg transition hover:bg-gray-100"
    >
      −
    </button>

    <span className="flex h-11 flex-1 items-center justify-center bg-gray-50 font-semibold">
      {qty}
    </span>

    <button
      onClick={() => onChange(qty + 1)}
      className="h-11 w-10 bg-gray-50 text-lg transition hover:bg-gray-100"
    >
      +
    </button>
  </div>
);

/* ─── Tag pill ─── */
const Tag: React.FC<{ label: string; color: string; bg: string }> = ({
  label,
  color,
  bg,
}) => (
  <span
    style={{ color, background: bg }}
    className="rounded-full px-3 py-1 text-[10px] font-semibold tracking-wide sm:text-[11px]"
  >
    {label}
  </span>
);

/* ─── Skeleton Loader Component ─── */
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="mx-auto mt-20 max-w-7xl px-3 py-6 sm:px-5 md:px-8 lg:px-16">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Skeleton className="h-3 w-10" />
        <span>›</span>
        <Skeleton className="h-3 w-16" />
        <span>›</span>
        <Skeleton className="h-3 w-20" />
        <span>›</span>
        <Skeleton className="h-3 w-32" />
      </div>

      {/* Main Layout Skeleton */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* LEFT IMAGE Skeleton */}
        <div className="w-full">
          <div className="relative flex min-h-[260px] w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:min-h-[340px] sm:p-5 md:min-h-[430px] lg:min-h-[520px]">
            <Skeleton className="w-32 h-32 rounded-lg" />
          </div>

          {/* Thumbnails Skeleton */}
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5 md:gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-gray-200 p-1">
                <Skeleton className="h-14 w-full rounded-lg sm:h-16 md:h-20" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT Skeleton */}
        <div className="w-full">
          {/* Tags Skeleton */}
          <div className="mb-4 flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          {/* Name Skeleton */}
          <Skeleton className="h-8 w-3/4 rounded-lg sm:h-10 md:h-12" />

          {/* Category Skeleton */}
          <Skeleton className="mt-2 h-3 w-24 rounded" />

          {/* Rating Skeleton */}
          <div className="mt-4 flex flex-wrap items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-5 h-5 rounded" />
            ))}
            <Skeleton className="ml-2 h-4 w-32 rounded" />
          </div>

          {/* Price Skeleton */}
          <div className="mt-5 flex flex-wrap items-end gap-2 sm:gap-3">
            <Skeleton className="h-9 w-28 rounded sm:h-10" />
            <Skeleton className="h-6 w-20 rounded" />
          </div>

          <hr className="my-5 sm:my-6" />

          {/* Features Skeleton */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                <Skeleton className="h-6 w-6 rounded mx-auto" />
                <Skeleton className="mt-1 h-3 w-12 rounded mx-auto" />
                <Skeleton className="mt-1 h-2 w-16 rounded mx-auto" />
              </div>
            ))}
          </div>

          <hr className="my-5 sm:my-6" />

          {/* Cart Skeleton */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Skeleton className="h-11 w-full max-w-[140px] rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl sm:flex-1" />
            <Skeleton className="h-11 w-full rounded-xl sm:w-12" />
          </div>

          {/* Free delivery Skeleton */}
          <div className="mt-4 flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3 w-48 rounded" />
          </div>

          {/* Description Skeleton */}
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 sm:p-5">
            <Skeleton className="h-5 w-32 rounded" />
            <div className="mt-2 space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <section className="mt-14 border-t pt-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-7 w-48 rounded sm:h-8" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <div className="rounded-[20px] border border-[#ede8df] overflow-hidden">
                <div className="relative flex items-center justify-center h-40 bg-gray-100">
                  <Skeleton className="w-[120px] h-[120px] rounded-lg" />
                </div>
                <div className="p-3.5 space-y-3 bg-[#fffdf9]">
                  <Skeleton className="h-3 w-20 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <Skeleton className="h-6 w-16 rounded" />
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex gap-px">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="w-[11px] h-[11px] rounded" />
                      ))}
                    </div>
                    <Skeleton className="h-3 w-8 rounded ml-0.5" />
                  </div>
                  <div className="pt-1">
                    <Skeleton className="w-full h-9 rounded-[10px]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ProductDetails: React.FC = () => {
  const { products, currency, addToCart } = useAppContext();
  const { id } = useParams<{ id: string }>();

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    // Simulate minimum loading time for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!product) return;

    const filtered = products.filter(
      (item) => item.category === product.category && item._id !== id
    );

    setRelatedProducts(filtered.slice(0, 4));
  }, [products, product, id]);

  useEffect(() => {
    if (product?.image?.length) setThumbnail(product.image[0]);
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < qty; i++) addToCart(product._id);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discountPct =
    product && product.price > product.offerPrice
      ? Math.round(
          ((product.price - product.offerPrice) / product.price) * 100
        )
      : null;

  // Show skeleton while loading
  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product)
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <span className="text-5xl">🥦</span>
        <p className="text-lg text-gray-600">Product not found</p>

        <Link
          to="/products"
          className="rounded-xl border border-gray-300 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          ← Back to store
        </Link>
      </div>
    );

  return (
    <div className="mx-auto mt-20 max-w-7xl px-3 py-6 sm:px-5 md:px-8 lg:px-16">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-[11px] text-gray-500 sm:text-xs">
        <Link to="/">Home</Link>
        <span>›</span>

        <Link to="/products">Products</Link>
        <span>›</span>

        <Link to={`/products?category=${product.category}`}>
          {product.category}
        </Link>

        <span>›</span>

        <span className="font-medium text-gray-800 line-clamp-1">
          {product.name}
        </span>
      </nav>

      {/* Main Layout */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* LEFT IMAGE */}
        <div className="w-full">
          {/* Main Image */}
          <div className="relative flex min-h-[260px] w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:min-h-[340px] sm:p-5 md:min-h-[430px] lg:min-h-[520px]">
            {discountPct && (
              <div className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold text-white sm:text-xs">
                -{discountPct}%
              </div>
            )}

            {!product.inStock && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-2 text-center text-xs text-white sm:text-sm">
                Out of stock
              </div>
            )}

            <img
              src={thumbnail || "/placeholder.jpg"}
              alt={product.name}
              className="h-auto w-full object-contain max-h-[220px] sm:max-h-[300px] md:max-h-[390px] lg:max-h-[470px]"
            />
          </div>

          {/* Thumbnails */}
          {product.image && product.image.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5 md:gap-3">
              {product.image.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setThumbnail(img)}
                  className={`overflow-hidden rounded-xl border p-1 transition-all ${
                    thumbnail === img
                      ? "border-green-700 ring-2 ring-green-200"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-14 w-full rounded-lg object-cover sm:h-16 md:h-20"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="w-full">
          {/* Tags */}
          <div className="mb-4 flex flex-wrap gap-2">
            {product.inStock ? (
              <Tag label="✓ In stock" color="#2E7D4F" bg="#E8F5EE" />
            ) : (
              <Tag label="Out of stock" color="#B71C1C" bg="#FFEBEE" />
            )}

            {discountPct && (
              <Tag
                label={`${discountPct}% OFF`}
                color="#B34000"
                bg="#FFF0E5"
              />
            )}

            <Tag label="🌿 Fresh daily" color="#5B4000" bg="#FFF8E1" />
          </div>

          {/* Name */}
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            {product.name}
          </h1>

          <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-gray-400 sm:text-xs">
            {product.category}
          </p>

          {/* Rating */}
          <div className="mt-4 flex flex-wrap items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`text-base sm:text-lg ${
                  n <= 4 ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}

            <span className="ml-2 border-l border-gray-200 pl-3 text-xs text-gray-500 sm:text-sm">
              4.0 · 128 ratings
            </span>
          </div>

          {/* Price */}
          <div className="mt-5 flex flex-wrap items-end gap-2 sm:gap-3">
            <span className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {currency}
              {product.offerPrice.toFixed(2)}
            </span>

            {product.price > product.offerPrice && (
              <span className="text-base text-gray-400 line-through sm:text-lg">
                {currency}
                {product.price.toFixed(2)}
              </span>
            )}

            <span className="text-xs text-gray-400 sm:text-sm">/ piece</span>
          </div>

          <hr className="my-5 sm:my-6" />

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: "🌿", label: "Organic", sub: "Certified" },
              { icon: "❄️", label: "Cold chain", sub: "Maintained" },
              { icon: "🚚", label: "Delivery", sub: "Same day" },
              { icon: "♻️", label: "Packaging", sub: "Eco-friendly" },
            ].map(({ icon, label, sub }) => (
              <div
                key={label}
                className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center"
              >
                <div className="text-lg sm:text-xl">{icon}</div>
                <p className="mt-1 text-[11px] font-semibold sm:text-xs">
                  {label}
                </p>
                <p className="text-[10px] text-gray-500">{sub}</p>
              </div>
            ))}
          </div>

          <hr className="my-5 sm:my-6" />

          {/* Cart */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <QtyControl qty={qty} onChange={setQty} />

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`h-11 w-full rounded-xl px-4 text-sm font-semibold text-white transition sm:h-12 sm:flex-1 ${
                !product.inStock
                  ? "cursor-not-allowed bg-gray-400"
                  : added
                  ? "bg-green-800"
                  : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {added
                ? "✓ Added to cart"
                : `Add to cart · ${currency}${(
                    product.offerPrice * qty
                  ).toFixed(2)}`}
            </button>

            <button
              onClick={() => setWishlisted((w) => !w)}
              className={`h-11 w-full rounded-xl border text-xl sm:h-12 sm:w-12 ${
                wishlisted
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border-gray-200 text-gray-400"
              }`}
            >
              {wishlisted ? "♥" : "♡"}
            </button>
          </div>

          {/* Free delivery */}
          <p className="mt-4 flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-green-700"></span>
            Free delivery on orders over {currency}30.00
          </p>

          {/* Description */}
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 sm:p-5">
            <p className="font-semibold text-green-900">
              About this product
            </p>

            <p className="mt-2 text-sm leading-6 text-green-800">
              Hand-picked and sourced from local farms, this{" "}
              {product.name.toLowerCase()} arrives fresh to your doorstep.
              We prioritise quality, taste, and nutrition — delivered same day
              when ordered before 2 PM.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.filter((p) => p.inStock).length > 0 && (
        <section className="mt-14 border-t pt-10">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              More from {product.category}
            </h2>

            <Link
              to="/products"
              className="text-sm font-medium text-green-700"
            >
              See all →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts
              .filter((p) => p.inStock)
              .map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;