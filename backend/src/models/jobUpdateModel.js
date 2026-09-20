const mongoose = require("mongoose");

const jobUpdateSchema = new mongoose.Schema(
  {
    poster: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobUpdate", jobUpdateSchema);
