import React from "react";
import { Link, useLocation } from "react-router-dom";

// ── Types ──────────────────────────────────────────────
interface OrderConfirmationProps {
  orderId?: string;
  total?: number;
  currency?: string;
  paymentMethod?: string;
  deliveryAddress?: string;
  savedAmount?: number;
  estimatedTime?: string;
}

// ── Timeline step data ─────────────────────────────────
const STEPS = [
  { label: "Confirmed",       sub: "Just now",      status: "done"    },
  { label: "Packing",         sub: "In progress",   status: "active"  },
  { label: "Out for delivery",sub: "~2 hrs",        status: "pending" },
  { label: "Delivered",       sub: "Est. 5–6 PM",   status: "pending" },
];

// ── Step icons ─────────────────────────────────────────
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const PackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
  </svg>
);
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const HomeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const OrderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);
const CartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
  </svg>
);

const STEP_ICONS = [<CheckIcon />, <PackIcon />, <ArrowIcon />, <HomeIcon />];

// ── Main Component ─────────────────────────────────────
const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const orderData = location.state || {};

  // Get values from navigation state or use defaults
  const orderId = orderData.orderId || `BLN-${Math.floor(Math.random() * 90000) + 10000}`;
  const total = orderData.total || 0;
  const currency = orderData.currency || "₹";
  const paymentMethod = orderData.paymentMethod || "Cash on delivery";
  const deliveryAddress = orderData.deliveryAddress || "Your address";
  const savedAmount = orderData.savedAmount || 0;

  return (
    <>
      <style>{`
        @keyframes oc-pop {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.06); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes oc-rise {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes oc-draw {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes oc-burst {
          0%   { transform: scale(0); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes oc-float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-6px); }
        }
        .oc-card    { animation: oc-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .oc-burst   { animation: oc-burst 0.6s ease-out 0.3s both; }
        .oc-float   { animation: oc-float 3s ease-in-out 0.6s infinite; }
        .oc-check   { stroke-dasharray: 60; stroke-dashoffset: 60; animation: oc-draw 0.4s ease 0.6s forwards; }
        .oc-r1  { animation: oc-rise 0.4s ease 0.5s both; opacity: 0; }
        .oc-r2  { animation: oc-rise 0.4s ease 0.6s both; opacity: 0; }
        .oc-r3  { animation: oc-rise 0.4s ease 0.7s both; opacity: 0; }
        .oc-r4  { animation: oc-rise 0.4s ease 0.8s both; opacity: 0; }
        .oc-r5  { animation: oc-rise 0.4s ease 0.9s both; opacity: 0; }
        .oc-r6  { animation: oc-rise 0.4s ease 1.0s both; opacity: 0; }
      `}</style>

      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4 py-16">
        <div className="oc-card bg-[#fffdf9] rounded-[24px] border border-[#ede8df] w-full max-w-[440px] px-9 pt-10 pb-9 shadow-lg">

          {/* Confetti dots */}
          <div className="oc-r1 flex justify-center gap-2 mb-6">
            {[
              { bg: "#c4e8b4", r: "2px",  rot: "15deg"  },
              { bg: "#ffd54f", r: "50%",  rot: "-20deg" },
              { bg: "#f48fb1", r: "2px",  rot: "30deg"  },
              { bg: "#90caf9", r: "50%",  rot: "-10deg" },
              { bg: "#c4e8b4", r: "2px",  rot: "25deg"  },
              { bg: "#ffb74d", r: "2px",  rot: "-15deg" },
              { bg: "#b0d890", r: "50%",  rot: "5deg"   },
            ].map((c, i) => (
              <div
                key={i}
                style={{ background: c.bg, borderRadius: c.r, transform: `rotate(${c.rot})` }}
                className="w-2 h-2 flex-shrink-0"
              />
            ))}
          </div>

          {/* Check icon */}
          <div className="flex justify-center mb-6">
            <div className="oc-float relative w-20 h-20 rounded-full bg-[#eaf7e0] border-2 border-[#b0d890] flex items-center justify-center">
              <div className="oc-burst absolute inset-[-8px] rounded-full border-2 border-[#b0d890]" />
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="19" fill="#eaf7e0" stroke="#b0d890" strokeWidth="1.5" />
                <path
                  className="oc-check"
                  d="M11 20l7 7 11-13"
                  stroke="#1a2e1a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <p className="oc-r1 text-[10px] text-[#a0966e] tracking-[2px] uppercase text-center mb-2">
            Order #{orderId}
          </p>
          <h1 className="oc-r2 text-[22px] font-semibold text-[#1a2e1a] text-center tracking-tight mb-2">
            Order confirmed! 🎉
          </h1>
          <p className="oc-r3 text-[13px] text-[#7a6e58] text-center leading-[1.7] mb-7">
            Thanks for shopping with Blenes. Your fresh items are being packed and will be on their way shortly.
          </p>

          {/* Delivery timeline */}
          <div className="oc-r4 relative flex justify-between items-start mb-7">
            {/* track line */}
            <div className="absolute top-4 left-[10%] right-[10%] h-px bg-[#e0d8cc]" />
            {/* progress line */}
            <div className="absolute top-4 left-[10%] w-[16%] h-px bg-[#1a2e1a]" />

            {STEPS.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-1.5 flex-1">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0
                  ${step.status === "done"    ? "bg-[#1a2e1a] text-[#c4e8b4]" : ""}
                  ${step.status === "active"  ? "bg-[#eaf7e0] border-2 border-[#1a2e1a] text-[#1a2e1a]" : ""}
                  ${step.status === "pending" ? "bg-[#f5f0e8] border-2 border-[#ded6c8] text-[#b8aa90]" : ""}
                `}>
                  {STEP_ICONS[i]}
                </div>
                <div className="text-center">
                  <p className={`text-[11px] font-medium leading-tight ${step.status === "pending" ? "text-[#b8aa90]" : "text-[#1a2e1a]"}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-[#a0966e] mt-0.5">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order details tile */}
          <div className="oc-r5 bg-[#f5f0e8] rounded-[16px] px-5 py-4 mb-5 space-y-2.5">
            {[
              { label: "Order total",    value: `${currency}${total.toLocaleString()}`,     highlight: false },
              { label: "Payment",        value: paymentMethod,                               highlight: false },
              { label: "Delivering to",  value: deliveryAddress,                             highlight: false },
              ...(savedAmount > 0
                ? [{ label: "You saved", value: `${currency}${savedAmount.toLocaleString()} on this order`, highlight: true }]
                : []),
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-[12px] text-[#7a6e58]">{row.label}</span>
                {row.highlight ? (
                  <span className="text-[11px] font-semibold text-[#27500a] bg-[#eaf7e0] border border-[#b0d890] px-2.5 py-0.5 rounded-full">
                    {row.value}
                  </span>
                ) : (
                  <span className="text-[12px] font-semibold text-[#1a2e1a]">{row.value}</span>
                )}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="oc-r6 flex gap-2.5">
            <Link
              to="/my-orders"
              className="flex-1 h-11 flex items-center justify-center gap-1.5 bg-[#f5f0e8] text-[#4a3e2a] border border-[#ded6c8] rounded-[12px] text-[13px] font-semibold hover:bg-[#ede8da] hover:border-[#c8bfaa] transition-all active:scale-[0.97]"
            >
              <OrderIcon /> View order
            </Link>
            <Link
              to="/products"
              className="flex-1 h-11 flex items-center justify-center gap-1.5 bg-[#1a2e1a] text-[#d4eecc] rounded-[12px] text-[13px] font-semibold hover:bg-[#2a4a28] transition-all active:scale-[0.97]"
            >
              <CartIcon /> Shop more
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;