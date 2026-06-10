const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    // FIX: restore targetId — it was commented out, breaking the unique index below
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      // Points to an Event, Course, Mentor, or Enrollment depending on targetType
    },

    targetType: {
      type: String,
      enum: ["event", "course", "mentor", "internship"],
      required: true,
    },

    targetName: {
      type: String,
      required: true,
      trim: true,
    },

    // FIX: link to User instead of storing name/email as plain strings
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Keep denormalized fields for display without extra lookups
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    studentEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    // admin can show/hide a review
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// FIX: unique index now works because targetId is no longer commented out
// One user can rate the same target only once
ratingSchema.index({ targetId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);