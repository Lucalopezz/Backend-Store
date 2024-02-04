import express from "express";

import ProductController from "../controllers/ProductController.js";
import checkAdmin from "../utils/CheckAdmin.js";

const router = express.Router();

router.post("/create", checkAdmin, ProductController.createProduct);

export default router;
