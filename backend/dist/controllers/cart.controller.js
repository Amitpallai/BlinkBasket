"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCart = void 0;
const User_1 = __importDefault(require("../models/User"));
const updateCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        if (!cartItems || typeof cartItems !== "object") {
            return res.status(400).json({
                success: false,
                message: "cartItems is required",
            });
        }
        await User_1.default.findByIdAndUpdate(userId, { cartItems }, { new: true });
        return res.json({
            success: true,
            message: "Cart updated",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.updateCart = updateCart;
