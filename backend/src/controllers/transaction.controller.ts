import { Request, Response } from "express";
import orderModel from "../models/Order";

interface AuthRequest extends Request {
  userId?: string;
}

type TransactionView = {
  _id: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  txnRef: string | null;
  createdAt: Date;
  paidAt: Date | null;
};

const mapOrderToTransaction = (order: any): TransactionView => ({
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

export const getUserTransactions = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const orders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .select("_id amount paymentMethod paymentStatus status txnRef createdAt paidAt");

    const transactions = orders.map(mapOrderToTransaction);
    console.debug("[transaction:user] fetched", { userId, count: transactions.length });

    return res.json({ success: true, transactions });
  } catch (error: any) {
    console.error("[transaction:user] failed", { error: error?.message });
    return res.status(500).json({ success: false, message: "Failed to fetch user transactions" });
  }
};

export const getSellerTransactions = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const orders = await orderModel
      .find({})
      .sort({ createdAt: -1 })
      .select("_id amount paymentMethod paymentStatus status txnRef createdAt paidAt");

    const transactions = orders.map(mapOrderToTransaction);
    console.debug("[transaction:seller] fetched", { count: transactions.length });

    return res.json({ success: true, transactions });
  } catch (error: any) {
    console.error("[transaction:seller] failed", { error: error?.message });
    return res.status(500).json({ success: false, message: "Failed to fetch seller transactions" });
  }
};
