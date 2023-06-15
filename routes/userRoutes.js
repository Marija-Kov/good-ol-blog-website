import express from "express";
const router = express.Router();
import authController from "../controllers/authController.js";

router.post("/login", authController.user_login);
router.post("/signup", authController.user_signup);
router.get("/logout", authController.user_logout)


export default router;
