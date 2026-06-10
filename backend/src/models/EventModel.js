const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    about: {
      type: String,
      required: true,
    },

    date: {
      type: Date, // FIX: use Date instead of String for sorting and querying
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    place: {
      type: String,
      required: true,
    },

    eventImage: {
      type: String,
      required: true,
    },

    // FIX: link event to one or more mentors/speakers
    speakers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor",
      },
    ],

    // FIX: track whether registrations are still open
    isRegistrationOpen: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // FIX: was "timestaps" (typo)
);

module.exports = mongoose.model("Event", eventSchema);