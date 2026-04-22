import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/User";
// Extend Request for auth middleware
interface AuthRequest extends Request {
    userId?: string;
}

interface AuthBody {
    name?: string;
    email: string;
    password: string;
}

// ==================== SIGNUP ====================
export const signup = async (
    req: Request<{}, {}, AuthBody>,
    res: Response
): Promise<Response> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });

        const { JWT_SECRET, NODE_ENV } = process.env;

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
        }

        const token = jwt.sign(
            { userId: user._id.toString() },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            user: { name: user.name, email: user.email },
            message: "You have signed up successfully",
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// ==================== LOGIN ====================
export const login = async (
    req: Request<{}, {}, AuthBody>,
    res: Response
): Promise<Response> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const { JWT_SECRET, NODE_ENV } = process.env;

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
        }

        const token = jwt.sign(
            { userId: user._id.toString() },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            user: { name: user.name, email: user.email },
            message: "You have signed in",
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// ==================== CHECK AUTH ====================
export const isAuth = async (
    req: AuthRequest,
    res: Response
): Promise<Response> => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// ==================== LOGOUT ====================
export const logout = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { NODE_ENV } = process.env;

        res.clearCookie("token", {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: NODE_ENV === "production" ? "none" : "strict",
        });

        return res.json({
            success: true,
            message: "Logged out",
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            return res.json({
                success: false,
                message: error.message,
            });
        }

        return res.json({
            success: false,
            message: "Internal server error",
        });
    }
};