"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = require("./config/cors");
const routes_1 = require("./routes");
const services_1 = require("./config/services");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(cors_1.corsMiddleware);
// ✅ Lazy connection middleware — runs once, reuses after
let isConnected = false;
app.use(async (req, res, next) => {
    if (!isConnected) {
        try {
            await (0, services_1.connectServices)();
            isConnected = true;
        }
        catch (err) {
            console.error("❌ Service connection failed:", err);
            return res.status(500).json({ error: "Service unavailable" });
        }
    }
    next();
});
(0, routes_1.registerRoutes)(app);
exports.default = app;
