// src/controllers/orderController.js

// FIXED: correct variable name
const Customer = require("../models/customers");

/**
 * USER SIDE: Create order
 */
exports.createOrder = async (req, res) => {
  try {
    const {
      restaurantId,
      tableNumber,
      customerName,
      phoneNumber,
      description,
      items,
    } = req.body;

    if (!restaurantId || !customerName || !phoneNumber || !items?.length) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const order = await Customer.create({
      restaurantId,
      tableNumber,
      customerName,
      phoneNumber,
      description,
      items,
      status: "pending",
    });

    const io = req.app.get("io");
    io.to(String(restaurantId)).emit("newOrder", order);

    res.status(201).json({ msg: "Order created", order });
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


/**
 * RESTAURANT SIDE: Get all orders
 */
exports.getRestaurantOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { status } = req.query;

    const filter = { restaurantId };
    if (status && status !== "all") filter.status = status;

    const orders = await Customer.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json({ orders });
  } catch (err) {
    console.error("getRestaurantOrders error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


/**
 * RESTAURANT SIDE: Update order status
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "preparing", "ready", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const order = await Customer.findById(orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.status = status;
    await order.save({ validateBeforeSave: false });

    const io = req.app.get("io");
    io.to(String(order.restaurantId)).emit("orderStatusUpdated", order);

    res.json({ msg: "Status updated", order });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
