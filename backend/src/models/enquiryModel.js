// ── NOTE: This model is used for both General Enquiry Registration and Curriculum Download Registration (mode: "Curriculum Download") ──
const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email:    { type: String, required: true, trim: true, lowercase: true },
    mobile:   { type: String, required: true, trim: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    mode:    { type: String, required: true, trim: true }, // e.g. "Online Live"
    message: { type: String, trim: true },
    isContacted: { type: Boolean, default: false }, // for admin follow-up tracking
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);