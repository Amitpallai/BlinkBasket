import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

// ✅ PROPER Express Request extension
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

interface UserJwtPayload extends JwtPayload {
  userId: string;
}

export const authUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
      return;  // ✅ FIXED: Early return
    }

    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
      res.status(500).json({
        success: false,
        message: "Server configuration error"
      });
      return;  // ✅ FIXED: Early return
    }

    const decoded = jwt.verify(token, JWT_SECRET) as UserJwtPayload;
    if (!decoded.userId) {
      res.status(401).json({
        success: false,
        message: "Invalid token payload"
      });
      return;  // ✅ FIXED: Early return
    }

    req.userId = decoded.userId;
    next();  // ✅ Success - call next

  } catch (error: VerifyErrors | any) {
    console.error("Auth error:", error.message);
    
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        message: "Session expired"
      });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Authentication failed"
      });
    }
    // ✅ No return needed - implicit end
  }
};