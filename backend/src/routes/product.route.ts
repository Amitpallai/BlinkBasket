import express, { Router, RequestHandler } from "express";
import { upload } from "../configs/multer";

import {
  addProduct,
  changeStock,
  deleteProduct,
  productById,
  productList,
  updateProduct,
  updateProductById,
} from "../controllers/product.controller";

import { sellerAuth } from "../middlewares/sellerAuth";

const productRoute: Router = express.Router();

// =======================================================
// CREATE PRODUCT
// =======================================================
productRoute.post(
  "/add",
  sellerAuth,
  upload.array("images", 5),
  addProduct as RequestHandler
);

// =======================================================
// READ ALL PRODUCTS
// =======================================================
productRoute.get("/list", productList);

// =======================================================
// READ SINGLE PRODUCT
// =======================================================
productRoute.get("/:id", productById);

// =======================================================
// UPDATE PRODUCT
// =======================================================
productRoute.put(
  "/update/:id",
  sellerAuth,
  upload.array("images", 5),
  updateProductById as RequestHandler
);

// =======================================================
// DELETE PRODUCT
// =======================================================
productRoute.delete(
  "/delete/:id",
  sellerAuth,
  deleteProduct
);

// =======================================================
// CHANGE STOCK
// =======================================================
productRoute.patch(
  "/stock",
  sellerAuth,
  changeStock
);

export default productRoute;