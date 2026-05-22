"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ✅ FIXED MIDDLEWARE - Dynamic JWT verification
const sellerAuth = async (req, res, next) => {
    try {
        // ✅ Get token from cookie OR Authorization header
        let token = req.cookies?.sellerToken;
        if (!token && req.header("Authorization")) {
            token = req.header("Authorization").replace("Bearer ", "");
        }
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Seller token required"
            });
        }
        const { JWT_SECRET } = process.env;
        if (!JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
        }
        // ✅ Verify token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!decoded.sellerId) {
            return res.status(401).json({
                success: false,
                message: "Invalid seller token"
            });
        }
        // ✅ Attach sellerId to req
        req.sellerId = decoded.sellerId;
        next();
    }
    catch (error) {
        console.error("Seller auth error:", error.message);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Seller session expired"
            });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid seller token"
            });
        }
        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};
exports.sellerAuth = sellerAuth;
