// Hero Component - Tailwind CSS version (Responsive)
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const WORDS = ["Organic.", "Local.", "Seasonal.", "Honest."];

const Hero: React.FC = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 350);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="grid lg:grid-cols-2 grid-cols-1 overflow-hidden bg-[#f7f6f2] min-h-[90vh] md:min-h-[85vh] lg:h-[70vh] rounded-b-3xl">
      {/* Left Content */}
      <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 lg:pr-0 relative z-10 order-2 lg:order-1">
        
        {/* Label - Responsive spacing and text size */}
        <span className="inline-flex items-center gap-2 mb-3 sm:mb-4 text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.18em] uppercase text-[#3a6b4a] animate-[slideRight_0.7s_0.1s_ease_both]">
          <span className="w-5 sm:w-7 h-px bg-[#3a6b4a]" />
          Groceries, reimagined
        </span>

        {/* Headline - Responsive font sizes */}
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.2] sm:leading-[1.1] md:leading-[1.04] tracking-[-0.01em] text-[#1a1916] mb-1 animate-[fadeUp_0.7s_0.2s_ease_both]">
          Everything fresh.
        </h1>
        
        {/* Rotating word - Fully responsive */}
        <div className="min-h-[3rem] sm:min-h-[4rem] md:min-h-[5rem] lg:min-h-[6rem] mb-3 sm:mb-4">
          <span 
            className={`block font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl italic text-[#3a6b4a] leading-[1.2] sm:leading-[1.1] transition-all duration-300 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'
            }`}
          >
            {WORDS[wordIndex]}
          </span>
        </div>

         

        {/* Actions - Responsive buttons and spacing */}
        <div className="flex flex-col xs:flex-row items-center gap-3 sm:gap-4 mb-6 sm:mb-8 animate-[fadeUp_0.7s_0.5s_ease_both]">
          <Link 
            to="/products" 
            className="w-full xs:w-auto bg-[#1a1916] text-white text-sm sm:text-base font-medium tracking-[0.06em] px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-grey-800 hover:-translate-y-0.5 transition-all duration-300 text-center"
          >
            Shop Now
          </Link>
          <Link 
            to="/about" 
            className="w-full xs:w-auto text-sm sm:text-base font-medium tracking-[0.06em] text-[#1a1916] hover:text-[#3a6b4a] transition-all duration-300 flex items-center justify-center gap-2 group hover:gap-3.5"
          >
            Our story
            <svg 
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Trust Badges - Mobile optimized */}
        <div className="flex flex-wrap gap-4 sm:gap-6 mt-4 animate-[fadeUp_0.7s_0.65s_ease_both]">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#3a6b4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs sm:text-sm text-green-600">Same-day delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#3a6b4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs sm:text-sm text-green-600">100% carbon-neutral</span>
          </div>
           <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#3a6b4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs sm:text-sm text-green-600"> Trusted by 10,000+ happy customers</span>
          </div>
        </div>
      </div>

      {/* Right Image - Responsive with different mobile/tablet behavior */}
      <div className="relative overflow-hidden bg-[#eaf2ec] order-1 lg:order-2 min-h-[300px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-full">
        <img
          src="https://images.unsplash.com/photo-1734076459162-fa4e3ab91633?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Fresh produce haul"
          className="w-full h-full object-cover object-center animate-[scaleIn_1.1s_0.1s_ease_both]"
          loading="eager"
        />
        
        {/* Gradient overlay for better text visibility on mobile - optional */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:hidden" />
        
         
      </div>
    </section>
  );
};

export default Hero;