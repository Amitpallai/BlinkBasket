import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  category: string;
  image: string[];
  offerPrice?: number; // Made optional to match usage
  price?: number;
}

interface OrderItem {
  product: Product | null | string;
  quantity: number;
}

interface Order {
  _id: string;
  paymentType: string;
  amount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderResponseData {
  success: boolean;
  orders: Order[];
  message?: string;
}

const statusStyles: Record<string, string> = {
  Pending: "bg-[#fff8e1] text-[#b8860b]",
  Processing: "bg-[#e3f2fd] text-[#1565c0]",
  Shipped: "bg-[#e8eaf6] text-[#3949ab]",
  Delivered: "bg-[#e8f5e9] text-[#2e7d32]",
  Cancelled: "bg-[#fce4ec] text-[#c62828]",
};

const paymentStyles: Record<string, string> = {
  COD: "bg-[#f3e5f5] text-[#6a1b9a]",
  Online: "bg-[#e3f2fd] text-[#1565c0]",
};

const Badge = ({
  label,
  styleMap,
}: {
  label: string;
  styleMap: Record<string, string>;
}) => {
  const cls = styleMap[label] ?? "bg-[#f5f0e8] text-[#a0966e]";

  return (
    <span
      className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${cls}`}
    >
      {label}
    </span>
  );
};

const Myorder: React.FC = () => {
  const { currency } = useAppContext();
  const [myOrder, setMyOrder] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<OrderResponseData>("/api/order/user");

      if (data.success && data.orders) {
        // Filter out any orders with invalid items
        const validOrders = data.orders.filter(order => 
          order && order.items && Array.isArray(order.items)
        );
        setMyOrder(validOrders);
      } else {
        toast.error(data.message || "Failed to fetch orders");
        setMyOrder([]);
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      if (error?.response?.status === 404) {
        toast.error("Orders endpoint not found. Please check your API configuration.");
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch orders");
      }
      setMyOrder([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []); // Added empty dependency array - it's correct

  // Helper function to safely get product price
  const getProductPrice = (product: Product | null | string): number => {
    if (!product || typeof product === 'string') return 0;
    return product.offerPrice || product.price || 0;
  };

  // Helper function to safely get product name
  const getProductName = (product: Product | null | string): string => {
    if (!product || typeof product === 'string') return "Product unavailable";
    return product.name || "Unnamed product";
  };

  // Helper function to safely get product category
  const getProductCategory = (product: Product | null | string): string => {
    if (!product || typeof product === 'string') return "Unknown";
    return product.category || "Uncategorized";
  };

  // Helper function to safely get product image
  const getProductImage = (product: Product | null | string): string => {
    if (!product || typeof product === 'string') return "/placeholder-image.jpg";
    return product.image?.[0] || "/placeholder-image.jpg";
  };

  if (loading) {
    return (
      <div className="mt-16 pb-20 px-4 md:px-8 lg:px-16 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#1a2e1a] border-t-transparent"></div>
          <p className="text-[#a0966e] mt-4">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 pb-20 px-4 md:px-8 lg:px-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1a2e1a]">My Orders</h1>
        <p className="text-sm text-[#a0966e] mt-1">
          {myOrder.length} {myOrder.length === 1 ? "order" : "orders"} found
        </p>
      </div>

      {/* Empty */}
      {myOrder.length === 0 ? (
        <div className="text-center py-20 text-[#a0966e]">
          <svg 
            className="mx-auto h-16 w-16 text-[#c8bfaa] mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
            />
          </svg>
          <p>No orders found</p>
          <p className="text-sm mt-2">Your orders will appear here once you make a purchase</p>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrder.map((order) => {
            // Safely calculate subtotal with null checks
            const subtotal = order.items?.reduce((sum, item) => {
              const price = getProductPrice(item.product);
              const quantity = item.quantity || 0;
              return sum + (price * quantity);
            }, 0) || 0;

            // Offer discount 20%
            const offerDiscount = Math.round(subtotal * 0.2);

            // Final total from backend
            const finalTotal = order.amount || 0;

            // Coupon discount = remaining difference
            const couponDiscount = Math.max(0, subtotal - offerDiscount - finalTotal);

            // Ensure we don't show negative discount
            const finalOfferDiscount = Math.min(offerDiscount, subtotal);

            return (
              <div
                key={order._id}
                className="bg-white border border-[#ede8df] rounded-[20px] overflow-hidden transition-shadow hover:shadow-md "
              >
                {/* Top */}
                <div className="flex justify-between items-start gap-4 px-6 py-4 border-b border-[#ede8df] flex-wrap">
                  <div>
                    <p className="text-[11px] text-[#a0966e] uppercase font-medium">
                      Order · {order._id?.slice(-8).toUpperCase() || 'UNKNOWN'}
                    </p>

                    <div className="flex gap-2 mt-2">
                      <Badge
                        label={order.paymentType || 'Unknown'}
                        styleMap={paymentStyles}
                      />
                      <Badge 
                        label={order.status || 'Pending'} 
                        styleMap={statusStyles} 
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-[#1a2e1a]">
                      {currency}
                      {(finalTotal || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-[#a0966e]">Final Paid</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  {order.items?.filter(item => item && item.product).map((item, index) => {
                    const productPrice = getProductPrice(item.product);
                    const quantity = item.quantity || 0;
                    const itemTotal = productPrice * quantity;
                    
                    return (
                      <div
                        key={`${order._id}-item-${index}`} // Better key for uniqueness
                        className={`flex justify-between gap-4 px-5 py-4 ${
                          index !== (order.items?.length || 0) - 1
                            ? "border-b border-[#f5f0e8]"
                            : ""
                        }`}
                      >
                        <div className="flex gap-4">
                          <img
                            src={getProductImage(item.product)}
                            alt={getProductName(item.product)}
                            className="w-14 h-14 rounded-xl object-cover bg-[#f7f2ea]"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                            }}
                          />

                          <div>
                            <p className="text-sm font-medium text-[#1a2e1a]">
                              {getProductName(item.product)}
                            </p>
                            <p className="text-xs text-[#a0966e] uppercase mt-1">
                              {getProductCategory(item.product)}
                            </p>
                            <p className="text-xs text-[#a0966e] mt-1">
                              Qty · {quantity}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm font-semibold text-[#1a2e1a]">
                          {currency}
                          {itemTotal.toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                <div className="bg-[#f7f2ea] px-5 py-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#7a6e58]">Subtotal</span>
                    <span>
                      {currency}
                      {subtotal.toLocaleString()}
                    </span>
                  </div>

                  {finalOfferDiscount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Offer Discount (20%)</span>
                      <span>
                        -{currency}
                        {finalOfferDiscount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Coupon Discount</span>
                      <span>
                        -{currency}
                        {couponDiscount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-[#e6dccf] pt-2 flex justify-between font-semibold text-[#1a2e1a]">
                    <span>Order Total</span>
                    <span>
                      {currency}
                      {finalTotal.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-[#a0966e] pt-1">
                    {order.createdAt 
                      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Date unavailable"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Myorder;