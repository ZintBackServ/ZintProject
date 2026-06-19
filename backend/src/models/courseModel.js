const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseImage: {
      type: String,
      required: true,
      trim: true,
    },

    courseCurriculum: {
      type: String,
      trim: true,
    },

    courseCertificate: {
      type: String,
      trim: true,
    },

    courseName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    fee: {
      type: Number,
      required: true,
    },

    about: {
      type: String,
      required: true,
      trim: true,
    },

    trending: {
      type: Boolean,
      required: true,
      default: false,
    },

    mode: {
      type: String,
      required: true,
      enum: ["Online", "Offline", "Hybrid"], // FIX: enumerate valid modes
    },

    type: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    subCategory: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date, // FIX: use Date instead of String for proper querying/sorting
    },

    language: {
      type: String,
    },

    // FIX: add reference to mentors assigned to this course
    mentors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor",
      },
    ],

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true } // FIX: add timestamps (was missing entirely)
);

module.exports = mongoose.model("Course", courseSchema);