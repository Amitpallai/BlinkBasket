import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ── tiny counter hook ── */
function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ── intersection observer hook ── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─────────────────────────────────────────────
   STAT CARD - Professional
───────────────────────────────────────────── */
const StatCard: React.FC<{ value: number; suffix: string; label: string; started: boolean }> = ({
  value, suffix, label, started,
}) => {
  const count = useCounter(value, 1600, started);
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2 tracking-tight">
        {count}{suffix}
      </div>
      <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider font-medium">
        {label}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   FEATURE CARD - Professional with Custom Green
───────────────────────────────────────────── */
const FeatureCard: React.FC<{ title: string; description: string; delay: number }> = ({
  title, description, delay,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group opacity-0 translate-y-4"
      style={{ animationDelay: `${delay}ms`, animation: `fadeUp 0.5s ease forwards` }}
    >
      <div 
        className="w-12 h-12 rounded-lg mb-4 transition-colors duration-300"
        style={{ backgroundColor: isHovered ? '#00662a' : '#008235' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <h4 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">{title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN ABOUT PAGE - Custom Green Theme (#008235)
───────────────────────────────────────────── */
const About: React.FC = () => {
  const { ref: statsRef, inView: statsInView } = useInView(0.3);
  const { ref: featRef, inView: featInView } = useInView(0.15);
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isViewHovered, setIsViewHovered] = useState(false);
  const [isContactHovered, setIsContactHovered] = useState(false);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.98); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="bg-white">

        {/* ── HERO - Custom Green ── */}
        <section className="relative min-h-[85vh] lg:min-h-[90vh] flex flex-col lg:flex-row">
          {/* Left Content */}
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-12 lg:py-0 order-2 lg:order-1">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider mb-6 animate-[fadeIn_0.6s_ease_both]" style={{ color: '#008235' }}>
                <span className="w-8 h-px" style={{ backgroundColor: '#008235' }}></span>
                Since 2017
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 animate-[fadeUp_0.6s_0.1s_ease_both]">
                Farm-fresh
                <br />
                delivered daily.
              </h1>

              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 animate-[fadeUp_0.6s_0.2s_ease_both]">
                We partner directly with local farmers to bring seasonal, organic
                produce straight to your doorstep. No middlemen, no compromises.
              </p>

              <div className="flex gap-4 flex-wrap animate-[fadeUp_0.6s_0.3s_ease_both]">
                <Link 
                  to="/" 
                  className="text-white px-8 py-3.5 rounded-md text-sm font-medium transition-all duration-200 inline-flex items-center gap-2 group"
                  style={{ backgroundColor: isShopHovered ? '#00662a' : '#008235' }}
                  onMouseEnter={() => setIsShopHovered(true)}
                  onMouseLeave={() => setIsShopHovered(false)}
                >
                  Shop Now
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link 
                  to="/products" 
                  className="border border-gray-300 text-gray-700 px-8 py-3.5 rounded-md text-sm font-medium transition-all duration-200"
                  style={{ 
                    borderColor: isViewHovered ? '#008235' : '#d1d5db',
                    color: isViewHovered ? '#008235' : '#374151'
                  }}
                  onMouseEnter={() => setIsViewHovered(true)}
                  onMouseLeave={() => setIsViewHovered(false)}
                >
                  View Products
                </Link>
              </div>

              <div className="flex gap-6 flex-wrap mt-10 animate-[fadeUp_0.6s_0.4s_ease_both]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#008235' }}></div>
                  <span className="text-xs text-gray-500">100% Organic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#008235' }}></div>
                  <span className="text-xs text-gray-500">Same-day delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#008235' }}></div>
                  <span className="text-xs text-gray-500">No hidden fees</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative min-h-[400px] lg:min-h-0 order-1 lg:order-2" style={{ backgroundColor: '#e8f5ed' }}>
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80"
              alt="Fresh organic vegetables arranged artistically"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* ── STATS - Professional ── */}
        <section className="border-y border-gray-100 py-16 md:py-20 px-6 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12" ref={statsRef}>
              <StatCard value={12000} suffix="+" label="CUSTOMERS" started={statsInView} />
              <StatCard value={500} suffix="+" label="PRODUCTS" started={statsInView} />
              <StatCard value={98} suffix="%" label="ON-TIME DELIVERY" started={statsInView} />
              <StatCard value={7} suffix="" label="YEARS OF SERVICE" started={statsInView} />
            </div>
          </div>
        </section>

        {/* ── OUR STORY - Custom Green Accents ── */}
        <section className="py-20 md:py-28 px-6 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#008235' }}>
                    Our Story
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mt-2">
                    Rooted in freshness,<br />grown with care.
                  </h2>
                </div>
                
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Founded in 2017, GreenBasket began as a small farmers' market
                    stall in the heart of the city. Today, we serve thousands of
                    households while maintaining our core mission — honest food,
                    fairly priced, delivered fast.
                  </p>
                  <p>
                    Every item on our shelves is sourced within 150 km of your city,
                    hand-picked at peak ripeness, and delivered within 24 hours of harvest.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="border-l-2 pl-4" style={{ borderColor: '#008235' }}>
                    <div className="text-2xl font-semibold text-gray-900">40+</div>
                    <div className="text-xs text-gray-500 mt-1">Local Farms</div>
                  </div>
                  <div className="border-l-2 pl-4" style={{ borderColor: '#008235' }}>
                    <div className="text-2xl font-semibold text-gray-900">24h</div>
                    <div className="text-xs text-gray-500 mt-1">Max Delivery</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80"
                  alt="Fresh organic produce"
                  className="h-64 w-full object-cover rounded-lg"
                />
                <div className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80"
                    alt="Local farmers market"
                    className="h-40 w-full object-cover rounded-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"
                    alt="Fresh vegetables"
                    className="h-40 w-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES - Custom Green Grid ── */}
        <section className="py-20 md:py-28 px-6 sm:px-8" style={{ backgroundColor: '#e8f5ed' }}>
          <div className={`max-w-6xl mx-auto ${featInView ? "" : ""}`} ref={featRef}>
            <div className="text-center mb-16">
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#008235' }}>
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mt-2">
                Everything you need,<br />nothing you don't.
              </h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                We built our platform around the values that matter most to modern families.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                delay={0} 
                title="Always Organic" 
                description="Every product passes our strict organic certification check before reaching your cart."
              />
              <FeatureCard 
                delay={100} 
                title="Express Delivery" 
                description="Order before noon, get it at your door by evening — even on weekends."
              />
              <FeatureCard 
                delay={200} 
                title="Farmer First" 
                description="We pay farmers 30% above market rates. Good food starts with fair pay."
              />
              <FeatureCard 
                delay={300} 
                title="Cold-Chain Freshness" 
                description="Refrigerated logistics ensure produce arrives as crisp as when it left the farm."
              />
              <FeatureCard 
                delay={400} 
                title="Zero Waste Packaging" 
                description="All packaging is 100% compostable or recyclable."
              />
              <FeatureCard 
                delay={500} 
                title="24/7 Expert Support" 
                description="Real humans, not bots. Our team is always available to help."
              />
            </div>
          </div>
        </section>

        {/* ── CTA - Custom Green ── */}
        <section className="py-20 md:py-28 px-6 sm:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="rounded-2xl p-12 md:p-16" style={{ backgroundColor: '#008235' }}>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                Ready for fresher groceries?
              </h2>
              <p className="text-white/90 text-base md:text-lg mb-8 max-w-md mx-auto">
                Join 12,000+ happy households already eating better with GreenBasket.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link 
                  to="/" 
                  className="bg-white px-8 py-3.5 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-50"
                  style={{ color: '#008235' }}
                >
                  Start Shopping
                </Link>
                <Link
                  to="/contact"
                  className="border text-white px-8 py-3.5 rounded-md text-sm font-medium transition-all duration-200"
                  style={{ 
                    borderColor: isContactHovered ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)',
                    backgroundColor: isContactHovered ? 'rgba(255,255,255,0.1)' : 'transparent'
                  }}
                  onMouseEnter={() => setIsContactHovered(true)}
                  onMouseLeave={() => setIsContactHovered(false)}
                >
                  Contact Sales
                </Link>
              </div>
              <p className="text-white/70 text-xs mt-6">
                Free shipping on your first order • Cancel anytime
              </p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default About;