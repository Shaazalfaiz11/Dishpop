// routes/order.routes.js
const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/isAuthenticated");

const {
  createOrder,
  getRestaurantOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

// CREATE order - PROTECTED (owner)
router.post("/orders", isAuthenticated, createOrder);

// GET all orders of restaurant - PROTECTED
router.get("/restaurants/:restaurantId/orders", isAuthenticated, getRestaurantOrders);

// UPDATE order status - PROTECTED
router.patch("/orders/:orderId/status", isAuthenticated, updateOrderStatus);

module.exports = router;
