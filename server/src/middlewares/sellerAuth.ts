import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

// ✅ FIXED: Proper Request extension for Express cookies
declare global {
  namespace Express {
    interface Request {
      sellerId?: string;
    }
  }
}

interface SellerJwtPayload extends JwtPayload {
  sellerId: string;  // ✅ Match your controller token format
}

// ✅ FIXED MIDDLEWARE - Dynamic JWT verification
export const sellerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // ✅ Get token from cookie OR Authorization header
    let token = req.cookies?.sellerToken;
    
    if (!token && req.header("Authorization")) {
      token = req.header("Authorization")!.replace("Bearer ", "");
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
    const decoded = jwt.verify(token, JWT_SECRET) as SellerJwtPayload;
    
    if (!decoded.sellerId) {
      return res.status(401).json({
        success: false,
        message: "Invalid seller token"
      });
    }

    // ✅ Attach sellerId to req
    req.sellerId = decoded.sellerId;
    next();

  } catch (error: VerifyErrors | any) {
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
