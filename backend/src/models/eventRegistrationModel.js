const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
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
    },

    highestQualification: {
      type: String,
      trim: true,
      required: false,
    },
  },
  { timestamps: true }
);

// A given email can only register once for a given event
eventRegistrationSchema.index({ event: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("EventRegistration", eventRegistrationSchema);