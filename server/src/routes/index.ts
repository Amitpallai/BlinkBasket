import { Express } from "express";
import userRouter from "./user.route";
import sellerRouter from "./seller.route";
import productRoute from "./product.route";
import cartRouter from "./cart.route";
import addressRoute from "./address.route";
import orderRouter from "./order.route";
import paymentRoutes from "./payment.route";
import transactionRouter from "./transaction.route";

export const registerRoutes = (app: Express): void => {
  app.get("/", (_req, res) => {
    res.send("server hello");
  });

  app.use("/api/user", userRouter);
  app.use("/api/seller", sellerRouter);
  app.use("/api/product", productRoute);
  app.use("/api/cart", cartRouter);
  app.use("/api/address", addressRoute);
  app.use("/api/order", orderRouter);
  app.use("/api/payment", paymentRoutes);
  app.use("/api/transaction", transactionRouter);
};
