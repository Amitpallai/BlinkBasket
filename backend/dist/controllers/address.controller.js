"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddress = exports.addAddress = void 0;
const Address_1 = __importDefault(require("../models/Address"));
// ADD ADDRESS
const addAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { address } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        if (!address ||
            !address.firstName ||
            !address.lastName ||
            !address.street ||
            !address.city ||
            !address.state ||
            !address.country ||
            !address.zipcode ||
            !address.phone) {
            return res.status(400).json({ success: false, message: "All address fields are required" });
        }
        await Address_1.default.create({
            userId,
            fullName: `${address.firstName} ${address.lastName}`.trim(),
            phone: address.phone,
            addressLine1: address.street,
            addressLine2: address.addressLine2 || "",
            city: address.city,
            state: address.state,
            pincode: address.zipcode,
            country: address.country,
        });
        return res.json({ success: true, message: "Address added successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in addAddress:", error.message);
        }
        else {
            console.error("Unknown error in addAddress");
        }
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.addAddress = addAddress;
// GET ADDRESS
const getAddress = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const address = await Address_1.default.find({ userId });
        // No saved address is a valid empty state, not an error.
        if (!address || address.length === 0) {
            return res.json({
                success: true,
                address: [],
                message: "No saved addresses yet"
            });
        }
        const normalizedAddress = address.map((item) => {
            const nameParts = item.fullName?.trim().split(/\s+/) || [];
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ");
            return {
                _id: item._id,
                firstName,
                lastName,
                email: "",
                phone: item.phone,
                street: item.addressLine1,
                city: item.city,
                state: item.state,
                zipcode: item.pincode,
                country: item.country,
            };
        });
        return res.json({ success: true, address: normalizedAddress });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error in getAddress:", error.message);
        }
        else {
            console.error("Unknown error in getAddress");
        }
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getAddress = getAddress;
