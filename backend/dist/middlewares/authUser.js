"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authUser = (req, res, next) => {
    try {
        // ✅ Dual token support
        let token = req.cookies?.token;
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Authentication token required"
            });
            return; // ✅ FIXED: Early return
        }
        const { JWT_SECRET } = process.env;
        if (!JWT_SECRET) {
            res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
            return; // ✅ FIXED: Early return
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!decoded.userId) {
            res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
            return; // ✅ FIXED: Early return
        }
        req.userId = decoded.userId;
        next(); // ✅ Success - call next
    }
    catch (error) {
        console.error("Auth error:", error.message);
        if (error.name === "TokenExpiredError") {
            res.status(401).json({
                success: false,
                message: "Session expired"
            });
        }
        else if (error.name === "JsonWebTokenError") {
            res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: "Authentication failed"
            });
        }
        // ✅ No return needed - implicit end
    }
};
exports.authUser = authUser;
