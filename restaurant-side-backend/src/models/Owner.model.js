// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // SCHEMA
// const ownerSchema = new mongoose.Schema(
//   {
//     restaurantName: { type: String, required: true, trim: true },
//     ownerName: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     phone: { type: String, required: true, unique: true, trim: true },
//     state: { type: String, trim: true },
//     city: { type: String, trim: true },
//     pincode: { type: String, trim: true },
//     restaurantType: { type: String, trim: true },

//     password: { type: String, required: true, select: false },
//     accountVerified: { type: Boolean, default: false },

//     // EMAIL VERIFICATION OTP
//     verificationCode: { type: String },
//     verificationCodeExpire: Date,

//     // FORGOT PASSWORD OTP
//     resetOTP: { type: String },
//     resetOTPExpire: Date,
//   },
//   { timestamps: true }
// );

// // 🔒 PRE-SAVE HOOK — FIX DOUBLE HASHING
// ownerSchema.pre("save", async function (next) {
//   // If password is not modified → skip hashing
//   if (!this.isModified("password")) return next();

//   // If password is already hashed (bcrypt hashed passwords start with $2b$)
//   if (this.password.startsWith("$2b$")) return next();

//   // Otherwise hash the password
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// // 🔑 COMPARE PASSWORD
// ownerSchema.methods.comparePassword = async function (enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password);
// };

// // 🔢 GENERATE EMAIL VERIFICATION OTP
// ownerSchema.methods.generateVerificationCode = function () {
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   this.verificationCode = otp;
//   this.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
//   return otp;
// };

// // 🔢 GENERATE FORGOT PASSWORD OTP
// ownerSchema.methods.generateResetOTP = function () {
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   this.resetOTP = otp;
//   this.resetOTPExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
//   return otp;
// };

// // 🔐 GENERATE JWT TOKEN
// ownerSchema.methods.getJWTToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
// };

// // EXPORT MODEL
// const Owner = mongoose.model("Owner", ownerSchema);
// module.exports = Owner;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid"); // for unique restaurantId

// SCHEMA
const ownerSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: String,
      unique: true,
      default: () => "REST-" + uuidv4(), // e.g., REST-550e8400-e29b-41d4-a716-446655440000
      immutable: true, // cannot be changed later
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

    // EMAIL VERIFICATION OTP
    verificationCode: { type: String },
    verificationCodeExpire: Date,

    // FORGOT PASSWORD OTP
    resetOTP: { type: String },
    resetOTPExpire: Date,
  },
  { timestamps: true }
);

// 🔒 PRE-SAVE HOOK — FIX DOUBLE HASHING
ownerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password.startsWith("$2b$")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// 🔑 COMPARE PASSWORD
ownerSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// 🔢 GENERATE EMAIL VERIFICATION OTP
ownerSchema.methods.generateVerificationCode = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationCode = otp;
  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 min
  return otp;
};

// 🔢 GENERATE FORGOT PASSWORD OTP
ownerSchema.methods.generateResetOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.resetOTP = otp;
  this.resetOTPExpire = Date.now() + 10 * 60 * 1000; // 10 min
  return otp;
};

// 🔐 GENERATE JWT TOKEN USING restaurantId
// ownerSchema.methods.getJWTToken = function () {
//   return jwt.sign({ restaurantId: this.restaurantId }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

ownerSchema.methods.getJWTToken = function () {
  return jwt.sign({ restaurantId: this.restaurantId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// EXPORT MODEL
const Owner = mongoose.model("Owner", ownerSchema);
module.exports = Owner;
