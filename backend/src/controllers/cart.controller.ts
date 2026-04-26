import { Request, Response } from "express";
import userModel from "../models/User";

// Define cart type (adjust based on your schema)
interface CartItems {
    [key: string]: number; // e.g. itemId: quantity
}

interface UpdateCartBody {
    cartItems: CartItems;
}

export const updateCart = async (
    req: Request<{}, {}, UpdateCartBody>,
    res: Response
): Promise<Response> => {
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

        await userModel.findByIdAndUpdate(userId, { cartItems }, { new: true });

        return res.json({
            success: true,
            message: "Cart updated",
        });

    } catch (error: unknown) {
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
