import express from "express";
import { sellerIsAuth, sellerLogin, sellerLogout } from "../controllers/seller.controller";
import { sellerAuth } from "../middlewares/sellerAuth";

const sellerRouter = express.Router();

// ✅ PUBLIC - NO middleware (fixes 401)
sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/isauth', sellerIsAuth);  // ← REMOVED sellerAuth
sellerRouter.post('/logout', sellerLogout);  // ← Protected

export default sellerRouter;