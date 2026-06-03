import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { IoCartOutline, IoMenu, IoClose, IoSearchSharp } from "react-icons/io5";
import { MdOutlineAccountCircle } from "react-icons/md";
import { useAppContext } from "@/context/AppContext";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, getCartCount } = useAppContext();

  // Shrink navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition-colors duration-200 pb-0.5 ${
      isActive
        ? "text-green-700"
        : "text-gray-600 hover:text-green-700"
    }`;

  return (
    <>
      <style>{`
        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          right: 0;
          height: 2px;
          background: #15803d;
          border-radius: 999px;
        }
        @keyframes mobileMenuIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .mobile-menu-open {
          animation: mobileMenuIn 0.22s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dropdown-open {
          animation: dropIn 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }
        .cart-badge {
          animation: cartPop 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes cartPop {
          0%  { transform: scale(0.5); }
          70% { transform: scale(1.2); }
          100%{ transform: scale(1); }
        }
      `}</style>

      <nav
        className={`fixed left-0 right-0 top-0 z-50 px-3 transition-all duration-300 sm:px-4 md:px-6 ${
          scrolled ? "top-0 pt-2" : "pt-3"
        }`}
      >
        {/* ── Main Bar ────────────────────────────────────────────── */}
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-gray-200/80 bg-white/92 px-4 py-2.5 backdrop-blur-md sm:px-5 md:px-6 transition-all duration-300 ${
            scrolled ? "shadow-md" : "shadow-sm"
          }`}
        >
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 rounded-xl bg-green-700 px-3.5 py-2 text-sm font-semibold text-white transition-all hover:bg-green-800 hover:shadow-md active:scale-95 sm:px-4"
            aria-label="Go home"
          >
            <span className="h-2 w-2 rounded-full bg-white/90 transition-transform group-hover:scale-125" />
            <span className="hidden xs:block">BlinkBasket</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 lg:flex">
            {[
              { to: "/", label: "Home" },
              { to: "/products", label: "Products" },
              { to: "/about", label: "About" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `${navLinkClass({ isActive })} ${isActive ? "nav-link-active" : ""}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <button
              onClick={() => navigate("/products")}
              className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-green-700 active:scale-95"
              aria-label="Search products"
            >
              <IoSearchSharp className="text-[18px]" />
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-green-700 active:scale-95"
              aria-label={`Cart — ${getCartCount()} items`}
            >
              <IoCartOutline className="text-[22px]" />
              {getCartCount() > 0 && (
                <span
                  key={getCartCount()} // re-mount triggers animation
                  className="cart-badge absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white"
                >
                  {getCartCount() > 9 ? "9+" : getCartCount()}
                </span>
              )}
            </button>

            {/* Desktop Auth */}
            {!user ? (
              <button
                onClick={() => navigate("/login")}
                className="hidden rounded-xl bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800 hover:shadow-md active:scale-95 sm:block"
              >
                Login
              </button>
            ) : (
              <div ref={dropdownRef} className="relative hidden sm:block">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 transition hover:bg-gray-100 active:scale-95"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <MdOutlineAccountCircle className="text-[22px] text-gray-700" />
                  <span className="max-w-[88px] truncate text-sm font-medium text-gray-700">
                    {user.name || "Account"}
                  </span>
                  <svg
                    className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="dropdown-open absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                    {/* User info header */}
                    <div className="border-b border-gray-50 px-4 py-3">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                        Signed in as
                      </p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-gray-800">
                        {user.name || "Account"}
                      </p>
                    </div>
                    <div className="p-1.5">
                      <NavLink
                        to="/my-orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-green-700"
                      >
                        <svg className="h-4 w-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round"/>
                        </svg>
                        My Orders
                      </NavLink>
                      <NavLink
                        to="/transactions"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-green-700"
                      >
                        <svg className="h-4 w-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M4 7h16M4 12h10M4 17h7M19 17l2 2 3-3" strokeLinecap="round"/>
                        </svg>
                        Transactions
                      </NavLink>
                      <NavLink
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-green-700"
                      >
                        <svg className="h-4 w-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round"/>
                        </svg>
                        Profile
                      </NavLink>
                      <button
                        onClick={() => { setDropdownOpen(false); logout(); }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50"
                      >
                        <svg className="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round"/>
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-xl p-2 text-gray-700 transition hover:bg-gray-100 active:scale-95 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? (
                <IoClose className="text-[22px]" />
              ) : (
                <IoMenu className="text-[22px]" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ─────────────────────────────────────────── */}
        {open && (
          <div className="mobile-menu-open mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl lg:hidden">
            <div className="flex flex-col divide-y divide-gray-50">
              {[
                { to: "/", label: "Home", icon: "🏠" },
                { to: "/products", label: "Products", icon: "🛒" },
                { to: "/about", label: "About", icon: "💚" },
              ].map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <span>{icon}</span>
                  {label}
                </NavLink>
              ))}
            </div>

            <div className="p-4">
              {!user ? (
                <button
                  onClick={() => { setOpen(false); navigate("/login"); }}
                  className="w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white transition hover:bg-green-800 active:scale-[0.98]"
                >
                  Login
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setOpen(false); navigate("/my-orders"); }}
                    className="w-full rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-200 active:scale-[0.98]"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => { setOpen(false); navigate("/profile"); }}
                    className="w-full rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-200 active:scale-[0.98]"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { setOpen(false); logout(); }}
                    className="w-full rounded-xl bg-red-500 py-3 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-[0.98]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;