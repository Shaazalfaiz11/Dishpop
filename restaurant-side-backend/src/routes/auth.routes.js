// routes/auth.Routes.js

const express = require("express");
const {
  register,
  login,
  logout,
  getProfile,
  sendForgotOTP,
  verifyForgotOTP,
  resetPassword,
} = require("../controllers/auth.controller.js");
const { isAuthenticated } = require("../middlewares/isAuthenticated.js");

const router = express.Router();

// Test route
router.get("/test", (req, res) => res.json({ success: true, message: "Auth router works!" }));

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgot-password", sendForgotOTP);
router.post("/verify-forgot-otp", verifyForgotOTP);
router.post("/reset-password", resetPassword);

// Protected route
router.get("/profile", isAuthenticated, getProfile);

module.exports = router;
