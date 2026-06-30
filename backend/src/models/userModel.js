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
      lowercase: true,
      index: true,
    },
    contactNo: {
      type: String,
      unique: true,
      sparse: true,      // allows null/undefined for Google-only users
      index: true,
    },
    password: {
      type: String,
      required: false,   // not required for Google OAuth users
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
      select: false,
    },

    //  Google OAuth
    googleId: {
      type: String,
      unique: true,
      sparse: true,      // allows multiple docs with null googleId
      index: true,
    },
    avatar: {
      type: String,      // profile picture URL from Google
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    //  Email OTP Verification 
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false,     // never returned in normal queries
    },
    otpExpiry: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);