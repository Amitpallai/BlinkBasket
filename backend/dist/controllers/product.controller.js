"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeStock = exports.deleteProduct = exports.updateProductById = exports.updateProduct = exports.productById = exports.productList = exports.addProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const cloudinary_1 = require("cloudinary");
// =======================================================
// ADD PRODUCT
// =======================================================
const addProduct = async (req, res) => {
    try {
        const productData = JSON.parse(req.body.productData);
        if (!productData.name || !productData.price || !productData.offerPrice) {
            return res.status(400).json({
                success: false,
                message: "Name, price and offer price are required",
            });
        }
        if (!productData.category) {
            return res.status(400).json({
                success: false,
                message: "Category is required",
            });
        }
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Images are required",
            });
        }
        const imageUrls = await Promise.all(files.map(async (file) => {
            const result = await cloudinary_1.v2.uploader.upload(file.path);
            return result.secure_url;
        }));
        const product = await Product_1.default.create({
            ...productData,
            image: imageUrls,
        });
        return res.json({
            success: true,
            message: "Product added successfully",
            product,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};
exports.addProduct = addProduct;
// =======================================================
// GET ALL PRODUCTS
// =======================================================
const productList = async (req, res) => {
    try {
        const products = await Product_1.default.find({}).sort({ createdAt: -1 });
        return res.json({
            success: true,
            products,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.productList = productList;
// =======================================================
// GET PRODUCT BY ID
// =======================================================
const productById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product_1.default.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        return res.json({
            success: true,
            product,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.productById = productById;
// =======================================================
// UPDATE PRODUCT
// =======================================================
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product_1.default.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        const productData = JSON.parse(req.body.productData);
        let imageUrls = product.image;
        if (req.files && req.files.length > 0) {
            imageUrls = await Promise.all(req.files.map(async (file) => {
                const result = await cloudinary_1.v2.uploader.upload(file.path);
                return result.secure_url;
            }));
        }
        const updated = await Product_1.default.findByIdAndUpdate(id, {
            ...productData,
            image: imageUrls,
        }, { new: true });
        return res.json({
            success: true,
            message: "Product updated successfully",
            product: updated,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateProduct = updateProduct;
// =======================================================
// UPDATE PRODUCT BY ID
// =======================================================
// =======================================================
// UPDATE PRODUCT BY ID
// =======================================================
const updateProductById = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate product ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }
        // Find existing product
        const existingProduct = await Product_1.default.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        // Parse product data from request body
        let productData;
        try {
            productData = JSON.parse(req.body.productData);
        }
        catch (parseError) {
            return res.status(400).json({
                success: false,
                message: "Invalid product data format",
            });
        }
        // Validate required fields if they are being updated
        if (productData.name !== undefined && !productData.name) {
            return res.status(400).json({
                success: false,
                message: "Name cannot be empty",
            });
        }
        // Get final price (new price if provided, otherwise existing price)
        const finalPrice = productData.price !== undefined ? productData.price : existingProduct.price;
        const finalOfferPrice = productData.offerPrice !== undefined ? productData.offerPrice : existingProduct.offerPrice;
        // ✅ CRITICAL FIX: Validate price
        if (productData.price !== undefined && productData.price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be greater than 0",
            });
        }
        // ✅ CRITICAL FIX: Validate offerPrice against the FINAL price
        if (productData.offerPrice !== undefined) {
            if (productData.offerPrice < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Offer price cannot be negative",
                });
            }
            // This is the key validation you're missing!
            if (productData.offerPrice > finalPrice) {
                return res.status(400).json({
                    success: false,
                    message: `Offer price (${productData.offerPrice}) must be less than or equal to regular price (${finalPrice})`,
                });
            }
        }
        // Handle image updates
        let imageUrls = existingProduct.image;
        if (req.files && req.files.length > 0) {
            try {
                // Upload new images to Cloudinary
                imageUrls = await Promise.all(req.files.map(async (file) => {
                    const result = await cloudinary_1.v2.uploader.upload(file.path);
                    return result.secure_url;
                }));
            }
            catch (uploadError) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload images to Cloudinary",
                    error: uploadError.message,
                });
            }
        }
        // Prepare update data - only include fields that are provided
        const updateData = {};
        if (productData.name !== undefined)
            updateData.name = productData.name;
        if (productData.price !== undefined)
            updateData.price = productData.price;
        if (productData.offerPrice !== undefined)
            updateData.offerPrice = productData.offerPrice;
        if (productData.description !== undefined)
            updateData.description = productData.description;
        if (productData.category !== undefined)
            updateData.category = productData.category;
        if (productData.inStock !== undefined)
            updateData.inStock = productData.inStock;
        // Only update images if new ones were provided
        if (req.files && req.files.length > 0) {
            updateData.image = imageUrls;
        }
        // ✅ Add a pre-validation to ensure offerPrice doesn't exceed price
        if (updateData.offerPrice && updateData.price && updateData.offerPrice > updateData.price) {
            return res.status(400).json({
                success: false,
                message: `Offer price (${updateData.offerPrice}) must be less than or equal to regular price (${updateData.price})`,
            });
        }
        // Update the product
        const updatedProduct = await Product_1.default.findByIdAndUpdate(id, updateData, {
            new: true, // Return the updated document
            runValidators: true // Run model validators on update
        });
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found after update",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });
    }
    catch (error) {
        console.error("Update product error:", error);
        // Handle specific MongoDB errors
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format",
            });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};
exports.updateProductById = updateProductById;
// =======================================================
// DELETE PRODUCT
// =======================================================
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product_1.default.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        await Product_1.default.findByIdAndDelete(id);
        return res.json({
            success: true,
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.deleteProduct = deleteProduct;
// =======================================================
// CHANGE STOCK
// =======================================================
const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        const product = await Product_1.default.findByIdAndUpdate(id, { inStock }, { new: true });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        return res.json({
            success: true,
            message: "Stock updated successfully",
            product,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.changeStock = changeStock;
