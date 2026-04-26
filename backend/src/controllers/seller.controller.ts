import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sellerModel from "../models/Seller";

interface SellerAuthRequest extends Request {
  sellerId?: string;
}

// ==================== SELLER CHECK AUTH ====================
export const sellerIsAuth = async (
  req: SellerAuthRequest,
  res: Response,
): Promise<Response> => {
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

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const seller = await sellerModel.findById(decoded.sellerId).select("-password");

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
  } catch (error) {
    return res.status(200).json({
      success: false,
      seller: null,
    });
  }
};

// ==================== SELLER LOGIN ====================
export const sellerLogin = async (
  req: Request,
  res: Response,
): Promise<Response> => {
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
      seller = await sellerModel.findOne({ email: defaultEmail });
      
      if (!seller) {
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        seller = new sellerModel({
          email: defaultEmail,
          password: hashedPassword,
        });
        await seller.save();
        console.log("✅ Default seller created during login");
      } else {
        // Ensure password is correct
        const isMatch = await bcrypt.compare(defaultPassword, seller.password);
        if (!isMatch) {
          const hashedPassword = await bcrypt.hash(defaultPassword, 10);
          seller.password = hashedPassword;
          await seller.save();
          console.log("✅ Default seller password updated during login");
        }
      }
    } else {
      // Normal login flow for other sellers
      seller = await sellerModel.findOne({ email });
      
      if (!seller) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const isMatch = await bcrypt.compare(password, seller.password);
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

    const token = jwt.sign({ sellerId: seller._id.toString() }, JWT_SECRET, {
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
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== SELLER LOGOUT ====================
export const sellerLogout = async (
  req: Request,
  res: Response,
): Promise<Response> => {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
