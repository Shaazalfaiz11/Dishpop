import mongoose from "mongoose";

const dishSchema = new mongoose.Schema(
  {
    restaurantId: { type: String, required: true },
    restaurantEmail: { type: String, required: true },
    name: String,
    slug: String,
    price: Number,
    description: String,
    category: String,
    available: Boolean,
    isVeg: Boolean,
    imageUrl: String,
    thumbnailUrl: String,
    arModelUrl: String,
    iosModelUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Dish", dishSchema);
