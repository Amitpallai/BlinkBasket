import { Request, Response } from "express";
import orderModel from "../models/Order";
import productModel from "../models/Product";
import addressModel from "../models/Address"; // ✅ ADD THIS IMPORT
import userModel from "../models/User";
import Stripe from "stripe";

// ================= TYPES =================
interface AuthRequest extends Request {
  userId?: string;
}

interface OrderItem {
  product: string;
  quantity: number;
}

interface OrderBody {
  userId?: string;
  items: OrderItem[];
  address: string;
  amount?: number; // final total from frontend
}

// =======================================================
// PLACE COD ORDER
// =======================================================
export const placeOrderCOD = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.userId || req.body.userId;

    const { items, address, amount }: OrderBody = req.body;

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
    const order = await orderModel.create({
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD", // ✅ Changed from paymentType to paymentMethod
      paymentStatus: "pending", // ✅ Add payment status
      status: "order placed",
    });

    // Clear cart after successful COD order placement.
    await userModel.findByIdAndUpdate(userId, { cartItems: {} });

    return res.json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("placeOrderCOD:", error.message);
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =======================================================
// PLACE STRIPE ORDER
// =======================================================
export const placeOrderStripe = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.userId || req.body.userId;

    const { items, address, amount }: OrderBody = req.body;

    const origin = req.headers.origin as string;

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

    let productData: {
      name: string;
      price: number;
      quantity: number;
    }[] = [];

    for (const item of items) {
      const product = await productModel.findById(item.product);

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
    const order = await orderModel.create({
      userId,
      items,
      address,
      amount,
      paymentMethod: "Online", // ✅ Changed from paymentType to paymentMethod
      paymentStatus: "pending", // ✅ Initial status
      status: "pending",
    });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      productData.map((item) => ({
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
        orderId: (order as any)._id.toString(),
        userId,
      },
    });

    return res.json({
      success: true,
      url: session.url,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("placeOrderStripe:", error.message);
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =======================================================
// USER ORDERS
// =======================================================
export const getUserOrder = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // ✅ FIX: Use correct field names based on your Order schema
    const orders = await orderModel
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getUserOrder:", error.message);
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =======================================================
// ALL ORDERS
// =======================================================
export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // ✅ FIX: Use correct field names based on your Order schema
    const orders = await orderModel
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getAllOrders:", error.message);
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =======================================================
// UPDATE ORDER STATUS (Admin)
// =======================================================
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("updateOrderStatus:", error.message);
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};