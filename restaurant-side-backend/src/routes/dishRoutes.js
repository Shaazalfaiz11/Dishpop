// // routes/dish.routes.js
// const express = require('express');
// const router = express.Router();
// const upload = require('../middlewares/upload.middleware');
// const { isAuthenticated } = require("../middlewares/isAuthenticated");

// const {
//   toggleAvailability,
//   updateStatus,
//   getDish,
//   getDishStats,
//   updateDish
// } = require('../controllers/dishController');

// // GET single dish - PUBLIC
// router.get("/dishes/:id", getDish);

// // TOGGLE availability - PROTECTED
// router.patch('/dishes/:id/availability', isAuthenticated, toggleAvailability);

// // UPDATE dish - PROTECTED
// router.put(
//   '/restaurants/:restaurantId/dish/:id',
//   isAuthenticated,
//   upload.single('image'),
//   updateDish
// );

// module.exports = router;
// routes/dishRoutes.js

const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const isAuthenticated = require("../middlewares/isAuthenticated");

const {
  getDish,
  updateDish,
  deleteDish
} = require("../controllers/dishController");

// =====================
// GET SINGLE DISH (PUBLIC)
// =====================
router.get(
  "/restaurants/:restaurantId/dishes/:dishId",
  getDish
);

// =====================
// UPDATE DISH (PROTECTED)
// =====================
router.patch(
  "/restaurants/:restaurantId/dishes/:dishId",
  isAuthenticated,
  upload.single("image"),
  updateDish
);

// =====================
// DELETE DISH (PROTECTED)
// =====================
router.delete(
  "/restaurants/:restaurantId/dishes/:dishId",
  isAuthenticated,
  deleteDish
);

module.exports = router;
