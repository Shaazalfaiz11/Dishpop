const sendToken = (user, statusCode, message, res) => {
  // Generate JWT with restaurantId
  const token = user.getJWTToken(); // Make sure getJWTToken() uses restaurantId

  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7;

  const options = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message,
      token,
      user: {
        restaurantId: user.restaurantId, // use restaurantId instead of _id
        email: user.email,
        ownerName: user.ownerName,
        phone: user.phone,
        restaurantName: user.restaurantName,
      },
    });
};

module.exports = sendToken;
