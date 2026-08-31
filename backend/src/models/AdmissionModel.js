const mongoose = require("mongoose");

const AdmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      trim: true,
    },

    fatherName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
      lowercase: true,
    },

    mobileNumber: {
      type: String,
      trim: true,
    },

    fatherMobile: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
      enum: ["General", "OBC", "SC", "ST", "EWS", "Other"],
      default: "General",
    },

    gender: {
      type: String,
      trim: true,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },

    address: {
      type: String,
      trim: true,
    },

    dob: {
      type: String,
      trim: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    courseMode: {
      type: String,
      trim: true,
      enum: ["Online", "Offline"],
      default: "Online",
    },

    totalFee: {
      type: Number,
      default: 0,
    },

    batchTime: {
      type: String,
      trim: true,
    },

    batchStartTime: {
      type: String,
      trim: true,
    },

    batchEndTime: {
      type: String,
      trim: true,
    },

    courseDuration: {
      type: String,
      trim: true,
    },

    photo: {
      type: String,
      trim: true,
    },

    paymentScreenshot: {
      type: String,
      trim: true,
    },

    transactionId: {
      type: String,
      trim: true,
    },

    utrNumber: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "on hold"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// FIX: prevent a user from applying to the same course twice
AdmissionSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("Admission", AdmissionSchema);