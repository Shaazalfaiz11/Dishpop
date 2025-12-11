// routes/menu.routes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const isAuthenticated = require("../middlewares/isAuthenticated");

const Dish = require('../models/Dish'); 
const {
  getMenu,
  createDish,
  deleteDish
} = require('../controllers/menu.controller');
const { getDish } = require('../controllers/dishController');

// GET all categories - PUBLIC
router.get('/restaurants/:restaurantId/categories', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const categories = await Dish.distinct("category", { restaurantId });
    return res.json({ success: true, data: categories });
  } catch (err) {
    console.error("Category fetch error:", err);
    return res.status(500).json({ success: false, message: "Error fetching categories" });
  }
});

// GET full menu - PUBLIC
router.get('/restaurants/:restaurantId/menu', getMenu);

// GET single dish from menu - PUBLIC
router.get("/restaurants/:restaurantId/menu/:id", getDish);

// CREATE dish - PROTECTED
router.post(
  '/restaurants/:restaurantId/menu',
  isAuthenticated,
  upload.single('image'),
  createDish
);

// DELETE dish - PROTECTED
router.delete(
  '/restaurants/:restaurantId/menu/:id',
  isAuthenticated,
  deleteDish
);

module.exports = router;
