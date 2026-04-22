"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const services_1 = require("./config/services");
const promises_1 = require("node:dns/promises");
const startServer = async () => {
    try {
        // Fix DNS (for MongoDB ECONNREFUSED issue)
        (0, promises_1.setServers)(["1.1.1.1", "8.8.8.8"]);
        // Connect services
        await (0, services_1.connectServices)();
        app_1.default.listen(env_1.env.port, () => {
            console.log(`🚀 Server running on port ${env_1.env.port}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
