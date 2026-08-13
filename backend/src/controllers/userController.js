const userModel = require("../models/userModel");
const bcrypt    = require("bcrypt");
const jwt       = require("jsonwebtoken");
const crypto    = require("crypto");
const logger    = require("../utils/logger");
const { sendOTPEmail, sendPasswordResetEmail } = require("../utils/sendEmail");

const {
  isValid,
  validators,
  isValidEmail,
  isValidPassword,
} = require("../utils/validator");
const mongoose = require("mongoose");

// ── Cookie config ────────────────────────────────────────────────────────────
const IS_PROD = process.env.NODE_ENV === "production";

function cookieSameSite() {
  if (!IS_PROD) return "lax";

  const apiOrigin = process.env.API_PUBLIC_URL || process.env.API_URL;
  const frontend = process.env.frontendurl || process.env.FRONTEND_URL;
  if (!apiOrigin || !frontend) return "lax";

  try {
    return new URL(apiOrigin).origin !== new URL(frontend).origin ? "none" : "lax";
  } catch {
    return "lax";
  }
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   IS_PROD,
  sameSite: cookieSameSite(),
  maxAge:   24 * 60 * 60 * 1000,
};

// ── Helper: generate JWT + set httpOnly cookie ───────────────────────────────
// sessionToken is embedded in the JWT so authMiddleware can compare it
// against the value stored in MongoDB — if they differ, the session is stale.
const generateToken = (user, sessionToken) =>
  jwt.sign(
    { userId: user._id, role: user.role, sessionToken },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "24h" }
  );

// Generates a fresh sessionToken, persists it to DB, mints JWT, sets cookie.
// Every call invalidates all previous sessions for that user.
const setTokenCookie = async (res, user) => {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  // Save to DB (select: false field — need direct update)
  await userModel.findByIdAndUpdate(user._id, { sessionToken });
  const token = generateToken(user, sessionToken);
  res.cookie("token", token, COOKIE_OPTIONS);
  return token;
};

// ── Helper: generate 6-digit OTP ────────────────────────────────────────────
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// ── Allowed fields whitelist (prevents mass-assignment) ──────────────────────
const SIGNUP_FIELDS  = ["firstName", "lastName", "email", "contactNo", "password"];
const UPDATE_FIELDS  = ["firstName", "lastName", "contactNo", "avatar"];

// ── Validation helper ────────────────────────────────────────────────────────
async function validation(key, data, reply) {
  if (!validators[key]) return;
  if (!validators[key](data)) {
    reply.push(`Enter Valid ${key}`);
  }
  if (key === "email") {
    const dup = await userModel.findOne({ email: data });
    if (dup) reply.push("Email Already Exists");
  }
  if (key === "contactNo") {
    const dup = await userModel.findOne({ contactNo: data });
    if (dup) reply.push("Contact Number Already Exists");
  }
}

// ── OTP brute-force constants ────────────────────────────────────────────────
const MAX_OTP_ATTEMPTS  = 5;
const OTP_LOCK_DURATION = 15 * 60 * 1000; // 15 minutes

// ────────────────────────────────────────────────────────────────────────────
// 1. Sign Up (local) — whitelists fields, sends OTP
// ────────────────────────────────────────────────────────────────────────────
const signUpUser = async (req, res) => {
  let reply = [];
  try {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ success: false, msg: "Bad Request! No Data Provided." });
    }

    // Whitelist: only pick allowed fields
    const userData = {};
    for (const key of SIGNUP_FIELDS) {
      if (body[key] !== undefined) userData[key] = body[key];
    }

    const keys   = Object.keys(userData);
    const values = Object.values(userData);

    for (let i = 0; i < keys.length; i++) {
      await validation(keys[i], values[i], reply);
    }
    if (reply.length !== 0) {
      return res.status(400).json({ success: false, msg: reply });
    }

    // Hash password
    userData.password       = await bcrypt.hash(userData.password, 10);
    userData.role           = "user";
    userData.authProvider   = "local";

    // Generate OTP
    const otp       = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    userData.otp             = otp;
    userData.otpExpiry       = otpExpiry;
    userData.isEmailVerified = false;
    userData.otpAttempts     = 0;

    const createUser = await userModel.create(userData);
    await sendOTPEmail(createUser.email, otp);

    return res.status(201).json({
      success: true,
      msg: "User registered successfully. Please verify your email with the OTP sent.",
      userId: createUser._id,
    });
  } catch (error) {
    logger.error("signUpUser error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || "field";
      return res.status(409).json({ success: false, msg: `${field} already exists.` });
    }
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 2. Verify OTP — with brute-force protection
// ────────────────────────────────────────────────────────────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, msg: "Email and OTP are required." });
    }

    const user = await userModel
      .findOne({ email })
      .select("+otp +otpExpiry +otpAttempts +otpLockedUntil");

    if (!user) return res.status(404).json({ success: false, msg: "User Not Found" });
    if (user.isEmailVerified) return res.status(400).json({ success: false, msg: "Email is already verified." });

    // Check lock
    if (user.otpLockedUntil && user.otpLockedUntil > new Date()) {
      const remaining = Math.ceil((user.otpLockedUntil - Date.now()) / 60000);
      return res.status(429).json({
        success: false,
        msg: `Too many failed attempts. Try again in ${remaining} minute(s).`,
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ success: false, msg: "OTP not found. Please request a new one." });
    }
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ success: false, msg: "OTP has expired. Please request a new one." });
    }

    // Wrong OTP
    if (user.otp !== otp) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
        user.otpLockedUntil = new Date(Date.now() + OTP_LOCK_DURATION);
        user.otpAttempts    = 0;
        await user.save();
        return res.status(429).json({
          success: false,
          msg: `Too many failed attempts. Account locked for 15 minutes.`,
        });
      }
      await user.save();
      const remaining = MAX_OTP_ATTEMPTS - user.otpAttempts;
      return res.status(400).json({
        success: false,
        msg: `Invalid OTP. ${remaining} attempt(s) remaining.`,
      });
    }

    // Correct OTP
    user.isEmailVerified = true;
    user.otp             = undefined;
    user.otpExpiry       = undefined;
    user.otpAttempts     = 0;
    user.otpLockedUntil  = null;
    await user.save();

    // Set httpOnly cookie (also rotates sessionToken → invalidates other devices)
    await setTokenCookie(res, user);

    return res.status(200).json({ success: true, msg: "Email verified successfully." });
  } catch (error) {
    logger.error("verifyOTP error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 3. Resend OTP
// ────────────────────────────────────────────────────────────────────────────
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, msg: "Valid email is required." });
    }

    const user = await userModel.findOne({ email }).select("+otpAttempts +otpLockedUntil");
    if (!user) return res.status(404).json({ success: false, msg: "User Not Found" });
    if (user.isEmailVerified) return res.status(400).json({ success: false, msg: "Email is already verified." });

    const otp       = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp            = otp;
    user.otpExpiry      = otpExpiry;
    user.otpAttempts    = 0;   // reset counter on resend
    user.otpLockedUntil = null;
    await user.save();

    await sendOTPEmail(email, otp);
    return res.status(200).json({ success: true, msg: "New OTP sent to your email." });
  } catch (error) {
    logger.error("resendOTP error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 4. Login (local)
// ────────────────────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, msg: "Email and Password are required." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, msg: "Invalid Email" });
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ success: false, msg: "User Not Found" });

    if (user.authProvider === "google" && !user.password) {
      return res.status(400).json({
        success: false,
        msg: "This account uses Google Sign-In. Please login with Google.",
      });
    }
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        msg: "Email not verified. Please verify your email first.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: "Incorrect Password" });
    }

    await setTokenCookie(res, user);
    return res.status(200).json({ success: true, msg: "Login Successful" });
  } catch (error) {
    logger.error("loginUser error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 5. Logout — clears the httpOnly cookie
// ────────────────────────────────────────────────────────────────────────────
const logoutUser = async (req, res) => {
  try {
    // Clear the sessionToken in DB so the cookie is dead even if someone kept it
    const token = req.cookies?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (decoded?.userId) {
          await userModel.findByIdAndUpdate(decoded.userId, { sessionToken: null });
        }
      } catch (_) { /* token already invalid — fine */ }
    }
  } catch (_) { /* ignore */ }

  res.clearCookie("token", {
    httpOnly: true,
    secure:   IS_PROD,
    sameSite: cookieSameSite(),
  });
  return res.status(200).json({ success: true, msg: "Logged out successfully." });
};

// ────────────────────────────────────────────────────────────────────────────
// 6. Google OAuth Callback
// Token is set as httpOnly cookie, no token in URL
// ────────────────────────────────────────────────────────────────────────────
const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);

    await setTokenCookie(res, user);
    // Redirect without token in URL — frontend reads /user/me instead
    return res.redirect(`${process.env.FRONTEND_URL}/auth/google/success`);
  } catch (error) {
    logger.error("googleAuthCallback error:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 7. Get All Users (admin only) — with pagination
// ────────────────────────────────────────────────────────────────────────────
const getAllUser = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const [users, total] = await Promise.all([
      userModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      userModel.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      msg: "Users Fetched Successfully",
      data: users,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    logger.error("getAllUser error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 8. Get Single User By ID (admin only)
// ────────────────────────────────────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, msg: "Invalid Id" });
    }
    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });
    return res.status(200).json({ success: true, msg: "User Profile Fetched", data: user });
  } catch (error) {
    logger.error("getUserById error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 9. Get Multiple Users By IDs (admin only)
// ────────────────────────────────────────────────────────────────────────────
const getUsersByIDs = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, msg: "ids array is required." });
    }
    const users = await userModel.find({ _id: { $in: ids } });
    if (!users.length) return res.status(404).json({ success: false, msg: "Users not found" });
    return res.status(200).json({ success: true, msg: "Users fetched", data: users });
  } catch (error) {
    logger.error("getUsersByIDs error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 10. Update User — FIX: ownership check (only self or admin)
// ────────────────────────────────────────────────────────────────────────────
const UpdateUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, msg: "Invalid Id" });
    }

    // IDOR fix: only the owner or admin can update
    const isSelf  = req.userId.toString() === id;
    const isAdmin = req.userRole === "admin";
    if (!isSelf && !isAdmin) {
      return res.status(403).json({ success: false, msg: "Access Denied! You can only update your own profile." });
    }

    // Whitelist allowed update fields
    const body    = req.body;
    const allowed = isAdmin
      ? [...UPDATE_FIELDS, "role", "isEmailVerified"]   // admin can also change role
      : UPDATE_FIELDS;

    const updateData = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, msg: "No valid fields to update." });
    }

    const updated = await userModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, msg: "User not found" });

    return res.status(200).json({ success: true, msg: "User updated successfully", data: updated });
  } catch (error) {
    logger.error("UpdateUser error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 11. Delete User (admin only)
// ────────────────────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id || req.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, msg: "Invalid User Id" });
    }
    const deleted = await userModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, msg: "User not found" });
    return res.status(200).json({ success: true, msg: "User deleted successfully" });
  } catch (error) {
    logger.error("deleteUser error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// 12. GET /me — logged-in user's own profile (used by frontend to restore session)
// ────────────────────────────────────────────────────────────────────────────
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ success: false, msg: "Unauthorized" });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    return res.status(200).json({ success: true, msg: "Profile fetched successfully", data: user });
  } catch (error) {
    logger.error("getMyProfile error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// FORGOT PASSWORD — Step 1: Send reset OTP to email
// ────────────────────────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, msg: "Email is required." });

    const cleanEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ success: false, msg: "No user found with this email address. Please check your email or sign up." });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({ success: false, msg: "This account uses Google Sign-In. Please click 'Continue with Google'." });
    }

    const otp       = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetOtp         = otp;
    user.resetOtpExpiry   = otpExpiry;
    user.resetToken       = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    await sendPasswordResetEmail(user.email, otp);

    return res.status(200).json({ success: true, msg: "OTP sent to your email!" });
  } catch (error) {
    logger.error("forgotPassword error:", error);
    return res.status(500).json({ success: false, msg: error.message || "Failed to send OTP email." });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// FORGOT PASSWORD — Step 2: Verify OTP, issue reset token
// ────────────────────────────────────────────────────────────────────────────
const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, msg: "Email and OTP are required." });

    const user = await userModel
      .findOne({ email: email.toLowerCase().trim() })
      .select("+resetOtp +resetOtpExpiry +resetToken +resetTokenExpiry");

    if (!user) return res.status(404).json({ success: false, msg: "User not found." });
    if (!user.resetOtp || !user.resetOtpExpiry) {
      return res.status(400).json({ success: false, msg: "No OTP found. Please request a new one." });
    }
    if (new Date() > user.resetOtpExpiry) {
      return res.status(400).json({ success: false, msg: "OTP has expired. Please request a new one." });
    }
    if (user.resetOtp !== otp) {
      return res.status(400).json({ success: false, msg: "Invalid OTP. Please try again." });
    }

    // OTP valid — generate a short-lived reset token (15 minutes)
    const resetToken       = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    user.resetOtp         = undefined;
    user.resetOtpExpiry   = undefined;
    user.resetToken       = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    return res.status(200).json({ success: true, msg: "OTP verified.", resetToken });
  } catch (error) {
    logger.error("verifyResetOTP error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// FORGOT PASSWORD — Step 3: Reset password with token
// ────────────────────────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ success: false, msg: "Reset token and new password are required." });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        msg: "Password must be 8–20 characters with uppercase, lowercase, number & special character.",
      });
    }


    // Find user by reset token

    const matchedUser = await userModel
      .findOne({ resetToken })
      .select("+password +resetToken +resetTokenExpiry");

    if (!matchedUser) {
      return res.status(400).json({ success: false, msg: "Invalid or expired reset token." });
    }
    if (new Date() > matchedUser.resetTokenExpiry) {
      return res.status(400).json({ success: false, msg: "Reset token has expired. Please start over." });
    }

    matchedUser.password          = await bcrypt.hash(newPassword, 10);
    matchedUser.resetToken        = undefined;
    matchedUser.resetTokenExpiry  = undefined;
    await matchedUser.save();

    return res.status(200).json({ success: true, msg: "Password reset successful. You can now sign in." });
  } catch (error) {
    logger.error("resetPassword error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};


module.exports = {
  signUpUser,
  loginUser,
  logoutUser,
  verifyOTP,
  resendOTP,
  googleAuthCallback,
  getAllUser,
  getUserById,
  getUsersByIDs,
  UpdateUser,
  deleteUser,
  getMyProfile,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
};