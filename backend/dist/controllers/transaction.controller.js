"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSellerTransactions = exports.getUserTransactions = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const mapOrderToTransaction = (order) => ({
    _id: order._id.toString(),
    orderId: order._id.toString(),
    amount: order.amount,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
    txnRef: order.txnRef || null,
    createdAt: order.createdAt,
    paidAt: order.paidAt || null,
});
const getUserTransactions = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        const orders = await Order_1.default
            .find({ userId })
            .sort({ createdAt: -1 })
            .select("_id amount paymentMethod paymentStatus status txnRef createdAt paidAt");
        const transactions = orders.map(mapOrderToTransaction);
        console.debug("[transaction:user] fetched", { userId, count: transactions.length });
        return res.json({ success: true, transactions });
    }
    catch (error) {
        console.error("[transaction:user] failed", { error: error?.message });
        return res.status(500).json({ success: false, message: "Failed to fetch user transactions" });
    }
};
exports.getUserTransactions = getUserTransactions;
const getSellerTransactions = async (req, res) => {
    try {
        const orders = await Order_1.default
            .find({})
            .sort({ createdAt: -1 })
            .select("_id amount paymentMethod paymentStatus status txnRef createdAt paidAt");
        const transactions = orders.map(mapOrderToTransaction);
        console.debug("[transaction:seller] fetched", { count: transactions.length });
        return res.json({ success: true, transactions });
    }
    catch (error) {
        console.error("[transaction:seller] failed", { error: error?.message });
        return res.status(500).json({ success: false, message: "Failed to fetch seller transactions" });
    }
};
exports.getSellerTransactions = getSellerTransactions;
