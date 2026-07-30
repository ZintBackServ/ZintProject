const express   = require("express");
const router    = express.Router();
const passport  = require("../config/passport");
const rateLimit = require("express-rate-limit");

const {
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
} = require("../controllers/userController");

const authentication = require("../middlewares/authMiddleware");
const authorization  = require("../middlewares/authorization");

// ── Rate Limiters ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, msg: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, msg: "Too many OTP requests. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Public Routes ─────────────────────────────────────────────────────────────
router.post("/newUser",     signUpUser);
router.post("/login",       authLimiter, loginUser);
router.post("/logout",      logoutUser);

// OTP Routes
router.post("/verify-otp",  otpLimiter, verifyOTP);
router.post("/resend-otp",  otpLimiter, resendOTP);

// ── Google OAuth Routes ───────────────────────────────────────────────────────
// Step 1: Redirect user to Google login page
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// Step 2: Google redirects back — cookie is set, redirect to /auth/google/success
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`,
    session: false,
  }),
  googleAuthCallback
);

// ── Protected Routes ──────────────────────────────────────────────────────────
router.get("/me",                authentication, getMyProfile);
router.put("/UpdateUser/:id",    authentication, UpdateUser);

// Admin only
router.get("/allUsers",          authentication, authorization("admin"), getAllUser);
router.get("/getUserById/:id",   authentication, authorization("admin"), getUserById);
router.post("/getUsersByIDs",    authentication, authorization("admin"), getUsersByIDs);
router.delete("/deleteUser/:id", authentication, authorization("admin"), deleteUser);
router.delete("/user/:userId",   authentication, authorization("admin"), deleteUser);

module.exports = router;