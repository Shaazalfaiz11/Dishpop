// admin-backend/models/owner.js
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ownerSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: String,
      unique: true,
      immutable: true,
    },
    restaurantName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    state: { type: String, trim: true },
    city: { type: String, trim: true },
    pincode: { type: String, trim: true },
    restaurantType: { type: String, trim: true },

    password: { type: String, required: true, select: false },
    accountVerified: { type: Boolean, default: false },

    verificationCode: { type: String },
    verificationCodeExpire: Date,

    resetOTP: { type: String },
    resetOTPExpire: Date,
  },
  { timestamps: true }
);

// ⚠️ IMPORTANT: the collection name must match the main backend
// default for model "Owner" is "owners", which matches your original schema.
const Owner = mongoose.model("Owner", ownerSchema);

export default Owner;
