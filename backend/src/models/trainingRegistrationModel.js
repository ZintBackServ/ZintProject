const mongoose = require("mongoose");

const trainingRegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    timetableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timetable",
      required: true,
      index: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    faculty: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    studentEmail: {
      type: String,
      trim: true,
    },
    confirmationSent: {
      type: Boolean,
      default: false,
    },
    reminderSent: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate registration by the same student for the same class
trainingRegistrationSchema.index({ userId: 1, timetableId: 1 }, { unique: true });

module.exports = mongoose.model("TrainingRegistration", trainingRegistrationSchema);
