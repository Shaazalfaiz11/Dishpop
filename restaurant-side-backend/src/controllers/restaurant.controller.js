const Owner = require("../models/Owner.model");

// ===============================
// GET restaurant by ID (Public)
// ===============================
exports.getRestaurantById = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Owner.findOne({ restaurantId }).select(
      "-password -verificationCode -verificationCodeExpire -resetOTP -resetOTPExpire"
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.json({
      success: true,
      restaurant,
    });
  } catch (err) {
    console.error("getRestaurantById ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ==============================================
// GET my restaurant (logged-in user)
// Uses: req.user.restaurantId
// ==============================================
exports.getMyRestaurant = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;

    const restaurant = await Owner.findOne({ restaurantId }).select(
      "-password -verificationCode -verificationCodeExpire -resetOTP -resetOTPExpire"
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this account",
      });
    }

    return res.json({
      success: true,
      restaurant,
    });
  } catch (err) {
    console.error("getMyRestaurant ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
