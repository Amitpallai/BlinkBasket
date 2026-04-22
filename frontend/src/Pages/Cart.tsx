// Cart.tsx
import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  category?: string;
  image: string[];
  offerPrice: number;
  weight?: string;
  inStock: boolean;
}
interface CartItem extends Product {
  quantity: number;
}
interface Address {
  _id: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
}

// ── Coupon config ──────────────────────────────────────
const COUPONS: Record<string, { pct: number; label: string }> = {
  BLENES20: { pct: 20, label: "20% off your order" },
  FRESH10: { pct: 10, label: "10% off fresh picks" },
  NEWUSER: { pct: 15, label: "15% off for new users" },
};
const COUPON_CHIPS = Object.keys(COUPONS);

// ── Icons ──────────────────────────────────────────────
const ArrowRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const EditIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#5a8a54"
    strokeWidth="2.5"
  >
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const CheckIcon = ({ color = "#3b6d11" }: { color?: string }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const CloseIcon = ({ color = "#c07070" }: { color?: string }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const TagIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#5a8a54"
    strokeWidth="2"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

// ── Empty State ────────────────────────────────────────
const EmptyCart = ({ onShop }: { onShop: () => void }) => (
  <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center justify-center text-center px-4">
    <div className="w-24 h-24 bg-[#fffdf9] border border-[#ede8df] rounded-3xl flex items-center justify-center mb-6">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#b8aa90"
        strokeWidth="1.5"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
    </div>
    <h2 className="text-2xl font-semibold text-[#1a2e1a] tracking-tight mb-2">
      Your cart is empty
    </h2>
    <p className="text-sm text-[#a0966e] mb-8">
      Add some fresh items to get started
    </p>
    <button
      onClick={onShop}
      className="flex items-center gap-2 bg-[#1a2e1a] text-[#d4eecc] px-6 py-3 rounded-[14px] text-sm font-medium hover:bg-[#2a4a28] transition-colors"
    >
      Continue shopping <ArrowRight />
    </button>
  </div>
);

// ── Coupon Section ─────────────────────────────────────
interface CouponSectionProps {
  currency: string;
  subtotalAfterDiscount: number;
  onCouponApplied: (saving: number, code: string) => void;
  onCouponRemoved: () => void;
}
const CouponSection: React.FC<CouponSectionProps> = ({
  currency,
  subtotalAfterDiscount,
  onCouponApplied,
  onCouponRemoved,
}) => {
  const [input, setInput] = useState("");
  const [applied, setApplied] = useState<{
    code: string;
    pct: number;
    label: string;
  } | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const apply = () => {
    const code = input.trim().toUpperCase();
    if (!code) return;
    const coupon = COUPONS[code];
    if (coupon) {
      setApplied({ code, ...coupon });
      setError("");
      onCouponApplied(
        Math.round((subtotalAfterDiscount * coupon.pct) / 100),
        code,
      );
    } else {
      setError("Invalid code. Try: " + COUPON_CHIPS.join(", "));
    }
  };

  const remove = () => {
    setApplied(null);
    setInput("");
    setError("");
    onCouponRemoved();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div>
      <p className="text-[10px] text-[#8a7a5e] tracking-[1.2px] uppercase font-medium mb-2.5 flex items-center gap-1.5">
        <TagIcon /> Coupon code
      </p>

      {applied ? (
        <div className="flex items-center justify-between bg-[#eaf7e0] border border-[#b0d890] rounded-[12px] px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            <CheckIcon />
            <div>
              <span className="text-[12px] font-bold text-[#1a2e1a] tracking-wider">
                {applied.code}
              </span>
              <p className="text-[11px] text-[#3b6d11] mt-0.5">
                {applied.label}
              </p>
            </div>
          </div>
          <button
            onClick={remove}
            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#c8e8b8] transition-colors"
            aria-label="Remove coupon"
          >
            <CloseIcon color="#5a7a54" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value.toUpperCase());
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              placeholder="Enter coupon code"
              maxLength={20}
              className="flex-1 h-11 border-[1.5px] border-[#ede8df] focus:border-[#1a2e1a] rounded-[12px] px-3.5 text-[13px] text-[#1a2e1a] bg-[#fffdf9] placeholder-[#c8bfaa] tracking-wider outline-none transition-colors"
            />
            <button
              onClick={apply}
              disabled={!input.trim()}
              className="h-11 px-5 bg-[#1a2e1a] text-[#c4e8b4] text-[13px] font-semibold rounded-[12px] hover:bg-[#2a4a28] active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
          {error && (
            <p className="text-[11px] text-[#a32d2d] mt-2 pl-1">{error}</p>
          )}
          <div className="flex gap-1.5 flex-wrap mt-2.5">
            {COUPON_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setInput(chip);
                  setError("");
                }}
                className="bg-[#f5f0e8] border border-[#ded6c8] rounded-[8px] px-2.5 py-1 text-[11px] font-semibold text-[#4a3e2a] tracking-wider hover:bg-[#fffdf9] hover:border-[#1a2e1a] hover:text-[#1a2e1a] transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────
const Cart: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    products,
    cartItems,
    clearCart,
    currency,
    removeCart,
    updateCart,
    getCartCount,
    getCartAmount,
  } = useAppContext();

  const [cartArray, setCartArray] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addressMessage, setAddressMessage] = useState("");
  const [paymentOption, setPaymentOption] = useState<"COD" | "Online">("COD");
  const [loading, setLoading] = useState(false);
  const [couponSaving, setCouponSaving] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  const getCart = () => {
    const temp: CartItem[] = [];
    for (const key in cartItems) {
      const product = products.find((p) => p._id === key);
      if (product)
        temp.push({
          ...product,
          image: product.image || [],
          quantity: cartItems[key],
        });
    }
    setCartArray(temp);
  };

  const fetchAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        const list: Address[] = Array.isArray(data.address) ? data.address : [];
        setAddresses(list);

        if (list.length > 0) {
          setSelectedAddress(list[0]);
          setAddressMessage("");
        } else {
          setSelectedAddress(null);
          setAddressMessage("No delivery address saved yet. Add one to continue.");
        }
        return;
      }

      setAddresses([]);
      setSelectedAddress(null);
      setAddressMessage(data.message || "Please add a delivery address to continue.");
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setAddresses([]);
        setSelectedAddress(null);
        setAddressMessage("No delivery address saved yet. Add one to continue.");
        return;
      }
      setAddressMessage("Could not load saved addresses right now.");
      toast.error("Could not load address. Please try again.");
    }
  };

  // ✅ Cart.tsx → placeOrder function
// Send finalTotal as amount to backend

// ─────────────────────────────────────────────────────────────
// REPLACE your existing `placeOrder` function in Cart.tsx with:
// ─────────────────────────────────────────────────────────────

const placeOrder = async () => {
  if (!selectedAddress) {
    return toast.error("Please select a delivery address");
  }

  setLoading(true);

  try {
    // ── ONLINE: create pending order → navigate to /payment ──
    if (paymentOption === "Online") {
      const { data } = await axios.post("/api/payment/initiate", {
        items: cartArray.map((i) => ({
          product: i._id,
          quantity: i.quantity,
        })),
        address: selectedAddress._id,
        amount: finalTotal,
        coupon: couponCode || undefined,
      });

      if (data.success) {
        navigate("/payment", {
          state: {
            orderId: data.orderId,
            amount: finalTotal,
            currency,
            deliveryAddress: `${selectedAddress.firstName} ${selectedAddress.lastName}, ${selectedAddress.street}, ${selectedAddress.city}`,
            savedAmount: totalSaving,
          },
        });
      } else {
        toast.error(data.message || "Could not create order");
      }
      return;
    }

    // ── COD: place order directly ──
    const { data } = await axios.post("/api/order/cod", {
      items: cartArray.map((i) => ({
        product: i._id,
        quantity: i.quantity,
      })),
      address: selectedAddress._id,
      paymentMethod: "COD",
      coupon: couponCode || undefined,
      amount: finalTotal,
    });

    if (data.success) {
      await clearCart();
      toast.success("Order placed!");
      navigate("/confirmation", {
        state: {
          orderId:
            data.order?._id ||
            `BLN-${Math.floor(Math.random() * 90000) + 10000}`,
          total: finalTotal,
          currency,
          paymentMethod: "Cash on delivery",
          deliveryAddress: `${selectedAddress.firstName} ${selectedAddress.lastName}, ${selectedAddress.street}, ${selectedAddress.city}`,
          savedAmount: totalSaving,
        },
      });
    }
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Order failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


// ─────────────────────────────────────────────────────────────
// ALSO add /payment route in your App.tsx / router:
// ─────────────────────────────────────────────────────────────
//
//   import Payment from "./pages/Payment";
//
//   <Route path="/payment" element={<Payment />} />
//
// ─────────────────────────────────────────────────────────────
// ALSO register payment routes in server/app.ts (or server.ts):
// ─────────────────────────────────────────────────────────────
//
//   import paymentRoutes from "./routes/paymentRoutes";
//   app.use("/api/payment", paymentRoutes);
//
// ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (products.length) getCart();
  }, [products, cartItems]);
  useEffect(() => {
    if (user) fetchAddress();
  }, [user]);

  const subtotal = getCartAmount();
  const itemCount = getCartCount();
  const offerDiscount = Math.round(subtotal * 0.2);
  const afterOffer = subtotal - offerDiscount;
  const totalSaving = offerDiscount + couponSaving;
  const finalTotal = afterOffer - couponSaving;

  if (cartArray.length === 0)
    return <EmptyCart onShop={() => navigate("/products")} />;

  return (
    <div className="min-h-screen bg-[#f5f0e8] pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-5 items-start">
        {/* LEFT: Cart Items */}
        <div className="bg-[#fffdf9] rounded-[20px] border border-[#ede8df] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#ede8df]">
            <h1 className="text-base font-semibold text-[#1a2e1a]">
              Your cart
            </h1>
            <span className="bg-[#1a2e1a] text-[#c4e8b4] text-[11px] font-semibold px-3 py-1 rounded-full">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>

          {cartArray.map((product) => (
            <div
              key={product._id}
              className="flex items-center gap-4 px-6 py-5 border-b border-[#f0ebe0] last:border-none hover:bg-[#faf7f2] transition-colors"
            >
              <div className="w-[72px] h-[72px] rounded-[14px] bg-[#f0ebe0] flex-shrink-0 overflow-hidden">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                {product.category && (
                  <p className="text-[10px] text-[#a0966e] tracking-[1.2px] uppercase font-medium mb-0.5">
                    {product.category}
                  </p>
                )}
                <h3 className="text-sm font-medium text-[#1a2e1a] truncate">
                  {product.name}
                </h3>
                <p className="text-[11px] text-[#b8aa90] mt-0.5">
                  {product.weight || "Standard"}
                </p>
                <p className="text-[13px] font-medium text-[#4a3e2a] mt-1.5">
                  {currency}
                  {product.offerPrice.toLocaleString()} / unit
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-[#1a2e1a] rounded-[10px] overflow-hidden h-8">
                    <button
                      onClick={() => removeCart(product._id)}
                      className="w-8 h-8 flex items-center justify-center bg-[#f5f0e8] text-[#1a2e1a] text-base hover:bg-[#ede8da] transition-colors flex-shrink-0"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-[13px] font-semibold text-[#1a2e1a] bg-[#fffdf9]">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateCart(product._id, product.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center bg-[#1a2e1a] text-[#c4e8b4] text-base hover:bg-[#2a4a28] transition-colors flex-shrink-0"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <span className="text-[15px] font-semibold text-[#1a2e1a]">
                  {currency}
                  {(product.offerPrice * product.quantity).toLocaleString()}
                </span>
                <button
                  onClick={() => removeCart(product._id)}
                  className="w-8 h-8 rounded-[8px] border border-[#ede8df] flex items-center justify-center hover:bg-[#fff0f0] hover:border-[#f0a0a0] transition-all"
                  aria-label="Remove item"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Order Summary */}
        <div className="bg-[#fffdf9] rounded-[20px] border border-[#ede8df] overflow-hidden lg:sticky lg:top-24">
          <div className="px-6 py-5 border-b border-[#ede8df]">
            <h2 className="text-base font-semibold text-[#1a2e1a]">
              Order summary
            </h2>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Savings pill */}
            <div className="flex items-center gap-2 bg-[#eaf7e0] border border-[#b0d890] rounded-[12px] px-3.5 py-2.5">
              <CheckIcon />
              <span className="text-[12px] text-[#27500a] font-medium">
                You're saving {currency}
                {totalSaving > 0 ? totalSaving.toLocaleString() : "0"} on this
                order
              </span>
            </div>

            {/* Address */}
            <div className="bg-[#f5f0e8] rounded-[14px] p-4">
              <p className="text-[10px] text-[#8a7a5e] tracking-[1.2px] uppercase font-medium mb-2">
                Delivering to
              </p>
              {selectedAddress ? (
                <>
                  <p className="text-[13px] font-semibold text-[#1a2e1a]">
                    {selectedAddress.firstName} {selectedAddress.lastName}
                  </p>
                  <p className="text-[12px] text-[#7a6e58] leading-relaxed mt-0.5">
                    {selectedAddress.street}
                    <br />
                    {selectedAddress.city}, {selectedAddress.state}
                  </p>
                  <button
                    onClick={() => navigate("/add-address")}
                    className="flex items-center gap-1.5 text-[11px] text-[#5a8a54] font-medium mt-2.5 hover:text-[#3b6d11] transition-colors"
                  >
                    <EditIcon /> Change address
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  {addressMessage && (
                    <p className="text-[12px] text-[#7a6e58] leading-relaxed">
                      {addressMessage}
                    </p>
                  )}
                  <button
                    onClick={() => navigate("/add-address")}
                    className="text-[13px] text-[#5a8a54] font-medium hover:text-[#3b6d11] transition-colors"
                  >
                    + Add delivery address
                  </button>
                </div>
              )}
            </div>

            {/* Coupon */}
            <CouponSection
              currency={currency}
              subtotalAfterDiscount={afterOffer}
              onCouponApplied={(saving, code) => {
                setCouponSaving(saving);
                setCouponCode(code);
              }}
              onCouponRemoved={() => {
                setCouponSaving(0);
                setCouponCode("");
              }}
            />

            {/* Payment */}
            <div>
              <p className="text-[10px] text-[#8a7a5e] tracking-[1.2px] uppercase font-medium mb-2.5">
                Payment method
              </p>
              <div className="flex gap-2">
                {(["COD", "Online"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setPaymentOption(opt)}
                    className={`flex-1 py-2.5 rounded-[12px] text-[12px] font-medium transition-all border-[1.5px] ${
                      paymentOption === opt
                        ? "bg-[#1a2e1a] text-[#c4e8b4] border-[#1a2e1a]"
                        : "bg-[#fffdf9] text-[#4a3e2a] border-[#ede8df] hover:border-[#c8dfc8] hover:bg-[#f5f9f4]"
                    }`}
                  >
                    {opt === "COD" ? "Cash on delivery" : "Pay online"}
                  </button>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="border-t border-[#ede8df] pt-4 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-[#7a6e58]">
                  Subtotal ({itemCount} items)
                </span>
                <span className="text-[13px] font-medium text-[#1a2e1a]">
                  {currency}
                  {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-[#7a6e58]">Delivery</span>
                <span className="bg-[#eaf7e0] text-[#3b6d11] text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-[#b0d890]">
                  Free
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-[#7a6e58]">
                  Offer discount (20%)
                </span>
                <span className="text-[13px] font-medium text-[#3b6d11]">
                  −{currency}
                  {offerDiscount.toLocaleString()}
                </span>
              </div>
              {couponSaving > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-[#7a6e58]">
                    Coupon ({couponCode})
                  </span>
                  <span className="text-[13px] font-medium text-[#3b6d11]">
                    −{currency}
                    {couponSaving.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-[#ede8df] pt-4 flex justify-between items-baseline">
              <span className="text-[15px] font-semibold text-[#1a2e1a]">
                Total
              </span>
              <div className="text-right">
                {couponSaving > 0 && (
                  <span className="text-[12px] text-[#b8aa90] line-through mr-2">
                    {currency}
                    {afterOffer.toLocaleString()}
                  </span>
                )}
                <span className="text-[22px] font-semibold text-[#1a2e1a]">
                  {currency}
                  {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={placeOrder}
              disabled={loading || !selectedAddress}
              className="w-full flex items-center justify-center gap-2 bg-[#1a2e1a] text-[#d4eecc] py-4 rounded-[14px] text-[14px] font-semibold hover:bg-[#2a4a28] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  Place order <ArrowRight />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
