"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerLogout = exports.sellerLogin = exports.sellerIsAuth = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Seller_1 = __importDefault(require("../models/Seller"));
// ==================== SELLER CHECK AUTH ====================
const sellerIsAuth = async (req, res) => {
    try {
        const token = req.cookies.sellerToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(200).json({
                success: false,
                seller: null,
            });
        }
        const { JWT_SECRET } = process.env;
        if (!JWT_SECRET) {
            return res.status(500).json({ success: false, message: "Server config error" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const seller = await Seller_1.default.findById(decoded.sellerId).select("-password");
        if (!seller) {
            return res.status(200).json({
                success: false,
                seller: null,
            });
        }
        return res.status(200).json({
            success: true,
            seller: {
                _id: seller._id,
                email: seller.email,
            },
        });
    }
    catch (error) {
        return res.status(200).json({
            success: false,
            seller: null,
        });
    }
};
exports.sellerIsAuth = sellerIsAuth;
// ==================== SELLER LOGIN ====================
const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Default seller credentials
        const defaultEmail = "amitpallai@gmail.com";
        const defaultPassword = "hacker";
        console.log("🔐 Seller login attempt:", { email, passwordProvided: !!password });
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required",
            });
        }
        // Check if this is the default seller
        let seller;
        if (email === defaultEmail && password === defaultPassword) {
            // Find or create default seller
            seller = await Seller_1.default.findOne({ email: defaultEmail });
            if (!seller) {
                const hashedPassword = await bcryptjs_1.default.hash(defaultPassword, 10);
                seller = new Seller_1.default({
                    email: defaultEmail,
                    password: hashedPassword,
                });
                await seller.save();
                console.log("✅ Default seller created during login");
            }
            else {
                // Ensure password is correct
                const isMatch = await bcryptjs_1.default.compare(defaultPassword, seller.password);
                if (!isMatch) {
                    const hashedPassword = await bcryptjs_1.default.hash(defaultPassword, 10);
                    seller.password = hashedPassword;
                    await seller.save();
                    console.log("✅ Default seller password updated during login");
                }
            }
        }
        else {
            // Normal login flow for other sellers
            seller = await Seller_1.default.findOne({ email });
            if (!seller) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }
            const isMatch = await bcryptjs_1.default.compare(password, seller.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }
        }
        const { JWT_SECRET, NODE_ENV } = process.env;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET missing");
        }
        const token = jsonwebtoken_1.default.sign({ sellerId: seller._id.toString() }, JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("sellerToken", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        console.log("✅ Seller login successful:", email);
        return res.status(200).json({
            success: true,
            token,
            seller: {
                _id: seller._id,
                email: seller.email,
            },
            message: "Login successful",
        });
    }
    catch (error) {
        console.error("❌ Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.sellerLogin = sellerLogin;
// ==================== SELLER LOGOUT ====================
const sellerLogout = async (req, res) => {
    try {
        const { NODE_ENV } = process.env;
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: NODE_ENV === "production" ? "none" : "strict",
        });
        return res.json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};
exports.sellerLogout = sellerLogout;
