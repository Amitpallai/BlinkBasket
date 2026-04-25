import React, { useState } from "react";
import { useInView } from "../hooks/useInView";

const TRUST = [
  {
    icon: "🌱",
    title: "100% Organic",
    desc: "Every product certified",
    color: "#d1fae5",
    iconBg: "#bbf7d0",
  },
  {
    icon: "⚡",
    title: "2-hour Delivery",
    desc: "In select pin codes",
    color: "#fef9c3",
    iconBg: "#fef08a",
  },
  {
    icon: "↩️",
    title: "Easy Returns",
    desc: "No questions asked",
    color: "#dbeafe",
    iconBg: "#bfdbfe",
  },
  {
    icon: "🔒",
    title: "Secure Payments",
    desc: "256-bit encryption",
    color: "#fce7f3",
    iconBg: "#fbcfe8",
  },
];

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(false);
  const { ref: trustRef, inView: trustInView } = useInView(0.15);
  const { ref: formRef, inView: formInView } = useInView(0.2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSent(true);
      setEmail("");
    }
  };

  return (
    <>
      <style>{`
        @keyframes trustCard {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes formReveal {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes checkBounce {
          0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
          60%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
          80%  { transform: scale(0.92); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .trust-card {
          opacity: 0;
          transform: translateY(20px) scale(0.97);
        }
        .trust-card.visible {
          animation: trustCard 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .form-section {
          opacity: 0;
          transform: translateY(24px);
        }
        .form-section.visible {
          animation: formReveal 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .success-icon {
          animation: checkBounce 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .subscribe-btn {
          transition: background 0.25s, transform 0.2s, box-shadow 0.2s;
        }
        .subscribe-btn:hover {
          background: #3a6b4a;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(58,107,74,0.28);
        }
        .subscribe-btn:active {
          transform: translateY(0);
        }
        .email-input-wrap {
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .email-input-wrap.focused {
          border-color: #3a6b4a;
          box-shadow: 0 0 0 3px rgba(58,107,74,0.1);
        }
      `}</style>

      {/* ── Trust Bar ─────────────────────────────────────────────── */}
      <section
        className=" py-14  bg-[#F7F6F2]"
        style={{
          borderTop: "1px solid #F7F6F2",
          borderBottom: "1px solid #F7F6F2",
        }}
      >
        <div
          ref={trustRef}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-5 px-6 sm:grid-cols-2 lg:grid-cols-4 md:px-10 lg:px-6"
        >
          {TRUST.map((t, i) => (
            <div
              key={t.title}
              className={`trust-card flex items-center gap-4 rounded-2xl p-4 ${
                trustInView ? "visible" : ""
              }`}
              style={{
                background: t.color,
                animationDelay: `${i * 90}ms`,
              }}
            >
              <span
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg"
                style={{ background: t.iconBg }}
              >
                {t.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1a1916]">
                  {t.title}
                </p>
                <p className="text-xs text-[#6b6860] mt-0.5">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24"
        style={{ background: "linear-gradient(160deg, #eaf2ec 0%, #f3f8f4 60%, #eef6f0 100%)" }}
      >
        {/* Decorative blobs */}
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, #a7f3c0 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #6ee7a7 0%, transparent 70%)",
          }}
        />

        <div
          ref={formRef}
          className={`form-section relative z-10 mx-auto max-w-lg px-6 text-center ${
            formInView ? "visible" : ""
          }`}
        >
          {/* Label */}
          <p className="mb-5 inline-flex items-center justify-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#3a6b4a]">
            <span className="h-px w-7 bg-[#3a6b4a]" />
            Stay fresh
            <span className="h-px w-7 bg-[#3a6b4a]" />
          </p>

          {/* Headline */}
          <h2
            className="mb-3 font-serif text-3xl font-semibold leading-[1.15] text-[#1a1916] lg:text-[2.6rem]"
            style={{ letterSpacing: "-0.01em" }}
          >
            Get{" "}
            <em className="italic text-[#3a6b4a]">seasonal picks</em>
            <br />
            in your inbox
          </h2>

          <p className="mb-10 text-[15px] leading-[1.75] text-[#4a4740]">
            Weekly harvest notes, exclusive discounts, and recipes — straight
            from our farms to your inbox. Unsubscribe anytime.
          </p>

          {/* Form / Success */}
          {sent ? (
            <div className="flex flex-col items-center gap-3">
              <span
                className="success-icon flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                style={{ background: "#dcfce7" }}
              >
                ✅
              </span>
              <p className="text-base font-semibold text-[#166534]">
                You're in! Watch your inbox.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-1 text-xs text-[#6b6860] underline underline-offset-2 hover:text-[#3a6b4a] transition-colors"
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            <form
              className="mb-4 flex flex-col gap-2.5 sm:flex-row"
              onSubmit={handleSubmit}
              noValidate
            >
              <div
                className={`email-input-wrap flex flex-1 items-center gap-2 rounded-full border border-[#d8d4cc] bg-white px-5 ${
                  focused ? "focused" : ""
                }`}
              >
                <svg
                  className="h-4 w-4 flex-shrink-0 text-[#9e9b95]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  className="flex-1 bg-transparent py-3.5 text-sm text-[#1a1916] placeholder:text-[#b0aca4] focus:outline-none"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  required
                />
              </div>
              <button
                type="submit"
                className="subscribe-btn rounded-full bg-[#1a1916] px-7 py-3.5 text-sm font-semibold tracking-[0.05em] text-white"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[11px] tracking-[0.04em] text-[#a09c96]">
            No spam, ever. We respect your inbox.
          </p>

          {/* Social proof */}
          <div className="mt-7 flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              {["#f9a8d4", "#86efac", "#93c5fd", "#fcd34d"].map((c, i) => (
                <span
                  key={i}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs"
                  style={{ background: c }}
                >
                  {["😊", "🙂", "😄", "😁"][i]}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#6b6860]">
              <strong className="font-semibold text-[#1a1916]">2,400+</strong>{" "}
              subscribers already
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Newsletter;