// server/controllers/paymentController.ts
import { Request, Response } from "express";
import Order from "../models/Order";
import mongoose from "mongoose";
import userModel from "../models/User";

// ── Helper: generate transaction reference ─────────────
const genTxnRef = (): string =>
  `UPI${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

// ── POST /api/payment/initiate ─────────────────────────
// Creates a new order with paymentStatus: 'pending'
// Called by Cart.tsx before navigating to /payment
export const initiatePayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).userId as string;

    const {
      items,
      address,
      amount,
      coupon,
    }: {
      items: { product: string; quantity: number }[];
      address: string;
      amount: number;
      coupon?: string;
    } = req.body;

    // Basic validation
    if (!items?.length) {
      res.status(400).json({ success: false, message: "Cart is empty" });
      return;
    }
    if (!address) {
      res.status(400).json({ success: false, message: "Delivery address required" });
      return;
    }
    if (!amount || amount <= 0) {
      res.status(400).json({ success: false, message: "Invalid amount" });
      return;
    }

    // Create the order with pending payment
    const order = await Order.create({
      userId,
      items,
      address,
      amount,
      coupon: coupon || null,
      paymentMethod: "Online",
      paymentStatus: "pending",
      status: "order placed",
    });

    res.status(201).json({
      success: true,
      orderId: (order._id as any).toString(),
      amount,
      message: "Order created. Awaiting payment.",
    });
  } catch (err: any) {
    console.error("[initiatePayment]", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to initiate payment",
    });
  }
};

// ── POST /api/payment/verify ───────────────────────────
// Marks order payment as verified/paid
// In production: validate UPI webhook / Razorpay signature here
export const verifyPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      orderId,
      upiId,
      amount,
      app,
    }: {
      orderId: string;
      upiId: string;
      amount: number;
      app?: string;
    } = req.body;

    if (!orderId || !upiId) {
      res.status(400).json({ success: false, message: "orderId and upiId are required" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.status(400).json({ success: false, message: "Invalid orderId" });
      return;
    }

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    if (order.paymentStatus === "paid") {
      // Already paid — return success idempotently
      res.json({
        success: true,
        message: "Payment already verified",
        txnRef: order.txnRef,
        orderId: order._id,
      });
      return;
    }

    if (order.paymentStatus === "failed") {
      res.status(400).json({ success: false, message: "Payment was marked as failed" });
      return;
    }

    // Validate amount matches (tolerance for floating-point)
    if (Math.abs(order.amount - amount) > 1) {
      res.status(400).json({
        success: false,
        message: `Amount mismatch: expected ${order.amount}, got ${amount}`,
      });
      return;
    }

    // ─────────────────────────────────────────────────────
    // NOTE: In production replace this block with:
    //   1. Razorpay: verify HMAC signature (razorpay_payment_id + orderId)
    //   2. PayU / Cashfree: validate webhook hash
    //   3. UPI intent: poll /api/payment/status until gateway confirms
    // For now we accept the client's confirmation (demo mode)
    // ─────────────────────────────────────────────────────

    const txnRef = genTxnRef();

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      txnRef,
      paidAt: new Date(),
      paymentMeta: {
        upiId,
        app: app || "UPI",
        verifiedAt: new Date(),
      },
    });

    // Payment completed: clear user's cart so cart page is empty.
    await userModel.findByIdAndUpdate(order.userId, { cartItems: {} });

    res.json({
      success: true,
      message: "Payment verified successfully",
      txnRef,
      orderId,
    });
  } catch (err: any) {
    console.error("[verifyPayment]", err);
    res.status(500).json({
      success: false,
      message: err.message || "Payment verification failed",
    });
  }
};

// ── GET /api/payment/status/:orderId ──────────────────
// Poll payment status (useful for QR payments)
export const getPaymentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;

    const orderIdStr = Array.isArray(orderId) ? orderId[0] : orderId;

    if (!mongoose.Types.ObjectId.isValid(orderIdStr)) {
      res.status(400).json({ success: false, message: "Invalid orderId" });
      return;
    }

    const order = await Order.findById(orderIdStr).select(
      "paymentStatus txnRef paidAt amount"
    );

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    res.json({
      success: true,
      paymentStatus: order.paymentStatus,
      txnRef: order.txnRef || null,
      paidAt: order.paidAt || null,
      amount: order.amount,
    });
  } catch (err: any) {
    console.error("[getPaymentStatus]", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch payment status",
    });
  }
};

// ── POST /api/payment/cancel ──────────────────────────
// Cancel a pending payment / order
export const cancelPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.status(400).json({ success: false, message: "Invalid orderId" });
      return;
    }

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    if (order.paymentStatus !== "pending") {
      res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.paymentStatus}`,
      });
      return;
    }

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "failed",
      status: "cancelled",
    });

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (err: any) {
    console.error("[cancelPayment]", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to cancel order",
    });
  }
};
