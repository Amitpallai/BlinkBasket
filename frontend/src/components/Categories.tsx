import React, { useState, useRef, useEffect } from "react";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

interface Category {
  image: string;
  text: string;
  path: string;
  bgColor: string;
}

const Categories: React.FC = () => {
  const { navigate } = useAppContext();
  const [active, setActive] = useState<string | null>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const handleClick = (category: Category) => {
    setActive(category.path);
    navigate(`/products/${category.path.toLowerCase()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        .categories-scroll::-webkit-scrollbar { display: none; }
        .categories-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes catPop {
          0%  { transform: scale(1); }
          40% { transform: scale(0.94); }
          70% { transform: scale(1.04); }
          100%{ transform: scale(1); }
        }
        .cat-btn:active { animation: catPop 0.3s ease both; }
        .cat-img {
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .cat-btn:hover .cat-img {
          transform: scale(1.1) rotate(-2deg);
        }
        .cat-btn.active-cat .cat-img {
          transform: scale(1.05);
        }
      `}</style>

      <section className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className=" flex items-center justify-between ">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-[#1a2e1a] text-xl lg:text-XL md:text-2xl ">
              Shop By Category
            </h2>
            <p className="mt-0.5 text-xs text-[#7a7060]">
              {(categories as Category[]).length} categories
            </p>
          </div>

          {/* Scroll hint arrows (visible on md+) */}
          <div className="hidden gap-1.5 sm:flex">
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" })
              }
              disabled={!canScrollLeft}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e0dbd1] bg-white text-[#4a3e2a] transition disabled:opacity-25 hover:border-[#3a6b4a] hover:text-[#3a6b4a]"
              aria-label="Scroll left"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" })
              }
              disabled={!canScrollRight}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e0dbd1] bg-white text-[#4a3e2a] transition disabled:opacity-25 hover:border-[#3a6b4a] hover:text-[#3a6b4a]"
              aria-label="Scroll right"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scroll Container */}
        <div className="relative">
          {/* Left fade */}
          <div
            className={`pointer-events-none absolute left-0 top-0 z-10 h-full w-10 transition-opacity duration-300 sm:w-14 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background: "linear-gradient(to right, #f7f6f2 10%, transparent)",
            }}
          />
          {/* Right fade */}
          <div
            className={`pointer-events-none absolute right-0 top-0 z-10 h-full w-10 transition-opacity duration-300 sm:w-14 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background: "linear-gradient(to left, #f7f6f2 10%, transparent)",
            }}
          />

          <div
            ref={scrollRef}
            className="categories-scroll flex gap-2 overflow-x-auto pb-3 scroll-smooth sm:gap-3 md:gap-4"
          >
            {(categories as Category[]).map((category, index) => {
              const isActive = active === category.path;
              return (
                <button
                  key={index}
                  onClick={() => handleClick(category)}
                  className={`cat-btn group relative flex min-w-[80px] flex-shrink-0 flex-col items-center gap-2.5 rounded-2xl border px-2 py-3.5 transition-all duration-200 sm:min-w-[96px] sm:px-3 md:min-w-[108px] ${
                    isActive ? "active-cat" : ""
                  }`}
                  style={{
                    borderColor: isActive ? "#1a2e1a" : "transparent",
                    background: isActive ? "#fff" : "transparent",
                    boxShadow: isActive
                      ? "0 2px 12px rgba(26,46,26,0.10)"
                      : "none",
                  }}
                  aria-pressed={isActive}
                  aria-label={category.text}
                >
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center rounded-xl transition-transform duration-200"
                    style={{
                      backgroundColor: category.bgColor,
                      width: "clamp(52px,14vw,72px)",
                      height: "clamp(52px,14vw,72px)",
                    }}
                  >
                    <img
                      src={category.image}
                      alt={category.text}
                      className="cat-img object-contain"
                      style={{ width: "60%", height: "60%" }}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-center text-[11px] leading-tight sm:text-xs ${
                      isActive
                        ? "font-semibold text-[#1a2e1a]"
                        : "font-medium text-[#4a3e2a]"
                    }`}
                  >
                    {category.text}
                  </span>

                  {/* Active pip */}
                  <span
                    className={`absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#1a2e1a] transition-all duration-300 ${
                      isActive ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    }`}
                  />

                  {/* Hover ring */}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-2xl border border-[#e5e0d8] opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Categories;