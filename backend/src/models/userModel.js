const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true, // FIX: normalize email to lowercase consistently
      index: true,
    },

    contactNo: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // never returned in queries
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    refreshToken: {
      type: String,
      select: false, // FIX: sensitive — hide from queries just like password
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);