import React from "react";

const ITEMS = [
  { emoji: "🌿", label: "Certified Organic" },
  { emoji: "🚚", label: "Same-day Delivery" },
  { emoji: "🌾", label: "Farm Direct" },
  { emoji: "❄️", label: "Cold-chain Fresh" },
  { emoji: "♻️", label: "Zero-waste Packaging" },
  { emoji: "🤝", label: "Fair Farmer Wages" },
  { emoji: "🥦", label: "500+ Products" },
  { emoji: "⭐", label: "4.9 Star Rating" },
];

// Separator between items
const Dot: React.FC = () => (
  <span className="mx-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-[#4e8a61] opacity-70" />
);

const Ticker: React.FC = () => {
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS]; // triple for seamless loop

  return (
    <>
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .ticker-track {
          animation: ticker-scroll 32s linear infinite;
          will-change: transform;
        }
        .ticker-wrapper:hover .ticker-track {
          animation-play-state: paused;
        }
        .ticker-wrapper:hover .ticker-item {
          opacity: 0.65;
        }
        .ticker-wrapper:hover .ticker-item:hover {
          opacity: 1;
        }
      `}</style>

      <div
        className="ticker-wrapper relative overflow-hidden bg-gradient-to-br from-[#141210] to-[#1e1a16] border-y-[0.5px] border-white/10"
        aria-hidden="true"
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#141210] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#141210] to-transparent" />

        <div className="flex w-max py-3">
          <div className="ticker-track flex items-center">
            {repeated.map((item, i) => (
              <span
                key={i}
                className="ticker-item flex items-center gap-2 px-6 text-[11px] font-medium uppercase tracking-[0.12em] whitespace-nowrap text-white/78 transition-opacity duration-200"
              >
                <span className="text-[13px]">{item.emoji}</span>
                {item.label}
                <Dot />
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Ticker;