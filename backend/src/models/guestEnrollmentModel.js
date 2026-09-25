const mongoose = require("mongoose");

const guestEnrollmentSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  mobile: { type: String, required: true, trim: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
  courseName: { type: String, required: true },
  mode: { type: String, enum: ["Online", "Offline"], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  orderId: { type: String, default: null, index: true },
  paymentId: { type: String, default: null },
  signature: { type: String, default: null },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "free"], default: "pending" },
  status: { type: String, enum: ["pending", "active", "cancelled"], default: "pending" },
  purchasedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("GuestEnrollment", guestEnrollmentSchema);
