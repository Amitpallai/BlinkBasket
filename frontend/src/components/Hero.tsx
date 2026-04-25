// Hero Component - Tailwind CSS version
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

    <section className="grid lg:grid-cols-2 grid-cols-1 overflow-hidden bg-[#f7f6f2] h-[70vh] rounded-b-3xl"> 
      {/* Left Content */}
      <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 xl:p-20 lg:pr-0  relative z-10 overflow-y mt-14">
        {/* Label */}
        <span className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-[0.18em] uppercase text-[#3a6b4a] animate-[slideRight_0.7s_0.1s_ease_both]">
          <span className="w-7 h-px bg-[#3a6b4a]" />
          Groceries, reimagined
        </span>

        {/* Headline */}
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-semibold leading-[1.04] tracking-[-0.01em] text-[#1a1916] mb-1 animate-[fadeUp_0.7s_0.2s_ease_both]">
          Everything fresh.
        </h1>
        
        {/* Rotating word */}
        <span 
          className={`block font-serif text-4xl md:text-5xl lg:text-6xl italic text-[#3a6b4a] leading-[1.04] mb-4 transition-all duration-300 min-h-[1.15em] ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'
          }`}
        >
          {WORDS[wordIndex]}
        </span>

        

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 mb-8 animate-[fadeUp_0.7s_0.5s_ease_both]">
          <Link 
            to="/products" 
            className="bg-[#1a1916] text-white text-sm font-medium tracking-[0.06em] px-8 py-3 rounded-full hover:bg-[#3a6b4a] hover:-translate-y-0.5 transition-all duration-300 inline-block"
          >
            Shop Now
          </Link>
          <Link to="/about" className="text-sm font-medium tracking-[0.06em] text-[#1a1916] hover:text-[#3a6b4a] transition-all duration-300 flex items-center gap-2 group hover:gap-3.5">
            Our story
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

         
      </div>

      {/* Right Image */}
      <div className="hidden lg:block relative overflow-hidden bg-[#eaf2ec]">
        <img
          src="https://images.unsplash.com/photo-1734076459162-fa4e3ab91633?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Fresh grocery haul"
          className="w-full h-full object-cover animate-[scaleIn_1.1s_0.1s_ease_both]"
        />
        
      </div>
    </section>
  );
};

export default Hero;