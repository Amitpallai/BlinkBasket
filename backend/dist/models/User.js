"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    cartItems: { type: Object, default: {} },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
}, { minimize: false, timestamps: true });
const userModel = mongoose_1.default.model("user", userSchema);
exports.default = userModel;
