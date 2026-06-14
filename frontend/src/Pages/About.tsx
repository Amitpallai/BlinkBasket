import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ── Intersection observer hook ── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ── Counter hook ── */
function useCounter(target: number, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ── Stat Item ── */
const StatItem: React.FC<{
  value: number;
  suffix: string;
  label: string;
  started: boolean;
}> = ({ value, suffix, label, started }) => {
  const count = useCounter(value, 1600, started);
  return (
    <div>
      <div className="text-4xl font-semibold text-[#1a2e1a] tracking-tight leading-none">
        {count}{suffix}
      </div>
      <div className="text-[11px] font-medium uppercase tracking-widest text-[#a0966e] mt-2">
        {label}
      </div>
    </div>
  );
};

/* ── Feature Card ── */
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div>
    <div className="w-10 h-10 rounded-xl bg-[#e8f5ed] flex items-center justify-center mb-4 text-[#3B6D11]">
      {icon}
    </div>
    <p className="text-sm font-medium text-[#1a2e1a] mb-1.5">{title}</p>
    <p className="text-sm text-[#7a6e58] leading-relaxed">{description}</p>
  </div>
);

/* ── Pill badge ── */
const Pill: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#3B6D11] bg-[#EAF3DE] px-3 py-1 rounded-full">
    <span className="w-1.5 h-1.5 rounded-full bg-[#008235]" />
    {label}
  </span>
);

/* ── Section tag ── */
const Tag: React.FC<{ label: string }> = ({ label }) => (
  <span className="block text-[11px] font-medium uppercase tracking-wider text-[#008235] mb-2.5">
    {label}
  </span>
);

/* ── Main About Page ── */
const About: React.FC = () => {
  const { ref: statsRef, inView: statsInView } = useInView(0.3);
  const { ref: featRef, inView: featInView } = useInView(0.1);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-0 { animation: fadeUp 0.55s 0.05s ease both; }
        .anim-1 { animation: fadeUp 0.55s 0.15s ease both; }
        .anim-2 { animation: fadeUp 0.55s 0.25s ease both; }
        .anim-3 { animation: fadeUp 0.55s 0.35s ease both; }
        .feat-item {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.45s ease, transform 0.45s ease;
        }
        .feat-item.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className="bg-[#f7f4ef] min-h-screen">

        {/* ── HERO ── */}
        <section className="max-w-6xl mx-auto px-6 sm:px-10 pt-24 pb-0">
          <div className="anim-0 mb-5">
            <Pill label="Est. 2026" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold text-[#1a2e1a] tracking-tight leading-[1.08] anim-1 mb-5">
            Farm-fresh,
            <br />
            <span className="text-[#008235]">delivered daily.</span>
          </h1>

          <p className="text-base md:text-lg text-[#7a6e58] leading-relaxed max-w-xl anim-2 mb-8">
            We partner directly with local farmers to bring seasonal, organic
            produce to your doorstep — no middlemen, no compromises.
          </p>

          <div className="flex gap-3 flex-wrap anim-3 mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white transition-colors duration-200"
              style={{ backgroundColor: "#008235" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#00662a")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#008235")}
            >
              Shop now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium text-[#1a2e1a] bg-white border border-[#e0d9cf] hover:border-[#008235] hover:text-[#008235] transition-colors duration-200"
            >
              View products
            </Link>
          </div>

          <div className="flex gap-5 flex-wrap anim-3">
            {["100% organic", "Same-day delivery", "No hidden fees"].map((t) => (
              <span key={t} className="flex items-center gap-2 text-xs text-[#7a6e58]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008235]" />
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* ── HERO IMAGE ── */}
        <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-12">
          <div className="rounded-2xl overflow-hidden h-[340px] md:h-[420px] w-full">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=80"
              alt="Fresh organic vegetables arranged artistically"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ── STATS ── */}
        <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16" ref={statsRef}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-[#e0d9cf]">
            {[
              { value: 12000, suffix: "+", label: "Customers" },
              { value: 500,   suffix: "+", label: "Products" },
              { value: 98,    suffix: "%", label: "On-time delivery" },
              { value: 7,     suffix: "",  label: "Years of service" },
            ].map((s, i) => (
              <div key={i} className="md:px-10 first:pl-0 last:pr-0">
                <StatItem {...s} started={statsInView} />
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="border-t border-[#e0d9cf]" />
        </div>

        {/* ── OUR STORY ── */}
        <section className="max-w-6xl mx-auto px-6 sm:px-10 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div>
              <Tag label="Our story" />
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1a2e1a] tracking-tight leading-tight mb-6">
                Rooted in freshness,<br />grown with care.
              </h2>
              <p className="text-sm text-[#7a6e58] leading-relaxed mb-4">
                Founded in 2017, GreenBasket began as a small farmers' market
                stall in the heart of the city. Today, we serve thousands of
                households while staying true to our mission — honest food,
                fairly priced, delivered fast.
              </p>
              <p className="text-sm text-[#7a6e58] leading-relaxed mb-10">
                Every item is sourced within 150 km of your city, hand-picked at
                peak ripeness, and delivered within 24 hours of harvest.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "40+", label: "Local farms" },
                  { value: "24h", label: "Max delivery" },
                ].map((s) => (
                  <div key={s.label} className="flex gap-3 items-stretch">
                    <div className="w-0.5 bg-[#008235] self-stretch rounded-none" />
                    <div>
                      <div className="text-2xl font-semibold text-[#1a2e1a] tracking-tight">{s.value}</div>
                      <div className="text-xs text-[#a0966e] mt-1">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: image collage */}
            <div className="grid grid-rows-2 gap-3 h-[380px]">
              <div className="rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80"
                  alt="Fresh organic produce at market"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl overflow-hidden bg-[#e8f5ed]">
                  <img
                    src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80"
                    alt="Farmers market"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden bg-[#e8f5ed]">
                  <img
                    src="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&q=80"
                    alt="Fresh vegetables"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10" ref={featRef}>
            <div className="mb-12">
              <Tag label="Why choose us" />
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1a2e1a] tracking-tight leading-tight">
                Everything you need,<br />nothing you don't.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  title: "Always organic",
                  description: "Every product passes our strict organic certification check before reaching your cart.",
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                  ),
                  delay: 0,
                },
                {
                  title: "Express delivery",
                  description: "Order before noon, get it at your door by evening — even on weekends.",
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  delay: 80,
                },
                {
                  title: "Farmer first",
                  description: "We pay farmers 30% above market rates. Good food starts with fair pay.",
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  ),
                  delay: 160,
                },
                {
                  title: "Cold-chain freshness",
                  description: "Refrigerated logistics ensure produce arrives as crisp as when it left the farm.",
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18M9 6l3-3 3 3M9 18l3 3 3-3M3 12h18M6 9l-3 3 3 3M18 9l3 3-3 3" />
                    </svg>
                  ),
                  delay: 240,
                },
                {
                  title: "Zero waste packaging",
                  description: "All packaging is 100% compostable or recyclable. No plastic, ever.",
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ),
                  delay: 320,
                },
                {
                  title: "24/7 support",
                  description: "Real humans, not bots. Our team is always available to help you.",
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ),
                  delay: 400,
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className={`feat-item${featInView ? " visible" : ""}`}
                  style={{ transitionDelay: `${f.delay}ms` }}
                >
                  <FeatureCard icon={f.icon} title={f.title} description={f.description} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-6xl mx-auto px-6 sm:px-10 py-20">
          <div className="rounded-2xl bg-[#1a2e1a] px-10 py-16 text-center">
            <span className="inline-block text-[11px] font-medium uppercase tracking-wider text-[#9FE1CB] mb-4">
              Ready to eat better?
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight mb-4">
              Join 12,000+ happy households.
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto mb-8">
              Free shipping on your first order. No commitment, cancel anytime.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                to="/"
                className="px-7 py-3 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: "#008235" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#00662a")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#008235")}
              >
                Start shopping
              </Link>
              <Link
                to="/contact"
                className="px-7 py-3 rounded-lg text-sm font-medium text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                Contact sales
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default About;