const rateLimit = require("express-rate-limit");

// Limit public form submissions (Enquiries, Applications, Ratings) to 10 per 15 minutes per IP
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, msg: "Too many submissions from this IP. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { formLimiter };
