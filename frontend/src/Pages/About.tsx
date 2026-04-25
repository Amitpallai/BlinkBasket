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
   STAT CARD
───────────────────────────────────────────── */
const StatCard: React.FC<{ value: number; suffix: string; label: string; icon: string; started: boolean }> = ({
  value, suffix, label, icon, started,
}) => {
  const count = useCounter(value, 1600, started);
  return (
    <div className="flex flex-col items-center gap-1.5 p-8 rounded-2xl bg-white/5 border border-white/10 transition-all duration-200 hover:-translate-y-1 hover:bg-green-500/20">
      <span className="text-[1.8rem] mb-1">{icon}</span>
      <span className="font-sans text-[2.4rem] font-bold text-green-500">
        {count}{suffix}
      </span>
      <span className="text-[0.82rem] text-white/55 uppercase tracking-[0.06em]">{label}</span>
    </div>
  );
};

/* ─────────────────────────────────────────────
   FEATURE CARD
───────────────────────────────────────────── */
const FeatureCard: React.FC<{ icon: string; title: string; desc: string; delay: number }> = ({
  icon, title, desc, delay,
}) => (
  <div 
    className="bg-white rounded-2xl p-8 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg opacity-0 translate-y-6"
    style={{ animationDelay: `${delay}ms`, animation: `fadeUp 0.55s ease both` }}
  >
    <div className="text-3xl mb-4 w-13 h-13 bg-green-100 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <h4 className="font-sans text-lg font-semibold mb-2">{title}</h4>
    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

/* ─────────────────────────────────────────────
   TEAM CARD
───────────────────────────────────────────── */
const TeamCard: React.FC<{ name: string; role: string; img: string; delay: number }> = ({
  name, role, img, delay,
}) => (
  <div 
    className="text-center opacity-0 translate-y-5 transition-transform duration-200 hover:-translate-y-1"
    style={{ animationDelay: `${delay}ms`, animation: `fadeUp 0.5s ease both` }}
  >
    <div className="w-full aspect-square rounded-2xl overflow-hidden mb-3.5 bg-green-100">
      <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-400 hover:scale-105" />
    </div>
    <p className="font-sans font-semibold text-[0.95rem] mb-0.5">{name}</p>
    <p className="text-[0.8rem] text-green-700">{role}</p>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN ABOUT PAGE
───────────────────────────────────────────── */
const About: React.FC = () => {
  const { ref: statsRef, inView: statsInView } = useInView(0.3);
  const { ref: featRef, inView: featInView } = useInView(0.15);
  const { ref: teamRef, inView: teamInView } = useInView(0.15);
  const { ref: ctaRef, inView: ctaInView } = useInView(0.3);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap');

        * {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }

        .features-animate .feature-card {
          animation: fadeUp 0.55s ease both !important;
        }
        
        .team-animate .team-card {
          animation: fadeUp 0.5s ease both !important;
        }
      `}</style>

      <div className="text-[#1c1917] bg-gray-50 overflow-x-hidden">

        {/* ── HERO ── */}
        <section className="relative min-h-[92vh] grid md:grid-cols-2 overflow-hidden bg-[#fefce8]">
          <div className="flex flex-col justify-center p-16 md:p-20 relative z-[2] md:px-16 md:py-20">
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-[0.75rem] font-semibold tracking-wide uppercase py-1.5 px-4 rounded-full w-fit mb-6 animate-[fadeUp_0.6s_ease_both]">
              🌿 Fresh Shop
            </span>

            <h1 className="font-sans text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.2] mb-5 animate-[fadeUp_0.6s_0.1s_ease_both] tracking-[-0.02em]">
              Farm-fresh<br />
              goodness,<br />
              <span className="text-green-500">delivered daily.</span>
            </h1>

            <p className="text-base text-gray-500 leading-relaxed max-w-[440px] mb-9 animate-[fadeUp_0.6s_0.2s_ease_both]">
              We partner directly with local farmers to bring seasonal, organic
              produce straight to your doorstep — no middlemen, no compromises.
            </p>

            <div className="flex gap-3.5 flex-wrap animate-[fadeUp_0.6s_0.3s_ease_both]">
              <Link to="/" className="bg-green-500 text-white font-medium text-[0.95rem] py-3.5 px-8 rounded-full transition-all duration-200 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(34,197,94,0.4)] shadow-[0_4px_20px_rgba(34,197,94,0.35)]">
                Shop Now
              </Link>
              <Link to="/products" className="border-2 border-[#1c1917] text-[#1c1917] font-medium text-[0.95rem] py-3.5 px-8 rounded-full transition-all duration-200 hover:bg-[#1c1917] hover:text-white hover:-translate-y-0.5">
                Explore Products
              </Link>
            </div>

            <div className="flex gap-3 flex-wrap mt-10 animate-[fadeUp_0.6s_0.4s_ease_both]">
              {["100% Organic", "Same-day delivery", "No hidden fees"].map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-[0.8rem] font-normal text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden md:min-h-auto">
            <img
              src="https://img.freepik.com/free-photo/top-view-assortment-vegetables-with-word-vegan-paper-bag_23-2148853339.jpg?w=1380"
              alt="Fresh Vegetables"
              className="w-full h-full object-cover block scale-[1.04] transition-transform duration-[8s] hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#fefce8]/20 to-transparent pointer-events-none" />

            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl py-2.5 px-4 shadow-lg flex items-center gap-2 text-[0.8rem] font-medium animate-[float_3s_ease-in-out_infinite]">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Free Delivery Today
            </div>

            <div className="absolute bottom-8 left-6 bg-white/90 backdrop-blur-sm rounded-xl py-2.5 px-4 shadow-lg flex items-center gap-2 text-[0.8rem] font-medium animate-[float_3s_1.2s_ease-in-out_infinite]">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              500+ Products In Stock
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="bg-[#1c1917] py-20 px-8">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" ref={statsRef}>
            <StatCard value={12000} suffix="+" label="Happy Customers" icon="😊" started={statsInView} />
            <StatCard value={500}   suffix="+"  label="Fresh Products"   icon="🥦" started={statsInView} />
            <StatCard value={98}    suffix="%"  label="On-time Delivery" icon="🚚" started={statsInView} />
            <StatCard value={7}     suffix=""   label="Years of Service" icon="🌟" started={statsInView} />
          </div>
        </section>

        {/* ── OUR STORY ── */}
        <section>
          <div className="max-w-[1100px] mx-auto py-24 px-8 grid md:grid-cols-2 gap-20 items-center">
            <div className="grid grid-cols-2 grid-rows-[auto_auto] gap-3">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
                alt="Local farm"
                className="col-span-2 h-[220px] w-full rounded-2xl object-cover block"
              />
              <img
                src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&q=80"
                alt="Fresh herbs"
                className="h-[140px] w-full rounded-2xl object-cover block"
              />
              <img
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80"
                alt="Market stall"
                className="h-[140px] w-full rounded-2xl object-cover block"
              />
            </div>

            <div>
              <span className="inline-block text-[0.7rem] font-semibold tracking-wide uppercase text-green-700 bg-green-100 py-1.5 px-3.5 rounded-full mb-5">
                Our Story
              </span>
              <h2 className="font-sans text-[clamp(1.8rem,3vw,2.4rem)] font-bold leading-[1.3] mb-5 tracking-[-0.01em]">
                Rooted in freshness,<br />grown with care.
              </h2>
              <p className="text-[0.95rem] text-gray-600 leading-relaxed mb-4">
                Founded in 2017, GreenBasket began as a small farmers' market
                stall in the heart of the city. Today we serve thousands of
                households, but our mission stays the same — honest food, fairly
                priced, delivered fast.
              </p>
              <p className="text-[0.95rem] text-gray-600 leading-relaxed mb-4">
                Every item on our shelves is sourced within 150 km of your city,
                hand-picked at peak ripeness, and delivered within 24 hours of
                harvest.
              </p>
              <ul className="list-none p-0 mt-6 flex flex-col gap-2.5">
                {["Direct partnerships with 40+ local farms", "Zero harmful pesticides — certified organic", "Cold-chain logistics to lock in freshness", "Eco-friendly, compostable packaging"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[0.9rem] text-[#1c1917]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="bg-green-100 py-24 px-8">
          <div className={`max-w-[1100px] mx-auto ${featInView ? "features-animate" : ""}`} ref={featRef}>
            <div className="text-center mb-14">
              <span className="inline-block text-[0.7rem] font-semibold tracking-wide uppercase text-green-700 bg-green-200 py-1.5 px-3.5 rounded-full mb-3">
                Why Us
              </span>
              <h2 className="font-sans text-[clamp(1.8rem,3vw,2.4rem)] font-bold mb-2 tracking-[-0.01em]">
                Everything you need, <span className="text-green-700">nothing you don't.</span>
              </h2>
              <p className="text-gray-600 text-base max-w-[520px] mx-auto">
                We built GreenBasket around the things that matter most to modern families.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard delay={0}   icon="🌱" title="Always Organic"        desc="Every product passes our strict organic certification check before reaching your cart." />
              <FeatureCard delay={80}  icon="⚡" title="Express Delivery"      desc="Order before noon, get it at your door by evening — even on weekends." />
              <FeatureCard delay={160} icon="🤝" title="Farmer First"          desc="We pay farmers 30% above market rates. Good food starts with fair pay." />
              <FeatureCard delay={240} icon="❄️" title="Cold-Chain Freshness"  desc="Our refrigerated logistics ensure produce arrives as crisp as it left the farm." />
              <FeatureCard delay={320} icon="♻️" title="Zero Waste Packaging"  desc="All packaging is 100% compostable or recyclable — good for you and the planet." />
              <FeatureCard delay={400} icon="💬" title="24 / 7 Support"        desc="Real humans, not bots. Our team is always available to help you." />
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="max-w-[1100px] mx-auto py-24 px-8">
          <div className={`${teamInView ? "team-animate" : ""}`} ref={teamRef}>
            <div className="text-center mb-14">
              <span className="inline-block text-[0.7rem] font-semibold tracking-wide uppercase text-green-700 bg-green-100 py-1.5 px-3.5 rounded-full mb-3">
                The Team
              </span>
              <h2 className="font-sans text-[clamp(1.8rem,3vw,2.4rem)] font-bold mb-2 tracking-[-0.01em]">
                People behind your plate
              </h2>
              <p className="text-gray-600 text-base max-w-[520px] mx-auto">
                A small, passionate team obsessed with fresh food and fast delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <TeamCard delay={0}   name="Priya Sharma"   role="Founder & CEO"       img="https://randomuser.me/api/portraits/women/44.jpg" />
              <TeamCard delay={100} name="Arjun Mehta"    role="Head of Sourcing"    img="https://randomuser.me/api/portraits/men/32.jpg" />
              <TeamCard delay={200} name="Sneha Rao"      role="Operations Lead"     img="https://randomuser.me/api/portraits/women/65.jpg" />
              <TeamCard delay={300} name="Kiran Patel"    role="Customer Experience" img="https://randomuser.me/api/portraits/men/76.jpg" />
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section ref={ctaRef}>
          <div className="mx-8 mb-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[#14532d] via-[#166534] to-[#15803d] relative">
            <div className="absolute w-[340px] h-[340px] rounded-full bg-white/5 pointer-events-none -top-24 -left-20" />
            <div className="absolute w-[240px] h-[240px] rounded-full bg-white/5 pointer-events-none -bottom-16 -right-10" />
            <div className="max-w-[680px] mx-auto py-20 px-8 text-center relative z-[2]">
              <h2 className="font-sans text-[clamp(1.8rem,3.5vw,2.5rem)] font-bold text-white mb-4 tracking-[-0.01em]">
                Ready for fresher groceries?
              </h2>
              <p className="text-white/70 text-base mb-8 leading-relaxed">
                Join 12,000+ happy households already eating better with
                GreenBasket. Your first order ships free.
              </p>
              <div className="flex gap-3.5 justify-center flex-wrap">
                <Link to="/" className="bg-white text-green-700 font-semibold text-base py-3.5 px-9 rounded-full transition-all duration-200 hover:bg-gray-100 hover:-translate-y-0.5">
                  Start Shopping
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-white/40 text-white font-medium text-base py-3.5 px-9 rounded-full transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default About;