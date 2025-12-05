// const { ErrorHandler } = require("../middlewares/error.js");
// const { catchAsyncError } = require("../middlewares/catchAsyncError.js");
// const User = require("../models/Owner.model.js");
// const sendEmail = require("../utils/sendEmail.js");
// const sendToken = require("../utils/sendToken.js");

// // Normalize email
// const normalizeEmail = (email = "") => email.toString().trim().toLowerCase();

// // ==================== REGISTER ====================
// const register = catchAsyncError(async (req, res, next) => {
//   let {
//     restaurantName,
//     ownerName,
//     email,
//     phone,
//     state,
//     city,
//     pincode,
//     restaurantType,
//     password,
//     confirmPassword,
//   } = req.body;

//   email = normalizeEmail(email);

//   if (!ownerName || !email || !phone || !password || !confirmPassword)
//     return next(new ErrorHandler("Required fields missing.", 400));

//   if (password !== confirmPassword)
//     return next(new ErrorHandler("Password and confirm password do not match.", 400));

//   const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
//   if (!passwordRegex.test(password))
//     return next(
//       new ErrorHandler(
//         "Password must be 8+ characters, include uppercase, lowercase, and number.",
//         400
//       )
//     );

//   const existingVerified = await User.findOne({
//     $or: [{ email }, { phone }],
//     accountVerified: true,
//   });

//   if (existingVerified) return next(new ErrorHandler("Email or phone already in use.", 400));

//   let user = await User.findOne({ email });

//   if (user && !user.accountVerified) {
//     user.restaurantName = restaurantName ?? user.restaurantName;
//     user.ownerName = ownerName ?? user.ownerName;
//     user.phone = phone ?? user.phone;
//     user.state = state ?? user.state;
//     user.city = city ?? user.city;
//     user.pincode = pincode ?? user.pincode;
//     user.restaurantType = restaurantType ?? user.restaurantType;
//     user.password = password;
//     user.accountVerified = true;
//   } else if (!user) {
//     user = await User.create({
//       restaurantName,
//       ownerName,
//       email,
//       phone,
//       state,
//       city,
//       pincode,
//       restaurantType,
//       password,
//       accountVerified: true,
//     });
//   }

//   await user.save({ validateBeforeSave: false });

//   return res.status(201).json({
//     success: true,
//     message: "Registration successful.",
//     user: {
//       id: user._id,
//       restaurantName: user.restaurantName,
//       ownerName: user.ownerName,
//       email: user.email,
//       phone: user.phone,
//       state: user.state,
//       city: user.city,
//       pincode: user.pincode,
//       restaurantType: user.restaurantType,
//       accountVerified: user.accountVerified,
//     },
//   });
// });

// // ==================== LOGIN ====================
// const login = catchAsyncError(async (req, res, next) => {
//   let { email, password } = req.body;
//   email = normalizeEmail(email);

//   if (!email || !password)
//     return next(new ErrorHandler("Please provide email and password.", 400));

//   const user = await User.findOne({ email }).select("+password");
//   if (!user)
//     return next(new ErrorHandler("Invalid credentials or account not verified.", 400));

//   if (!user.accountVerified)
//     return next(new ErrorHandler("Account not verified.", 400));

//   const isMatch = await user.comparePassword(password);
//   if (!isMatch) return next(new ErrorHandler("Invalid credentials.", 400));

//   return sendToken(user, 200, "Logged in successfully.", res);
// });

// // ==================== LOGOUT ====================
// const logout = catchAsyncError(async (req, res, next) => {
//   res
//     .cookie("token", "", {
//       expires: new Date(0),
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Strict",
//     })
//     .status(200)
//     .json({ success: true, message: "Logged out successfully." });
// });

// // ==================== PROFILE ====================
// const getProfile = catchAsyncError(async (req, res, next) => {
//   const user = await User.findById(req.user._id);
//   if (!user) return next(new ErrorHandler("User not found.", 404));
//   res.status(200).json({ success: true, user });
// });

// // ==================== FORGOT PASSWORD ====================
// const sendForgotOTP = catchAsyncError(async (req, res, next) => {
//   let { email } = req.body;
//   email = normalizeEmail(email);

//   if (!email) return next(new ErrorHandler("Email required.", 400));

//   const user = await User.findOne({ email, accountVerified: true });
//   if (!user) return next(new ErrorHandler("User not found.", 404));

//   const otp = user.generateResetOTP();
//   await user.save({ validateBeforeSave: false });

//   const emailHtml = `<p>Your password reset OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`;
//   await sendEmail({ email: user.email, subject: "Password Reset OTP", message: emailHtml });

//   return res.status(200).json({ success: true, message: "Reset OTP sent to email." });
// });

// // ==================== VERIFY FORGOT OTP ====================
// const verifyForgotOTP = catchAsyncError(async (req, res, next) => {
//   let { email, otp } = req.body;
//   email = normalizeEmail(email);

//   if (!email || !otp) return next(new ErrorHandler("Email and OTP required.", 400));

//   const user = await User.findOne({ email });
//   if (!user) return next(new ErrorHandler("User not found.", 404));

//   if (!user.resetOTP || user.resetOTP.toString() !== otp.toString())
//     return next(new ErrorHandler("Invalid OTP.", 400));

//   if (Date.now() > new Date(user.resetOTPExpire).getTime())
//     return next(new ErrorHandler("OTP expired.", 400));

//   return res.status(200).json({ success: true, message: "OTP verified." });
// });

// // ==================== RESET PASSWORD ====================
// const resetPassword = catchAsyncError(async (req, res, next) => {
//   let { email, otp, password, confirmPassword } = req.body;
//   email = normalizeEmail(email);

//   if (!email || !otp || !password || !confirmPassword)
//     return next(new ErrorHandler("All fields are required.", 400));

//   if (password !== confirmPassword)
//     return next(new ErrorHandler("Passwords do not match.", 400));

//   const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
//   if (!passwordRegex.test(password))
//     return next(
//       new ErrorHandler(
//         "Password must be 8+ characters, include uppercase, lowercase, and number.",
//         400
//       )
//     );

//   const user = await User.findOne({ email }).select("+resetOTP +resetOTPExpire +password");
//   if (!user) return next(new ErrorHandler("User not found.", 404));

//   if (!user.resetOTP || user.resetOTP.toString() !== otp.toString())
//     return next(new ErrorHandler("Invalid OTP.", 400));

//   if (Date.now() > new Date(user.resetOTPExpire).getTime())
//     return next(new ErrorHandler("OTP expired.", 400));

//   user.password = password;
//   user.resetOTP = undefined;
//   user.resetOTPExpire = undefined;

//   await user.save();

//   return sendToken(user, 200, "Password reset successfully and logged in.", res);
// });

// // ==================== EXPORT ====================
// module.exports = {
//   register,
//   login,
//   logout,
//   getProfile,
//   sendForgotOTP,
//   verifyForgotOTP,
//   resetPassword,
// };
const { ErrorHandler } = require("../middlewares/error.js");
const { catchAsyncError } = require("../middlewares/catchAsyncError.js");
const User = require("../models/Owner.model.js");
const sendEmail = require("../utils/sendEmail.js");
const sendToken = require("../utils/sendToken.js");

// Normalize email
const normalizeEmail = (email = "") => email.toString().trim().toLowerCase();

// ==================== REGISTER ====================
const register = catchAsyncError(async (req, res, next) => {
  let {
    restaurantName,
    ownerName,
    email,
    phone,
    state,
    city,
    pincode,
    restaurantType,
    password,
    confirmPassword,
  } = req.body;

  email = normalizeEmail(email);

  if (!ownerName || !email || !phone || !password || !confirmPassword)
    return next(new ErrorHandler("Required fields missing.", 400));

  if (password !== confirmPassword)
    return next(new ErrorHandler("Password and confirm password do not match.", 400));

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password))
    return next(
      new ErrorHandler(
        "Password must be 8+ characters, include uppercase, lowercase, and number.",
        400
      )
    );

  const existingVerified = await User.findOne({
    $or: [{ email }, { phone }],
    accountVerified: true,
  });

  if (existingVerified) return next(new ErrorHandler("Email or phone already in use.", 400));

  let user = await User.findOne({ email });

  if (user && !user.accountVerified) {
    user.restaurantName = restaurantName ?? user.restaurantName;
    user.ownerName = ownerName ?? user.ownerName;
    user.phone = phone ?? user.phone;
    user.state = state ?? user.state;
    user.city = city ?? user.city;
    user.pincode = pincode ?? user.pincode;
    user.restaurantType = restaurantType ?? user.restaurantType;
    user.password = password;
    user.accountVerified = true;
  } else if (!user) {
    user = await User.create({
      restaurantName,
      ownerName,
      email,
      phone,
      state,
      city,
      pincode,
      restaurantType,
      password,
      accountVerified: true,
    });
  }

  await user.save({ validateBeforeSave: false });

  return sendToken(user, 201, "Registration successful.", res);
});

// ==================== LOGIN ====================
const login = catchAsyncError(async (req, res, next) => {
  let { email, password } = req.body;
  email = normalizeEmail(email);

  if (!email || !password)
    return next(new ErrorHandler("Please provide email and password.", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user)
    return next(new ErrorHandler("Invalid credentials or account not verified.", 400));

  if (!user.accountVerified)
    return next(new ErrorHandler("Account not verified.", 400));

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new ErrorHandler("Invalid credentials.", 400));

  return sendToken(user, 200, "Logged in successfully.", res);
});

// ==================== LOGOUT ====================
const logout = catchAsyncError(async (req, res, next) => {
  res
    .cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    })
    .status(200)
    .json({ success: true, message: "Logged out successfully." });
});

// ==================== PROFILE ====================
const getProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ restaurantId: req.user.restaurantId });
  if (!user) return next(new ErrorHandler("User not found.", 404));
  res.status(200).json({ success: true, user });
});

// ==================== FORGOT PASSWORD ====================
const sendForgotOTP = catchAsyncError(async (req, res, next) => {
  let { email } = req.body;
  email = normalizeEmail(email);

  if (!email) return next(new ErrorHandler("Email required.", 400));

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) return next(new ErrorHandler("User not found.", 404));

  const otp = user.generateResetOTP();
  await user.save({ validateBeforeSave: false });

  const emailHtml = `<p>Your password reset OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`;
  await sendEmail({ email: user.email, subject: "Password Reset OTP", message: emailHtml });

  return res.status(200).json({ success: true, message: "Reset OTP sent to email." });
});

// ==================== VERIFY FORGOT OTP ====================
const verifyForgotOTP = catchAsyncError(async (req, res, next) => {
  let { email, otp } = req.body;
  email = normalizeEmail(email);

  if (!email || !otp) return next(new ErrorHandler("Email and OTP required.", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found.", 404));

  if (!user.resetOTP || user.resetOTP.toString() !== otp.toString())
    return next(new ErrorHandler("Invalid OTP.", 400));

  if (Date.now() > new Date(user.resetOTPExpire).getTime())
    return next(new ErrorHandler("OTP expired.", 400));

  return res.status(200).json({ success: true, message: "OTP verified." });
});

// ==================== RESET PASSWORD ====================
const resetPassword = catchAsyncError(async (req, res, next) => {
  let { email, otp, password, confirmPassword } = req.body;
  email = normalizeEmail(email);

  if (!email || !otp || !password || !confirmPassword)
    return next(new ErrorHandler("All fields are required.", 400));

  if (password !== confirmPassword)
    return next(new ErrorHandler("Passwords do not match.", 400));

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password))
    return next(
      new ErrorHandler(
        "Password must be 8+ characters, include uppercase, lowercase, and number.",
        400
      )
    );

  const user = await User.findOne({ email }).select("+resetOTP +resetOTPExpire +password");
  if (!user) return next(new ErrorHandler("User not found.", 404));

  if (!user.resetOTP || user.resetOTP.toString() !== otp.toString())
    return next(new ErrorHandler("Invalid OTP.", 400));

  if (Date.now() > new Date(user.resetOTPExpire).getTime())
    return next(new ErrorHandler("OTP expired.", 400));

  user.password = password;
  user.resetOTP = undefined;
  user.resetOTPExpire = undefined;

  await user.save();

  return sendToken(user, 200, "Password reset successfully and logged in.", res);
});

// ==================== EXPORT ====================
module.exports = {
  register,
  login,
  logout,
  getProfile,
  sendForgotOTP,
  verifyForgotOTP,
  resetPassword,
};
