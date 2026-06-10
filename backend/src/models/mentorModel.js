const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    mentorName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    expertise: {
      type: [String], // e.g. ["React", "Node", "DSA"]
      required: true,
    },

    experience: {
      type: String, // e.g. "5 years"
    },

    bio: {
      type: String,
    },

    profileImage: {
      type: String,
      required: true,
    },

    // FIX: link mentor back to a User account if they are registered users
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // optional — some mentors may be external
    },

    // FIX: store computed/cached average rating instead of re-querying every time
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true } // FIX: was "timestaps" (typo)
);

module.exports = mongoose.model("Mentor", mentorSchema);