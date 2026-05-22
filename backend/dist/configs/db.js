"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const { MONGODB_URL } = process.env;
        if (!MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables");
        }
        mongoose_1.default.connection.on("connected", () => {
            console.log("✓ Database is connected");
        });
        mongoose_1.default.connection.on("error", (error) => {
            console.error("✗ Database connection error:", error);
        });
        await mongoose_1.default.connect(MONGODB_URL);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("✗ DB Connection Error:", error.message);
        }
        else {
            console.error("✗ Unknown DB Connection Error");
        }
        // Don't exit process - serverless functions need to stay alive
        // The connection will retry on next request
    }
};
exports.default = connectDB;
