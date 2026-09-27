const rateLimit = require("express-rate-limit");

// Global rate limiter across all endpoints (300 requests per 15 min per IP)
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: "Too many requests from this IP. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/" || req.path === "/api/health" || req.path.startsWith("/api/payments/webhook"),
});

// Limit public form submissions (Enquiries, Applications, Ratings) to 10 per 15 minutes per IP
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, msg: "Too many submissions from this IP. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const messagingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, msg: "Too many requests. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { globalApiLimiter, formLimiter, messagingLimiter };

