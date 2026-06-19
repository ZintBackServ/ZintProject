const mongoose = require("mongoose");

const AdmissionSchema = new mongoose.Schema(
  {
    // FIX: added userId so every admission is tied to a registered user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    email:{
      type: String,
      required: true,
      trim: true,
      index: true,
      lower:true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    // FIX: track admission status so admins can approve/reject
    status: {
      type: String,
      enum: ["pending", "completed", "on hold"],
      default: "pending",
    },
  },
  { timestamps: true } // FIX: was "timestaps" (typo)
);

// FIX: prevent a user from applying to the same course twice
AdmissionSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("Admission", AdmissionSchema);