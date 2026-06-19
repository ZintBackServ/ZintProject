const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    // ── Razorpay Payment Fields ──────────────────────────
    paymentId: {
      type: String,
      default: null, // razorpay_payment_id after capture
    },
    orderId: {
      type: String,
      default: null, // razorpay_order_id (created on backend)
    },
    signature: {
      type: String,
      default: null, // razorpay_signature (verified on backend)
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "free"],
      default: "pending",
    },
    amount: {
      type: Number,
      default: 0, // in INR (not paise) — store readable value
    },
    currency: {
      type: String,
      default: "INR",
    },
    // ────────────────────────────────────────────────────

    purchasedAt: {
      type: Date,
      default: null,
    },
    expiredAt: {
      type: Date,
      default: null, // null = lifetime access
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "completed", "expired", "cancelled", "pending"],
      default: "pending", // stays pending until payment is verified
    },
  },
  { timestamps: true }
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Auto-expire active enrollments whose expiry date has passed
enrollmentSchema.pre("save", function () {
  if (
    this.expiredAt &&
    this.expiredAt < new Date() &&
    this.status === "active"
  ) {
    this.status = "expired";
  }
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);