const mongoose = require("mongoose");

const webinarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    mentor: { type: String, required: true, trim: true },
    mentorRole: { type: String, trim: true, default: "Industry Expert" },
    date: { type: Date, required: true },
    time: { type: String, required: true, trim: true },
    meetingLink: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "webdev" },
    poster: { type: String, required: true },
    isRegistrationOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Webinar", webinarSchema);
