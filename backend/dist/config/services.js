"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectServices = void 0;
const db_1 = __importDefault(require("../configs/db"));
const cloudinary_1 = __importDefault(require("../configs/cloudinary"));
const connectServices = async () => {
    await (0, db_1.default)();
    await (0, cloudinary_1.default)();
};
exports.connectServices = connectServices;
