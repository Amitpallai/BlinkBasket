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
            console.log("Database is connected");
        });
        await mongoose_1.default.connect(MONGODB_URL);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("DB Connection Error:", error.message);
        }
        else {
            console.error("Unknown DB Connection Error");
        }
        process.exit(1); // optional: stop app if DB fails
    }
};
exports.default = connectDB;
