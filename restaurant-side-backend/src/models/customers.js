const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: String,
      required: true,
      index: true,
    },

    tableNumber: {
      type: Number,
      default: null,
    },

    customerName: {
      type: String,
      trim: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    items: [
      {
        itemId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "Dish", // optional
        },
        name: String,
        qty: Number,
        price: Number,
        imageUrl: String,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "completed"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

// Indexes for speed
CustomerSchema.index({ restaurantId: 1, createdAt: -1 });
CustomerSchema.index({ restaurantId: 1, status: 1 });

module.exports = mongoose.model("Customer", CustomerSchema, "customers");
