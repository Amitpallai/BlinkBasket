"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const connectCloudinary = async () => {
    try {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        console.log("Cloudinary is connected");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error connecting to Cloudinary:", error.message);
        }
        else {
            console.error("Unknown error connecting to Cloudinary");
        }
        throw new Error("Cloudinary configuration failed");
    }
};
exports.default = connectCloudinary;
