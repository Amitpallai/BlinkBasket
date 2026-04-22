// server/models/Order.ts  ← ADD these fields to your existing Order schema
// Paste the new fields into your existing orderSchema

import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: string;
  items: { product: string; quantity: number }[];
  address: Schema.Types.ObjectId;
  amount: number;
  coupon?: string;
  paymentMethod: "COD" | "Online";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  status: string;
  // ── NEW UPI payment fields ──
  txnRef?: string;          // UPI transaction reference (e.g. UPI1718000000ABC123)
  paidAt?: Date;            // Timestamp when payment was confirmed
  paymentMeta?: {           // Extra info from UPI app
    upiId?: string;         // Customer's UPI ID (e.g. user@ybl)
    app?: string;           // App used (GPay, PhonePe, QR, etc.)
    verifiedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    address: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    amount: { type: Number, required: true },
    coupon: { type: String, default: null },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    status: {
      type: String,
      default: "order placed",
    },
    // ── UPI payment fields ──────────────────────────────
    txnRef: { type: String, default: null },
    paidAt: { type: Date, default: null },
    paymentMeta: {
      upiId: { type: String },
      app: { type: String },
      verifiedAt: { type: Date },
    },
  },
  { timestamps: true }
);

// Index for fast payment status lookups
orderSchema.index({ userId: 1, paymentStatus: 1 });
orderSchema.index({ txnRef: 1 }, { sparse: true });

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;