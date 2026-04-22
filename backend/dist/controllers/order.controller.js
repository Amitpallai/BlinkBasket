"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getUserOrder = exports.placeOrderStripe = exports.placeOrderCOD = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const stripe_1 = __importDefault(require("stripe"));
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
// PLACE STRIPE ORDER
// =======================================================
const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { items, address, amount } = req.body;
        const origin = req.headers.origin;
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
        let productData = [];
        for (const item of items) {
            const product = await Product_1.default.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`,
                });
            }
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
        }
        // ✅ FIX: Use correct field names based on your Order schema
        const order = await Order_1.default.create({
            userId,
            items,
            address,
            amount,
            paymentMethod: "Online", // ✅ Changed from paymentType to paymentMethod
            paymentStatus: "pending", // ✅ Initial status
            status: "pending",
        });
        const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
        const line_items = productData.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.floor(item.price * 100),
            },
            quantity: item.quantity,
        }));
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            },
        });
        return res.json({
            success: true,
            url: session.url,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("placeOrderStripe:", error.message);
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.placeOrderStripe = placeOrderStripe;
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
                { paymentStatus: "paid" } // ✅ Changed from isPaid
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
                { paymentStatus: "paid" } // ✅ Changed from isPaid
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
