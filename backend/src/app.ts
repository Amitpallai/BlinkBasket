import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { corsMiddleware } from "./config/cors";
import { registerRoutes } from "./routes";
import { connectServices } from "./config/services";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsMiddleware);

// ✅ Lazy connection middleware — runs once, reuses after
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectServices();
      isConnected = true;
    } catch (err) {
      console.error("❌ Service connection failed:", err);
      return res.status(500).json({ error: "Service unavailable" });
    }
  }
  next();
});

registerRoutes(app);

export default app;