import express from "express";

import ProductController from "../controllers/ProductController.js";
import checkAdmin from "../utils/CheckAdmin.js";

import { imageUpload } from "../utils/ImageUpload.js";

const router = express.Router();

router.post(
  "/create",
  checkAdmin,
  imageUpload.single("images"),
  ProductController.createProduct
);

router.get("/allProducts", ProductController.listProducts);
router.delete("/delete/:id", checkAdmin, ProductController.deleteProducts);

export default router;
