"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authUser_1 = require("../middlewares/authUser");
const sellerAuth_1 = require("../middlewares/sellerAuth");
const transaction_controller_1 = require("../controllers/transaction.controller");
const transactionRouter = express_1.default.Router();
transactionRouter.get("/user", authUser_1.authUser, transaction_controller_1.getUserTransactions);
transactionRouter.get("/seller", sellerAuth_1.sellerAuth, transaction_controller_1.getSellerTransactions);
exports.default = transactionRouter;
