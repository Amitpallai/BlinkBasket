import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { corsMiddleware } from "./config/cors";
import { registerRoutes } from "./routes";

const app = express();

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(corsMiddleware);
registerRoutes(app);

export default app;