// Payment.tsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";

// ── Types ──────────────────────────────────────────────
interface PaymentLocationState {
  orderId: string;
  amount: number;
  currency: string;
  deliveryAddress?: string;
  savedAmount?: number;
  paymentMethod?: string;
}

type Step = "select" | "processing" | "success";
type Tab = "upi" | "qr";

// ── UPI Apps ───────────────────────────────────────────
const UPI_APPS = [
  {
    name: "GPay",
    color: "#4285F4",
    bg: "#EAF1FF",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22.5 12c0-5.8-4.7-10.5-10.5-10.5S1.5 6.2 1.5 12 6.2 22.5 12 22.5 22.5 17.8 22.5 12z" fill="#4285F4"/>
        <path d="M12 6.5c1.5 0 2.8.5 3.8 1.4l2.8-2.8C16.9 3.5 14.6 2.5 12 2.5 8 2.5 4.5 4.9 3 8.4l3.3 2.5C7 8.7 9.3 6.5 12 6.5z" fill="#EA4335"/>
        <path d="M12 17.5c-2.7 0-5-1.7-5.7-4.1L3 15.9c1.5 3.4 5 5.6 9 5.6 2.5 0 4.8-.9 6.5-2.5l-3.1-2.4c-.9.6-2.1.9-3.4.9z" fill="#34A853"/>
        <path d="M21.5 12c0-.8-.1-1.5-.2-2.2H12v4.2h5.3c-.2 1.1-.9 2-1.9 2.6l3.1 2.4c1.8-1.7 2.9-4.2 2.9-7z" fill="#FBBC05"/>
      </svg>
    ),
  },
  {
    name: "PhonePe",
    color: "#5F259F",
    bg: "#F3ECFF",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill="#5F259F"/>
        <path d="M7 12l3-4h4l2 3-5 6-4-5z" fill="white"/>
        <circle cx="16" cy="8" r="2" fill="#04C9E2"/>
      </svg>
    ),
  },
  {
    name: "Paytm",
    color: "#002970",
    bg: "#E6F0FF",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#002970"/>
        <path d="M4 12h6v5H4z" fill="#00BAF2"/>
        <path d="M10 7h6v10h-6z" fill="white"/>
        <path d="M16 7h4v5h-4z" fill="#00BAF2"/>
      </svg>
    ),
  },
  {
    name: "BHIM",
    color: "#1A4480",
    bg: "#E8F0FB",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill="#1A4480"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">₹</text>
      </svg>
    ),
  },
  {
    name: "Amazon Pay",
    color: "#FF9900",
    bg: "#FFF6E6",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#232F3E"/>
        <path d="M6 14c0 0 5 3 12 0" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 9h10M7 12h7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

// ── Icons ──────────────────────────────────────────────
const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5a8a54" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#3b8a1a" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const ScanIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="5" height="5" />
    <rect x="16" y="3" width="5" height="5" />
    <rect x="3" y="16" width="5" height="5" />
    <path d="M21 16h-3v3M21 21v-1M16 21h1M8 3H3v5M3 8v5M16 8V3M8 8H3M21 11v5M11 3v5M11 8v5M11 16v5M16 16h5M16 11H8v5M8 11v5M8 16H3" />
  </svg>
);

const UpiIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <path d="M6 15h4M16 15h2" />
  </svg>
);

// ── Processing Spinner ─────────────────────────────────
const ProcessingView = ({ amount, currency }: { amount: number; currency: string }) => {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      <div className="relative w-24 h-24">
        <svg className="animate-spin w-24 h-24" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="#ede8df" strokeWidth="6" />
          <circle
            cx="48" cy="48" r="40"
            fill="none"
            stroke="#1a2e1a"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset="188"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[28px]">₹</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[18px] font-semibold text-[#1a2e1a]">
          Verifying payment{".".repeat(dots)}
        </p>
        <p className="text-[13px] text-[#a0966e] mt-1">
          Processing {currency}{amount.toLocaleString()}
        </p>
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#1a2e1a] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
};

// ── Success View ───────────────────────────────────────
const SuccessView = ({
  orderId,
  amount,
  currency,
  onContinue,
}: {
  orderId: string;
  amount: number;
  currency: string;
  onContinue: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-10 gap-5 text-center">
    <div className="w-20 h-20 rounded-full bg-[#eaf7e0] border-2 border-[#b0d890] flex items-center justify-center">
      <CheckCircleIcon />
    </div>
    <div>
      <h2 className="text-[22px] font-semibold text-[#1a2e1a]">Payment successful!</h2>
      <p className="text-[13px] text-[#a0966e] mt-1">
        {currency}{amount.toLocaleString()} paid
      </p>
    </div>
    <div className="bg-[#f5f0e8] rounded-[14px] px-5 py-3 w-full max-w-xs text-left">
      <p className="text-[10px] text-[#8a7a5e] tracking-[1.2px] uppercase font-medium mb-1">
        Order ID
      </p>
      <p className="text-[13px] font-semibold text-[#1a2e1a] font-mono">{orderId}</p>
    </div>
    <button
      onClick={onContinue}
      className="w-full max-w-xs bg-[#1a2e1a] text-[#d4eecc] py-3.5 rounded-[14px] text-[14px] font-semibold hover:bg-[#2a4a28] active:scale-[0.98] transition-all"
    >
      View order
    </button>
  </div>
);

// ── QR Code Tab ────────────────────────────────────────
const QRTab = ({
  amount,
  currency,
  orderId,
}: {
  amount: number;
  currency: string;
  orderId: string;
}) => {
  const MERCHANT_UPI = import.meta.env.VITE_MERCHANT_UPI || "FreshMert@ybl";
  const MERCHANT_NAME = "Fresh Mart";
  const upiString = `upi://pay?pa=${MERCHANT_UPI}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent("Order " + orderId)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&bgcolor=fffdf9&color=1a2e1a&data=${encodeURIComponent(upiString)}`;

  const [copied, setCopied] = useState(false);

  const copyUpi = () => {
    navigator.clipboard.writeText(MERCHANT_UPI).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      {/* QR Frame */}
      <div className="relative">
        <div className="w-[248px] h-[248px] bg-[#fffdf9] border-[2px] border-[#1a2e1a] rounded-[20px] overflow-hidden flex items-center justify-center p-3 shadow-[0_4px_24px_rgba(26,46,26,0.08)]">
          <img
            src={qrUrl}
            alt="UPI QR Code"
            className="w-full h-full object-contain rounded-[12px]"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Crect width='220' height='220' fill='%23f5f0e8'/%3E%3Ctext x='110' y='115' text-anchor='middle' fill='%231a2e1a' font-size='14' font-family='sans-serif'%3EQRCODE LOADING%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
        {/* Corner dots */}
        {[
          "top-2 left-2",
          "top-2 right-2",
          "bottom-2 left-2",
          "bottom-2 right-2",
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-5 h-5 rounded-[5px] bg-[#1a2e1a]`}
          />
        ))}
      </div>

      {/* Amount badge */}
      <div className="bg-[#eaf7e0] border border-[#b0d890] rounded-full px-4 py-1.5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#3b8a1a] animate-pulse" />
        <span className="text-[13px] font-semibold text-[#27500a]">
          {currency}{amount.toLocaleString()} · Scan to pay
        </span>
      </div>

      {/* Merchant UPI */}
      <div className="w-full bg-[#f5f0e8] rounded-[14px] p-3.5 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-[#8a7a5e] tracking-[1.2px] uppercase font-medium">
            Merchant UPI
          </p>
          <p className="text-[13px] font-semibold text-[#1a2e1a] mt-0.5 font-mono">
            {MERCHANT_UPI}
          </p>
        </div>
        <button
          onClick={copyUpi}
          className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-[8px] transition-all ${
            copied
              ? "bg-[#eaf7e0] text-[#3b8a1a] border border-[#b0d890]"
              : "bg-[#fffdf9] text-[#5a8a54] border border-[#ede8df] hover:border-[#1a2e1a] hover:text-[#1a2e1a]"
          }`}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <CopyIcon />
              Copy
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-[#a0966e] text-center leading-relaxed">
        Open any UPI app and scan this QR code.<br />
        Payment auto-confirms within 30 seconds.
      </p>
    </div>
  );
};

// ── UPI ID Tab ─────────────────────────────────────────
interface UpiIdTabProps {
  amount: number;
  currency: string;
  onPay: (upiId: string, app: string) => void;
}
const UpiIdTab: React.FC<UpiIdTabProps> = ({ amount, currency, onPay }) => {
  const [upiId, setUpiId] = useState("");
  const [selectedApp, setSelectedApp] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateUpi = (id: string) =>
    /^[\w.-]+@[\w]+$/.test(id.trim());

  const handleAppSelect = (name: string, handle: string) => {
    setSelectedApp(name);
    const base = upiId.split("@")[0] || "";
    setUpiId(base ? `${base}${handle}` : "");
    setError("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handlePay = () => {
    const id = upiId.trim();
    if (!id) return setError("Please enter your UPI ID");
    if (!validateUpi(id))
      return setError("Enter a valid UPI ID (e.g. yourname@ybl)");
    setError("");
    onPay(id, selectedApp);
  };

  return (
    <div className="flex flex-col gap-5 py-2">
      {/* App chips */}
      <div>
        <p className="text-[10px] text-[#8a7a5e] tracking-[1.2px] uppercase font-medium mb-2.5">
          Select UPI app
        </p>
        <div className="grid grid-cols-5 gap-2">
          {UPI_APPS.map((app) => (
            <button
              key={app.name}
              onClick={() => handleAppSelect(app.name, getHandle(app.name))}
              className={`flex flex-col items-center gap-1.5 py-2.5 rounded-[12px] border-[1.5px] transition-all ${
                selectedApp === app.name
                  ? "border-[#1a2e1a] bg-[#f0f7ec] scale-[0.97]"
                  : "border-[#ede8df] bg-[#fffdf9] hover:border-[#c8dfc8] hover:bg-[#f5f9f4]"
              }`}
            >
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: app.bg }}>
                {app.icon}
              </div>
              <span className="text-[9px] font-semibold text-[#4a3e2a] text-center leading-none">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* UPI ID input */}
      <div>
        <p className="text-[10px] text-[#8a7a5e] tracking-[1.2px] uppercase font-medium mb-2">
          Your UPI ID
        </p>
        <div className="relative">
          <input
            ref={inputRef}
            value={upiId}
            onChange={(e) => {
              setUpiId(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handlePay()}
            placeholder="yourname@ybl"
            className={`w-full h-12 border-[1.5px] ${
              error ? "border-[#c05050]" : "border-[#ede8df] focus:border-[#1a2e1a]"
            } rounded-[12px] px-4 pr-12 text-[13px] text-[#1a2e1a] bg-[#fffdf9] placeholder-[#c8bfaa] outline-none transition-colors font-mono tracking-wide`}
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-[#a0966e]">
            UPI
          </span>
        </div>
        {error && (
          <p className="text-[11px] text-[#a32d2d] mt-1.5 pl-0.5">{error}</p>
        )}
        <p className="text-[11px] text-[#a0966e] mt-1.5">
          You'll receive a payment request on your UPI app
        </p>
      </div>

      {/* Pay button */}
      <button
        onClick={handlePay}
        disabled={!upiId.trim()}
        className="w-full flex items-center justify-center gap-2 bg-[#1a2e1a] text-[#d4eecc] py-3.5 rounded-[14px] text-[14px] font-semibold hover:bg-[#2a4a28] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Pay {currency}{amount.toLocaleString()}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

// Helper: get UPI handle by app name
function getHandle(name: string): string {
  const handles: Record<string, string> = {
    GPay: "@okicici",
    PhonePe: "@ybl",
    Paytm: "@paytm",
    BHIM: "@upi",
    "Amazon Pay": "@apl",
  };
  return handles[name] || "@upi";
}

// ── Main Payment Page ──────────────────────────────────
const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useAppContext();
  const state = location.state as PaymentLocationState | null;

  const [tab, setTab] = useState<Tab>("upi");
  const [step, setStep] = useState<Step>("select");
  const [txnRef, setTxnRef] = useState("");

  // Guard: no state → go back to cart
  useEffect(() => {
    if (!state?.orderId || !state?.amount) {
      navigate("/cart");
    }
  }, [state, navigate]);

  if (!state?.orderId) return null;

  const { orderId, amount, currency = "₹", deliveryAddress, savedAmount = 0 } = state;

  const handleUpiPay = async (upiId: string, app: string) => {
    setStep("processing");
    try {
      // Call backend to verify / confirm payment
      const { data } = await axios.post("/api/payment/verify", {
        orderId,
        upiId,
        amount,
        app,
      });
      if (data.success) {
        await clearCart();
        setTxnRef(data.txnRef || `UPI${Date.now()}`);
        setTimeout(() => setStep("success"), 1200);
      } else {
        toast.error(data.message || "Payment verification failed");
        setStep("select");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Payment failed. Please try again.");
      setStep("select");
    }
  };

  const handleQrPaid = async () => {
    setStep("processing");
    try {
      const { data } = await axios.post("/api/payment/verify", {
        orderId,
        upiId: "qr-scan",
        amount,
        app: "QR",
      });
      if (data.success) {
        await clearCart();
        setTxnRef(data.txnRef || `QR${Date.now()}`);
        setTimeout(() => setStep("success"), 1200);
      } else {
        toast.error(data.message || "Payment not received yet");
        setStep("select");
      }
    } catch {
      toast.error("Could not verify payment. Please try again.");
      setStep("select");
    }
  };

  const handleContinue = () => {
    navigate("/confirmation", {
      state: {
        orderId,
        total: amount,
        currency,
        paymentMethod: "Online (UPI)",
        deliveryAddress,
        savedAmount,
        txnRef,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-start justify-center pt-20 pb-16 px-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        {step === "select" && (
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-1.5 text-[13px] text-[#7a6e58] hover:text-[#1a2e1a] font-medium mb-4 transition-colors"
          >
            <ArrowLeft /> Back to cart
          </button>
        )}

        <div className="bg-[#fffdf9] rounded-[24px] border border-[#ede8df] overflow-hidden shadow-[0_4px_32px_rgba(26,46,26,0.06)]">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#ede8df]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[17px] font-semibold text-[#1a2e1a]">
                  {step === "select"
                    ? "Complete payment"
                    : step === "processing"
                    ? "Processing…"
                    : "Payment done!"}
                </h1>
                {step === "select" && (
                  <p className="text-[12px] text-[#a0966e] mt-0.5">
                    Order #{orderId.slice(-8).toUpperCase()}
                  </p>
                )}
              </div>
              {/* Amount pill */}
              {step === "select" && (
                <div className="bg-[#1a2e1a] text-[#c4e8b4] rounded-[10px] px-3.5 py-2 text-right">
                  <p className="text-[10px] tracking-wider opacity-70">PAY</p>
                  <p className="text-[16px] font-semibold leading-none mt-0.5">
                    {currency}{amount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {step === "processing" && (
              <ProcessingView amount={amount} currency={currency} />
            )}
            {step === "success" && (
              <SuccessView
                orderId={orderId}
                amount={amount}
                currency={currency}
                onContinue={handleContinue}
              />
            )}

            {step === "select" && (
              <>
                {/* Tab switcher */}
                <div className="flex bg-[#f5f0e8] rounded-[14px] p-1 mb-5">
                  {(
                    [
                      { key: "upi", label: "UPI ID", Icon: UpiIcon },
                      { key: "qr", label: "Scan QR", Icon: ScanIcon },
                    ] as const
                  ).map(({ key, label, Icon }) => (
                    <button
                      key={key}
                      onClick={() => setTab(key)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] text-[13px] font-medium transition-all ${
                        tab === key
                          ? "bg-[#fffdf9] text-[#1a2e1a] shadow-sm border border-[#ede8df]"
                          : "text-[#7a6e58] hover:text-[#1a2e1a]"
                      }`}
                    >
                      <Icon />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {tab === "upi" ? (
                  <UpiIdTab
                    amount={amount}
                    currency={currency}
                    onPay={handleUpiPay}
                  />
                ) : (
                  <>
                    <QRTab
                      amount={amount}
                      currency={currency}
                      orderId={orderId}
                    />
                    {/* "I've paid" button */}
                    <button
                      onClick={handleQrPaid}
                      className="w-full mt-4 bg-[#1a2e1a] text-[#d4eecc] py-3.5 rounded-[14px] text-[14px] font-semibold hover:bg-[#2a4a28] active:scale-[0.98] transition-all"
                    >
                      I've completed payment
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Security footer */}
          {step === "select" && (
            <div className="px-6 pb-5 pt-0">
              <div className="flex items-center justify-center gap-2 text-[11px] text-[#a0966e]">
                <ShieldIcon />
                Secured by UPI · 256-bit encryption · No card data stored
              </div>
            </div>
          )}
        </div>

        {/* Powered by */}
        {step === "select" && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-1.5">
              {["GPay", "PhonePe", "Paytm", "BHIM"].map((a) => (
                <div
                  key={a}
                  className="w-6 h-6 rounded-full bg-[#fffdf9] border border-[#ede8df] flex items-center justify-center"
                >
                  <span className="text-[7px] font-bold text-[#4a3e2a]">
                    {a[0]}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-[11px] text-[#b8aa90]">
              All UPI apps accepted
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;