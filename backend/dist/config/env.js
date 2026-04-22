"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const toPort = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
exports.env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: toPort(process.env.PORT, 4000),
    clientOrigins: (process.env.CLIENT_ORIGINS ??
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
};
