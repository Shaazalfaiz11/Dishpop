const jwt = require("jsonwebtoken");
const User = require("../models/Owner.model.js");
const { ErrorHandler } = require("./error.js");

const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookies or headers
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return next(new ErrorHandler("Authentication required", 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user using restaurantId
    const user = await User.findOne({ restaurantId: decoded.restaurantId }).select("-password");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
};

module.exports = { isAuthenticated };
