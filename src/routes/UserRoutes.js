import express from "express";
import UserController from "../controllers/UserController.js";
import checkToken from "../utils/CheckToken.js";
import { imageUpload } from "../utils/ImageUpload.js";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/currentUser", UserController.getCurrentUserFromToken);
router.patch(
  "/:id/image",
  checkToken,
  imageUpload.single("image"),
  UserController.addUserPhoto
);
router.patch("/:id", checkToken, UserController.editUser);


export default router;
