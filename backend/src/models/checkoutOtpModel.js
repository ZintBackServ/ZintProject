const mongoose = require("mongoose");

const checkoutOtpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  fullName: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  otpHash: { type: String, required: true, select: false },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, expires: 0 },
}, { timestamps: true });

module.exports = mongoose.model("CheckoutOtp", checkoutOtpSchema);
