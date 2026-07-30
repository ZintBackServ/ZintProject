const mongoose = require("mongoose");

const placementRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null for guest (not-logged-in) submissions
    },

    fullName: { type: String, required: true, trim: true },
    email:    { type: String, required: true, trim: true, lowercase: true },
    phone:    { type: String, required: true, trim: true },

    course: { type: String, required: true, trim: true }, // plain course name, no reference

    message: { type: String, trim: true }, // optional

    isContacted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlacementRegistration", placementRegistrationSchema);