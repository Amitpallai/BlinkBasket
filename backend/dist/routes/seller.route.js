"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const seller_controller_1 = require("../controllers/seller.controller");
const sellerRouter = express_1.default.Router();
// ✅ PUBLIC - NO middleware (fixes 401)
sellerRouter.post('/login', seller_controller_1.sellerLogin);
sellerRouter.get('/isauth', seller_controller_1.sellerIsAuth); // ← REMOVED sellerAuth
sellerRouter.post('/logout', seller_controller_1.sellerLogout); // ← Protected
exports.default = sellerRouter;
