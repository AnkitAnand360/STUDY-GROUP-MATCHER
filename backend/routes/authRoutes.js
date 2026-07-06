const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controllers/authController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/change-password", authMiddleware, changePassword);

module.exports = router;