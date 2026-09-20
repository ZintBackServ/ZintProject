const mongoose = require("mongoose");

const studentDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      index: true,
    },
    fatherName: {
      type: String,
      required: [true, "Father's name is required"],
      trim: true,
    },
    whatsappNumber: {
      type: String,
      required: [true, "WhatsApp number is required"],
      trim: true,
      index: true,
    },
    course: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      index: true,
    },
    mentor: {
      type: String,
      required: [true, "Mentor name is required"],
      trim: true,
      index: true,
    },
    courseStartDate: {
      type: Date,
      required: [true, "Course start date is required"],
    },
    courseDuration: {
      type: String,
      trim: true,
      default: "",
    },
    batchTime: {
      type: String,
      required: [true, "Batch time is required"],
      trim: true,
    },
    // Stored separately so batch start time can be scheduled reliably. `batchTime`
    // remains as a display/legacy value for records created before this change.
    batchStartTime: {
      type: String,
      trim: true,
      default: "",
    },
    batchEndTime: {
      type: String,
      trim: true,
      default: "",
    },
    fee: {
      type: Number,
      default: 0,
    },

    // ── Admin Managed Fields ──
    notes: {
      type: String,
      default: "",
    },
    nextFeeDate: {
      type: Date,
      default: null,
    },
    nextFeeAmount: {
      type: Number,
      default: 0,
    },
    isAllFeeSubmitted: {
      type: Boolean,
      default: false,
    },
    isLockedForStudent: {
      type: Boolean,
      default: true,
    },
    isVerifiedByAdmin: {
      type: Boolean,
      default: false,
    },

    // ── Reminder Tracking ──
    lastFeeReminderSentDate: {
      type: String,
      default: null,
    },
    lastBatchReminderSentDate: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentDetail", studentDetailSchema);
