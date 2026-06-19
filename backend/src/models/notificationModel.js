const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    image: { type: String, default: null }, // image URL (Cloudinary or any CDN)

    type: {
      type: String,
      enum: ["course", "event", "announcement"],
      required: true,
    },

    // Dynamically references Course or Event collection based on type
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null, // null for announcements (no linked content)
    },

    isActive: { type: Boolean, default: true }, // admin can hide without deleting
    expiresAt: { type: Date, default: null },    // auto-hide after this date (optional)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);