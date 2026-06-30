const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendOTPEmail } = require("../utils/sendEmail");

const {
  isValid,
  validators,
  isValidEmail,
  isValidPassword,
} = require("../utils/validator");

const mongoose = require("mongoose");

//  Helper: generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "24hr" }
  );
};

// ── Helper: generate 6-digit OTP 
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Validation helper (same as before) 
async function validation(key, data, reply) {
  if (!validators[key](data)) {
    reply.push(`Enter Valid ${key}`);
  }
  if (key === "email") {
    let duplicateEmail = await userModel.findOne({ email: data });
    if (duplicateEmail) reply.push("Email Already Exists");
  }
  if (key === "contactNo") {
    let duplicateContact = await userModel.findOne({ contactNo: data });
    if (duplicateContact) reply.push("Contact Number Already Exists");
  }
}

//  1. Sign Up (local) — sends OTP after registration 
const signUpUser = async (req, res) => {
  let reply = [];
  try {
    let userData = req.body;
    const keys = Object.keys(userData);
    const values = Object.values(userData);
    const length = keys.length;

    if (length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided." });
    }

    let { password } = userData;

    for (let i = 0; i < length; i++) {
      await validation(keys[i], values[i], reply);
    }
    if (reply.length !== 0) {
      return res.status(400).json({ msg: reply });
    }

    // Hash password
    userData.password = await bcrypt.hash(password, 10);
    userData.role = "user";
    userData.authProvider = "local";

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    userData.otp = otp;
    userData.otpExpiry = otpExpiry;
    userData.isEmailVerified = false;

    let createUser = await userModel.create(userData);

    // Send OTP email
    await sendOTPEmail(createUser.email, otp);

    return res.status(201).json({
      msg: "User registered successfully. Please verify your email with the OTP sent.",
      userId: createUser._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

//  2. Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP are required." });
    }

    // Select otp and otpExpiry (they have select:false in schema)
    const user = await userModel
      .findOne({ email })
      .select("+otp +otpExpiry");

    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ msg: "Email is already verified." });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ msg: "OTP not found. Please request a new one." });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ msg: "OTP has expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP." });
    }

    // Mark email as verified and clear OTP fields
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      msg: "Email verified successfully.",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

//  3. Resend OTP 
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ msg: "Valid email is required." });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ msg: "Email is already verified." });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPEmail(email, otp);

    return res.status(200).json({ msg: "New OTP sent to your email." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// 4. Login (local) 
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password are required." });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    let user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }

    // Block Google-only accounts from logging in with password
    if (user.authProvider === "google" && !user.password) {
      return res.status(400).json({
        msg: "This account uses Google Sign-In. Please login with Google.",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        msg: "Email not verified. Please verify your email first.",
      });
    }

    let isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ msg: "Incorrect Password" });
    }

    const token = generateToken(user);
    return res.status(200).json({ msg: "Login Successful", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// 5. Google OAuth Callback — called by passport after Google redirects 
const googleAuthCallback = async (req, res) => {
  try {
    // req.user is set by passport (see config/passport.js)
    const user = req.user;

    if (!user) {
      return res.status(401).json({ msg: "Google authentication failed." });
    }

    const token = generateToken(user);

    // Redirect to frontend with token in query string
    // Frontend should grab the token from URL and store it
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/success?token=${token}`
    );
  } catch (error) {
    console.log(error);
    return res.redirect(`${process.env.FRONTEND_URL}/auth/google/failure`);
  }
};

//  6. Get All Users (admin only)
const getAllUser = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ msg: "Access Denied! Admin Only" });
    }
    let users = await userModel.find().sort({ createdAt: -1 });
    if (users.length === 0) {
      return res.status(404).json({ msg: "No user found" });
    }
    return res.status(200).json({
      msg: "Users Fetched Successfully",
      totalUsers: users.length,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// 7. Get Single User By ID 
const getUserById = async (req, res) => {
  try {
    let id = req.id || req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }
    let user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).json({ msg: "User Profile Fetched Successfully", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// 8. Get Multiple Users By IDs
const getUsersByIDs = async (req, res) => {
  try {
    const { ids } = req.body;
    let users = await userModel.find({ _id: { $in: ids } });
    if (!users || users.length === 0) {
      return res.status(404).json({ msg: "Users not found" });
    }
    return res.status(200).json({ msg: "Users fetched", users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// 9. Update User 
const UpdateUser = async (req, res) => {
  try {
    let reply = [];
    let id = req.params.id;
    let userData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }

    const keys = Object.keys(userData);
    const values = Object.values(userData);
    const length = keys.length;

    if (length === 0) {
      return res.status(400).json({ msg: "Bad Request! No Data Provided." });
    }

    for (let i = 0; i < length; i++) {
      await validation(keys[i], values[i], reply);
    }
    if (reply.length !== 0) {
      return res.status(400).json({ msg: reply });
    }

    let updateUser = await userModel.findByIdAndUpdate(id, userData, { new: true });
    if (!updateUser) {
      return res.status(400).json({ msg: "User not found" });
    }
    return res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// 10. Delete User 
const deleteUser = async (req, res) => {
  try {
    let id = req.params.id || req.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json("Invalid User Id");
    }
    let deleted = await userModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(400).json({ msg: "User not found" });
    }
    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  signUpUser,
  loginUser,
  verifyOTP,
  resendOTP,
  googleAuthCallback,
  getAllUser,
  getUserById,
  getUsersByIDs,
  UpdateUser,
  deleteUser,
};