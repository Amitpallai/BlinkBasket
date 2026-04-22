"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/routes/paymentRoutes.ts
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../controllers/payment.controller");
const authUser_1 = require("../middlewares/authUser"); // your existing auth middleware
const router = express_1.default.Router();
// POST /api/payment/initiate
// Creates a pending order ready for UPI payment
// Body: { items, address, amount, coupon? }
router.post("/initiate", authUser_1.authUser, payment_controller_1.initiatePayment);
// POST /api/payment/verify
// Marks the order as paid after UPI confirmation
// Body: { orderId, upiId, amount, app? }
router.post("/verify", authUser_1.authUser, payment_controller_1.verifyPayment);
// GET /api/payment/status/:orderId
// Poll payment status (for QR auto-confirm polling)
router.get("/status/:orderId", authUser_1.authUser, payment_controller_1.getPaymentStatus);
// POST /api/payment/cancel
// Cancel a pending payment / order
// Body: { orderId }
router.post("/cancel", authUser_1.authUser, payment_controller_1.cancelPayment);
exports.default = router;
