import express from "express";

import ProductController from "../controllers/ProductController.js";
import checkAdmin from "../utils/CheckAdmin.js";
import checkToken from "../utils/CheckToken.js";


import { imageUpload } from "../utils/ImageUpload.js";
import CartController from "../controllers/CartController.js";
import OrderController from "../controllers/OrderController.js";

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
router.delete("/cart/delete/:id", checkToken, CartController.deleteCartItems)


router.post("/order/create", checkToken, OrderController.createOrder)
router.get("/orders", checkToken, OrderController.listOrders)
router.patch("/order/update", checkAdmin, OrderController.updateOrderStatus)


export default router;
