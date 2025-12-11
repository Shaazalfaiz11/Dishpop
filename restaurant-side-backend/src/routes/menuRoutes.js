// routes/menu.routes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { isAuthenticated } = require("../middlewares/isAuthenticated");

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


router.get('/restaurants/:restaurantId/menu', getMenu);

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



//// admin
router.get("/dishes/by-email/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const owner = await Owner.findOne({ email });

    if (!owner) return res.status(404).json({ success: false, message: "Restaurant not found" });

    const dishes = await Dish.find({ restaurantEmail: email });

    return res.json({ success: true, dishes });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
