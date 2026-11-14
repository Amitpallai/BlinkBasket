import express from "express";
import { authUser } from "../middlewares/authUser";
import { sellerAuth } from "../middlewares/sellerAuth";
import {
  getSellerTransactions,
  getUserTransactions,
} from "../controllers/transaction.controller";

const transactionRouter = express.Router();

transactionRouter.get("/user", authUser, getUserTransactions);
transactionRouter.get("/seller", sellerAuth, getSellerTransactions);

export default transactionRouter;
