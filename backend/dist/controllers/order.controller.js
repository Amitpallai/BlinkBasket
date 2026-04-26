"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getUserOrder = exports.placeOrderCOD = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
// =======================================================
// PLACE COD ORDER
// =======================================================
const placeOrderCOD = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { items, address, amount } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Items are required",
            });
        }
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount",
            });
        }
        // ✅ FIX: Use correct field names based on your Order schema
        const order = await Order_1.default.create({
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD", // ✅ Changed from paymentType to paymentMethod
            paymentStatus: "pending", // ✅ Add payment status
            status: "order placed",
        });
        // Clear cart after successful COD order placement.
        await User_1.default.findByIdAndUpdate(userId, { cartItems: {} });
        return res.json({
            success: true,
            message: "Order placed successfully",
            order,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("placeOrderCOD:", error.message);
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.placeOrderCOD = placeOrderCOD;
// =======================================================
// USER ORDERS
// =======================================================
const getUserOrder = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        // ✅ FIX: Use correct field names based on your Order schema
        const orders = await Order_1.default
            .find({
            userId,
            $or: [
                { paymentMethod: "COD" }, // ✅ Changed from paymentType
                { paymentStatus: "paid" }, // ✅ Changed from isPaid
            ],
        })
            .populate("items.product")
            .populate("address") // ✅ This will work now that Address model is imported
            .sort({ createdAt: -1 });
        return res.json({
            success: true,
            orders,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("getUserOrder:", error.message);
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getUserOrder = getUserOrder;
// =======================================================
// ALL ORDERS
// =======================================================
const getAllOrders = async (req, res) => {
    try {
        // ✅ FIX: Use correct field names based on your Order schema
        const orders = await Order_1.default
            .find({
            $or: [
                { paymentMethod: "COD" }, // ✅ Changed from paymentType
                { paymentStatus: "paid" }, // ✅ Changed from isPaid
            ],
        })
            .populate("items.product")
            .populate("address") // ✅ This will work now that Address model is imported
            .sort({ createdAt: -1 });
        return res.json({
            success: true,
            orders,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("getAllOrders:", error.message);
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getAllOrders = getAllOrders;
// =======================================================
// UPDATE ORDER STATUS (Admin)
// =======================================================
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: "Order ID and status are required",
            });
        }
        const order = await Order_1.default.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        return res.json({
            success: true,
            message: "Order status updated successfully",
            order,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("updateOrderStatus:", error.message);
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.updateOrderStatus = updateOrderStatus;
