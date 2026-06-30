// courseModel.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseImage: {
      type: String,
      trim: true,
      default: function () {
        return this.courseName;
      }
    },
    courseCurriculum:  { type: String, trim: true },
    courseCertificate: { type: String, trim: true },

    courseName: { type: String, required: true, trim: true, index: true },
    duration:   { type: String, required: true, trim: true },
    fee:        { type: Number },
    online_fee: { type: Number },
    about:      { type: String,  trim: true },
    trending:   { type: Boolean, required: true, default: false },

    mode: {
      type: String,
      required: true,
      enum: ["Online", "Offline", "Hybrid"],
    },
    type:     { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    startDate: { type: Date },
    language:  { type: String },
    mentors:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Mentor" }],
    rating:    { type: Number, min: 0, max: 5, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);