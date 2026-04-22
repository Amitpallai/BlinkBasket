"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../configs/multer");
const product_controller_1 = require("../controllers/product.controller");
const sellerAuth_1 = require("../middlewares/sellerAuth");
const productRoute = express_1.default.Router();
// =======================================================
// CREATE PRODUCT
// =======================================================
productRoute.post("/add", sellerAuth_1.sellerAuth, multer_1.upload.array("images", 5), product_controller_1.addProduct);
// =======================================================
// READ ALL PRODUCTS
// =======================================================
productRoute.get("/list", product_controller_1.productList);
// =======================================================
// READ SINGLE PRODUCT
// =======================================================
productRoute.get("/:id", product_controller_1.productById);
// =======================================================
// UPDATE PRODUCT
// =======================================================
productRoute.put("/update/:id", sellerAuth_1.sellerAuth, multer_1.upload.array("images", 5), product_controller_1.updateProductById);
// =======================================================
// DELETE PRODUCT
// =======================================================
productRoute.delete("/delete/:id", sellerAuth_1.sellerAuth, product_controller_1.deleteProduct);
// =======================================================
// CHANGE STOCK
// =======================================================
productRoute.patch("/stock", sellerAuth_1.sellerAuth, product_controller_1.changeStock);
exports.default = productRoute;
