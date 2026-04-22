import { Express } from "express";
import userRouter from "../routes/user.route";
import sellerRouter from "../routes/seller.route";
import productRoute from "../routes/product.route";
import cartRouter from "../routes/cart.route";
import addressRoute from "../routes/address.route";
import orderRouter from "../routes/order.route";
import paymentRoutes from "../routes/payment.route";
import transactionRouter from "../routes/transaction.route";

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
