"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller"); // ✅ Fix import path
const authUser_1 = require("../middlewares/authUser"); // ✅ Fix import path
const router = (0, express_1.Router)();
// ✅ Line 5-6 FIXED: Proper function handlers
router.post("/update", authUser_1.authUser, cart_controller_1.updateCart);
exports.default = router;
