"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authUser_1 = require("../middlewares/authUser");
const order_controller_1 = require("../controllers/order.controller");
const sellerAuth_1 = require("../middlewares/sellerAuth");
const orderRoute = express_1.default.Router();
orderRoute.post('/cod', authUser_1.authUser, order_controller_1.placeOrderCOD);
orderRoute.get('/user', authUser_1.authUser, order_controller_1.getUserOrder);
orderRoute.get('/seller', sellerAuth_1.sellerAuth, order_controller_1.getAllOrders);
exports.default = orderRoute;
