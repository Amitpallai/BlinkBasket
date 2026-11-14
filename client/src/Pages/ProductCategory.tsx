import React, { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Categories from "../components/Categories";
import type { Product } from "../context/AppContext";

const GRID =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5";

const ProductCategory: React.FC = () => {
  const { products } = useAppContext();
  const { category } = useParams<{ category: string }>();
  const routerNavigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const isAll = !category || category.toLowerCase() === "all";

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [products, category]);

  const inStock = useMemo(
    () => (products as Product[]).filter((p) => p.inStock),
    [products],
  );

  const visible = useMemo(
    () =>
      isAll
        ? inStock
        : inStock.filter(
            (p) => p.category?.toLowerCase() === category?.toLowerCase(),
          ),
    [inStock, category, isAll],
  );

  // "All" view: products grouped under their category
  const grouped = useMemo(() => {
    const names = Array.from(
      new Set(
        inStock.map((p) => p.category?.toLowerCase()).filter(Boolean) as string[],
      ),
    );
    return names.map((name) => ({
      name,
      items: inStock.filter((p) => p.category?.toLowerCase() === name),
    }));
  }, [inStock]);

  const goTo = (name: string) => {
    routerNavigate(`/products/${name}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="mx-auto mt-20 max-w-7xl px-3 py-6 sm:px-5 md:px-8 lg:px-16">
      <div className="-mx-3 mb-6 sm:mx-0">
        <Categories />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-medium capitalize md:text-2xl">
          {isAll ? "All products" : category} (
          {!loading ? visible.length : "..."})
        </h2>
      </div>

      {loading ? (
        <div className={GRID}>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCard key={`skeleton-${i}`} product={null as any} loading />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">📦</div>
          <h3 className="mb-2 text-xl font-medium text-gray-700">
            No products found
          </h3>
          <p className="text-gray-500">
            We couldn't find any products in the{" "}
            <span className="font-medium capitalize">{category}</span> category.
          </p>
        </div>
      ) : isAll ? (
        <div className="space-y-12">
          {grouped.map(({ name, items }) => (
            <section key={name}>
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="text-lg font-semibold capitalize text-[#111]">
                  {name}
                </h3>
                <button
                  onClick={() => goTo(name)}
                  className="text-[13px] font-medium text-gray-500 hover:text-black"
                >
                  View all ({items.length})
                </button>
              </div>
              <div className={GRID}>
                {items.slice(0, 4).map((p) => (
                  <ProductCard key={p._id} product={p} loading={false} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className={GRID}>
          {visible.map((p) => (
            <ProductCard key={p._id} product={p} loading={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCategory;