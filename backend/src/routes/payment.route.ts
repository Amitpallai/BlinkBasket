// server/routes/paymentRoutes.ts
import express from "express";
import {
  initiatePayment,
  verifyPayment,
  getPaymentStatus,
  cancelPayment,
} from "../controllers/payment.controller";
import { authUser } from "../middlewares/authUser"; // your existing auth middleware

const router = express.Router();

// POST /api/payment/initiate
// Creates a pending order ready for UPI payment
// Body: { items, address, amount, coupon? }
router.post("/initiate", authUser, initiatePayment);

// POST /api/payment/verify
// Marks the order as paid after UPI confirmation
// Body: { orderId, upiId, amount, app? }
router.post("/verify", authUser, verifyPayment);

// GET /api/payment/status/:orderId
// Poll payment status (for QR auto-confirm polling)
router.get("/status/:orderId", authUser, getPaymentStatus);

// POST /api/payment/cancel
// Cancel a pending payment / order
// Body: { orderId }
router.post("/cancel", authUser, cancelPayment);

export default router;
