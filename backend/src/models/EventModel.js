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
      type: Date,
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

    // speakers are now plain names, not Mentor references
    speakers: [
      {
        type: String,
        trim: true,
      },
    ],

    isRegistrationOpen: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);