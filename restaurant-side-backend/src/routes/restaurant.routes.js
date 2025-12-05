const express = require("express");
const router = express.Router();
const {
  getRestaurantById,
  getMyRestaurant,
} = require("../controllers/restaurant.controller.js");

// For dashboard after login
router.get("/me", getMyRestaurant);

// For direct access via restaurantId (frontend route)
router.get("/:restaurantId", getRestaurantById);

module.exports = router;
