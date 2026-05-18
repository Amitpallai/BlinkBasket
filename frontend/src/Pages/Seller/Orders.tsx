"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import {toast} from "sonner";

type Address = {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
};

type OrderItem = {
  product?: { name?: string } | null;
  quantity: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  address: Address;
  amount: number;
  paymentType: string;
  isPaid: boolean;
  createdAt: string;
};

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch orders"
      );
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrder();
    // Smooth transition for the spinning icon
    setTimeout(() => setRefreshing(false), 600);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        .ord-wrap {
          font-family: 'DM Sans', sans-serif;
          padding: 20px;
        }

        .ord-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .ord-title-group {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .ord-title {
          font-size: 19px;
          font-weight: 500;
          color: #1a1a1a;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .ord-count {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #aaa;
          letter-spacing: 0.06em;
        }

        /* ─── Refresh Button ─── */
        .ord-refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 9px;
          background: #fff;
          border: 1px solid #e0e0da;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ord-refresh-btn:hover {
          background: #fafaf8;
          border-color: #10b981;
          color: #10b981;
        }

        .ord-refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spin {
          animation: ord-spin 0.8s linear infinite;
          display: inline-block;
        }

        @keyframes ord-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .ord-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: #e8e8e4;
          border: 1px solid #e8e8e4;
          border-radius: 10px;
          overflow: hidden;
        }

        .ord-row {
          display: grid;
          grid-template-columns: 1fr 180px 90px 130px;
          align-items: center;
          background: #fff;
          transition: background 0.1s ease;
        }

        .ord-row:hover {
          background: #fafaf8;
        }

        .ord-cell {
          padding: 18px 20px;
          border-right: 1px solid #f0f0ec;
        }

        .ord-cell:last-child {
          border-right: none;
        }

        .ord-items-cell {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .ord-icon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 7px;
          background: #f2f2ef;
          border: 1px solid #e8e8e4;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
        }

        .ord-item-row {
          display: flex;
          align-items: center;
          gap: 6px;
          line-height: 1.6;
        }

        .ord-item-name {
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .ord-item-qty {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #aaa;
        }

        .ord-address-name {
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 3px;
        }

        .ord-address-detail {
          font-size: 12px;
          color: #888;
          line-height: 1.5;
        }

        .ord-amount {
          font-family: 'DM Mono', monospace;
          font-size: 13.5px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .ord-meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #888;
          margin-bottom: 4px;
        }

        .ord-meta-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          color: #bbb;
          width: 44px;
          flex-shrink: 0;
        }

        .ord-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          font-weight: 500;
          border-radius: 4px;
          padding: 1px 7px;
        }

        .ord-badge-paid {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #d1fae5;
        }

        .ord-badge-pending {
          background: #fff8f0;
          color: #b35c00;
          border: 1px solid #f0d9b5;
        }

        .ord-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .ord-thead {
          display: grid;
          grid-template-columns: 1fr 180px 90px 130px;
          background: #fafaf8;
          border-bottom: 1px solid #e8e8e4;
        }

        .ord-thead-cell {
          padding: 10px 20px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          color: #aaa;
          border-right: 1px solid #f0f0ec;
        }

        .ord-empty {
          background: #fff;
          padding: 56px 20px;
          text-align: center;
          color: #ccc;
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .ord-row, .ord-thead { grid-template-columns: 1fr; }
          .ord-thead { display: none; }
          .ord-cell { border-right: none; border-bottom: 1px solid #f0f0ec; }
        }
      `}</style>

      <div className="ord-wrap">
        <div className="ord-header">
          <div className="ord-title-group">
            <h2 className="ord-title">Orders</h2>
            <span className="ord-count">{orders.length} total</span>
          </div>

          <button 
            className="ord-refresh-btn" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <span className={refreshing ? 'spin' : ''}>↻</span>
            {refreshing ? 'Updating...' : 'Refresh'}
          </button>
        </div>

        <div className="ord-list">
          <div className="ord-thead">
            <div className="ord-thead-cell">Items</div>
            <div className="ord-thead-cell">Customer</div>
            <div className="ord-thead-cell">Amount</div>
            <div className="ord-thead-cell">Details</div>
          </div>

          {orders.length === 0 ? (
            <div className="ord-empty">No orders yet</div>
          ) : (
            orders.map((order, index) => (
              <div key={order._id || index} className="ord-row">
                <div className="ord-cell">
                  <div className="ord-items-cell">
                    <div className="ord-icon">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                      </svg>
                    </div>
                    <div>
                      {order.items?.length ? (
                        order.items.map((item, i) => (
                          <div key={i} className="ord-item-row">
                            <span className="ord-item-name">{item.product?.name || "Product"}</span>
                            <span className="ord-item-qty">×{item.quantity}</span>
                          </div>
                        ))
                      ) : (
                        <span className="ord-item-name">No items</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="ord-cell">
                  <p className="ord-address-name">{order.address?.firstName} {order.address?.lastName}</p>
                  <p className="ord-address-detail">
                    {order.address?.city}, {order.address?.state}<br />
                    {order.address?.country}
                  </p>
                </div>

                <div className="ord-cell">
                  <span className="ord-amount">{currency}{Number(order.amount || 0).toFixed(2)}</span>
                </div>

                <div className="ord-cell">
                  <div className="ord-meta-row">
                    <span className="ord-meta-label">Date</span>
                    <span>{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="ord-meta-row">
                    <span className="ord-meta-label">Via</span>
                    <span>{order.paymentType}</span>
                  </div>
                  <div className={`ord-badge ${order.isPaid ? "ord-badge-paid" : "ord-badge-pending"}`}>
                    <span className="ord-badge-dot" />
                    {order.isPaid ? "Paid" : "Pending"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;