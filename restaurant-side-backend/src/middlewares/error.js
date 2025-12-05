// Custom Error class
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Error handling middleware
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error.";

  if (err.name === "CastError") {
    err = new ErrorHandler(`Invalid ${err.path}`, 400);
  }

  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("JWT is invalid", 401);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("JWT expired", 401);
  }

  if (err.code === 11000) {
    err = new ErrorHandler(
      `Duplicate ${Object.keys(err.keyValue)} entered`,
      400
    );
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = {
  ErrorHandler,
  errorMiddleware,
};
