import { Router } from "express";
import { updateCart } from "../controllers/cart.controller";  // ✅ Fix import path
import { authUser } from "../middlewares/authUser"          // ✅ Fix import path

const router = Router();

// ✅ Line 5-6 FIXED: Proper function handlers
router.post("/update", authUser, updateCart);

export default router;
