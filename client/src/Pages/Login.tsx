import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import {toast} from "sonner";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAppContext();

  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isSignup ? "/api/user/signup" : "/api/user/login";
      const { data } = await axios.post(url, form);
      if (data.success) {
        toast.success(data.message || "Success");
        setUser(data.user);
        const redirectTo = location.state?.from?.pathname || "/";
        navigate(redirectTo, { replace: true });
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignup((v) => !v);
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex font-sans bg-[#FAFAF7]">
      {/* Left decorative panel - hidden on mobile, shown on large screens */}
      <div className="hidden lg:flex lg:flex-[0_0_420px] bg-[#1A2B1A] p-12 flex-col justify-center relative overflow-hidden">
        <div className="flex flex-col gap-5 relative z-10">
          <span className="font-['Fraunces',_Georgia,_serif] text-xl text-[#A8D8B4] font-semibold tracking-tight">
            🌿 BlinkBasket
          </span>
          <h2 className="font-['Fraunces',_Georgia,_serif] text-[34px] font-semibold text-[#E8F5EE] leading-tight tracking-tight m-0">
            Fresh groceries,<br />delivered to your door
          </h2>
          <p className="text-[15px] text-[#7BAF89] leading-relaxed m-0">
            Organic produce, local farms,<br />same-day delivery.
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {[
              { icon: "🥦", text: "Organic" },
              { icon: "🚚", text: "Same day" },
              { icon: "❄️", text: "Cold chain" },
              { icon: "♻️", text: "Eco pack" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full py-1.5 px-3.5 text-[13px]"
              >
                <span>{icon}</span>
                <span className="text-[#A8D8B4] font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-6">
        <div className="w-full max-w-[440px] flex flex-col">
          {/* Back link */}
          <button
            onClick={() => navigate("/")}
            className="bg-none border-none text-[13px] text-[#999] cursor-pointer p-0 font-sans mb-6 self-start transition-colors hover:text-[#333]"
          >
            ← Back to store
          </button>

          {/* Icon + heading */}
          <div className="flex flex-col gap-1 mb-6">
            <span className="text-4xl mb-1">{isSignup ? "🛒" : "👋"}</span>
            <h1 className="font-['Fraunces',_Georgia,_serif] text-[28px] font-semibold text-[#1A2B1A] tracking-tight m-0">
              {isSignup ? "Create account" : "Welcome back"}
            </h1>
            <p className="text-[13px] text-[#999] m-0">
              {isSignup
                ? "Sign up to start ordering fresh groceries"
                : "Login to your BlinkBasket account"}
            </p>
          </div>

          {/* Toggle tabs */}
          <div className="flex bg-[#EDEEE8] rounded-xl p-[3px] gap-[3px] mb-6">
            {["Login", "Sign up"].map((label, i) => {
              const active = isSignup === (i === 1);
              return (
                <button
                  key={label}
                  onClick={() => setIsSignup(i === 1)}
                  className={`flex-1 h-9 rounded-lg border-none text-[13px] font-medium cursor-pointer font-sans transition-all ${
                    active
                      ? "bg-white text-[#1A2B1A] shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                      : "bg-transparent text-[#888]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
            {isSignup && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#555] tracking-wide">
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full h-[46px] px-3.5 rounded-xl border-[1.5px] border-[#EDEEE8] bg-[#FAFAF7] text-sm font-sans text-[#1A2B1A] outline-none transition-all placeholder:text-[#ccc] focus:border-[#2E7D4F] focus:bg-white focus:shadow-[0_0_0_3px_rgba(46,125,79,0.10)]"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#555] tracking-wide">
                Email address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full h-[46px] px-3.5 rounded-xl border-[1.5px] border-[#EDEEE8] bg-[#FAFAF7] text-sm font-sans text-[#1A2B1A] outline-none transition-all placeholder:text-[#ccc] focus:border-[#2E7D4F] focus:bg-white focus:shadow-[0_0_0_3px_rgba(46,125,79,0.10)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#555] tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full h-[46px] px-3.5 pr-11 rounded-xl border-[1.5px] border-[#EDEEE8] bg-[#FAFAF7] text-sm font-sans text-[#1A2B1A] outline-none transition-all placeholder:text-[#ccc] focus:border-[#2E7D4F] focus:bg-white focus:shadow-[0_0_0_3px_rgba(46,125,79,0.10)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[15px] p-0 leading-none"
                  tabIndex={-1}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {!isSignup && (
              <div className="text-right -mt-1">
                <button
                  type="button"
                  className="bg-none border-none text-[12px] text-[#2E7D4F] cursor-pointer font-sans font-medium p-0 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`mt-1 w-full h-[50px] rounded-xl bg-[#2E7D4F] text-white text-[15px] font-semibold font-sans border-none cursor-pointer tracking-wide transition-all hover:bg-[#1B5E36] hover:-translate-y-px active:scale-[0.99] disabled:bg-[#aaa] disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2.5">
                  <span className="spinner w-[18px] h-[18px] rounded-full border-[2.5px] border-white/35 border-t-white inline-block animate-spin" />
                  {isSignup ? "Creating account…" : "Logging in…"}
                </span>
              ) : isSignup ? (
                "Create account →"
              ) : (
                "Login →"
              )}
            </button>
          </form>

          {/* Switch mode */}
          <p className="mt-[18px] text-[13px] text-[#999] text-center">
            {isSignup ? "Already have an account?" : "New to BlinkBasket?"}
            <button
              onClick={switchMode}
              className="bg-none border-none text-[13px] text-[#2E7D4F] font-semibold cursor-pointer font-sans ml-1.5 p-0 hover:underline"
            >
              {isSignup ? "Login" : "Create account"}
            </button>
          </p>

          {/* Trust note */}
          <p className="mt-4 text-[11px] text-[#bbb] text-center font-sans">
            🔒 Your data is secure and never shared.
          </p>
        </div>
      </div>

      {/* Global styles for animations and font imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=DM+Sans:wght@400;500;600&display=swap');
        
        .spinner {
          animation: spin 0.75s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;