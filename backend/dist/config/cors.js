"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./env");
const corsOptions = {
    origin(origin, callback) {
        // Allow server-to-server and tools without an Origin header.
        if (!origin)
            return callback(null, true);
        if (env_1.env.clientOrigins.includes(origin))
            return callback(null, true);
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
};
exports.corsMiddleware = (0, cors_1.default)(corsOptions);
