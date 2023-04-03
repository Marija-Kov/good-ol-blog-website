const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.user_login);
router.get("/logout", authController.user_logout);

module.exports = router;
