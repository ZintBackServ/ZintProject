const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    eventName: {
      type: String,
      required: true,
    },

    // FIX: link to User so registrations can be queried by account
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // optional — allow guest/walk-in registrations
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    rollNo: {
      type: String,
      trim: true,
      default: "",
    },

    // FIX: prevent a person from registering for the same event twice
  },
  { timestamps: true }
);

// FIX: one email per event — prevents duplicate registrations
registrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);