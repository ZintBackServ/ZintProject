const mongoose = require("mongoose");

const latestUpdateSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true, trim: true },
    pdf:     { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LatestUpdate", latestUpdateSchema);