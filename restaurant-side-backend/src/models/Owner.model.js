const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// ===============================
// OWNER / RESTAURANT SCHEMA
// ===============================
const ownerSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: String,
      unique: true,
      default: () => "REST-" + uuidv4(),
      immutable: true,
    },

    restaurantName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },

    state: { type: String, trim: true },
    city: { type: String, trim: true },
    pincode: { type: String, trim: true },
    restaurantType: { type: String, trim: true },

    password: { type: String, required: true, select: false },
    accountVerified: { type: Boolean, default: false },

    // OTPs
    verificationCode: String,
    verificationCodeExpire: Date,
    resetOTP: String,
    resetOTPExpire: Date,
  },
  { timestamps: true }
);

// ===============================
// PASSWORD HASHING
// ===============================
ownerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password.startsWith("$2b$")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ===============================
// COMPARE PASSWORD
// ===============================
ownerSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// ===============================
// EMAIL VERIFICATION OTP
// ===============================
ownerSchema.methods.generateVerificationCode = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationCode = otp;
  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000;
  return otp;
};

// ===============================
// RESET PASSWORD OTP
// ===============================
ownerSchema.methods.generateResetOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.resetOTP = otp;
  this.resetOTPExpire = Date.now() + 10 * 60 * 1000;
  return otp;
};

// ===============================
// JWT TOKEN (UPDATED + CORRECT)
// ===============================
// MUST include BOTH email and restaurantId
// So the Dish controller can use req.user.email
// and req.user.restaurantId
// ===============================
ownerSchema.methods.getJWTToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      restaurantId: this.restaurantId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ===============================
module.exports = mongoose.model("Owner", ownerSchema);
