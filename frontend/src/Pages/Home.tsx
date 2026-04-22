import React, { useEffect, useRef } from "react";
import Ticker from "../components/Ticker";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import Newsletter from "../components/Newsletter";

const Home: React.FC = () => {
  const mainRef = useRef<HTMLElement>(null);

  // Smooth reveal for sections on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const sections = mainRef.current?.querySelectorAll(".section-reveal");
    sections?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main
      ref={mainRef}
      className="min-h-screen bg-[#f7f6f2]"
    >
       <Hero />


      {/* Categories — soft top divider */}
      <div className="section-reveal opacity-0 translate-y-7 transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] transition-delay-[60ms]">
        <div className="mx-auto max-w-7xl ">
          <Categories />
        </div>
      </div>

      {/* Best Sellers */}
      <div className="section-reveal opacity-0 translate-y-7 transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] transition-delay-[100ms]">
        <div className="mx-auto max-w-7xl py-6">
          <BestSeller />
        </div>
      </div>

      
      {/* Ticker sits flush below hero */}
      <div className="section-reveal opacity-0 translate-y-7 transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
        <Ticker />
      </div>

      {/* Newsletter — full-bleed, rounded top edge */}
      <div className="section-reveal mt-6 opacity-0 translate-y-7 transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] transition-delay-[40ms]">
        <Newsletter />
      </div>

      <style>{`
        .section-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </main>
  );
};

export default Home;