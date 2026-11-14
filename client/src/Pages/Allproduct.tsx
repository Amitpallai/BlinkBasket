import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

// Product type
interface Product {
  _id: string;
  name: string;
  inStock: boolean;
  price: number;
  offerPrice: number;
  category?: string;
  [key: string]: any; // allows extra fields like image, etc.
}

const Allproduct: React.FC = () => {
  const { products, searchQuery, setSearchQuery } = useAppContext();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Search filter
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

  const inStock = useMemo(
    () => filteredProducts.filter((p) => p.inStock),
    [filteredProducts],
  );

  // Categories (with counts) from the current in-stock results
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    inStock.forEach((p) => {
      const key = p.category?.toLowerCase();
      if (key) map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map, ([name, count]) => ({ name, count }));
  }, [inStock]);

  // Reset to "all" if the selected category disappears (e.g. after searching)
  useEffect(() => {
    if (
      activeCategory !== "all" &&
      !categories.some((c) => c.name === activeCategory)
    ) {
      setActiveCategory("all");
    }
  }, [categories, activeCategory]);

  const availableProducts = useMemo(
    () =>
      activeCategory === "all"
        ? inStock
        : inStock.filter((p) => p.category?.toLowerCase() === activeCategory),
    [inStock, activeCategory],
  );

  // Slider arrow state
  const checkScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  const slide = (dir: number) =>
    sliderRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });

  const chip = (active: boolean) =>
    `shrink-0 rounded-full px-4 py-2 text-[13px] font-medium capitalize transition-colors ${
      active
        ? "bg-black text-white"
        : "border border-gray-200 bg-white text-gray-700 hover:border-gray-400"
    }`;

  const arrowBtn =
    "hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-black disabled:opacity-25 disabled:hover:border-gray-200 sm:flex";

  return (
    <div className="mx-auto mt-20 max-w-7xl px-3 py-6 sm:px-5 md:px-8 lg:px-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <p className="shrink-0 text-xl font-medium md:text-2xl">
          All products
          <span className="ml-2 text-base text-gray-400">
            ({availableProducts.length})
          </span>
        </p>

        {/* Category slider */}
        {categories.length > 0 && (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              onClick={() => slide(-1)}
              disabled={!canScrollLeft}
              aria-label="Scroll categories left"
              className={arrowBtn}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div
              ref={sliderRef}
              className="flex min-w-0 flex-1 snap-x gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <button
                onClick={() => setActiveCategory("all")}
                className={`${chip(activeCategory === "all")} snap-start`}
              >
                All <span className="opacity-60">{inStock.length}</span>
              </button>
              {categories.map(({ name, count }) => (
                <button
                  key={name}
                  onClick={() => setActiveCategory(name)}
                  className={`${chip(activeCategory === name)} snap-start`}
                >
                  {name} <span className="opacity-60">{count}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => slide(1)}
              disabled={!canScrollRight}
              aria-label="Scroll categories right"
              className={arrowBtn}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {availableProducts.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : "No products in this category"}
          </p>

          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
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