const mongoose = require("mongoose");

const CATEGORIES = [
  "Online Training",
  "Classroom Training",
  "Workshops",
  "Internships",
  "Weekend Training",
  "Other Classes",
];

const timetableSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
      index: true,
    },
    course:      { type: String, required: true, trim: true },
    faculty:     { type: String, required: true, trim: true },
    date:        { type: String, required: true, trim: true }, // e.g. "25 May 2026"
    time:        { type: String, required: true, trim: true }, // e.g. "9:15 AM (IST)"
    meetingLink: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Timetable = mongoose.model("Timetable", timetableSchema);

module.exports = Timetable;
module.exports.CATEGORIES = CATEGORIES;