// routes/dishRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { isAuthenticated } = require("../middlewares/isAuthenticated");

const {
  getDish,
  updateDish,
  toggleAvailability,
  deleteDish
} = require("../controllers/dishController");

// ==============================
// GET single dish
// GET /api/v1/dishes/:id
// ==============================
router.get("/dishes/:id", getDish);

// ==============================
// UPDATE dish
// PUT /api/v1/restaurants/:restaurantId/dish/:id
// ==============================
router.put(
  "/restaurants/:restaurantId/dish/:id",
  isAuthenticated,
  upload.single("image"),
  updateDish
);

// ==============================
// TOGGLE availability
// PATCH /api/v1/dishes/:id/availability
// ==============================
router.patch(
  "/dishes/:id/availability",
  isAuthenticated,
  toggleAvailability
);

// ==============================
// DELETE dish
// DELETE /api/v1/dishes/:id
// ==============================
router.delete("/dishes/:id", isAuthenticated, deleteDish);

module.exports = router;
