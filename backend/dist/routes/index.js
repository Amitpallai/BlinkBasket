"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
const user_route_1 = __importDefault(require("../routes/user.route"));
const seller_route_1 = __importDefault(require("../routes/seller.route"));
const product_route_1 = __importDefault(require("../routes/product.route"));
const cart_route_1 = __importDefault(require("../routes/cart.route"));
const address_route_1 = __importDefault(require("../routes/address.route"));
const order_route_1 = __importDefault(require("../routes/order.route"));
const payment_route_1 = __importDefault(require("../routes/payment.route"));
const transaction_route_1 = __importDefault(require("../routes/transaction.route"));
const registerRoutes = (app) => {
    app.get("/", (_req, res) => {
        res.send("server hello");
    });
    app.use("/api/user", user_route_1.default);
    app.use("/api/seller", seller_route_1.default);
    app.use("/api/product", product_route_1.default);
    app.use("/api/cart", cart_route_1.default);
    app.use("/api/address", address_route_1.default);
    app.use("/api/order", order_route_1.default);
    app.use("/api/payment", payment_route_1.default);
    app.use("/api/transaction", transaction_route_1.default);
};
exports.registerRoutes = registerRoutes;
