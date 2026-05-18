import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAppContext } from "@/context/AppContext";
import { useLocation } from "react-router-dom";

const keyframesStyle = `
  @keyframes sl-slide-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes sl-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

const SellerLogin: React.FC = () => {
  const { sellerLogin, setShowSellerLogin, navigate, isSeller } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const isInitialMount = useRef(true);

  const isStandalonePage = location.pathname === "/api/seller/login";

  useEffect(() => {
    if (!isStandalonePage) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setShowSellerLogin(false);
          navigate(-1);
        }
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [setShowSellerLogin, navigate, isStandalonePage]);

  useEffect(() => {
    if (!isInitialMount.current && isSeller && location.pathname !== "/seller") {
      navigate("/seller");
    }
    isInitialMount.current = false;
  }, [isSeller, navigate, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sellerLogin(email, password);
      if (!isStandalonePage) setShowSellerLogin(false);
      navigate("/seller");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    if (!isStandalonePage) {
      setShowSellerLogin(false);
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [isStandalonePage, setShowSellerLogin, navigate]);

  // ✅ Inline card JSX — no nested component definition
  const card = (
    <div className="font-['DM_Sans'] bg-white border border-[#e8e8e4] rounded-xl w-full max-w-[380px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.10)] animate-[sl-slide-up_0.2s_ease]">
      {/* Header */}
      <div className="px-7 pt-7 pb-5 border-b border-[#f0f0ec] flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="font-['DM_Mono'] text-[10px] tracking-[0.12em] uppercase text-[#aaa]">
            Seller Portal
          </span>
          <h2 className="text-[17px] font-medium text-[#1a1a1a] tracking-[-0.01em]">
            Sign in
          </h2>
        </div>
        <button
          onClick={handleClose}
          className="w-[30px] h-[30px] rounded-md border border-[#e8e8e4] bg-transparent flex items-center justify-center cursor-pointer text-[#999] hover:bg-[#f2f2ef] hover:text-[#1a1a1a] transition-all flex-shrink-0"
          aria-label="Close"
          type="button"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form */}
      <form className="px-7 pt-6 pb-7 flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sl-email" className="font-['DM_Mono'] text-[10px] font-medium tracking-[0.1em] uppercase text-[#aaa]">
            Email
          </label>
          <input
            id="sl-email"
            type="email"
            className="font-['DM_Sans'] text-[13.5px] text-[#1a1a1a] bg-[#fafaf8] border border-[#e0e0db] rounded-md px-3 py-2.5 outline-none w-full transition-all focus:border-[#1a1a1a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,26,26,0.06)] disabled:opacity-50 disabled:cursor-not-allowed"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seller@example.com"
            required
            disabled={loading}
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="sl-password" className="font-['DM_Mono'] text-[10px] font-medium tracking-[0.1em] uppercase text-[#aaa]">
            Password
          </label>
          <div className="relative">
            <input
              id="sl-password"
              type={showPassword ? "text" : "password"}
              className="font-['DM_Sans'] text-[13.5px] text-[#1a1a1a] bg-[#fafaf8] border border-[#e0e0db] rounded-md px-3 py-2.5 pr-10 outline-none w-full transition-all focus:border-[#1a1a1a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,26,26,0.06)] disabled:opacity-50 disabled:cursor-not-allowed"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#bbb] p-0.5 flex transition-colors hover:text-[#666]"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {!isStandalonePage && (
            <p className="text-[11.5px] text-[#aaa] -mt-1">
              Credentials are set in your environment config.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="font-['DM_Sans'] text-[13.5px] font-medium text-white bg-[#1a1a1a] border-none rounded-md py-2.5 px-0 w-full cursor-pointer transition-opacity hover:opacity-80 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
              Signing in…
            </>
          ) : (
            "Sign in to Dashboard"
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="px-7 py-3.5 bg-[#fafaf8] border-t border-[#f0f0ec] text-center text-xs text-[#aaa]">
        Not a seller?{" "}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!isStandalonePage) setShowSellerLogin(false);
            navigate("/");
          }}
          className="text-[#1a1a1a] font-medium no-underline border-b border-[#d0d0ca] hover:border-[#1a1a1a] transition-colors bg-transparent cursor-pointer"
        >
          Back to store
        </button>
      </div>
    </div>
  );

  if (isStandalonePage) {
    return (
      <>
        <style>{keyframesStyle}</style>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5">
          {card}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{keyframesStyle}</style>
      <div
        className="fixed inset-0 bg-black/35 flex items-center justify-center z-50 p-4 animate-[sl-fade-in_0.15s_ease]"
        onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      >
        {card}
      </div>
    </>
  );
};

export default SellerLogin;