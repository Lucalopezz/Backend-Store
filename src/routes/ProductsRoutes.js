import express from "express";

import ProductController from "../controllers/ProductController.js";
import checkAdmin from "../utils/CheckAdmin.js";
import checkToken from "../utils/CheckToken.js";


import { imageUpload } from "../utils/ImageUpload.js";
import CartController from "../controllers/CartController.js";

const router = express.Router();

router.post(
  "/create",
  checkAdmin,
  imageUpload.single("images"),
  ProductController.createProduct
);

router.get("/allProducts", ProductController.listProducts);
router.delete("/delete/:id", checkAdmin, ProductController.deleteProducts);
router.patch(
  "/edit/:id",
  checkAdmin,
  imageUpload.single("images"),
  ProductController.editProduct
);

router.post("/cart/add", checkToken, CartController.addToCart)
router.get("/cart", checkToken, CartController.getCartItems)

export default router;
