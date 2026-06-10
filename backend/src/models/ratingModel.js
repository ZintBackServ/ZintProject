const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    // what is being rated
    // targetId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    // },
    targetType: {
      type: String,
      enum: ["event", "course", "mentor", "internship"],
      required: true,
    },
    targetName: {
      type: String,
      required: true,
      trim: true,
    },

    // who gave the rating
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // the rating itself
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    // admin can show/hide a review
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// one student can rate same target only once
ratingSchema.index({ targetId: 1, studentEmail: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
