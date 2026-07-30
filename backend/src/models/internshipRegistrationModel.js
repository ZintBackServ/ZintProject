const mongoose = require("mongoose");

const internshipRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null for guest (not-logged-in) submissions
    },

    fullName: { type: String, required: true, trim: true },
    email:    { type: String, required: true, trim: true, lowercase: true },
    phone:    { type: String, required: true, trim: true },

    degree: { type: String, trim: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    duration: { type: String, required: true, trim: true },

    isContacted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InternshipRegistration", internshipRegistrationSchema);