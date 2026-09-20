const mongoose = require("mongoose");

const jobInterestSchema = new mongoose.Schema(
  {
    jobUpdate: { type: mongoose.Schema.Types.ObjectId, ref: "JobUpdate", required: true },
    name: { type: String, trim: true, default: "" },
    phone: { type: String, required: true, trim: true },
    whatsAppSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobInterest", jobInterestSchema);
