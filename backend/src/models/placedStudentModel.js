const mongoose = require("mongoose");

const placedStudentSchema = new mongoose.Schema(
  {
    // FIX: link to User so placed student record is tied to an actual account
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // optional — historical records may predate user accounts
    },

    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // FIX: ref to Course instead of a free-text string, for consistency
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    course: {
      type: String, // keep as fallback display name if courseId is not set
      required: true,
    },

    company: {
      type: String, // FIX: removed the erroneous "// years" comment
      required: true,
    },

    package: {
      type: String, // e.g. "12 LPA"
    },

    profileImage: {
      type: String,
      required: true,
    },

    logoImage: {
      type: String, // company logo URL
    },
  },
  { timestamps: true } // FIX: was "timestaps" (typo)
);

module.exports = mongoose.model("PlacedStudent", placedStudentSchema); // FIX: PascalCase model name