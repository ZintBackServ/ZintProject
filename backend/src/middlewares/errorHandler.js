// middlewares/errorHandler.js — centralized Express error handler
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} →`, err.message, err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ success: false, message: `${field} already exists.` });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
  }

  // Default
  const status = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";
  return res.status(status).json({
    success: false,
    message: isProd && status === 500 ? "Internal Server Error" : (err.message || "Internal Server Error"),
  });
};

module.exports = errorHandler;
