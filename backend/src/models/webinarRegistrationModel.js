const mongoose = require("mongoose");

const webinarRegistrationSchema = new mongoose.Schema(
  {
    webinar: { type: mongoose.Schema.Types.ObjectId, ref: "Webinar", required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    status: { type: String, trim: true, default: "Student" },
    interest: { type: String, trim: true, default: "" },
    whatsAppSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

webinarRegistrationSchema.index({ webinar: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("WebinarRegistration", webinarRegistrationSchema);
